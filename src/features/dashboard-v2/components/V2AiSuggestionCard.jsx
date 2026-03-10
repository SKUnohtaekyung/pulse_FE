import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, PlayCircle, BarChart2 } from 'lucide-react';

const V2AiSuggestionCard = ({
    evidence,
    confidence = 'high',
    content,
    ctaText,
    onCta,
    onHide,
    onWhy
}) => {
    const [isVisible, setIsVisible] = useState(true);

    const handleHide = (e) => {
        e.stopPropagation();
        setIsVisible(false);
        if (onHide) {
            setTimeout(() => onHide(), 400); // Trigger callback after animation
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, x: 100, height: 0, margin: 0, overflow: 'hidden' }}
                    transition={{ duration: 0.3 }}
                    className="bg-[#002B7A] rounded-[24px] p-6 shadow-lg text-white relative overflow-hidden flex flex-col gap-4"
                >
                    {/* Background Detail */}
                    <motion.div
                        className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-[#8FB6FF] rounded-full blur-[80px] pointer-events-none"
                        animate={{ opacity: [0.15, 0.3, 0.15], scale: [1, 1.2, 1] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Header: Evidence & Controls */}
                    <div className="flex justify-between items-start relative z-10 w-full shrink-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-md border border-white/20">
                                <Sparkles size={12} className="text-[#FF5A36]" />
                                <span className="text-[12px] font-bold text-white tracking-wide">
                                    상황 매칭도: {confidence === 'high' ? '높음' : confidence === 'medium' ? '보통' : '낮음'}
                                </span>
                            </div>
                            <div className="text-[12px] text-blue-100 font-medium flex items-center gap-1">
                                <BarChart2 size={12} />
                                {evidence}
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-3 shrink-0 ml-2">
                            <button
                                onClick={(e) => { e.stopPropagation(); if (onWhy) onWhy(); }}
                                className="text-[12px] text-white/60 hover:text-white transition-colors font-medium border-b border-transparent hover:border-white/60"
                            >
                                AI의 추천 이유
                            </button>
                            <button
                                onClick={handleHide}
                                className="text-[12px] text-white/60 hover:text-white transition-colors font-medium border-b border-transparent hover:border-white/60"
                            >
                                오늘은 그만 볼래요
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="relative z-10">
                        <p className="text-[17px] font-bold leading-[150%] break-keep">
                            {content}
                        </p>
                    </div>

                    {/* CTA */}
                    <div className="mt-2 relative z-10 w-full sm:w-auto">
                        <motion.button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (onCta) onCta();
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            animate={{
                                boxShadow: ['0px 0px 0px 0px rgba(255,90,54,0)', '0px 0px 15px 2px rgba(255,90,54,0.4)', '0px 0px 0px 0px rgba(255,90,54,0)']
                            }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="bg-[#FF5A36] text-white px-5 py-3 rounded-xl font-bold text-[16px] flex items-center justify-center gap-2 w-full relative overflow-hidden group"
                        >
                            <motion.div
                                className="absolute inset-0 w-[40%] bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg]"
                                animate={{ left: ['-100%', '200%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: 1 }}
                            />
                            <PlayCircle size={20} strokeWidth={2.5} className="relative z-10" />
                            <span className="relative z-10">{ctaText}</span>
                        </motion.button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default V2AiSuggestionCard;
