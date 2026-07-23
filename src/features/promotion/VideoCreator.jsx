import React, { useCallback, useRef, useState } from 'react';
import { Upload, X, Zap, Crown, Coffee, AlertCircle, Clock, Hash, Copy, Download, RefreshCw, Play, Wand2, Trash2, ChevronDown, Info, Plus, Sparkles, Lock } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import VideoPlayer from '../../components/common/VideoPlayer';
import ImageWithFallback from '../../components/common/ImageWithFallback';
import ConfirmModal from '../../components/common/ConfirmModal';
import { LoadingSpinner } from '../../components/common/StateViews';
import { useToast } from '../../components/common/ToastProvider';
import { releasePreview, validateImageFiles } from '../../utils/imageUpload';
import { IMAGE_ACCEPT_ATTR, MAX_IMAGE_COUNT, UPLOAD_GUIDE_TEXT, UPLOAD_ORDER_NOTICE } from '../../constants/upload';

// --- 3D Components for Loading (로딩 화면용 3D 컴포넌트) ---
// 회전하는 왜곡된 구체 (AI가 생각하는 뇌를 추상적으로 표현)
function AnimatedSphere() {
    const meshRef = useRef(null);
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (meshRef.current) {
            meshRef.current.rotation.x = t * 0.2;
            meshRef.current.rotation.y = t * 0.3;
        }
    });
    return (
        <Sphere ref={meshRef} args={[1, 64, 64]} scale={1.5}>
            <MeshDistortMaterial color="#002B7A" attach="material" distort={0.4} speed={2} roughness={0.2} metalness={0.8} />
        </Sphere>
    );
}

