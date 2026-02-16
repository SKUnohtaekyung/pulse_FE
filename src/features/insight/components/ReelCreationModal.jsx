import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Film, Sparkles, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';

export default function ReelCreationModal({ isOpen, onClose, persona, onConfirm }) {
    const [step, setStep] = useState('review'); // review | generating | done

    if (!isOpen || !persona) return null;

    // 🧠 Mock Logic: Extracting "AI-able" features vs "Operations"
    const aiFeatures = {
        visuals: persona.tags.map(t => `#${t}`),
        vibe: persona.journey.eat.type === 'good' ? '맛있는 음식에 집중하는 클로즈업 무드' : '활기찬 매장 분위기',
        copy: `"${persona.summary.split('.')[0]}"`,
    };

    const excludedFeatures = [
        persona.journey.visit.painPoint !== '없음' ? persona.journey.visit.painPoint : null,
        persona.journey.share.painPoint !== '없음' ? persona.journey.share.painPoint : null,
    ].filter(Boolean);

    const handleGenerate = () => {
        setStep('generating');
        // Simulate API call
        setTimeout(() => {
            onConfirm(); // Trigger actual navigation or logic
            setStep('review'); // Reset for next time (or close)
        }, 2000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] bg-white rounded-[28px] shadow-2xl z-[101] overflow-hidden border border-[#E5E8EB]"
                    >
                        {step === 'review' && (
                            <div className="flex flex-col h-full">
                                {/* Header */}
                                <div className="bg-[#F9FAFB] px-6 py-5 border-b border-[#F2F4F6] flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-[#E8F3FF] rounded-lg">
                                            <Sparkles size={18} className="text-[#3182F6]" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[#191F28] text-[16px]">AI 마케팅 레시피 확인</h3>
                                            <p className="text-[12px] text-[#8B95A1]">분석 데이터를 기반으로 영상을 기획했어요.</p>
                                        </div>
                                    </div>
                                    <button onClick={onClose} className="p-2 hover:bg-[#F2F4F6] rounded-full transition-colors">
                                        <X size={20} className="text-[#8B95A1]" />
                                    </button>
                                </div>

                                {/* Body */}
                                <div className="p-6 flex flex-col gap-6">

                                    {/* Section 1: Included (Green) */}
                                    <div>
                                        <h4 className="text-[13px] font-bold text-[#333D4B] mb-3 flex items-center gap-2">
                                            <Check size={14} className="text-[#3182F6]" />
                                            영상에 반영될 핵심 포인트
                                        </h4>
                                        <div className="bg-[#F9FAFB] rounded-xl p-4 border border-[#F2F4F6] flex flex-col gap-3">
                                            <div className="flex gap-3 items-start">
                                                <span className="text-[12px] font-bold text-[#8B95A1] w-12 shrink-0 mt-0.5">Visual</span>
                                                <div className="flex flex-wrap gap-1.5 flex-1">
                                                    {aiFeatures.visuals.map((v, i) => (
                                                        <span key={i} className="px-2 py-0.5 bg-white border border-[#E5E8EB] rounded text-[12px] text-[#4E5968] font-medium shadow-sm">
                                                            {v}
                                                        </span>
                                                    ))}
                                                    <p className="text-[12px] text-[#333D4B] w-full mt-1.5 leading-snug">
                                                        👉 {aiFeatures.vibe}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="w-full h-px bg-[#E5E8EB]" />
                                            <div className="flex gap-3 items-start">
                                                <span className="text-[12px] font-bold text-[#8B95A1] w-12 shrink-0 mt-0.5">Copy</span>
                                                <p className="text-[13px] text-[#191F28] font-bold leading-snug flex-1">
                                                    {aiFeatures.copy}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 2: Excluded (Red/Gray) */}
                                    {excludedFeatures.length > 0 && (
                                        <div>
                                            <h4 className="text-[13px] font-bold text-[#6B7684] mb-3 flex items-center gap-2">
                                                <AlertCircle size={14} className="text-[#FFB300]" />
                                                제외되는 운영 이슈 (영상화 불가)
                                            </h4>
                                            <div className="bg-[#FFF9F9] rounded-xl p-4 border border-[#FFE8E8]">
                                                <ul className="list-disc list-inside space-y-1">
                                                    {excludedFeatures.map((ex, i) => (
                                                        <li key={i} className="text-[12px] text-[#D9303E]">
                                                            {ex} <span className="text-[#FFB300] text-[10px] ml-1">(운영 개선 필요)</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}

                                </div>

                                {/* Footer */}
                                <div className="p-6 pt-0 mt-auto">
                                    <button
                                        onClick={handleGenerate}
                                        className="w-full py-4 bg-[#3182F6] hover:bg-[#206EF4] text-white rounded-[16px] font-bold text-[15px] shadow-lg shadow-blue-100 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                                    >
                                        <Film size={18} />
                                        이 레시피로 홍보 영상 만들기
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 'generating' && (
                            <div className="h-[400px] flex flex-col items-center justify-center text-center p-8 bg-white/90">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                    className="mb-6"
                                >
                                    <Loader2 size={40} className="text-[#3182F6]" />
                                </motion.div>
                                <h3 className="text-[20px] font-bold text-[#191F28] mb-2">AI가 영상을 구성하고 있어요</h3>
                                <p className="text-[#8B95A1] text-[14px]">약 10초 정도 소요됩니다...</p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
