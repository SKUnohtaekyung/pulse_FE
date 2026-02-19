import React, { useRef, useState, useEffect } from 'react';
import { Upload, X, Zap, Crown, Coffee, Lightbulb, AlertCircle, CheckCircle, TrendingUp, Clock, Hash, Copy, Download, Instagram, RefreshCw, Play, Wand2, Settings, Crop, Edit2, Trash2, ChevronDown, Info, Plus, Star, Sparkles, Lock } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';

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

export default function VideoCreator({ step, resultData, onReset, images, setImages, options, setOptions, onGenerate, onConfirm, onNavigate }) {
    const fileInputRef = useRef(null);

    // Local State for UI (화면 제어를 위한 로컬 상태)
    const [isAutoPrompt, setIsAutoPrompt] = useState(true); // AI 자동 완성 활성화 여부
    const [qualityMode, setQualityMode] = useState('standard'); // 'standard' | 'pro' (화질 모드)
    const [isQualityMenuOpen, setIsQualityMenuOpen] = useState(false); // 화질 선택 메뉴 토글
    const [selectedFile, setSelectedFile] = useState(null); // 백엔드 전송용 원본 파일 객체 (Backend Integration)
    // promptText와 videoTitle은 부모 컴포넌트(PromotionPage)에서 관리합니다 (상태 끌어올리기)

    // Loading Progress Logic (로딩 진행률 시뮬레이션)
    // 실제 서버 응답과 관계없이 사용자 경험을 위해 8초간 자연스럽게 게이지가 찹니다.
    const [progress, setProgress] = useState(0);
    const [activeTooltip, setActiveTooltip] = useState(null); // 'persona' | 'desc' | null
    const logs = ["사진을 분석하고 있어요...", "어울리는 음악을 고르고 있어요...", "장면을 최적화하고 있어요...", "영상을 렌더링하고 있어요..."];
    const LOADING_DURATION = 8000; // 8 seconds fixed
    const DEFAULT_PROMPT = "따뜻한 햇살이 비치는 창가에서 김이 모락모락 나는 커피 한 잔의 여유로움";

    useEffect(() => {
        if (step === 'loading') {
            setProgress(0);
            const intervalTime = 50;
            const steps = LOADING_DURATION / intervalTime;
            const increment = 100 / steps;

            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return prev + increment;
                });
            }, intervalTime);
            return () => clearInterval(interval);
        }
    }, [step]);

    // Auto-generate prompt (이미지 업로드 시 프롬프트 자동 완성)
    // 이미지를 올리면 기본 프롬프트를 자동으로 채워줘서 사용자가 막막하지 않게 돕습니다.
    useEffect(() => {
        if (images.length > 0 && isAutoPrompt && !options.prompt) {
            setOptions(prev => ({ ...prev, prompt: DEFAULT_PROMPT }));
        } else if (images.length === 0 && !options.prompt) {
            // Keep prompt empty if no images and no pre-filled prompt
        }
    }, [images, isAutoPrompt, options.prompt, setOptions]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const file = files[0];
            const newImage = URL.createObjectURL(file); // 프론트엔드 표시용 Blob URL
            setImages([newImage]);
            setSelectedFile(file); // 백엔드 전송용 Raw File 저장
        }
    };

    const handleAITitle = () => {
        // API 응답의 videoTitle이 있으면 사용, 없으면 기본 목업 타이틀
        const aiTitle = resultData?.videoTitle || '범계 로데오의 숨은 보석, 감성 카페 오픈!';
        setOptions(prev => ({ ...prev, title: aiTitle }));
    };

    // --- Round 9: Text Update & Premium AI UI ---
    // CONSTANTS VIBES and PERSONA_PROMPTS moved outside component for performance




    // --- Phase 5: VEO3 Payload Generator (VEO3 연동을 위한 검증 로직) ---
    // UI에서 선택한 값들을 AI 모델(VEO3)이 이해할 수 있는 JSON 구조로 변환합니다.
    // Video.md 명세서의 규칙을 엄격하게 따릅니다.
    const generateVeoPayload = () => {
        const transactionId = `PULSE_Gen_${Date.now()}`; // 고유 트랜잭션 ID 생성

        // Mappings based on Video.md (Video.md 기반 매핑 로직)
        const qualityKeywords = qualityMode === 'pro'
            ? "8K, Masterpiece, Highly Detailed, Sharp Focus, Ray Tracing"
            : "Photorealistic, 4K, Clean Image";

        const vibeMap = {
            energetic: { keywords: "Fast-paced, Vibrant Colors, High Saturation, Pop Style", camera: "Dynamic zoom, Fast transitions, Handheld shake" },
            luxury: { keywords: "Luxurious, Cinematic Lighting, Slow Motion, Elegant, Soft Focus", camera: "Slow smooth pan, Stabilized gimbal shot, Rack focus" },
            emotional: { keywords: "Cozy, Warm Tone, Instagram Aesthetic, Emotional, Lo-fi", camera: "Static shot with subtle movement, Shallow depth of field" }
        };
        const selectedVibe = vibeMap[options.vibe || 'energetic']; // Default to energetic

        const personaMap = {
            hangover: "A middle-aged man wiping sweat",
            worker: "Busy office worker in a suit",
            couple: "A young stylish couple"
        };
        const targetPersona = personaMap[options.personaId] || "A happy customer";

        const locationDesc = options.prompt || "A warm sunlit Korean restaurant table";

        return {
            metadata: {
                prompt_name: transactionId,
                base_style: `Vertical 9:16, Portrait Mode, ${qualityKeywords}, ${selectedVibe.keywords}, ${targetPersona} atmosphere`,
                aspect_ratio: "9:16",
                duration: "8-10 seconds",
                location: `${locationDesc} (e.g., A warm sunlit Korean restaurant table)`,
                camera_setup: `Vertical framing. ${selectedVibe.camera}`
            },
            key_elements: [
                options.prompt || "Delicious Food",
                `${targetPersona} (e.g., A happy couple, a busy office worker)`,
                "No text overlays",
                "High visual fidelity"
            ],
            negative_prompts: [
                "text", "subtitles", "captions", "english text", "korean text", "watermark", "logo", "signature",
                "horizontal", "landscape", "16:9", "letterbox",
                "distorted food", "messy table", "ugly faces", "bad anatomy", "violence", "disturbing content"
            ],
            timeline: [
                {
                    sequence: 1,
                    section: "HOOK (0-3s)",
                    timestamp: "00:00-00:03",
                    action: `[Shot: Close-up] + [Subject: ${options.prompt || "Main Menu"}] + [Action: Dynamic Sizzling] + [Context: High Contrast Lighting].`,
                    audio: "Upbeat Intro + Sizzling Sound"
                },
                {
                    sequence: 2,
                    section: "BODY (3-7s)",
                    timestamp: "00:03-00:07",
                    action: `[Shot: Medium Shot] + [Subject: ${targetPersona}] + [Action: Eating Happily] + [Context: Busy Store Atmosphere].`,
                    audio: "Ambient Chatter + Chewing Sound"
                },
                {
                    sequence: 3,
                    section: "OUTRO (7-10s)",
                    timestamp: "00:07-00:10",
                    action: `[Shot: Pull-back/Wide] + [Subject: Full Table Spread] + [Action: Static] + [Context: Inviting Atmosphere].`,
                    audio: "Logo Sound + Fading BGM"
                }
            ]
        };
    };

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
                                <label className="text-[14px] font-bold text-[#191F28] shrink-0 whitespace-nowrap">원본 이미지 (필수)</label>
                                <div className="flex items-center gap-1 text-[11px] text-[#002B7A] bg-blue-50 px-2 py-1 rounded-full whitespace-nowrap shrink-0">
                                    <Info size={11} className="shrink-0" /> <span>음식이나 가게의 분위기 중심 사진을 권장해요.</span>
                                </div>
                            </div>
                            <div
                                className={`h-[200px] rounded-2xl border-2 border-dashed transition-all relative overflow-hidden group ${images.length > 0 ? 'border-transparent' : 'border-gray-200 hover:border-[#002B7A]/30 hover:bg-gray-50 cursor-pointer'
                                    }`}
                                onClick={() => images.length === 0 && fileInputRef.current?.click()}
                            >
                                {images.length > 0 ? (
                                    <>
                                        <img src={images[0]} alt="preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition-colors" title="자르기">
                                                <Crop size={18} />
                                            </button>
                                            <button onClick={() => fileInputRef.current?.click()} className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition-colors" title="변경">
                                                <Edit2 size={18} />
                                            </button>
                                            <button onClick={() => setImages([])} className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-red-500 hover:text-white transition-colors" title="삭제">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full">
                                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                            <Upload size={20} className="text-gray-400 group-hover:text-[#002B7A]" />
                                        </div>
                                        <p className="text-[13px] font-bold text-gray-500">이미지 업로드</p>
                                        <p className="text-[12px] text-gray-400">클릭하거나 드래그하세요</p>
                                    </div>
                                )}
                            </div>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
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
                                {PERSONA_PROMPTS.map((persona) => {
                                    const isSelected = options.personaId === persona.id;
                                    return (
                                        <button
                                            key={persona.id}
                                            onClick={() => {
                                                setOptions({ ...options, prompt: persona.prompt, personaId: persona.id });
                                                setIsAutoPrompt(false);
                                            }}
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
                                <div className="flex items-center gap-2 cursor-pointer" onClick={() => {
                                    const nextState = !isAutoPrompt;
                                    setIsAutoPrompt(nextState);
                                    if (nextState) {
                                        setOptions(prev => ({ ...prev, prompt: DEFAULT_PROMPT }));
                                    }
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
                                    placeholder="만들고 싶은 영상의 느낌을 자유롭게 적어주세요."
                                    className={`w-full h-full rounded-xl p-3 text-[14px] resize-none transition-all outline-none border leading-relaxed ${isAutoPrompt
                                        ? 'bg-blue-50/50 border-blue-200 text-[#002B7A] focus:bg-white focus:border-[#002B7A] focus:ring-1 focus:ring-[#002B7A]'
                                        : 'bg-white border-gray-200 text-[#191F28] focus:border-[#002B7A] focus:ring-1 focus:ring-[#002B7A]'
                                        }`}
                                />
                                {isAutoPrompt && (
                                    <div className="absolute bottom-2 right-2 mb-1 flex items-center gap-1 text-[12px] text-[#002B7A] font-bold bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-blue-100 group-hover/prompt:opacity-0 transition-opacity pointer-events-none">
                                        <Wand2 size={12} /> AI가 작성함 (클릭하여 수정)
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
                                                if (confirm("Pro 플랜 전용 기능입니다. 지금 업그레이드하고 4K 화질을 경험해보세요!")) {
                                                    onNavigate('subscription');
                                                }
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
                                10초 영상 <Clock size={14} className="text-[#002B7A]" />
                            </button>
                        </div>

                        <button
                            onClick={() => {
                                try {
                                    const payload = generateVeoPayload();

                                    // [Backend Integration Bridge]
                                    // 1. payload: VEO3 생성 옵션 JSON
                                    // 2. selectedFile: 업로드할 원본 이미지 파일 (File Object)
                                    // 백엔드에서는 selectedFile을 스토리지에 업로드 후, 그 ID를 payload에 추가하여 VEO3로 요청해야 합니다.
                                    console.log("[VEO3 Payload Verification]", JSON.stringify(payload, null, 2));
                                    if (selectedFile) console.log("[Image File Ready]", selectedFile.name, selectedFile.size);

                                    onGenerate(payload, selectedFile);
                                } catch (error) {
                                    console.error("[Payload Generation Error]", error);
                                    alert("영상 생성 요청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
                                }
                            }}
                            disabled={images.length === 0 || step === 'loading'}
                            className={`w-full py-3.5 rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 transition-all shadow-lg ${images.length > 0 && step !== 'loading'
                                ? 'bg-gradient-to-r from-[#FF5A36] to-[#FF8A65] text-white hover:shadow-orange-500/30 hover:scale-[1.02]'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            {step === 'loading' ? (
                                <RefreshCw size={16} className="animate-spin" />
                            ) : (
                                <Wand2 size={16} />
                            )}
                            {step === 'loading' ? '제작 중...' : step === 'storyboard' ? '콘티 확인 중' : '영상 생성하기'}
                        </button>
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

                    {/* STORYBOARD STATE: Planning View */}
                    {step === 'storyboard' && (
                        <div className="relative w-full h-full flex flex-col animate-in fade-in zoom-in-95 duration-500 bg-white rounded-[24px] shadow-xl overflow-hidden">
                            <div className="bg-[#002B7A] p-4 text-white flex justify-between items-center shrink-0">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                        <Lightbulb size={18} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[16px]">AI가 그려본 우리 가게 이야기</h3>
                                        <p className="text-[13px] opacity-80">사장님의 가게에 딱 맞는 이야기를 준비했어요.</p>
                                    </div>
                                </div>
                                <div className="text-[12px] bg-white/20 px-2.5 py-1 rounded-lg">
                                    총 4장면 / 10초
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-gray-50">
                                {[
                                    { scene: 1, time: '0~3초', desc: '시선을 사로잡는 도입부 (Hook)', audio: '강렬한 비트의 트렌디한 BGM' },
                                    { scene: 2, time: '3~7초', desc: '메인 메뉴와 가게 분위기 (Body)', audio: '리듬감 있는 화면 전환과 효과음' },
                                    { scene: 3, time: '7~10초', desc: '방문 유도 및 로고 엔딩 (Outro)', audio: '임팩트 있는 마무리 사운드' }
                                ].map((scene) => (
                                    <div key={scene.scene} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex gap-4">
                                        <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center text-[#002B7A] shrink-0 font-bold text-sm border border-blue-100">
                                            #{scene.scene}
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <div className="flex justify-between items-center mb-1.5">
                                                <h4 className="font-bold text-[#191F28] text-[16px]">{scene.desc}</h4>
                                                <span className="text-[12px] text-[#002B7A] bg-blue-50 px-2.5 py-1 rounded-full font-bold">{scene.time}</span>
                                            </div>
                                            <p className="text-[13px] text-gray-500 flex items-center gap-1.5 mt-0.5">
                                                <Zap size={14} className="text-orange-500" /> {scene.audio}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 border-t border-gray-100 bg-white shrink-0 flex gap-3">
                                <button onClick={onReset} className="flex-1 py-3 rounded-xl border border-gray-200 font-bold text-[14px] text-gray-600 hover:bg-gray-50 transition-colors">
                                    수정하기
                                </button>
                                <button onClick={() => onConfirm(selectedFile, qualityMode)} className="flex-[2] py-3 rounded-xl bg-[#002B7A] text-white font-bold text-[14px] hover:bg-[#001F5C] shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
                                    <Wand2 size={16} /> 이대로 영상 만들기
                                </button>
                            </div>
                        </div>
                    )}

                    {/* LOADING STATE: 3D Animation (5 Satellites, Wider Canvas) */}
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
                            <div className="text-center space-y-3 z-10">
                                <h2 className="text-[24px] font-bold text-[#191F28] animate-pulse">
                                    {logs[Math.min(Math.floor(progress / 25), 3)]}
                                </h2>
                                <div className="w-[280px] bg-gray-200 h-1.5 rounded-full overflow-hidden mx-auto">
                                    <div className="h-full bg-[#002B7A] transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
                                </div>
                                <p className="text-[14px] text-gray-500 font-medium">잠시만 기다려주세요 ({Math.round(progress)}%)</p>
                            </div>
                        </div>
                    )}

                    {/* RESULT STATE: Video Player (No Title Overlay, Height Based) */}
                    {step === 'result' && resultData && (
                        <div className="relative h-full max-h-full w-auto aspect-[9/16] bg-black rounded-[24px] shadow-2xl overflow-hidden ring-4 ring-white animate-in zoom-in-95 duration-500 group object-contain">
                            <video src={resultData.videoUrl} controls autoPlay loop className="w-full h-full object-cover" />
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
                                <div className="flex items-center gap-3 flex-wrap">
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
                                    {/* 생성 시간 */}
                                    {resultData.generationTime && (
                                        <span className="text-[11px] text-gray-400 flex items-center gap-1 ml-auto shrink-0">
                                            <Clock size={11} /> {resultData.generationTime} 소요
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Title Input & Actions */}
                            <div className="flex flex-row justify-between items-center gap-4">
                                {/* Left Side: Title Input & AI Button */}
                                <div className="w-1/2 flex flex-col gap-1.5">
                                    <label className="text-[12px] font-bold text-[#002B7A] flex items-center gap-1">
                                        영상 제목 <Wand2 size={10} className="text-blue-400" />
                                    </label>
                                    <div className="relative w-full">
                                        <input
                                            type="text"
                                            value={options.title}
                                            onChange={(e) => setOptions({ ...options, title: e.target.value })}
                                            placeholder="영상 제목을 입력해주세요"
                                            className="w-full h-11 rounded-xl bg-white border border-gray-200 px-3 pr-24 text-[13px] focus:border-[#002B7A] focus:ring-1 focus:ring-[#002B7A] transition-all outline-none shadow-sm"
                                        />
                                        <button
                                            onClick={handleAITitle}
                                            className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[12px] font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-105 hover:shadow-md px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 shadow-sm"
                                        >
                                            <Wand2 size={11} /> AI 추천
                                        </button>
                                    </div>
                                </div>

                                {/* Right Side: Action Buttons */}
                                <div className="flex items-end gap-2 pb-1">
                                    <button onClick={onReset} className="h-11 w-11 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-[#002B7A] hover:border-[#002B7A] hover:bg-blue-50 shadow-sm flex items-center justify-center transition-all group" title="다시 만들기">
                                        <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                                    </button>
                                    <button className="h-11 px-6 rounded-xl bg-[#002B7A] text-white font-bold text-[14px] shadow-md hover:bg-[#001F5C] hover:shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02]">
                                        <Download size={16} /> 저장하기
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
        </div >
    );
}
