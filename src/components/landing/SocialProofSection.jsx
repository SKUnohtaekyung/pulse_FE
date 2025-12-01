import React from 'react';
import { motion } from 'framer-motion';
import { COLORS } from '../../constants';
import { Star } from 'lucide-react';

const ReviewCard = ({ name, role, content, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col justify-between"
    >
        <div>
            <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#FFB800" color="#FFB800" />
                ))}
            </div>
            <p className="text-[16px] text-gray-600 mb-6 leading-relaxed break-keep">
                "{content}"
            </p>
        </div>
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200" />
            <div>
                <p className="font-bold text-sm" style={{ color: COLORS.textMain }}>{name}</p>
                <p className="text-xs text-gray-500">{role}</p>
            </div>
        </div>
    </motion.div>
);

const SocialProofSection = () => {
    return (
        <section className="py-24 px-6 bg-white">
            <div className="max-w-[1200px] mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-[32px] md:text-[40px] font-bold mb-4" style={{ color: COLORS.textMain }}>
                        이미 많은 사장님들이<br className="md:hidden" /> PULSE와 함께 성장하고 있습니다.
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ReviewCard
                        name="박민수 사장님"
                        role="치킨집 운영 5년차"
                        content="릴스 만드는 게 이렇게 쉬운 줄 몰랐어요. 사진만 올렸는데 알아서 영상이 뚝딱 만들어지니 신기하네요. 덕분에 젊은 손님들이 많이 늘었습니다."
                        delay={0.2}
                    />
                    <ReviewCard
                        name="김지영 사장님"
                        role="카페 운영 2년차"
                        content="매번 어떤 이벤트를 해야 할지 고민이었는데, 손님 인사이트가 딱 맞는 제안을 해줘서 너무 편해요. 마케팅 스트레스가 확 줄었습니다."
                        delay={0.4}
                    />
                    <ReviewCard
                        name="최현우 사장님"
                        role="이자카야 운영 3년차"
                        content="다른 가게들은 다들 SNS 하는데 저만 뒤처지는 것 같아 불안했거든요. PULSE 덕분에 이제 저도 인싸 사장님이 된 기분입니다."
                        delay={0.6}
                    />
                </div>
            </div>
        </section>
    );
};

export default SocialProofSection;
