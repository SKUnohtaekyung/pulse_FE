import React from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, DollarSign, Clock } from 'lucide-react';

const ProblemCard = ({ icon: Icon, title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white p-10 rounded-[32px] flex flex-col items-start text-left shadow-sm hover:shadow-md transition-shadow border border-gray-100"
    >
        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
            <Icon size={32} className="text-[#002B7A]" />
        </div>
        <h3 className="text-[24px] font-bold mb-4 text-[#191F28]">{title}</h3>
        <p className="text-[16px] text-[#4B5563] leading-relaxed break-keep">{description}</p>
    </motion.div>
);

const ProblemSection = () => {
    return (
        <section id="problem-section" className="py-32 px-6 bg-[#F9FAFB] relative overflow-hidden">
            <div className="max-w-[1200px] mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-[40px] md:text-[52px] font-bold mb-6 text-[#191F28] leading-tight">
                        마케팅, 해야 하는 건 알지만<br className="md:hidden" /> 너무 막막하셨죠?
                    </h2>
                    <p className="text-[20px] text-[#6B7280]">
                        사장님들의 가장 큰 고민 3가지를 해결해드립니다.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <ProblemCard
                        icon={TrendingDown}
                        title="어떻게 해야 할지 몰라서"
                        description="상권 분석부터 타겟 설정까지, 복잡한 마케팅 지식이 없어도 괜찮습니다."
                        delay={0.2}
                    />
                    <ProblemCard
                        icon={DollarSign}
                        title="광고비가 너무 비싸서"
                        description="대행사 수수료나 플랫폼 광고비 없이, 합리적인 비용으로 홍보하세요."
                        delay={0.4}
                    />
                    <ProblemCard
                        icon={Clock}
                        title="가게 보느라 시간이 없어서"
                        description="촬영부터 편집까지, AI가 1분 만에 고퀄리티 릴스를 만들어드립니다."
                        delay={0.6}
                    />
                </div>
            </div>
        </section>
    );
};

export default ProblemSection;
