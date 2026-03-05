import React from 'react';
import { TrendingUp, Clock, MapPin, Sparkles, AlertCircle, BarChart3 } from 'lucide-react';
import { LOCAL_DATA } from '../../data/mockData';
import { motion } from 'framer-motion';

export default function LocalAnalysisSection({ isEmbedded }) {
    // 1. Safe Data Handling & Hero Logic
    const hasData = LOCAL_DATA && LOCAL_DATA.keywords && LOCAL_DATA.keywords.length > 0;

    // Fallback if data is missing
    if (!hasData) {
        return (
            <div className="h-full bg-white rounded-[24px] p-8 flex flex-col items-center justify-center text-center border border-gray-200">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="text-gray-400" size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-800">데이터를 불러올 수 없어요</h3>
                <p className="text-gray-500 mt-2">잠시 후 다시 시도해주세요.</p>
            </div>
        );
    }

    const heroInsight = {
        sub: `이곳은 ${LOCAL_DATA.areaName} 반경 500m 분석 결과입니다.`
    };

    return (
        <div className="w-full h-full bg-white rounded-[24px] relative overflow-hidden flex flex-col justify-between p-8 border border-[#E5E8EB] shadow-sm group">

            {/* [Background Aesthetic] Subtle gradients for atmosphere */}
            <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-gradient-to-br from-[#002B7A]/5 to-transparent rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

            {/* [Layer 1] Information Header (Top 55%) */}
            <div className="relative z-10 flex justify-between gap-12 h-[55%]">

                {/* Left: Hero Insight (Focus) */}
                <div className="flex-1 flex flex-col gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="px-3 py-1 bg-blue-50 text-[#002B7A] rounded-full text-[13px] font-bold flex items-center gap-1.5 border border-blue-100">
                                <MapPin size={14} className="fill-[#002B7A]/20" />
                                <span>{heroInsight.sub}</span>
                            </div>
                        </div>

                        <h3 className="text-[36px] leading-[1.2] font-bold text-[#191F28] tracking-tight">
                            이 상권은 <span className="bg-gradient-to-r from-[#002B7A] to-blue-500 bg-clip-text text-transparent">점심 시간대</span><br />
                            <span className="bg-gradient-to-r from-[#002B7A] to-blue-500 bg-clip-text text-transparent">20-30대 직장인</span>이 많아요
                        </h3>
                    </div>

                    <div className="max-w-lg bg-gray-50/80 rounded-2xl p-5 border border-gray-100 backdrop-blur-sm">
                        <p className="text-[16px] leading-relaxed text-[#4E5968] font-medium flex gap-3">
                            <Sparkles size={20} className="text-[#FFB300] shrink-0 mt-0.5 fill-[#FFB300]" />
                            <span>
                                주변 오피스 근무자들이 점심 식사를 위해 활발히 이동하며,
                                가성비와 회전율이 중요한 <strong>{LOCAL_DATA.type}</strong>의 특징을 보입니다.
                            </span>
                        </p>
                    </div>
                </div>

                {/* Right: Keywords (Context) */}
                <div className="w-[320px] shrink-0 flex flex-col hidden lg:flex">
                    <div className="flex items-center gap-2 mb-5 opacity-80">
                        <TrendingUp size={18} className="text-[#333D4B]" />
                        <span className="text-[14px] font-bold text-[#333D4B]">실시간 뜨는 키워드</span>
                    </div>
                    <div className="flex flex-col gap-2.5">
                        {LOCAL_DATA.keywords.slice(0, 4).map((kw, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#E5E8EB] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-blue-200 transition-colors group/item">
                                <div className="flex items-center gap-3">
                                    <span className={`w-6 h-6 flex items-center justify-center rounded-md text-[12px] font-bold ${i === 0 ? 'bg-[#002B7A] text-white' : 'bg-[#F2F4F6] text-[#8B95A1]'
                                        }`}>{i + 1}</span>
                                    <span className="text-[15px] font-bold text-[#333D4B]">#{kw.text}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-16 h-1.5 bg-[#F2F4F6] rounded-full overflow-hidden">
                                        <div className="h-full bg-[#002B7A]" style={{ width: `${kw.value}%` }} />
                                    </div>
                                    <span className="text-[12px] text-[#8B95A1] font-medium w-8 text-right">{kw.value}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* [Layer 2] Visualization Footer (Bottom 40%) - Anchored */}
            <div className="relative h-[40%] w-full flex flex-col justify-end">
                <div className="flex items-center justify-between mb-4 px-2">
                    <div className="flex items-center gap-2">
                        <BarChart3 size={18} className="text-[#8B95A1]" />
                        <span className="text-[14px] font-bold text-[#8B95A1]">요일별 유동인구 (12-13시 기준)</span>
                    </div>
                    {/* Legend */}
                    <div className="flex gap-4 text-[12px] font-medium text-[#8B95A1]">
                        <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#E5E8EB]" />평균</span>
                        <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#FF5A36]" />Peak</span>
                    </div>
                </div>

                {/* Massive Chart */}
                <div className="flex items-end justify-between gap-4 h-full relative z-10 px-4 pb-2">
                    {/* Grid Lines Overlay */}
                    <div className="absolute inset-0 border-t border-dashed border-[#E5E8EB] opacity-50 pointer-events-none top-4" />

                    {[35, 50, 85, 65, 95, 100, 80].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group/bar cursor-default">
                            <div className="w-full h-full flex items-end justify-center relative">
                                <motion.div
                                    initial={{ height: 0 }}
                                    whileInView={{ height: `${h}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: i * 0.05, type: "spring", stiffness: 80 }}
                                    className={`w-full max-w-[120px] rounded-t-lg relative transition-all duration-300 ${i === 5
                                        ? 'bg-gradient-to-t from-[#FF5A36] to-[#FF9E80] shadow-[0_4px_20px_rgba(255,90,54,0.25)]'
                                        : 'bg-[#F2F4F6] hover:bg-[#E5E8EB]'
                                        }`}
                                >
                                    {/* Value appearing on hover or peak */}
                                    {(i === 5) && (
                                        <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-[#FF5A36] text-white text-[12px] font-bold px-2.5 py-1 rounded-lg shadow-sm whitespace-nowrap animate-bounce">
                                            Peak!
                                        </div>
                                    )}
                                </motion.div>
                            </div>
                            <span className={`text-[14px] font-bold transition-colors ${i === 5 ? 'text-[#FF5A36]' : 'text-[#8B95A1] group-hover/bar:text-[#333D4B]'}`}>
                                {['월', '화', '수', '목', '금', '토', '일'][i]}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
