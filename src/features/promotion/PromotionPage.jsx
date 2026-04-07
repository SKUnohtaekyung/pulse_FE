import React, { useEffect, useRef, useState } from 'react';
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

const DEFAULT_TARGET = '우리 가게 손님';
const DEFAULT_CONCEPT = '맛있고 매력적인 우리 가게 대표 메뉴를 소개하는 홍보 영상';
const DEFAULT_VIBE = 'energetic';
const DEFAULT_QUALITY = 'standard';

export default function PromotionPage({ initialParams, onNavigate }) {
    const [viewMode, setViewMode] = useState('split');
    const [images, setImages] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [qualityMode, setQualityMode] = useState(DEFAULT_QUALITY);
    const [options, setOptions] = useState({
        vibe: DEFAULT_VIBE,
        title: '',
        prompt: '',
        personaId: null,
    });
    const [analysisData, setAnalysisData] = useState(null);
    const [personas, setPersonas] = useState([]);
    const [analysisReady, setAnalysisReady] = useState(false);
    const [isAutoPrompt, setIsAutoPrompt] = useState(true);
    const [isPromptLoading, setIsPromptLoading] = useState(false);

    const [step, setStep] = useState('input');
    const [resultData, setResultData] = useState(null);
    const [apiError, setApiError] = useState(null);
    const [progress, setProgress] = useState(0);
    const [progressMessage, setProgressMessage] = useState('');

    const autoPromptSequenceRef = useRef(0);

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

    useEffect(() => {
        let cancelled = false;

        const loadAnalysis = async () => {
            try {
                const data = await fetchLatestAnalysisData();
                if (cancelled) {
                    return;
                }

                setAnalysisData(data);
                setPersonas((data.personas || []).map(mapPromotionPersona));
            } catch (error) {
                if (!cancelled) {
                    console.warn('[PromotionPage] Failed to load personas from analysis:', error);
                }
            } finally {
                if (!cancelled) {
                    setAnalysisReady(true);
                }
            }
        };

        loadAnalysis();

        return () => {
            cancelled = true;
        };
    }, []);

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

    const selectedPersona = personas.find((persona) => String(persona.id) === String(options.personaId)) || null;

    useEffect(() => {
        if (!analysisReady || !isAutoPrompt) {
            setIsPromptLoading(false);
            return;
        }

        let cancelled = false;
        const requestId = autoPromptSequenceRef.current + 1;
        autoPromptSequenceRef.current = requestId;

        const fallbackPrompt = buildLocalAutoPrompt({
            persona: selectedPersona,
            analysisData,
            vibe: options.vibe || DEFAULT_VIBE,
        });

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
                    imageFile: selectedFile,
                });

                if (cancelled || autoPromptSequenceRef.current !== requestId) {
                    return;
                }

                setOptions((prev) => ({
                    ...prev,
                    prompt: recommendation?.recommendedPrompt || fallbackPrompt,
                }));
            } catch (error) {
                if (!cancelled && autoPromptSequenceRef.current === requestId) {
                    console.warn('[PromotionPage] Auto prompt fallback:', error);
                    setOptions((prev) => ({
                        ...prev,
                        prompt: fallbackPrompt,
                    }));
                }
            } finally {
                if (!cancelled && autoPromptSequenceRef.current === requestId) {
                    setIsPromptLoading(false);
                }
            }
        };

        const timer = setTimeout(recommendPrompt, 150);

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [
        analysisData,
        analysisReady,
        isAutoPrompt,
        options.vibe,
        qualityMode,
        selectedFile,
        selectedPersona,
    ]);

    const handleConfirmStoryboard = async () => {
        setStep('loading');
        setApiError(null);
        setProgress(0);
        setProgressMessage('');

        const target = buildPromotionTarget(selectedPersona, analysisData) || DEFAULT_TARGET;

        try {
            const data = await generatePromotionVideo({
                target,
                concept: options.prompt || DEFAULT_CONCEPT,
                mode: qualityToMode(qualityMode || DEFAULT_QUALITY),
                style: vibeToStyle(options.vibe || DEFAULT_VIBE),
                imageFile: selectedFile,
                onProgress: (percent, message) => {
                    setProgress(percent);
                    setProgressMessage(message);
                },
            });

            setResultData({
                videoUrl: data.videoUrl,
                videoTitle: data.videoTitle,
                hashtags: data.hashtags || [],
                generationTime: data.generationTime,
            });

            if (data.videoTitle) {
                setOptions((prev) => ({ ...prev, title: data.videoTitle }));
            }

            setStep('result');
        } catch (error) {
            console.error('[PromotionPage] 영상 생성 실패:', error);
            setApiError('영상 생성 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
            setStep('input');
        }
    };

    const handleReset = () => {
        setStep('input');
        setImages([]);
        setSelectedFile(null);
        setResultData(null);
        setApiError(null);
        setProgress(0);
        setProgressMessage('');
    };

    if (viewMode === 'gallery') {
        return <GalleryPage onBack={() => setViewMode('split')} />;
    }

    return (
        <div className="flex h-full gap-4 animate-in fade-in duration-500 min-h-0">
            {apiError && (
                <div className="absolute top-4 right-4 z-50 bg-red-500 text-white text-sm px-4 py-2 rounded-xl shadow-lg">
                    {apiError}
                </div>
            )}

            <VideoCreator
                step={step}
                resultData={resultData}
                onReset={handleReset}
                images={images}
                setImages={setImages}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                options={options}
                setOptions={setOptions}
                personas={personas}
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
            />
        </div>
    );
}
