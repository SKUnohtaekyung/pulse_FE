import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { COLORS } from '../../constants';

import ThreeBackground from '../../features/auth/ThreeBackground';

const HeroSection = () => {
    const navigate = useNavigate();

    return (
        <section className="relative h-screen flex items-center px-6 overflow-hidden bg-[#F5F7FA]">
            {/* 3D Background (Heart) - Positioned Right for Landing Page */}
            <div className="absolute inset-0 z-0">
                <ThreeBackground position={[2.5, 0, 0]} scale={1.2} />
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 max-w-[1200px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <h1 className="text-[48px] md:text-[80px] font-bold leading-[1.2] mb-6 tracking-tight text-[#191F28] break-keep">
                            복잡한 마케팅은<br />
                            <span className="text-[#002B7A]">PULSE</span>에게 맡기세요.
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-[18px] md:text-[20px] mb-10 font-medium text-[#4B5563] leading-relaxed break-keep"
                    >
                        오늘도 맛있는 요리에만 집중하실 수 있도록,<br className="hidden md:block" />
                        데이터 분석부터 홍보 영상 제작까지 <span className="text-[#002B7A]">PULSE</span>가 다 해드릴게요.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-wrap gap-4"
                    >
                        <button
                            onClick={() => navigate('/signup')}
                            className="px-8 py-4 rounded-full text-white text-[17px] font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 bg-[#002B7A] hover:bg-[#001F57]"
                        >
                            무료로 시작하기
                        </button>
                        <button
                            onClick={() => document.getElementById('problem-section').scrollIntoView({ behavior: 'smooth' })}
                            className="px-8 py-4 rounded-full bg-[#E0E7FF] text-[#002B7A] text-[17px] font-bold hover:bg-[#C7D2FE] transition-colors"
                        >
                            더 알아보기
                        </button>
                    </motion.div>
                </div>
                {/* Right side is reserved for the 3D Heart */}
                <div className="hidden md:block"></div>
            </div>
        </section>
    );
};

export default HeroSection;
