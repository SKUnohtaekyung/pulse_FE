import React from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Utensils, Share2, MessageCircle, AlertCircle, Zap, Quote, Sparkles } from 'lucide-react';

export default function JourneyMapSection({ persona }) {
    if (!persona) return null;

    const stages = [
        { key: 'explore', label: '탐색', icon: <Search size={16} /> },
        { key: 'visit', label: '방문', icon: <MapPin size={16} /> },
        { key: 'eat', label: '식사', icon: <Utensils size={16} /> },
        { key: 'share', label: '공유', icon: <Share2 size={16} /> },
    ];

    const timelineData = stages.map(stage => ({
        ...stage,
        ...persona.journey[stage.key]
    }));

    return (
        <div className="w-full relative py-2 pl-4">
            {/* Dashed Spine */}
            <div className="absolute left-[27px] top-6 bottom-6 w-0.5 border-l-2 border-dashed border-[#E5E8EB] z-0" />

            {timelineData.map((data, index) => (
                <div key={data.key} className="relative flex gap-6 mb-8 last:mb-0 group">
                    {/* 1. Timeline Node */}
                    <div className="relative z-10 flex flex-col items-center">
                        <div className={`w-14 h-14 rounded-full border-[4px] border-[#F2F4F6] flex items-center justify-center bg-white shadow-sm transition-transform group-hover:scale-110 ${data.type === 'good' ? 'bg-[#002B7A]/5' : data.type === 'pain' ? 'bg-[#FF5A36]/5' : ''
                            }`}>
                            <div className="text-[24px]">
                                {data.type === 'good' && '🤩'}
                                {data.type === 'pain' && '😥'}
                                {data.type === 'neutral' && '😐'}
                            </div>
                        </div>
                        <div className="mt-2 px-2 py-1 bg-white border border-[#E5E8EB] rounded-full text-[11px] font-bold text-[#4E5968] shadow-sm flex items-center gap-1.5 whitespace-nowrap">
                            {data.icon}
                            {data.label}
                        </div>
                    </div>

                    {/* 2. Content Card */}
                    <div className="flex-1 min-w-0">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl border border-[#E5E8EB] shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden hover:shadow-md transition-shadow"
                        >
                            {/* Card Body */}
                            <div className="p-5">
                                {/* Action Title */}
                                <h4 className="text-[17px] font-bold text-[#191F28] mb-3 flex items-start gap-2 leading-snug">
                                    <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-[#333D4B]" />
                                    {data.action}
                                </h4>

                                {/* Thought Bubble */}
                                <div className="relative bg-[#F9FAFB] rounded-xl p-4 text-[15px] text-[#4E5968] font-medium leading-relaxed flex gap-3">
                                    <Quote size={16} className="text-[#B0B8C1] shrink-0 rotate-180" />
                                    <span>{data.thought}</span>
                                </div>
                            </div>

                            {/* Card Footer: Insights (Pain or Opportunity) */}
                            <div className="bg-[#FAFAFB] border-t border-[#F2F4F6] p-4 flex flex-col gap-3">

                                {/* A. Pain Point (Red) - Only if exists */}
                                {(data.type === 'pain' || data.painPoint) && (
                                    <div className="flex items-start gap-3 bg-[#FF5A36]/5 p-3 rounded-xl border border-[#FF5A36]/10">
                                        <AlertCircle size={18} className="text-[#FF5A36] shrink-0 mt-0.5" />
                                        <div>
                                            <span className="block text-[12px] font-bold text-[#FF5A36] mb-0.5">고객이 느낀 불편</span>
                                            <p className="text-[14px] font-medium text-[#FF5A36] word-keep">{data.painPoint}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start gap-3 bg-[#002B7A]/5 p-3 rounded-xl border border-[#002B7A]/10">
                                    <Zap size={18} className="text-[#002B7A] shrink-0 mt-0.5 fill-[#002B7A]" />
                                    <div>
                                        <span className="block text-[12px] font-bold text-[#002B7A] mb-0.5">PULSE의 제안</span>
                                        <p className="text-[14px] font-bold text-[#002B7A] word-keep">{data.opportunity}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            ))}

            {/* Insight Pulse Summary Footer */}
            <div className="mt-8 ml-[27px] bg-white rounded-[24px] p-0 border border-[#E5E8EB] relative overflow-hidden shadow-sm">

                {/* Header Section: Title & Score */}
                <div className="bg-[#F5F7FA] p-6 border-b border-[#E5E8EB] flex justify-between items-start">
                    <div>
                        <h4 className="flex items-center gap-2 text-[18px] font-bold text-[#191F28] mb-2">
                            <img src="/PULSE_LOGO.png" alt="PULSE" style={{ width: 20, height: 20 }} className="object-contain" />
                            PULSE Insight 요약
                        </h4>
                        <p className="text-[14px] text-[#4E5968] font-medium">
                            고객의 감정 흐름을 분석한 결과입니다.
                        </p>
                    </div>

                    {/* Calculated CX Score */}
                    <div className="text-right">
                        <span className="block text-[12px] font-bold text-[#8B95A1] mb-1">고객 만족도</span>
                        <div className="text-[32px] font-bold text-[#002B7A] leading-none">
                            {Math.round(
                                (timelineData.filter(d => d.type === 'good').length * 100 +
                                    timelineData.filter(d => d.type === 'neutral').length * 50) / timelineData.length
                            )}
                            <span className="text-[16px] text-[#8B95A1] font-medium ml-1">점</span>
                        </div>
                    </div>
                </div>

                {/* Body Section */}
                <div className="p-6 flex flex-col gap-6">

                    {/* 1. Emoji Legend */}
                    <div className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-xl border border-[#F2F4F6]">
                        <span className="text-[12px] font-bold text-[#8B95A1] px-2">감정 기호:</span>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-1.5">
                                <span className="text-[16px]">🤩</span>
                                <span className="text-[12px] font-medium text-[#4E5968]">만족</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-[16px]">😐</span>
                                <span className="text-[12px] font-medium text-[#4E5968]">보통</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-[16px]">😥</span>
                                <span className="text-[12px] font-medium text-[#4E5968]">불만(이탈 위험)</span>
                            </div>
                        </div>
                    </div>

                    {/* 2. Emotional Trend Line (Detailed Flow) */}
                    <div>
                        <span className="block text-[13px] font-bold text-[#191F28] mb-3 flex items-center gap-2">
                            단계별 감정 변화 상세
                            <span className="text-[11px] font-medium text-[#8B95A1] bg-[#F5F7FA] px-2 py-0.5 rounded-full">고객의 속마음을 확인하세요</span>
                        </span>

                        <div className="grid grid-cols-4 gap-3">
                            {timelineData.map((d, i) => (
                                <div key={d.key} className={`relative rounded-xl p-4 border flex flex-col gap-3 transition-all ${d.type === 'good' ? 'bg-[#002B7A]/5 border-[#002B7A]/10' :
                                    d.type === 'pain' ? 'bg-[#FF5A36]/5 border-[#FF5A36]/10' :
                                        'bg-white border-[#E5E8EB]'
                                    }`}>
                                    {/* Step Header */}
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-[#8B95A1] uppercase tracking-wide">Step 0{i + 1}</span>
                                            <span className="text-[14px] font-bold text-[#191F28]">{d.label}</span>
                                        </div>
                                        <div className="text-[20px]">
                                            {d.type === 'good' && '🤩'}
                                            {d.type === 'pain' && '😥'}
                                            {d.type === 'neutral' && '😐'}
                                        </div>
                                    </div>

                                    {/* Quote Bubble */}
                                    <div className={`p-3 rounded-lg text-[13px] font-medium leading-normal relative ${d.type === 'good' ? 'bg-white text-[#002B7A]' :
                                        d.type === 'pain' ? 'bg-white text-[#FF5A36]' :
                                            'bg-[#F5F7FA] text-[#4E5968]'
                                        }`}>
                                        <Quote size={12} className={`absolute top-2 left-2 opacity-50 ${d.type === 'good' ? 'text-[#002B7A]' :
                                            d.type === 'pain' ? 'text-[#FF5A36]' : 'text-[#8B95A1]'
                                            }`} rotate={180} />
                                        <span className="pl-4 block">{d.thought}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 3. Detailed Verdict & Action */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Summary */}
                        <div className="bg-blue-50/50 p-5 rounded-xl border border-[#E5E8EB]">
                            <span className="block text-[12px] font-bold text-[#002B7A] mb-2">💡 분석 총평</span>
                            <p className="text-[14px] font-bold text-[#191F28] leading-relaxed">
                                {timelineData.some(d => d.type === 'pain')
                                    ? <span>초반 탐색과 방문 단계는 훌륭했지만, <span className="text-[#FF5A36] underline decoration-wavy">마지막 공유 단계에서 경험이 급격히 하락</span>했습니다. 이 부분을 놓치면 재방문율이 0%가 될 수 있습니다.</span>
                                    : "전체적인 여정이 매끄럽습니다. 특히 방문 단계에서의 만족도가 높아, 이 경험을 리뷰로 연결한다면 신규 고객 유입이 2배 이상 늘어날 것입니다."}
                            </p>
                        </div>

                        {/* Action Item */}
                        <div className="bg-[#002B7A] p-5 rounded-xl text-white shadow-lg flex flex-col justify-between cursor-pointer group hover:bg-[#002568] transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[12px] font-bold text-white/80">⚡ 지금 바로 해결하기</span>
                                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                    <Zap size={14} className="fill-white" />
                                </div>
                            </div>
                            <p className="text-[15px] font-bold leading-snug">
                                {timelineData.find(d => d.type === 'pain')?.opportunity || timelineData[timelineData.length - 1].opportunity}
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
