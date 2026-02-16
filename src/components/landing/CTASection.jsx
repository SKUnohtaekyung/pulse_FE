import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { COLORS } from '../../constants';

const CTASection = () => {
    const navigate = useNavigate();

    return (
        <section className="py-40 px-6 text-center relative overflow-hidden bg-[#F0F4FF]">
            {/* Background Decoration */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-white blur-[100px] opacity-60" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-100 blur-[80px] opacity-60" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-[800px] mx-auto relative z-10"
            >
                <h2 className="text-[40px] md:text-[56px] font-bold mb-8 text-[#002B7A] leading-[1.2]">
                    지금 바로 우리 가게 마케팅을<br />시작해보세요.
                </h2>
                <p className="text-[20px] text-[#4B5563] mb-12">
                    더 이상 고민하지 마세요. PULSE가 사장님의 든든한 파트너가 되어드립니다.
                </p>
                <button
                    onClick={() => navigate('/signup')}
                    className="px-12 py-6 rounded-full text-white text-[22px] font-bold shadow-xl hover:shadow-blue-900/20 transition-all transform hover:-translate-y-1 hover:scale-105 bg-[#002B7A] hover:bg-[#001F57]"
                >
                    PULSE 시작하기
                </button>
            </motion.div>
        </section>
    );
};

export default CTASection;
