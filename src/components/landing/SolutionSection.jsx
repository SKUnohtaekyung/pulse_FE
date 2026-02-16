import React from 'react';
import { motion } from 'framer-motion';
import { Search, Clapperboard, BarChart2, ArrowRight } from 'lucide-react';
import { COLORS } from '../../constants';

const StepCard = ({ number, icon: Icon, title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex-1 bg-white p-10 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group"
    >
        <div className="absolute top-10 right-10 text-[60px] font-bold text-gray-100 leading-none select-none group-hover:text-blue-50 transition-colors">
            {number}
        </div>
        <div className="mb-8 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-500">
                <Icon size={32} className="text-blue-600 group-hover:text-white transition-colors duration-500" />
            </div>
        </div>
        <h3 className="text-[24px] font-bold mb-4 relative z-10" style={{ color: COLORS.primary }}>{title}</h3>
        <p className="text-[17px] text-gray-600 leading-relaxed break-keep relative z-10">{description}</p>
    </motion.div>
);

const SolutionSection = () => {
    return (
        <section className="py-32 px-6 bg-white">
            <div className="max-w-[1200px] mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-24"
                >
                    <h2 className="text-[40px] md:text-[56px] font-bold mb-6" style={{ color: COLORS.textMain }}>
                        PULSE는 3단계로<br className="md:hidden" /> 마케팅을 자동화합니다.
                    </h2>
                    <p className="text-[20px] text-gray-500">
                        분석부터 실행까지, 하나의 루프로 연결된 경험을 제공합니다.
                    </p>
                </motion.div>

                <div className="flex flex-col md:flex-row gap-8">
                    <StepCard
                        number="01"
                        icon={Search}
                        title="Understand"
                        description="손님들의 리뷰와 상권 데이터를 분석하여 우리 가게만의 '손님 인사이트'를 도출합니다."
                        delay={0.2}
                    />
                    <StepCard
                        number="02"
                        icon={Clapperboard}
                        title="Create"
                        description="도출된 인사이트에 맞춰, 사진만 올리면 지금 바로 사용할 수 있는 '스마트 릴스'를 자동으로 제작합니다."
                        delay={0.4}
                    />
                    <StepCard
                        number="03"
                        icon={BarChart2}
                        title="Action"
                        description="업로드 성과를 분석하고, 매출 상승을 위한 '다음 행동'을 구체적으로 제안합니다."
                        delay={0.6}
                    />
                </div>
            </div>
        </section>
    );
};

export default SolutionSection;
