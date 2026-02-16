import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, BarChart2, PlayCircle, TrendingUp } from 'lucide-react';

const StepCard = ({ number, icon: Icon, title, description }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: number * 0.1 }}
        className="relative flex flex-col items-center text-center p-6"
    >
        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6 relative z-10">
            <Icon size={32} className="text-[#002B7A]" />
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#002B7A] text-white flex items-center justify-center font-bold text-sm border-4 border-white">
                {number}
            </div>
        </div>
        <h3 className="text-[20px] font-bold text-[#191F28] mb-3">{title}</h3>
        <p className="text-[16px] text-[#4B5563] leading-relaxed break-keep">{description}</p>

        {/* Connector Line (Desktop Only) */}
        {number < 4 && (
            <div className="hidden md:block absolute top-14 left-1/2 w-full h-[2px] bg-blue-100 -z-0" />
        )}
    </motion.div>
);

const HowItWorksSection = () => {
    return (
        <section className="py-24 px-6 bg-[#F9FAFB]">
            <div className="max-w-[1200px] mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-[36px] md:text-[48px] font-bold text-[#191F28] mb-4">
                        이렇게 쉬워도 되나 싶을 거예요
                    </h2>
                    <p className="text-[18px] text-[#6B7280]">
                        복잡한 과정은 다 뺐습니다. 사장님은 딱 4단계만 기억하세요.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <StepCard
                        number={1}
                        icon={UserPlus}
                        title="가입 및 정보 입력"
                        description="가게 위치와 업종만 알려주세요. 기본 분석 준비 끝!"
                    />
                    <StepCard
                        number={2}
                        icon={BarChart2}
                        title="손님 마음 읽기"
                        description="우리 동네 손님들이 뭘 좋아하는지 AI가 분석해드려요."
                    />
                    <StepCard
                        number={3}
                        icon={PlayCircle}
                        title="홍보 영상 만들기"
                        description="분석된 내용을 바탕으로 딱 맞는 홍보 영상을 1분 만에 제작!"
                    />
                    <StepCard
                        number={4}
                        icon={TrendingUp}
                        title="매출 쑥쑥 올리기"
                        description="SNS에 올리고 손님들이 찾아오는 걸 지켜보세요."
                    />
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
