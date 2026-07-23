import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import VideoCreator from './VideoCreator';
import GalleryPage from './GalleryPage';
import {
    fetchPromotionPromptRecommendation,
    generatePromotionVideo,
    vibeToStyle,
    qualityToMode,
} from './promotionApi';
import { fetchLatestAnalysisData } from '../insight/api/analysisApi';
import {
    buildLocalAutoPrompt,
    buildPromotionTarget,
    mapPromotionPersona,
} from './promotionPersonaUtils';
import ConfirmModal from '../../components/common/ConfirmModal';
import { useToast } from '../../components/common/ToastProvider';
import { getErrorMessage, isCanceledError } from '../../utils/apiError';
import { releasePreviews } from '../../utils/imageUpload';

const DEFAULT_TARGET = '우리 가게 손님';
const DEFAULT_CONCEPT = '맛있고 매력적인 우리 가게 대표 메뉴를 소개하는 홍보 영상';
const DEFAULT_VIBE = 'energetic';
const DEFAULT_QUALITY = 'standard';

/** 이 시간을 넘기면 "평소보다 오래 걸린다"고 안내한다. */
const SLOW_GENERATION_MS = 60000;

export default function PromotionPage({ initialParams, onNavigate }) {
    const toast = useToast();

    const [viewMode, setViewMode] = useState('split');
    const [images, setImages] = useState([]);
    const [qualityMode, setQualityMode] = useState(DEFAULT_QUALITY);
    const [options, setOptions] = useState({
        vibe: DEFAULT_VIBE,
        title: '',
        prompt: '',
        personaId: null,
    });
    const [analysisData, setAnalysisData] = useState(null);
    const [personas, setPersonas] = useState([]);
    const [personaLoadFailed, setPersonaLoadFailed] = useState(false);
    const [analysisReady, setAnalysisReady] = useState(false);
    const [isAutoPrompt, setIsAutoPrompt] = useState(true);
    const [isPromptLoading, setIsPromptLoading] = useState(false);

    const [step, setStep] = useState('input');
    const [resultData, setResultData] = useState(null);
    const [apiError, setApiError] = useState(null);
    const [progress, setProgress] = useState(null);
    const [progressMessage, setProgressMessage] = useState('');
    const [isSlowGeneration, setIsSlowGeneration] = useState(false);
    const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

    const autoPromptSequenceRef = useRef(0);
    const generationControllerRef = useRef(null);
    const generatingRef = useRef(false);
    const imagesRef = useRef(images);

    // 첫 번째 이미지가 프롬프트 추천의 기준이 된다.
    const primaryFile = images[0]?.file ?? null;

    useEffect(() => {
        imagesRef.current = images;
    }, [images]);

    // 언마운트 시 진행 중 요청을 끊고 미리보기 URL 을 해제한다.
    useEffect(
        () => () => {
            generationControllerRef.current?.abort();
            releasePreviews(imagesRef.current);
        },
        [],
    );

    useEffect(() => {
        if (!initialParams) {
            return;
        }

        setOptions((prev) => ({
            ...prev,
            vibe: initialParams.vibe || DEFAULT_VIBE,
            title: initialParams.title || '',
            prompt: initialParams.prompt || '',
            personaId: initialParams.personaId ?? null,
        }));
        setIsAutoPrompt(!initialParams.prompt);
    }, [initialParams]);

    // dev 전용: 사장님 자동 로그인 시 입력 사진을 샘플(public/dev/pizza.png)로
    // 자동 세팅해, 업로드 없이도 "영상 생성하기"가 바로 활성화되게 한다.
    useEffect(() => {
        if (!import.meta.env.DEV) return undefined;
        if (localStorage.getItem('accessToken') !== 'dev-bypass-token') return undefined;
        let cancelled = false;
        import('../../dev/mockOwner').then(({ MOCK_OWNER }) => {
            if (cancelled) return;
            setImages((prev) =>
                prev.length
                    ? prev
                    : [{ key: 'dev-sample', file: null, previewUrl: MOCK_OWNER.promotionSampleImage, displayName: '샘플 이미지' }],
            );
        });
        return () => {
            cancelled = true;
        };
    }, []);

    const loadAnalysis = useCallback(async (signal) => {
        setPersonaLoadFailed(false);
        try {
            const data = await fetchLatestAnalysisData(signal);
            if (signal?.aborted) return;

            setAnalysisData(data);
            setPersonas((data?.personas || []).map(mapPromotionPersona));
        } catch (error) {
            if (signal?.aborted || isCanceledError(error)) return;
            // 페르소나는 보조 정보다. 화면은 계속 쓸 수 있게 두되, 실패 사실은 알려 준다.
            setPersonaLoadFailed(true);
        } finally {
            if (!signal?.aborted) setAnalysisReady(true);
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        loadAnalysis(controller.signal);
        return () => controller.abort();
    }, [loadAnalysis]);

    const retryPersonaLoad = useCallback(() => {
        setAnalysisReady(false);
        const controller = new AbortController();
        loadAnalysis(controller.signal);
    }, [loadAnalysis]);

    useEffect(() => {
        if (personas.length === 0) {
            return;
        }

        setOptions((prev) => {
            if (prev.personaId !== null && prev.personaId !== undefined) {
                return prev;
            }

            return {
                ...prev,
                personaId: personas[0].id,
            };
        });
    }, [personas]);

    const selectedPersona = useMemo(
        () => personas.find((persona) => String(persona.id) === String(options.personaId)) || null,
        [personas, options.personaId],
    );

    useEffect(() => {
        if (!analysisReady || !isAutoPrompt) {
            setIsPromptLoading(false);
            return undefined;
        }

        const controller = new AbortController();
        const requestId = autoPromptSequenceRef.current + 1;
        autoPromptSequenceRef.current = requestId;

        const fallbackPrompt = buildLocalAutoPrompt({
            persona: selectedPersona,
            analysisData,
            vibe: options.vibe || DEFAULT_VIBE,
        });

        const isStale = () => controller.signal.aborted || autoPromptSequenceRef.current !== requestId;

        const recommendPrompt = async () => {
            setIsPromptLoading(true);

            try {
                const recommendation = await fetchPromotionPromptRecommendation({
                    target: buildPromotionTarget(selectedPersona, analysisData) || DEFAULT_TARGET,
                    storeName: analysisData?.store_name,
                    storeSummary: analysisData?.store_summary,
                    personaLabel: selectedPersona?.nickname,
                    personaSummary: selectedPersona?.summary,
                    personaTags: selectedPersona?.tags,
                    actionRecommendation: selectedPersona?.action_recommendation,
                    style: vibeToStyle(options.vibe || DEFAULT_VIBE),
                    mode: qualityToMode(qualityMode || DEFAULT_QUALITY),
                    imageFile: primaryFile,
                    signal: controller.signal,
                });

                if (isStale()) return;

                setOptions((prev) => ({
                    ...prev,
                    prompt: recommendation?.recommendedPrompt || fallbackPrompt,
                }));
            } catch (error) {
                // 추천 실패는 사용자를 막지 않는다. 로컬 규칙으로 만든 프롬프트를 대신 채운다.
                if (isStale() || isCanceledError(error)) return;
                setOptions((prev) => ({
                    ...prev,
                    prompt: fallbackPrompt,
                }));
            } finally {
                if (!isStale()) setIsPromptLoading(false);
            }
        };

        const timer = setTimeout(recommendPrompt, 150);

        return () => {
            controller.abort();
            clearTimeout(timer);
        };
    }, [
        analysisData,
        analysisReady,
        isAutoPrompt,
        options.vibe,
        qualityMode,
        primaryFile,
        selectedPersona,
    ]);

    const handleConfirmStoryboard = useCallback(async () => {
        // 연속 클릭 / Enter 중복 제출 차단 — state 가 아니라 ref 로 같은 tick 까지 막는다.
        if (generatingRef.current) return;
        if (images.length === 0) {
            toast.error('영상을 만들려면 사진을 먼저 등록해 주세요.');
            return;
        }

        generatingRef.current = true;
        generationControllerRef.current?.abort();
        const controller = new AbortController();
        generationControllerRef.current = controller;

        setStep('loading');
        setApiError(null);
        setProgress(null);
        setProgressMessage('');
        setIsSlowGeneration(false);
        // 이전 작업 결과가 새 작업 화면에 섞이지 않도록 먼저 비운다.
        setResultData(null);

        const slowTimer = setTimeout(() => {
            if (!controller.signal.aborted) setIsSlowGeneration(true);
        }, SLOW_GENERATION_MS);

        const target = buildPromotionTarget(selectedPersona, analysisData) || DEFAULT_TARGET;

        try {
            const data = await generatePromotionVideo({
                target,
                concept: options.prompt || DEFAULT_CONCEPT,
                mode: qualityToMode(qualityMode || DEFAULT_QUALITY),
                style: vibeToStyle(options.vibe || DEFAULT_VIBE),
                imageFiles: images.map((image) => image.file).filter(Boolean),
                signal: controller.signal,
                onProgress: (percent, message) => {
                    if (controller.signal.aborted) return;
                    setProgress(percent);
                    setProgressMessage(message);
                },
            });

            if (controller.signal.aborted) return;

            // 성공 응답을 받기 전에는 결과 화면으로 넘어가지 않는다.
            // 영상 주소가 없으면 결과 화면에서 대체 UI 를 보여주되, 상태는 result 로 확정한다.
            setResultData(data);
            if (data.videoTitle) {
                setOptions((prev) => ({ ...prev, title: data.videoTitle }));
            }
            if (!data.videoUrl) {
                toast.error('영상은 만들어졌지만 주소를 받지 못했어요. 다시 만들어 주세요.');
            }

            setStep('result');
        } catch (error) {
            if (controller.signal.aborted || isCanceledError(error)) return;
            const message = getErrorMessage(error, '영상 생성에 실패했어요. 입력한 내용은 그대로 남아 있으니 다시 시도할 수 있어요.');
            setApiError(message);
            toast.error(message);
            // 입력값(이미지·업종·무드·가이드 문구)은 그대로 두고 입력 화면으로만 되돌린다.
            setStep('input');
        } finally {
            clearTimeout(slowTimer);
            generatingRef.current = false;
            if (generationControllerRef.current === controller) generationControllerRef.current = null;
        }
    }, [analysisData, images, options.prompt, options.vibe, qualityMode, selectedPersona, toast]);

    /** 결과만 버리고 입력값은 유지한 채 다시 시도 */
    const handleRetryGeneration = useCallback(() => {
        setApiError(null);
        handleConfirmStoryboard();
    }, [handleConfirmStoryboard]);

    /** 처음부터 다시 시작 — 이미지까지 지우므로 확인을 받는다. */
    const handleReset = useCallback(() => {
        generationControllerRef.current?.abort();
        releasePreviews(imagesRef.current);
        setStep('input');
        setImages([]);
        setResultData(null);
        setApiError(null);
        setProgress(null);
        setProgressMessage('');
        setIsSlowGeneration(false);
        setIsResetConfirmOpen(false);
    }, []);

    const requestReset = useCallback(() => {
        if (images.length === 0 && !resultData) {
            handleReset();
            return;
        }
        setIsResetConfirmOpen(true);
    }, [images.length, resultData, handleReset]);

    if (viewMode === 'gallery') {
        return <GalleryPage onBack={() => setViewMode('split')} />;
    }

    return (
        <div className="flex h-full gap-4 animate-in fade-in duration-500 min-h-0">
            <VideoCreator
                step={step}
                resultData={resultData}
                onReset={requestReset}
                onRetry={handleRetryGeneration}
                images={images}
                setImages={setImages}
                options={options}
                setOptions={setOptions}
                personas={personas}
                personaLoadFailed={personaLoadFailed}
                onRetryPersonas={retryPersonaLoad}
                selectedPersona={selectedPersona}
                isAutoPrompt={isAutoPrompt}
                setIsAutoPrompt={setIsAutoPrompt}
                isPromptLoading={isPromptLoading}
                qualityMode={qualityMode}
                setQualityMode={setQualityMode}
                onConfirm={handleConfirmStoryboard}
                onNavigate={onNavigate}
                progress={progress}
                progressMessage={progressMessage}
                isSlowGeneration={isSlowGeneration}
                apiError={apiError}
                onDismissError={() => setApiError(null)}
            />

            <ConfirmModal
                isOpen={isResetConfirmOpen}
                onClose={() => setIsResetConfirmOpen(false)}
                onConfirm={handleReset}
                title="처음부터 다시 시작할까요?"
                description="등록한 사진과 만들어진 영상이 모두 사라져요. 이 작업은 되돌릴 수 없어요."
                confirmLabel="처음부터 다시"
            />
        </div>
    );
}