// 5개의 위성 (Satellites) - 회전하며 사라지는 효과 연출
// radius: 궤도 반지름, speed: 회전 속도, size: 위성 크기, color: 색상
function OrbitingSatellite({ radius, speed, size, color, offset, yAmp = 0.5 }) {
    const ref = useRef(null);
    useFrame((state) => {
        const t = state.clock.getElapsedTime() * speed + offset;
        if (ref.current) {
            ref.current.position.x = Math.cos(t) * radius;
            ref.current.position.z = Math.sin(t) * radius;
            ref.current.position.y = Math.sin(t * 0.5) * yAmp;
        }
    });
    return (
        <mesh ref={ref}>
            <sphereGeometry args={[size, 32, 32]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
        </mesh>
    );
}

// --- Constants (상수 데이터 외부 분리) ---
// 성능 최적화: 컴포넌트 리렌더링 시 불필요한 재생성을 막기 위해 전역 변수로 관리합니다.
const VIBES = [
    {
        id: 'energetic',
        label: '에너지',
        desc: '빠른 템포로 매력 포인트를 보여주는 홍보 영상',
        gradient: 'from-yellow-400 to-amber-500',
        bgSelected: 'bg-gradient-to-br from-yellow-100/90 to-amber-200/90 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_4px_12px_rgba(251,191,36,0.3)]',
        textSelected: 'text-amber-700',
        icon: <Zap size={16} />,
        recommend: true
    },
    {
        id: 'luxury',
        label: '프리미엄',
        desc: '차분한 템포로 고급스러운 이미지를 강조하는 영상',
        gradient: 'from-purple-400 to-fuchsia-600',
        bgSelected: 'bg-gradient-to-br from-purple-100/90 to-fuchsia-200/90 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_4px_12px_rgba(192,38,211,0.3)]',
        textSelected: 'text-purple-700',
        icon: <Crown size={16} />
    },
    {
        id: 'emotional',
        label: '무드',
        desc: '잔잔한 분위기와 스토리 중심으로 감성을 담은 영상',
        gradient: 'from-orange-300 to-rose-400',
        bgSelected: 'bg-gradient-to-br from-orange-100/90 to-rose-200/90 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_4px_12px_rgba(251,113,133,0.3)]',
        textSelected: 'text-rose-700',
        icon: <Coffee size={16} />
    }
];

const PERSONA_PROMPTS = [
    {
        id: 'hangover',
        label: '시원 국물파',
        icon: '🍜',
        desc: '해장이 필요한 손님 타겟',
        prompt: '김이 모락모락 나는 얼큰한 국물 요리 클로즈업, 땀을 닦으며 시원해하는 중년 남성, 해장이 되어 개운한 표정, 활기찬 아침 식당 분위기'
    },
    {
        id: 'worker',
        label: '가성비 직장인',
        icon: '💼',
        desc: '빠른 점심이 필요한 타겟',
        prompt: '푸짐하고 맛있는 점심 한 상 차림, 음식을 급하게 먹지만 만족스러운 표정, 시계를 확인하며 웃는 직장인, 활기찬 점심시간 분위기'
    },
    {
        id: 'couple',
        label: '미식가 커플',
        icon: '💑',
        desc: '데이트 맛집을 찾는 타겟',
        prompt: '로맨틱한 조명 아래 예쁘게 플레이팅된 요리, 서로 음식을 먹여주거나 건배하는 다정한 커플, 인스타그램 감성의 세련된 분위기'
    }
];

/** 영상 생성 단계 안내 — 가짜 퍼센트 대신 "지금 무엇을 하는 중인지"를 보여준다. */
const GENERATION_STAGES = ['이미지 확인 중', '장면 구성 중', '홍보 영상 생성 중', '결과 정리 중'];

export default function VideoCreator({ step, resultData, onReset, onRetry, images, setImages, options, setOptions, personas = [], personaLoadFailed = false, onRetryPersonas, selectedPersona, isAutoPrompt, setIsAutoPrompt, isPromptLoading = false, qualityMode, setQualityMode, onConfirm, onNavigate, progress = null, progressMessage = '', isSlowGeneration = false, apiError = null, onDismissError }) {
    const fileInputRef = useRef(null);
    const toast = useToast();

    // Local State for UI (화면 제어를 위한 로컬 상태)
    const [isQualityMenuOpen, setIsQualityMenuOpen] = useState(false); // 화질 선택 메뉴 토글
    // promptText와 videoTitle은 부모 컴포넌트(PromotionPage)에서 관리합니다 (상태 끌어올리기)

    const [activeTooltip, setActiveTooltip] = useState(null); // 'persona' | 'desc' | null
    const [isValidatingFiles, setIsValidatingFiles] = useState(false);
    const [fileErrors, setFileErrors] = useState([]); // [{ name, reason }]
    const [isProUpgradeOpen, setIsProUpgradeOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    const isFull = images.length >= MAX_IMAGE_COUNT;
    const hasProgressValue = typeof progress === 'number' && Number.isFinite(progress);

    // 진행률을 서버가 주지 않으면 가짜 퍼센트를 만들지 않고 단계 안내만 보여준다.
    const stageIndex = hasProgressValue ? Math.min(Math.floor(progress / 25), GENERATION_STAGES.length - 1) : 0;
    const displayMessage = progressMessage || GENERATION_STAGES[stageIndex];

    const addFiles = useCallback(
        async (fileList) => {
            const incoming = Array.from(fileList || []);
            if (incoming.length === 0) return;

            setIsValidatingFiles(true);
            try {
                const { accepted, rejected } = await validateImageFiles(incoming, images);
                // 잘못된 파일만 제외하고 정상 파일은 그대로 추가한다.
                if (accepted.length > 0) setImages((prev) => [...prev, ...accepted]);
                setFileErrors(rejected);
                if (rejected.length > 0 && accepted.length > 0) {
                    toast.info(`${accepted.length}장을 등록했어요. 나머지는 아래 안내를 확인해 주세요.`);
                }
            } finally {
                setIsValidatingFiles(false);
            }
        },
        [images, setImages, toast],
    );

    const handleFileChange = async (e) => {
        const input = e.target;
        await addFiles(input.files);
        // 같은 파일을 지웠다가 다시 고를 때도 onChange 가 발생하도록 값을 비운다.
        input.value = '';
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        setIsDragging(false);
        await addFiles(e.dataTransfer?.files);
    };

    const handleRemoveImage = (key) => {
        setImages((prev) => {
            const target = prev.find((image) => image.key === key);
            if (target) releasePreview(target);
            return prev.filter((image) => image.key !== key);
        });
        setFileErrors([]);
    };

    const handleDownload = async () => {
        if (!resultData?.videoUrl || isDownloading) return;
        setIsDownloading(true);
        try {
            const response = await fetch(resultData.videoUrl);
            if (!response.ok) throw new Error('download failed');
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = objectUrl;
            anchor.download = `${(options.title || resultData.videoTitle || 'pulse-promotion').replace(/[\\/:*?"<>|]/g, '')}.mp4`;
            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();
            URL.revokeObjectURL(objectUrl);
            toast.success('영상을 저장했어요.');
        } catch {
            toast.error('영상을 저장하지 못했어요. 잠시 후 다시 시도해 주세요.');
        } finally {
            setIsDownloading(false);
        }
    };

    const handleCopyTitle = async () => {
        const title = (options.title || '').trim();
        if (!title) {
            toast.info('복사할 제목을 먼저 입력해 주세요.');
            return;
        }
        try {
            await navigator.clipboard.writeText(title);
            toast.success('제목을 복사했어요.');
        } catch {
            toast.error('복사하지 못했어요. 제목을 직접 선택해 복사해 주세요.');
        }
    };

    // --- Round 9: Text Update & Premium AI UI ---
    // CONSTANTS VIBES and PERSONA_PROMPTS moved outside component for performance




    // 분석 데이터를 못 불러온 경우와 아직 불러오는 중인 경우를 구분해서 보여준다.
    const displayedPersonas = personas.length > 0
        ? personas
        : PERSONA_PROMPTS.map((persona, index) => ({
            ...persona,
            id: `persona-placeholder-${index + 1}`,
            label: personaLoadFailed ? '불러오기 실패' : '분석 연결 중',
            icon: personaLoadFailed ? '—' : '⏳',
            disabled: true,
        }));

    return (
        <div className="flex-1 h-full flex gap-6 overflow-hidden p-2">

            {/* --- LEFT PANEL: Input Studio (Fixed Width, No Scroll) --- */}
            <div className="w-[400px] shrink-0 h-full">
                <div className="w-full h-full bg-white rounded-[24px] border border-gray-200 shadow-sm p-5 flex flex-col overflow-hidden relative">

                    {/* Header */}
                    <div className="shrink-0 mb-4">
                        <h2 className="text-[18px] font-bold text-[#002B7A] flex items-center gap-2">
                            홍보 영상 만들기
                        </h2>
                        <p className="text-[13px] text-gray-500 mt-0.5 leading-snug">우리 가게의 매력을 담은 맞춤 홍보 영상을 쉽고 빠르게 만들어보세요!</p>
                    </div>

                    {/* Scrollable Content Area */}
                    <div className="flex-1 min-h-0 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-1 pb-2">

                        {/* Image Upload */}
                        <div className="space-y-2 shrink-0">
                            <div className="flex justify-between items-center gap-2">
                                <span className="text-[14px] font-bold text-[#191F28] shrink-0 whitespace-nowrap">
                                    원본 이미지 (필수)
                                    <span className="ml-1.5 text-[12px] font-medium text-gray-400">{images.length}/{MAX_IMAGE_COUNT}</span>
                                </span>
                                <div className="flex items-center gap-1 text-[11px] text-[#002B7A] bg-blue-50 px-2 py-1 rounded-full whitespace-nowrap shrink-0">
                                    <Info size={11} className="shrink-0" aria-hidden="true" /> <span>음식이나 가게 분위기 사진을 권장해요.</span>
                                </div>
                            </div>

                            {/* 허용 개수·형식·용량을 업로드 전에 안내한다 */}
                            <p className="text-[11px] text-gray-400 leading-snug">
                                {UPLOAD_GUIDE_TEXT} · {UPLOAD_ORDER_NOTICE}
                            </p>

                            <div
                                className={`min-h-[168px] rounded-2xl border-2 border-dashed transition-colors relative p-2 ${isDragging ? 'border-[#002B7A] bg-blue-50/50' : 'border-gray-200'}`}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setIsDragging(true);
                                }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                            >
                                {images.length > 0 ? (
                                    <ul className="grid grid-cols-3 gap-2" aria-label="등록한 이미지 목록">
                                        {images.map((image, index) => (
                                            <li key={image.key} className="relative rounded-xl overflow-hidden bg-gray-100 aspect-square">
                                                <ImageWithFallback
                                                    src={image.previewUrl}
                                                    alt={`${index + 1}번째 장면 이미지`}
                                                    className="w-full h-full object-cover"
                                                    wrapperClassName="w-full h-full"
                                                    showFallbackLabel={false}
                                                />
                                                <span className="absolute top-1 left-1 w-5 h-5 rounded-full bg-[#002B7A] text-white text-[11px] font-bold flex items-center justify-center" aria-hidden="true">
                                                    {index + 1}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(image.key)}
                                                    aria-label={`${index + 1}번째 이미지 삭제`}
                                                    className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white
                                                               transition-colors hover:bg-error
                                                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                                >
                                                    <Trash2 size={12} aria-hidden="true" />
                                                </button>
                                            </li>
                                        ))}
                                        {!isFull && (
                                            <li>
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    disabled={isValidatingFiles}
                                                    className="w-full aspect-square rounded-xl border border-dashed border-gray-300 text-gray-400
                                                               flex flex-col items-center justify-center gap-1
                                                               transition-colors hover:border-[#002B7A] hover:text-[#002B7A] disabled:opacity-50
                                                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002B7A]"
                                                >
                                                    {isValidatingFiles ? <LoadingSpinner size="sm" label="이미지 확인 중" /> : <Plus size={18} aria-hidden="true" />}
                                                    <span className="text-[11px] font-medium">사진 추가</span>
                                                </button>
                                            </li>
                                        )}
                                    </ul>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isValidatingFiles}
                                        className="w-full h-[150px] flex flex-col items-center justify-center gap-1 rounded-xl
                                                   transition-colors hover:bg-gray-50 disabled:opacity-50
                                                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002B7A]"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-1">
                                            {isValidatingFiles ? (
                                                <LoadingSpinner label="이미지 확인 중" />
                                            ) : (
                                                <Upload size={20} className="text-gray-400" aria-hidden="true" />
                                            )}
                                        </div>
                                        <span className="text-[13px] font-bold text-gray-500">
                                            {isValidatingFiles ? '이미지를 확인하고 있어요' : '이미지 업로드'}
                                        </span>
                                        <span className="text-[12px] text-gray-400">클릭하거나 여기로 끌어다 놓으세요</span>
                                    </button>
                                )}
                            </div>

                            {isFull && (
                                <p className="text-[11px] text-gray-400">
                                    최대 {MAX_IMAGE_COUNT}장까지 등록했어요. 다른 사진을 넣으려면 기존 사진을 삭제해 주세요.
                                </p>
                            )}

                            {/* 파일별 실패 사유 — 정상 파일은 그대로 유지된다 */}
                            {fileErrors.length > 0 && (
                                <ul className="flex flex-col gap-1" role="alert">
                                    {fileErrors.map((item, index) => (
                                        <li key={`${item.name}-${index}`} className="flex items-start gap-1.5 text-error text-error">
                                            <AlertCircle size={13} className="shrink-0 mt-[2px]" aria-hidden="true" />
                                            <span className="break-keep">
                                                <span className="font-semibold">{item.name}</span> — {item.reason}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept={IMAGE_ACCEPT_ATTR}
                                multiple
                                className="hidden"
                                tabIndex={-1}
                                aria-hidden="true"
                            />
                        </div>

                        {/* Persona Prompt Section */}
                        <div className="space-y-2 shrink-0 relative">
                            <label className="text-[15px] font-bold text-[#191F28] flex items-center gap-1.5">
                                타겟 손님 <span className="text-gray-400 font-medium text-[13px]">(선택)</span>
                                <div
                                    className="cursor-help"
                                    onMouseEnter={() => setActiveTooltip('persona')}
                                    onMouseLeave={() => setActiveTooltip(null)}
                                >
                                    <Info size={13} className={`transition-colors ${activeTooltip === 'persona' ? 'text-[#002B7A]' : 'text-gray-400'}`} />
                                </div>
                            </label>
                            {activeTooltip === 'persona' && (
                                <div className="absolute top-6 left-0 w-full p-3 bg-[#191F28]/95 backdrop-blur-sm text-white text-[12px] leading-snug rounded-xl shadow-xl z-[100] animate-in fade-in slide-in-from-top-1 duration-200">
                                    타겟 고객을 설정하면 AI가 해당 고객층이 선호하는 톤앤매너로 영상을 제작합니다.
                                </div>
                            )}
                            <div className="grid grid-cols-3 gap-2">
                                {displayedPersonas.map((persona) => {
                                    const isSelected = String(options.personaId) === String(persona.id);
                                    return (
                                        <button
                                            key={persona.id}
                                            onClick={() => {
                                                if (persona.disabled) {
                                                    return;
                                                }

                                                setOptions({ ...options, personaId: persona.id });
                                            }}
                                            disabled={persona.disabled}
                                            data-testid={`promotion-persona-${persona.id}`}
                                            className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all group ${isSelected
                                                ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500 shadow-sm'
                                                : 'border-gray-200 bg-gray-50 hover:bg-blue-50 hover:border-blue-200'
                                                }`}
                                        >
                                            <span className="text-xl mb-1 group-hover:scale-110 transition-transform">{persona.icon}</span>
                                            <span className={`text-[13px] font-bold ${isSelected ? 'text-[#002B7A]' : 'text-gray-700 group-hover:text-[#002B7A]'}`}>
                                                {persona.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                            {personaLoadFailed && (
                                <div className="flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl bg-point-bg" role="alert">
                                    <p className="text-[12px] text-[#191F28] break-keep">
                                        손님 분석 결과를 불러오지 못했어요. 타겟 없이도 영상은 만들 수 있어요.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={onRetryPersonas}
                                        className="shrink-0 text-[12px] font-bold text-[#002B7A] underline underline-offset-2 rounded
                                                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002B7A]"
                                    >
                                        다시 시도
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Prompt Section */}
                        <div className="space-y-2 flex-1 flex flex-col min-h-[120px] relative">
                            <div className="flex justify-between items-center shrink-0">
                                <label className="text-[15px] font-bold text-[#191F28] flex items-center gap-1.5">
                                    영상 컨셉 설명
                                    <div
                                        className="cursor-help"
                                        onMouseEnter={() => setActiveTooltip('desc')}
                                        onMouseLeave={() => setActiveTooltip(null)}
                                    >
                                        <Info size={13} className={`transition-colors ${activeTooltip === 'desc' ? 'text-[#002B7A]' : 'text-gray-400'}`} />
                                    </div>
                                </label>
                                {activeTooltip === 'desc' && (
                                    <div className="absolute top-8 left-0 w-full p-3 bg-[#191F28]/95 backdrop-blur-sm text-white text-[12px] leading-snug rounded-xl shadow-xl z-[100] animate-in fade-in slide-in-from-top-1 duration-200">
                                        만들고 싶은 영상의 주제나 강조하고 싶은 내용을 자세히 적을수록 퀄리티가 높아집니다.
                                    </div>
                                )}
                                <div className="flex items-center gap-2 cursor-pointer" data-testid="promotion-auto-prompt-toggle" onClick={() => {
                                    const nextState = !isAutoPrompt;
                                    setIsAutoPrompt(nextState);
                                }}>
                                    <span className={`text-[12px] font-medium transition-colors ${isAutoPrompt ? 'text-[#002B7A]' : 'text-gray-400'}`}>AI 자동 완성</span>
                                    <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${isAutoPrompt ? 'bg-[#002B7A]' : 'bg-gray-200'}`}>
                                        <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${isAutoPrompt ? 'translate-x-4' : 'translate-x-0'}`} />
                                    </div>
                                </div>
                            </div>
                            <div className="relative group/prompt flex-1">
                                <textarea
                                    value={options.prompt}
                                    onChange={(e) => {
                                        setOptions({ ...options, prompt: e.target.value });
                                        if (isAutoPrompt) setIsAutoPrompt(false);
                                    }}
                                    data-testid="promotion-prompt-textarea"
                                    placeholder="만들고 싶은 영상의 느낌을 자유롭게 적어주세요."
                                    className={`w-full h-full rounded-xl p-3 text-[14px] resize-none transition-all outline-none border leading-relaxed ${isAutoPrompt
                                        ? 'bg-blue-50/50 border-blue-200 text-[#002B7A] focus:bg-white focus:border-[#002B7A] focus:ring-1 focus:ring-[#002B7A]'
                                        : 'bg-white border-gray-200 text-[#191F28] focus:border-[#002B7A] focus:ring-1 focus:ring-[#002B7A]'
                                        }`}
                                />
                                {isAutoPrompt && (
                                    <div className="absolute bottom-2 right-2 mb-1 flex items-center gap-1 text-[12px] text-[#002B7A] font-bold bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-blue-100 group-hover/prompt:opacity-0 transition-opacity pointer-events-none">
                                        <Wand2 size={12} /> {isPromptLoading ? 'AI가 추천 중...' : 'AI가 작성함 (클릭하여 수정)'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer: Settings & Action (Fixed at Bottom) */}
                    <div className="shrink-0 pt-4 mt-2 border-t border-gray-100 flex flex-col gap-3 relative z-20">
                        <div className="grid grid-cols-2 gap-2">
                            {/* Mode Selector - Click based */}
                            <div className="relative z-50">
                                <button
                                    onClick={() => setIsQualityMenuOpen(!isQualityMenuOpen)}
                                    className="w-full px-3 py-2.5 bg-white rounded-xl border border-gray-100 text-[13px] font-medium text-gray-400 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                    {qualityMode === 'standard' ? '표준 화질' : '고화질 (Pro)'}
                                    <ChevronDown size={12} className={`text-gray-300 transition-transform ${isQualityMenuOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isQualityMenuOpen && (
                                    <div className="absolute bottom-full left-0 w-full bg-white rounded-xl shadow-xl border border-gray-100 mb-2 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
                                        <button
                                            onClick={() => {
                                                setQualityMode('standard');
                                                setIsQualityMenuOpen(false);
                                            }}
                                            className="w-full text-left px-3 py-2.5 text-[12px] font-medium text-[#191F28] transition-all duration-200 hover:bg-blue-50 hover:text-[#002B7A] hover:pl-4"
                                        >
                                            표준 모드 (빠름)
                                        </button>
                                        <button
                                            onClick={() => {
                                                // [PRO LOCK LOGIC]
                                                setIsProUpgradeOpen(true);
                                                setIsQualityMenuOpen(false);
                                            }}
                                            className="w-full text-left px-3 py-2.5 text-[12px] font-medium text-gray-400 flex justify-between items-center transition-all duration-200 hover:bg-gray-50 bg-gray-50/50 cursor-pointer"
                                        >
                                            <span className="flex items-center gap-1.5">프로 모드 <Lock size={10} /></span>
                                            <Crown size={12} className="text-gray-300" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Duration */}
                            <button className="px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-[13px] font-bold text-[#191F28] flex items-center justify-between cursor-default">
                                8초 영상 <Clock size={14} className="text-[#002B7A]" />
                            </button>
                        </div>

                        {/* 직전 시도가 실패했다면 입력값을 유지한 채 재시도 경로를 제공한다 */}
                        {apiError && (
                            <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-point-bg" role="alert">
                                <AlertCircle size={15} className="text-point shrink-0 mt-[2px]" aria-hidden="true" />
                                <p className="flex-1 text-[12px] text-[#191F28] leading-snug break-keep">{apiError}</p>
                                <button
                                    type="button"
                                    onClick={onDismissError}
                                    aria-label="오류 안내 닫기"
                                    className="shrink-0 p-0.5 text-gray-400 rounded transition-colors hover:text-[#191F28]
                                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002B7A]"
                                >
                                    <X size={13} aria-hidden="true" />
                                </button>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={apiError && onRetry ? onRetry : onConfirm}
                            data-testid="promotion-generate-button"
                            disabled={images.length === 0 || step === 'loading' || isValidatingFiles}
                            aria-busy={step === 'loading'}
                            aria-describedby={images.length === 0 ? 'promotion-generate-hint' : undefined}
                            className={`w-full py-3.5 rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 transition-transform shadow-lg
                                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002B7A] focus-visible:ring-offset-2 ${images.length > 0 && step !== 'loading' && !isValidatingFiles
                                ? 'bg-gradient-to-r from-[#FF5A36] to-[#FF8A65] text-white hover:scale-[1.02]'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            {step === 'loading' ? (
                                <RefreshCw size={16} className="animate-spin" aria-hidden="true" />
                            ) : (
                                <Wand2 size={16} aria-hidden="true" />
                            )}
                            {step === 'loading' ? '제작 중…' : apiError ? '다시 시도하기' : '영상 생성하기'}
                        </button>

                        {/* 버튼이 왜 비활성인지 명시한다 */}
                        {images.length === 0 && (
                            <p id="promotion-generate-hint" className="text-[11px] text-gray-400 text-center -mt-1">
                                사진을 1장 이상 등록하면 영상을 만들 수 있어요.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* --- RIGHT PANEL: Preview & Gallery (Split Layout, No Overlap) --- */}
            <div className="flex-1 flex flex-col gap-4 min-w-0 h-full">

                {/* 1. Top Area: Main Preview (Flexible) */}
                <div className="flex-1 min-h-0 bg-[#F5F7FA] rounded-[24px] border border-[#002B7A05] relative overflow-hidden flex flex-col items-center justify-center p-4">

                    {/* Background Grid */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                        style={{ backgroundImage: 'linear-gradient(#002B7A 1px, transparent 1px), linear-gradient(90deg, #002B7A 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                    </div>

                    {/* INPUT STATE: Placeholder - HEIGHT BASED SIZING */}
                    {step === 'input' && (
                        <div className="relative h-full max-h-full w-auto aspect-[9/16] bg-white rounded-[24px] shadow-xl flex flex-col items-center justify-center gap-4 animate-in fade-in zoom-in-95 duration-500 border border-white/50 object-contain">
                            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 shadow-inner">
                                <Play size={24} className="text-[#002B7A] ml-1 opacity-50" />
                            </div>
                            <div className="text-center space-y-1.5 px-4">
                                <p className="text-[14px] font-bold text-[#191F28]">영상이 여기에 표시됩니다</p>
                                <p className="text-[12px] text-gray-400">좌측에서 이미지를 업로드하고<br />아래에서 스타일을 선택해보세요.</p>
                            </div>
                        </div>
                    )}

                    {/* LOADING STATE: 3D Animation */}
                    {step === 'loading' && (
                        <div className="relative w-full h-full flex flex-col items-center justify-center animate-in fade-in duration-500">
                            <div className="relative w-full h-[80%] mb-4">
                                {/* Camera Z moved back to 8 to ensure full visibility */}
                                <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                                    <ambientLight intensity={0.7} />
                                    <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
                                    <pointLight position={[-10, -10, -10]} intensity={0.5} color="#002B7A" />
                                    <AnimatedSphere />
                                    {/* 5 Satellites with fading colors */}
                                    <OrbitingSatellite radius={3.0} speed={1.0} size={0.15} color="#002B7A" offset={0} />
                                    <OrbitingSatellite radius={3.6} speed={0.8} size={0.12} color="#2563EB" offset={1.5} />
                                    <OrbitingSatellite radius={4.2} speed={0.6} size={0.10} color="#60A5FA" offset={3.0} />
                                    <OrbitingSatellite radius={4.8} speed={0.5} size={0.08} color="#93C5FD" offset={4.5} />
                                    <OrbitingSatellite radius={5.4} speed={0.4} size={0.06} color="#BFDBFE" offset={6.0} />
                                </Canvas>
                            </div>
                            <div className="text-center space-y-3 z-10" role="status" aria-live="polite">
                                <h2 className="text-[24px] font-bold text-[#191F28]">
                                    {displayMessage}
                                </h2>

                                {/* 단계 안내 — 서버가 진행률을 주지 않아도 어디쯤인지 알 수 있게 한다 */}
                                <ol className="flex items-center justify-center gap-2 text-[12px]">
                                    {GENERATION_STAGES.map((stage, index) => (
                                        <li
                                            key={stage}
                                            className={`px-2.5 py-1 rounded-full transition-colors ${index <= stageIndex ? 'bg-[#002B7A] text-white font-semibold' : 'bg-gray-100 text-gray-400'}`}
                                            aria-current={index === stageIndex ? 'step' : undefined}
                                        >
                                            {stage}
                                        </li>
                                    ))}
                                </ol>

                                {/* 서버가 실제 진행률을 줄 때만 퍼센트를 표시한다 (가짜 진행률 금지) */}
                                {hasProgressValue ? (
                                    <>
                                        <div className="w-[280px] bg-gray-200 h-1.5 rounded-full overflow-hidden mx-auto">
                                            <div
                                                className="h-full bg-[#002B7A] transition-transform duration-300 ease-out origin-left"
                                                style={{ transform: `scaleX(${Math.max(0, Math.min(100, progress)) / 100})`, width: '100%' }}
                                            />
                                        </div>
                                        <p className="text-[14px] text-gray-500 font-medium">잠시만 기다려주세요 ({Math.round(progress)}%)</p>
                                    </>
                                ) : (
                                    <p className="text-[14px] text-gray-500 font-medium">
                                        현재 작업은 계속 진행 중입니다. 시간이 조금 걸릴 수 있어요.
                                    </p>
                                )}

                                {isSlowGeneration && (
                                    <p className="text-[13px] text-point font-medium break-keep max-w-[320px] mx-auto">
                                        영상 생성에 평소보다 시간이 걸리고 있어요. 창을 닫으면 작업이 취소되니 잠시만 기다려 주세요.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* RESULT STATE: Video Player (No Title Overlay, Height Based) */}
                    {step === 'result' && resultData && (
                        <div className="relative h-full max-h-full w-auto aspect-[9/16] bg-black rounded-[24px] shadow-2xl overflow-hidden ring-4 ring-white animate-in zoom-in-95 duration-500 group object-contain">
                            <VideoPlayer
                                src={resultData.videoUrl}
                                onRegenerate={onRetry}
                                className="w-full h-full object-cover"
                                controls
                                autoPlay
                                loop
                                muted
                                playsInline
                                preload="metadata"
                            />
                        </div>
                    )}
                </div>

                {/* 2. Bottom Area: Controls & Gallery (Fixed Height, No Overlap) - Hidden in Storyboard step */}
                <div className={`h-[200px] shrink-0 p-3 flex flex-col justify-center ${step === 'storyboard' ? 'hidden' : ''}`}>

                    {/* A. Style Gallery (Input Step) */}
                    {step === 'input' && (
                        <div className="animate-in slide-in-from-bottom-5 duration-500 h-full flex flex-col">
                            <div className="flex items-center justify-between px-1 mb-2 shrink-0">
                                <div className="flex flex-col">
                                    <h3 className="text-[14px] font-bold text-[#191F28] flex items-center gap-2">
                                        스타일 갤러리
                                    </h3>
                                    <p className="text-[13px] text-gray-500 mt-0.5">원하는 분위기를 선택해보세요.</p>
                                </div>
                            </div>

                            {/* Grid Layout: 4 Columns */}
                            <div className="grid grid-cols-4 gap-2.5 w-full h-full min-h-0">
                                {VIBES.map((vibe) => {
                                    const isSelected = options.vibe === vibe.id;

                                    // Theme Colors Definition
                                    const theme = {
                                        energetic: {
                                            border: 'border-amber-100',
                                            borderSelected: 'border-amber-200',
                                            bg: 'bg-white',
                                            bgSelected: 'bg-amber-50',
                                            ring: 'ring-amber-400',
                                            iconBg: 'bg-amber-50',
                                            iconBgSelected: 'bg-white',
                                            icon: 'text-amber-400',
                                            iconSelected: 'text-amber-600',
                                            title: 'text-amber-950',
                                            desc: 'text-amber-800/60'
                                        },
                                        luxury: {
                                            border: 'border-purple-100',
                                            borderSelected: 'border-purple-200',
                                            bg: 'bg-white',
                                            bgSelected: 'bg-purple-50',
                                            ring: 'ring-purple-400',
                                            iconBg: 'bg-purple-50',
                                            iconBgSelected: 'bg-white',
                                            icon: 'text-purple-400',
                                            iconSelected: 'text-purple-600',
                                            title: 'text-purple-950',
                                            desc: 'text-purple-800/60'
                                        },
                                        mood: {
                                            border: 'border-rose-100',
                                            borderSelected: 'border-rose-200',
                                            bg: 'bg-white',
                                            bgSelected: 'bg-rose-50',
                                            ring: 'ring-rose-400',
                                            iconBg: 'bg-rose-50',
                                            iconBgSelected: 'bg-white',
                                            icon: 'text-rose-400',
                                            iconSelected: 'text-rose-600',
                                            title: 'text-rose-950',
                                            desc: 'text-rose-800/60'
                                        }
                                    }[vibe.id] || { // Fallback
                                        border: 'border-gray-100',
                                        borderSelected: 'border-gray-200',
                                        bg: 'bg-white',
                                        bgSelected: 'bg-gray-50',
                                        ring: 'ring-gray-400',
                                        iconBg: 'bg-gray-50',
                                        iconBgSelected: 'bg-white',
                                        icon: 'text-gray-400',
                                        iconSelected: 'text-gray-600',
                                        title: 'text-gray-900',
                                        desc: 'text-gray-500'
                                    };

                                    return (
                                        <button
                                            key={vibe.id}
                                            onClick={() => setOptions({ ...options, vibe: vibe.id })}
                                            data-testid={`promotion-style-${vibe.id}`}
                                            className={`relative w-full h-full rounded-2xl overflow-hidden transition-all duration-300 group flex flex-col items-start justify-between p-3.5 text-left border ${isSelected
                                                ? `ring-2 ring-offset-1 ${theme.ring} ${theme.borderSelected} ${theme.bgSelected}`
                                                : `${theme.border} ${theme.bg} hover:border-gray-300 hover:shadow-md`
                                                }`}
                                        >
                                            {/* Background Gradient Accent (Subtle) */}
                                            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-20 -mr-10 -mt-10 transition-opacity ${isSelected ? 'opacity-40' : 'opacity-0 group-hover:opacity-20'} ${vibe.gradient}`}></div>

                                            {/* Header: Icon */}
                                            <div className="flex justify-between items-start w-full relative z-10 mb-2">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isSelected
                                                    ? `${theme.iconBgSelected} shadow-sm`
                                                    : `${theme.iconBg} group-hover:bg-white group-hover:shadow-sm`
                                                    }`}>
                                                    <div className={`${isSelected ? theme.iconSelected : theme.icon}`}>
                                                        {vibe.icon}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Body: Text (Larger Font, No Truncation) */}
                                            <div className="w-full relative z-10 flex-1 flex flex-col justify-end">
                                                <span className={`block text-[15px] font-bold mb-1 transition-colors leading-tight ${isSelected ? theme.title : 'text-[#191F28]'}`}>
                                                    {vibe.label}
                                                </span>
                                                <span className={`block text-[12px] leading-snug break-keep transition-colors ${isSelected ? theme.desc : 'text-gray-400'}`}>
                                                    {vibe.desc}
                                                </span>
                                            </div>

                                            {/* Recommendation Badge (PULSE Recommended) */}
                                            {vibe.recommend && (
                                                <div className="absolute top-3 right-3 z-20 animate-pulse">
                                                    <div className="bg-gradient-to-r from-[#002B7A] to-[#4D85FF] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                                                        <Sparkles size={10} className="text-yellow-300" /> PULSE 추천
                                                    </div>
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}

                                {/* Coming Soon Card */}
                                <div className="relative w-full h-full rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 flex flex-col items-center justify-center gap-2 cursor-default group hover:bg-gray-100 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-gray-600 transition-colors shadow-sm">
                                        <Plus size={16} />
                                    </div>
                                    <span className="text-[12px] text-gray-400 font-medium group-hover:text-gray-600">스타일 더보기</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* B. Result Controls (Result Step) - NEW LAYOUT (Horizontal) */}
                    {step === 'result' && (
                        <div className="animate-in slide-in-from-bottom-5 duration-500 flex flex-col gap-3 h-full justify-center">

                            {/* Hashtags & GenerationTime (API 응답 데이터) */}
                            {resultData && (
                                <div className="flex flex-col gap-1.5">
                                    {/* 생성 시간 - 해시태그 위 */}
                                    {resultData.generationTime && (
                                        <span className="text-[11px] text-gray-400 flex items-center gap-1">
                                            <Clock size={11} /> {resultData.generationTime} 소요
                                        </span>
                                    )}
                                    {/* 해시태그 */}
                                    {resultData.hashtags && resultData.hashtags.length > 0 && (
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <Hash size={13} className="text-[#002B7A] shrink-0" />
                                            {resultData.hashtags.map((tag, i) => (
                                                <span key={i} className="text-[12px] font-medium text-[#002B7A] bg-blue-50 px-2 py-0.5 rounded-full">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Title Input & Actions — 같은 가로열 */}
                            <div className="flex flex-row items-center gap-3">
                                {/* 영상 제목 라벨 */}
                                <label className="text-[12px] font-bold text-[#002B7A] flex items-center gap-1 shrink-0 whitespace-nowrap">
                                    영상 제목 <Wand2 size={10} className="text-blue-400" />
                                </label>

                                {/* 인풋 (flex-1 로 남은 공간 채움) */}
                                <div className="relative w-[280px] shrink-0">
                                    <input
                                        type="text"
                                        value={options.title}
                                        onChange={(e) => setOptions({ ...options, title: e.target.value })}
                                        placeholder="영상 제목을 입력해주세요"
                                        className="w-full h-11 rounded-xl bg-white border border-gray-200 px-3 pr-24 text-[13px] focus:border-[#002B7A] focus:ring-1 focus:ring-[#002B7A] transition-all outline-none shadow-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleCopyTitle}
                                        className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[12px] font-bold text-amber-700 bg-gradient-to-r from-amber-50 to-orange-100 hover:from-amber-100 hover:to-orange-200 border border-amber-200 hover:scale-105 px-3 py-1.5 rounded-full transition-transform flex items-center gap-1.5 shadow-sm
                                                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002B7A]"
                                    >
                                        <Copy size={11} aria-hidden="true" /> 복사하기
                                    </button>
                                </div>

                                {/* 새로고침 + 저장 버튼 */}
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        type="button"
                                        onClick={onReset}
                                        aria-label="처음부터 다시 만들기"
                                        title="처음부터 다시 만들기"
                                        className="h-11 w-11 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-[#002B7A] hover:border-[#002B7A] hover:bg-blue-50 shadow-sm flex items-center justify-center transition-colors group
                                                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002B7A]"
                                    >
                                        <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" aria-hidden="true" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleDownload}
                                        disabled={!resultData?.videoUrl || isDownloading}
                                        aria-busy={isDownloading}
                                        className="h-11 px-6 rounded-xl bg-[#002B7A] text-white font-bold text-[14px] shadow-md hover:bg-[#001F5C] flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]
                                                   disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100
                                                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002B7A] focus-visible:ring-offset-2"
                                    >
                                        {isDownloading ? <LoadingSpinner size="sm" label="저장 중" /> : <Download size={16} aria-hidden="true" />}
                                        {isDownloading ? '저장 중…' : '저장하기'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* C. Loading Message (Loading Step) */}
                    {step === 'loading' && (
                        <div className="flex items-center justify-center h-full text-gray-400 text-[13px] animate-pulse">
                            <Info size={14} className="mr-2" />
                            영상을 생성하는 동안 잠시만 기다려주세요.
                        </div>
                    )}
                </div>
            </div>

            <ConfirmModal
                isOpen={isProUpgradeOpen}
                onClose={() => setIsProUpgradeOpen(false)}
                onConfirm={() => {
                    setIsProUpgradeOpen(false);
                    onNavigate?.('subscription');
                }}
                title="고화질은 Pro 플랜 기능이에요"
                description="Pro 플랜으로 바꾸면 더 선명한 화질로 홍보 영상을 만들 수 있어요."
                confirmLabel="플랜 살펴보기"
                cancelLabel="나중에"
                tone="primary"
            />
        </div >
    );
}
