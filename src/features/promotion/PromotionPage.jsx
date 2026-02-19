import React, { useState } from 'react';
import VideoCreator from './VideoCreator';
import GalleryPage from './GalleryPage';
import { generatePromotionVideo, vibeToStyle, qualityToMode } from './promotionApi';

// ─── 모듈 레벨 상수 (컴포넌트 리렌더링과 무관하게 1회만 생성) ──────────────

/** personaId → API target 파라미터 변환 테이블 */
const PERSONA_LABELS = {
    hangover: '해장이 필요한 손님, 시원한 국물을 원하는 손님',
    worker: '빠른 점심이 필요한 직장인',
    couple: '데이트 맛집을 찾는 커플'
};

/** 페르소나 미선택 시 기본 타겟 설명 */
const DEFAULT_TARGET = '우리 가게 손님';

/** 프롬프트 미입력 시 기본 영상 컨셉 */
const DEFAULT_CONCEPT = '맛있는 우리 가게 음식을 소개하는 영상';

/** 기본 분위기 스타일 */
const DEFAULT_VIBE = 'energetic';

/** 기본 화질 모드 */
const DEFAULT_QUALITY = 'standard';

// ─────────────────────────────────────────────────────────────────────────────

export default function PromotionPage({ initialParams, onNavigate }) {
    const [viewMode, setViewMode] = useState('split'); // 'split' | 'gallery'
    const [images, setImages] = useState([]);
    const [options, setOptions] = useState({ vibe: DEFAULT_VIBE, title: '', prompt: '' });

    const [step, setStep] = useState('input'); // 'input' | 'storyboard' | 'loading' | 'result'
    const [resultData, setResultData] = useState(null);
    const [apiError, setApiError] = useState(null); // API 에러 상태 (UI 표시용)

    // Handle initial params from navigation (손님 마음 읽기 → 홍보 영상 만들기 컨텍스트 전달)
    React.useEffect(() => {
        if (initialParams) {
            setOptions(prev => ({
                ...prev,
                vibe: initialParams.vibe || DEFAULT_VIBE,
                title: initialParams.title || '',
                prompt: initialParams.prompt || '',
                personaId: initialParams.personaId || null
            }));
        }
    }, [initialParams]);

    const handleGenerate = () => {
        setStep('storyboard');
    };

    /**
     * 스토리보드 확정 → API 호출
     * 1) step을 'loading'으로 전환 (로딩 애니메이션 시작)
     * 2) generatePromotionVideo 호출 (API or 목업 fallback)
     * 3) 응답 데이터로 resultData 세팅 → step을 'result'로 전환
     *
     * @param {File|null} selectedFile - VideoCreator에서 전달받은 이미지 File 객체
     * @param {string} qualityMode     - VideoCreator에서 선택한 화질 모드
     */
    const handleConfirmStoryboard = async (selectedFile, qualityMode) => {
        setStep('loading');
        setApiError(null);

        const target = options.personaId
            ? (PERSONA_LABELS[options.personaId] ?? DEFAULT_TARGET)
            : DEFAULT_TARGET;

        try {
            const data = await generatePromotionVideo({
                target,
                concept: options.prompt || '맛있는 우리 가게 음식을 소개하는 영상',
                mode: qualityToMode(qualityMode || 'standard'),
                style: vibeToStyle(options.vibe || 'energetic'),
                imageFile: selectedFile
            });

            // API or 목업 응답 → resultData에 매핑
            setResultData({
                videoUrl: data.videoUrl,
                videoTitle: data.videoTitle,
                hashtags: data.hashtags || [],
                generationTime: data.generationTime
            });

            // 영상 제목이 있으면 title 입력창에 자동 세팅
            if (data.videoTitle) {
                setOptions(prev => ({ ...prev, title: data.videoTitle }));
            }

            setStep('result');
        } catch (error) {
            // 이 경우는 promotionApi 내부에서 이미 fallback 처리되므로 거의 발생 안 함
            console.error('[PromotionPage] 영상 생성 실패:', error);
            setApiError('영상 생성 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
            setStep('input');
        }
    };

    const handleReset = () => {
        setStep('input');
        setImages([]);
        setResultData(null);
        setApiError(null);
    };

    if (viewMode === 'gallery') {
        return <GalleryPage onBack={() => setViewMode('split')} />;
    }

    return (
        <div className="flex h-full gap-4 animate-in fade-in duration-500 min-h-0">
            {/* 에러 토스트 (API 연결 실패 시 - 거의 발생하지 않음) */}
            {apiError && (
                <div className="absolute top-4 right-4 z-50 bg-red-500 text-white text-sm px-4 py-2 rounded-xl shadow-lg">
                    {apiError}
                </div>
            )}

            {/* Main Creator Area (Full Width) */}
            <VideoCreator
                step={step}
                resultData={resultData}
                onReset={handleReset}
                images={images}
                setImages={setImages}
                options={options}
                setOptions={setOptions}
                onGenerate={handleGenerate}
                onConfirm={handleConfirmStoryboard}
                onNavigate={onNavigate}
            />
        </div>
    );
}
