import React, { useState } from 'react';
import {
    Sparkles,
    Clapperboard,
    TrendingUp,
    CloudRain,
    Zap,
    BarChart2,
    ArrowUpRight,
    Bell,
    Smile,
    Briefcase,
    Heart
} from 'lucide-react';
import { COLORS } from '../../constants';

const DashboardHome = () => {
    const [today] = useState(new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' }));

    return (
        <div className="flex flex-col h-full gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden">

            {/* Main Layout: 2 Columns (Left Content vs Right Widgets) - Fixed Height */}
            <div className="grid grid-cols-12 gap-4 h-full min-h-0">

                {/* LEFT COLUMN: Main Content (Hero & Performance) - col-span-9 */}
                <div className="col-span-9 flex flex-col gap-4 h-full min-h-0">

                    {/* 1. Hero Section: Today's Mission (Fixed Height ~35%) */}
                    <div
                        className="relative rounded-3xl p-6 flex items-center justify-between overflow-hidden group shadow-md shrink-0 h-[35%]"
                        style={{ background: `linear-gradient(120deg, ${COLORS.primary} 0%, #003BB5 100%)` }}
                    >
                        <div className="absolute right-0 top-0 h-full w-1/2 bg-white/5 transform skew-x-12 pointer-events-none"></div>

                        <div className="relative z-10 flex-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-bold mb-3">
                                <Sparkles size={12} className="text-yellow-300" />
                                오늘의 AI 추천 미션
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2 leading-tight">
                                "금요일 저녁 예약이 비었어요!<br />
                                <span className="text-yellow-300">퇴근길 직장인 타겟</span> 릴스를 올려보세요."
                            </h2>
                            <button className="mt-4 px-6 py-3 bg-[#FF5A36] hover:bg-[#FF7052] text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg hover:-translate-y-0.5">
                                <Clapperboard size={20} />
                                1분 만에 홍보 영상 만들기
                            </button>
                        </div>

                        <div className="relative z-10 hidden md:block w-40 h-40 opacity-90">
                            <div className="w-full h-full bg-gradient-to-br from-white/20 to-transparent rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
                                <div className="w-28 h-28 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                                    <TrendingUp size={56} className="text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Expanded Performance Section (Remaining Height ~65%) */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex-1 min-h-0 flex flex-col">
                        <div className="flex items-center justify-between mb-4 shrink-0">
                            <h3 className="font-bold text-[#191F28] text-xl flex items-center gap-2">
                                <BarChart2 size={24} className="text-[#002B7A]" />
                                지난주 성과 상세 분석
                            </h3>
                            <span className="text-xs text-gray-400 font-medium bg-gray-50 px-3 py-1 rounded-full">
                                데이터 기준: 10.15 ~ 10.21
                            </span>
                        </div>

                        <div className="flex gap-6 flex-1 min-h-0">
                            {/* Left: Expert Insight & Trend Chart */}
                            <div className="flex-1 flex flex-col gap-4">
                                {/* Expert Insight */}
                                <div className="bg-[#F5F7FA] p-4 rounded-2xl border border-[#002B7A]/5 flex gap-4 relative overflow-hidden shrink-0">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-[#002B7A]"></div>
                                    <div className="shrink-0">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-[#002B7A]/10 shadow-sm">
                                            <Briefcase size={18} className="text-[#002B7A]" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="bg-[#002B7A] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">AI 전문가</span>
                                        </div>
                                        <h4 className="text-sm font-bold text-[#191F28] mb-1">"노출은 훌륭하지만, 저장률 개선이 필요해요!"</h4>
                                        <p className="text-xs text-gray-600 leading-relaxed">
                                            지난주 대비 노출수가 <span className="text-green-600 font-bold">+15%</span> 증가했지만,
                                            방문 의사를 나타내는 '저장' 비율은 3%에 머물렀어요.
                                        </p>
                                    </div>
                                </div>

                                {/* Trend Chart */}
                                <div className="bg-white rounded-xl border border-gray-100 p-4 flex-1 flex flex-col">
                                    <h5 className="font-bold text-gray-800 mb-2 text-sm flex items-center gap-2">
                                        <TrendingUp size={14} className="text-gray-400" /> 주간 노출 추이
                                    </h5>
                                    <div className="flex-1 flex items-end justify-between gap-2 px-2 pb-2">
                                        {[45, 50, 75, 60, 90, 100, 85].map((h, i) => (
                                            <div key={i} className="flex-1 flex flex-col gap-1 items-center group h-full justify-end">
                                                <div
                                                    className={`w-full rounded-t-sm transition-all duration-500 ${i === 5 ? 'bg-[#002B7A]' : 'bg-[#E8EEF5]'}`}
                                                    style={{ height: `${h}%` }}
                                                ></div>
                                                <span className="text-[10px] text-gray-400">{['월', '화', '수', '목', '금', '토', '일'][i]}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right: Engagement Split */}
                            <div className="w-[40%] bg-white rounded-xl border border-gray-100 p-4 flex flex-col">
                                <h5 className="font-bold text-gray-800 mb-4 text-sm flex items-center gap-2">
                                    <Heart size={14} className="text-gray-400" /> 반응 유형 분석
                                </h5>
                                <div className="flex-1 flex flex-col justify-center gap-6">
                                    {[
                                        { label: '좋아요', val: 70, color: 'bg-red-400' },
                                        { label: '저장', val: 20, color: 'bg-[#002B7A]' },
                                        { label: '공유', val: 10, color: 'bg-green-500' }
                                    ].map((item, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between text-xs mb-1.5">
                                                <span className="text-gray-500">{item.label}</span>
                                                <span className="font-bold text-[#191F28]">{item.val}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div className={`h-full ${item.color}`} style={{ width: `${item.val}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-auto pt-4 text-center">
                                    <p className="text-xs text-gray-500 mb-1">저장 비율 목표</p>
                                    <p className="text-lg font-bold text-[#002B7A]">30%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Widgets (Trends, Weather, Sentiment) - col-span-3 */}
                <div className="col-span-3 flex flex-col gap-4 h-full min-h-0">

                    {/* 1. Real-time Trends (Flex-1) */}
                    <div className="flex-1 bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div>
                            <h3 className="font-bold text-[#191F28] text-sm flex items-center gap-2 mb-3">
                                <Bell size={16} className="text-[#FF5A36]" /> 실시간 트렌드
                            </h3>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="px-2.5 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-md">#하이볼</span>
                                <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-md">#회식</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400 mb-1.5">경쟁사 동향</p>
                            <p className="text-sm font-bold text-[#191F28] leading-snug">
                                주변 1위 '이자카야 텐'에서 <br />
                                <span className="text-[#FF5A36]">하이볼 2+1 이벤트</span>를 시작했어요.
                            </p>
                        </div>
                    </div>

                    {/* 2. Weather (Flex-1) */}
                    <div className="flex-1 bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-50 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
                        <h3 className="font-bold text-gray-500 text-sm flex items-center gap-1.5">
                            <CloudRain size={16} /> 날씨 & 상권
                        </h3>
                        <div>
                            <p className="text-xl font-bold text-[#191F28] mb-2">비 옴 / 많음</p>
                            <div className="flex items-center gap-1.5 text-xs font-medium text-[#002B7A] bg-[#F5F7FA] px-2.5 py-1.5 rounded-lg w-fit">
                                {/* <Zap size={14} className="text-yellow-500" />
                                <span>추천: 전 굽는 소리 ASMR</span> */}
                            </div>
                        </div>
                    </div>

                    {/* 3. Sentiment (Flex-1) */}
                    <div className="flex-1 bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
                        <h3 className="font-bold text-[#191F28] text-sm flex items-center gap-1.5">
                            <Smile size={16} className="text-green-500" /> 오늘의 감정 온도
                        </h3>
                        <div className="flex items-end justify-between">
                            <div>
                                <span className="text-3xl font-bold text-green-600">36.5°</span>
                                <p className="text-xs text-gray-400 mt-1">긍정적</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-[#191F28] mb-1">"친절해요"</p>
                                <p className="text-xs text-gray-400">가장 많이 언급됨</p>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default DashboardHome;
