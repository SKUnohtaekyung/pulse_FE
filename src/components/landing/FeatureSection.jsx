import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, PlayCircle, LayoutDashboard } from 'lucide-react';

const FeatureBlock = ({ icon: Icon, title, subtitle, description, imageSrc, reverse = false }) => (
    <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 md:gap-24 py-24`}>
        <motion.div
            initial={{ opacity: 0, x: reverse ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-left"
        >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-[#002B7A] font-bold text-sm mb-6">
                <Icon size={18} />
                {subtitle}
            </div>
            <h3 className="text-[32px] md:text-[40px] font-bold text-[#191F28] mb-6 leading-tight break-keep">
                {title}
            </h3>
            <p className="text-[18px] text-[#4B5563] leading-relaxed break-keep">
                {description}
            </p>
        </motion.div>

        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 w-full"
        >
            <div className="relative rounded-[32px] overflow-hidden shadow-2xl bg-white aspect-[4/3] group">
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400">
                    {/* Placeholder for feature image - In real app, use actual screenshots */}
                    <img src={imageSrc} alt={title} className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                    <span className="absolute">이미지 영역 ({subtitle})</span>
                </div>
            </div>
        </motion.div>
    </div>
);

const FeatureSection = () => {
    return (
        <section className="py-20 px-6 bg-white overflow-hidden">
            <div className="max-w-[1200px] mx-auto">
                <FeatureBlock
                    icon={BarChart2}
                    subtitle="손님 마음 읽기"
                    title="우리 가게 손님은 뭘 좋아할까? AI가 리뷰를 분석해 딱 알려드려요."
                    description="수많은 리뷰를 일일이 읽을 필요 없습니다. AI가 손님의 취향, 불만, 니즈를 분석해 '어떤 메뉴를 홍보해야 할지' 정확히 짚어드립니다."
                    imageSrc="/feature_insight.png"
                />
                <FeatureBlock
                    icon={PlayCircle}
                    subtitle="홍보 영상 만들기"
                    title="촬영? 편집? 걱정 마세요. 사진만 올리면 1분 만에 뚝딱!"
                    description="전문가처럼 영상을 만들 줄 몰라도 괜찮아요. 가게 사진 3장만 고르면, AI가 음악부터 자막까지 알아서 다 넣어주는 '스마트 릴스'를 경험해보세요."
                    imageSrc="/feature_reels.png"
                    reverse={true}
                />
                <FeatureBlock
                    icon={LayoutDashboard}
                    subtitle="우리 가게 현황"
                    title="숫자 대신 행동을 알려드립니다. 사장님은 따라만 하세요."
                    description="복잡한 그래프는 이제 그만. '오늘 저녁엔 이 메뉴를 홍보하세요', '단골 손님에게 쿠폰을 보내보세요' 처럼 당장 해야 할 일을 콕 집어 알려드립니다."
                    imageSrc="/feature_dashboard.png"
                />
            </div>
        </section>
    );
};

export default FeatureSection;
