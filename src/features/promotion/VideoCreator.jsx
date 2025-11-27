import React, { useRef, useState, useEffect } from 'react';
import { Upload, X, Zap, Crown, Coffee, Lightbulb, AlertCircle, CheckCircle, TrendingUp, Clock, Hash, Copy, Download, Instagram, RefreshCw, Play, Wand2, Settings, Crop, Edit2, Trash2, ChevronDown, Info, Plus, Star } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';

// --- 3D Components for Loading ---
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

// 5 Satellites with fading colors
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

export default function VideoCreator({ step, resultData, onReset, images, setImages, options, setOptions, onGenerate }) {
    const fileInputRef = useRef(null);

    // Local State for UI
    const [isAutoPrompt, setIsAutoPrompt] = useState(true);
    const [qualityMode, setQualityMode] = useState('standard'); // 'standard' | 'pro'
    const [promptText, setPromptText] = useState('');
    const [videoTitle, setVideoTitle] = useState(''); // Result screen title

    // Loading Progress Logic
    const [progress, setProgress] = useState(0);
    const logs = ["사진을 분석하고 있어요...", "어울리는 음악을 고르고 있어요...", "자막을 생성하고 있어요...", "영상을 렌더링하고 있어요..."];
    const LOADING_DURATION = 8000; // 8 seconds fixed

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

    // Auto-generate prompt when image is uploaded
    useEffect(() => {
        if (images.length > 0 && isAutoPrompt) {
            setPromptText("따뜻한 햇살이 비치는 창가에서 김이 모락모락 나는 커피 한 잔의 여유로움");
        } else if (images.length === 0) {
            setPromptText("");
        }
    }, [images, isAutoPrompt]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const newImage = URL.createObjectURL(files[0]);
            setImages([newImage]);
        }
    };

    const handleAITitle = () => {
        setVideoTitle("범계 로데오의 숨은 보석, 감성 카페 오픈!");
    };

    // --- Round 9: Text Update & Premium AI UI ---
    const VIBES = [
        {
            id: 'energetic',
            label: '에너지',
            desc: '빠른 템포로 매력 포인트를 보여주는 홍보 영상',
            gradient: 'from-yellow-400 to-amber-500',
            // 3D Glass Selected State
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

    return (
        <div className="flex-1 h-full flex gap-6 overflow-hidden p-2">

            {/* --- LEFT PANEL: Input Studio (Fixed Width, No Scroll) --- */}
            <div className="w-[400px] flex flex-col gap-4 shrink-0 h-full">

                {/* Box 1: Image & Prompt (Glass Card) */}
                <div className="flex-1 min-h-0 bg-white rounded-[24px] border border-gray-200 shadow-sm p-5 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
                    <div>
                        <h2 className="text-[18px] font-bold text-[#002B7A] flex items-center gap-2">
                            홍보 영상 만들기
                        </h2>
                        <p className="text-[12px] text-gray-400 mt-0.5">우리 가게의 매력을 담은 맞춤 홍보 영상을 쉽고 빠르게 만들어보세요!</p>
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2 flex-1 flex flex-col min-h-0">
                        <div className="flex justify-between items-center">
                            <label className="text-[13px] font-bold text-[#191F28]">원본 이미지 (필수)</label>
                            <div className="flex items-center gap-1 text-[10px] text-[#002B7A] bg-blue-50 px-2 py-0.5 rounded-full">
                                <Info size={10} /> <span>음식이나 가게의 분위기 중심 사진을 권장해요.</span>
                            </div>
                        </div>
                        <div
                            className={`flex-1 min-h-[160px] rounded-2xl border-2 border-dashed transition-all relative overflow-hidden group ${images.length > 0 ? 'border-transparent' : 'border-gray-200 hover:border-[#002B7A]/30 hover:bg-gray-50 cursor-pointer'
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
                                    <p className="text-[11px] text-gray-400">클릭하거나 드래그하세요</p>
                                </div>
                            )}
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                    </div>

                    {/* Prompt Section */}
                    <div className="space-y-2 shrink-0">
                        <div className="flex justify-between items-center">
                            <label className="text-[13px] font-bold text-[#191F28]">영상 설명</label>
                            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsAutoPrompt(!isAutoPrompt)}>
                                <span className={`text-[10px] font-medium transition-colors ${isAutoPrompt ? 'text-[#002B7A]' : 'text-gray-400'}`}>AI 자동 완성</span>
                                <div className={`w-7 h-3.5 rounded-full p-0.5 transition-colors ${isAutoPrompt ? 'bg-[#002B7A]' : 'bg-gray-200'}`}>
                                    <div className={`w-2.5 h-2.5 bg-white rounded-full shadow-sm transition-transform ${isAutoPrompt ? 'translate-x-3.5' : 'translate-x-0'}`} />
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <textarea
                                value={promptText}
                                onChange={(e) => !isAutoPrompt && setPromptText(e.target.value)}
                                readOnly={isAutoPrompt}
                                placeholder="만들고 싶은 영상의 느낌을 설명해주세요."
                                className={`w-full h-20 rounded-xl p-3 text-[13px] resize-none transition-all outline-none border leading-relaxed ${isAutoPrompt
                                    ? 'bg-blue-50/30 border-blue-100 text-[#002B7A] cursor-not-allowed'
                                    : 'bg-white border-gray-200 text-[#191F28] focus:border-[#002B7A] focus:ring-1 focus:ring-[#002B7A]'
                                    }`}
                            />
                            {isAutoPrompt && (
                                <div className="absolute bottom-2 right-2 mb-1 flex items-center gap-1 text-[9px] text-[#002B7A] font-bold bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm border border-blue-100">
                                    <Wand2 size={9} /> AI GENERATED
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Box 2: Settings & Action (Glass Card) */}
                <div className="bg-white rounded-[24px] border border-gray-200 shadow-sm p-5 flex flex-col gap-3 shrink-0">
                    <div className="grid grid-cols-2 gap-2">
                        {/* Mode Selector */}
                        <div className="relative group">
                            <button className="w-full px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-[12px] font-bold text-[#191F28] flex items-center justify-between hover:bg-gray-100 transition-colors">
                                {qualityMode === 'standard' ? '표준 모드' : '프로 모드'}
                                <ChevronDown size={12} className="text-gray-400" />
                            </button>
                            <div className="absolute bottom-full left-0 w-full bg-white rounded-xl shadow-xl border border-gray-100 mb-2 overflow-hidden hidden group-hover:block z-20">
                                <button onClick={() => setQualityMode('standard')} className="w-full text-left px-3 py-2.5 hover:bg-gray-50 text-[12px] font-medium text-[#191F28]">표준 모드 (빠름)</button>
                                <button onClick={() => setQualityMode('pro')} className="w-full text-left px-3 py-2.5 hover:bg-gray-50 text-[12px] font-medium text-[#191F28] flex justify-between">프로 모드 (고화질) <Crown size={12} className="text-orange-500" /></button>
                            </div>
                        </div>

                        {/* Duration */}
                        <button className="px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-[12px] font-medium text-gray-500 flex items-center justify-between cursor-default">
                            5초 영상 <Clock size={12} />
                        </button>
                    </div>

                    <button
                        onClick={onGenerate}
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
                        {step === 'loading' ? '제작 중...' : '영상 생성하기'}
                    </button>
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
                                <p className="text-[11px] text-gray-400">좌측에서 이미지를 업로드하고<br />아래에서 스타일을 선택해보세요.</p>
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

                {/* 2. Bottom Area: Controls & Gallery (Fixed Height, No Overlap) */}
                <div className="h-[180px] shrink-0 bg-[#F0F7FF] rounded-[24px] border border-[#002B7A10] shadow-sm p-5 flex flex-col justify-center">

                    {/* A. Style Gallery (Input Step) */}
                    {step === 'input' && (
                        <div className="animate-in slide-in-from-bottom-5 duration-500 h-full flex flex-col">
                            <div className="flex items-center justify-between px-1 mb-3 shrink-0">
                                <div className="flex flex-col">
                                    <h3 className="text-[14px] font-bold text-[#002B7A] flex items-center gap-2">
                                        스타일 갤러리
                                    </h3>
                                    <p className="text-[11px] text-[#002B7A]/60 mt-0.5">원하는 분위기를 선택해보세요.</p>
                                </div>
                            </div>

                            {/* Grid Layout: 4 Columns (3D Liquid Glass) */}
                            <div className="grid grid-cols-4 gap-3 w-full h-full min-h-0">
                                {VIBES.map((vibe) => (
                                    <button
                                        key={vibe.id}
                                        onClick={() => setOptions({ ...options, vibe: vibe.id })}
                                        className={`relative w-full h-full rounded-xl overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform-gpu group flex flex-col items-start justify-between p-3 text-left backdrop-blur-md ${options.vibe === vibe.id
                                            ? `${vibe.bgSelected} scale-[0.98] ring-1 ring-white/50`
                                            : 'bg-gradient-to-b from-white/60 to-white/20 border-t border-white/80 border-b border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.6)] hover:scale-[1.02] hover:shadow-lg'
                                            }`}
                                    >
                                        {/* Header: Icon */}
                                        <div className="flex justify-between items-start w-full">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white bg-gradient-to-br ${vibe.gradient} shadow-md`}>
                                                {vibe.icon}
                                            </div>
                                        </div>

                                        {/* Body: Text */}
                                        <div className="w-full">
                                            <span className={`block text-[13px] font-bold mb-0.5 ${options.vibe === vibe.id ? vibe.textSelected : 'text-[#191F28]'}`}>
                                                {vibe.label}
                                            </span>
                                            <span className="block text-[10px] text-gray-500 leading-tight">
                                                {vibe.desc}
                                            </span>
                                        </div>

                                        {/* Recommendation Badge */}
                                        {vibe.recommend && (
                                            <div className="absolute top-0 right-0 bg-[#002B7A] text-white text-[9px] font-bold px-2 py-1 rounded-bl-xl shadow-sm">
                                                AI 추천
                                            </div>
                                        )}
                                    </button>
                                ))}

                                {/* Coming Soon Card (3D Glass) */}
                                <div className="relative w-full h-full rounded-xl border border-dashed border-blue-200/60 bg-white/30 backdrop-blur-sm flex flex-col items-center justify-center gap-2 cursor-default group hover:bg-white/50 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-blue-50/50 border border-blue-100 flex items-center justify-center text-blue-300 group-hover:text-blue-500 transition-colors shadow-sm">
                                        <Plus size={16} />
                                    </div>
                                    <span className="text-[10px] text-blue-300 font-medium">More Styles</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* B. Result Controls (Result Step) - NEW LAYOUT (Horizontal) */}
                    {step === 'result' && (
                        <div className="animate-in slide-in-from-bottom-5 duration-500 flex flex-row gap-4 h-full items-center">

                            {/* Left Side: Title Input & AI Button */}
                            <div className="flex-1 flex flex-col gap-2">
                                <label className="text-[12px] font-bold text-[#002B7A] flex items-center gap-1">
                                    영상 제목 <Wand2 size={10} className="text-blue-400" />
                                </label>
                                <div className="relative w-full">
                                    <input
                                        type="text"
                                        value={videoTitle}
                                        onChange={(e) => setVideoTitle(e.target.value)}
                                        placeholder="영상 제목을 입력해주세요"
                                        className="w-full h-11 rounded-xl bg-white border border-gray-200 px-3 pr-24 text-[13px] focus:border-[#002B7A] focus:ring-1 focus:ring-[#002B7A] transition-all outline-none shadow-sm"
                                    />
                                    <button
                                        onClick={handleAITitle}
                                        className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-105 hover:shadow-md px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 shadow-sm"
                                    >
                                        <Wand2 size={11} /> AI 추천
                                    </button>
                                </div>
                            </div>

                            {/* Right Side: Action Buttons */}
                            <div className="flex items-end gap-2 h-full pb-1">
                                {/* Reset Button: Compact */}
                                <button onClick={onReset} className="h-11 w-11 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-[#002B7A] hover:border-[#002B7A] hover:bg-blue-50 shadow-sm flex items-center justify-center transition-all group" title="다시 만들기">
                                    <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                                </button>

                                {/* Save Button: Solid Main Blue, No Border */}
                                <button className="h-11 px-6 rounded-xl bg-[#002B7A] text-white font-bold text-[14px] shadow-md hover:bg-[#001F5C] hover:shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02]">
                                    <Download size={16} /> 저장하기
                                </button>
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
        </div>
    );
}
