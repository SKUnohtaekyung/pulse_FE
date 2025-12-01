import React, { useRef, useEffect } from 'react';
import { MapPin, Briefcase, Clock, TrendingUp, Clapperboard, MessageCircle, Send, Zap, Search, ThumbsUp, AlertCircle, Lightbulb, User, ArrowUpRight, Store, Star, MessageSquare } from 'lucide-react';
import { COLORS } from '../../constants';
import { LOCAL_DATA } from '../../data/mockData';

export default function LocalAnalysisSection({ onNavigate }) {
    const textRef = useRef(null);

    useEffect(() => {
        const adjustFontSize = () => {
            const element = textRef.current;
            if (!element) return;
            let size = 22;
            element.style.fontSize = `${size}px`;
            while (element.scrollWidth > element.offsetWidth && size > 14) {
                size -= 0.5;
                element.style.fontSize = `${size}px`;
            }
        };
        adjustFontSize();
        window.addEventListener('resize', adjustFontSize);
        return () => window.removeEventListener('resize', adjustFontSize);
    }, []);

    return (
        <div className="flex flex-1 min-h-0 gap-4 p-2 overflow-hidden min-w-[1024px]">
            {/* LEFT PANEL: Context (25%) */}
            <div className="w-[25%] flex flex-col h-full min-h-0">
                {/* Title Section */}
                <div className="mb-4 shrink-0 h-[108px] flex flex-col justify-center">
                    <h2 className="text-[22px] lg:text-[24px] font-bold text-[#002B7A] mb-2">우리 동네 상권 분석</h2>
                    <p className="text-[14px] lg:text-[15px] font-medium text-[#191F28] opacity-80 break-keep leading-relaxed">
                        사장님 가게 주변의 <span className="text-[#002B7A] font-bold opacity-100 text-[15px] lg:text-[16px]">상권 데이터</span>를 <br />
                        <span className="text-[#002B7A] font-bold opacity-100 text-[15px] lg:text-[16px]">실시간으로 분석</span>해 드려요.
                    </p>
                </div>

                {/* Area Profile */}
                <div className="flex-1 flex flex-col gap-3 min-h-0">
                    {/* Main Identity Card */}
                    <div className="bg-[#002B7A] rounded-[24px] p-5 shadow-xl ring-4 ring-[#002B7A]/10 shrink-0 flex flex-col justify-between min-h-[180px]">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="bg-white/20 text-white px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 backdrop-blur-sm">
                                    <MapPin size={10} /> {LOCAL_DATA.areaName}
                                </span>
                                <span className="text-white/60 text-[11px]">반경 500m</span>
                            </div>
                            <div className="font-bold text-white leading-tight">
                                <div className="text-[22px] mb-1">"이곳은</div>
                                <div ref={textRef} className="w-full whitespace-nowrap overflow-hidden text-[22px]">
                                    <span className="text-[#FF5A36]">{LOCAL_DATA.type}</span>
                                    <span>이에요"</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {LOCAL_DATA.badges.map((tag, i) => (
                                <span key={i} className="text-white/90 bg-white/10 px-3 py-1.5 rounded-lg text-[12px] font-medium border border-white/10">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="flex-1 flex flex-col gap-2 min-h-0">
                        <StatCard
                            label="주변 동종 업체"
                            value="23곳"
                            trend="+2곳"
                            trendUp={true}
                            icon={<Store size={18} />}
                            className="flex-1"
                        />
                        <StatCard
                            label="누적 리뷰 수"
                            value="1,245건"
                            trend="+12건"
                            trendUp={true}
                            icon={<MessageSquare size={18} />}
                            className="flex-1"
                        />

                    </div>
                </div>
            </div>

            {/* CENTER PANEL: Analysis (45%) */}
            <div className="w-[45%] flex flex-col h-full min-h-0">
                {/* Section Title */}
                <div className="mb-3 shrink-0 h-[108px] flex flex-col justify-center items-start pl-2">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="w-1.5 h-6 bg-[#002B7A] rounded-full"></span>
                        <h2 className="text-[22px] lg:text-[24px] font-bold text-[#191F28]">
                            상권 <span className="text-[#002B7A]">심층 분석</span>
                        </h2>
                    </div>
                    <p className="text-[13px] lg:text-[14px] font-medium text-gray-500 opacity-80 pl-3.5">
                        골든타임과 인기 키워드를 한눈에 비교해보세요.
                    </p>
                </div>

                {/* Main Analysis Box */}
                <div className="bg-white rounded-[24px] p-6 shadow-sm flex-1 flex flex-col relative overflow-hidden border border-[#002B7A05] min-h-0">
                    {/* Content Area - Split View */}
                    <div className="flex-1 flex gap-6 min-h-0 overflow-hidden">
                        {/* Left: Chart (Golden Time) */}
                        <div className="flex-1 flex flex-col min-w-0">
                            <div className="flex items-end justify-between mb-4 px-1 shrink-0">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-orange-50 rounded-lg">
                                        <Clock size={16} className="text-[#FF5A36]" />
                                    </div>
                                    <span className="text-[16px] font-bold text-[#191F28]">골든 타임</span>
                                </div>
                                <span className="text-[12px] text-gray-400">최근 1개월</span>
                            </div>

                            {/* Chart */}
                            <div className="flex-1 bg-[#F8F9FA] rounded-xl p-5 pt-10 flex items-end justify-between gap-3 border border-gray-100 min-h-0">
                                {[30, 45, 80, 60, 90, 100, 85].map((h, i) => (
                                    <div key={i} className="flex-1 flex flex-col gap-2 items-center group h-full justify-end">
                                        <div className="relative w-full h-full flex items-end justify-center">
                                            <div
                                                className={`w-full rounded-t-xl transition-all duration-500 ${i === 5 ? 'bg-[#FF5A36] shadow-lg shadow-orange-200' : 'bg-[#E8EEF5] group-hover:bg-[#002B7A]/20'}`}
                                                style={{ height: `${h}%`, minHeight: '10%' }}
                                            >
                                                {i === 5 && (
                                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#FF5A36] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-md whitespace-nowrap z-10 flex flex-col items-center">
                                                        <span>Peak</span>
                                                        <div className="w-1.5 h-1.5 bg-[#FF5A36] rotate-45 -mt-1"></div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <span className={`text-[12px] ${i === 5 ? 'font-bold text-[#FF5A36]' : 'text-gray-400'}`}>
                                            {['월', '화', '수', '목', '금', '토', '일'][i]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Keywords Ranking */}
                        <div className="w-[40%] flex flex-col min-w-0 border-l border-gray-100 pl-6">
                            <div className="flex items-end justify-between mb-4 px-1 shrink-0">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-blue-50 rounded-lg">
                                        <TrendingUp size={16} className="text-[#002B7A]" />
                                    </div>
                                    <span className="text-[16px] font-bold text-[#191F28]">인기 키워드</span>
                                </div>
                            </div>

                            {/* Keywords List */}
                            <div className="flex-1 flex flex-col gap-2 justify-start py-1">
                                {LOCAL_DATA.keywords.slice(0, 4).map((kw, i) => (
                                    <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors group">
                                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 transition-all ${i === 0
                                            ? 'bg-[#002B7A] text-white shadow-md group-hover:scale-110'
                                            : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            {i + 1}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-1.5">
                                                <span className="font-bold text-[#191F28] text-[14px] truncate">#{kw.text}</span>
                                                <span className="text-[12px] text-gray-500 font-medium">{kw.value}%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-[#002B7A] rounded-full opacity-80 transition-all duration-1000 ease-out"
                                                    style={{ width: `${kw.value}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* AI Strategy Button */}
                    <div className="mt-6 pt-5 border-t border-gray-100 shrink-0">
                        <div className="flex items-center justify-between bg-[#FFF4F1] rounded-xl p-4 border border-[#FF5A3620] shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                            <div className="flex-1 min-w-0 mr-4">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="bg-[#FF5A36] text-white text-[11px] font-bold px-2 py-0.5 rounded-md">AI 릴스</span>
                                    <span className="text-[#FF5A36] text-[13px] font-bold">자동 제작</span>
                                </div>
                                <p className="text-[#191F28] font-bold text-[15px] truncate group-hover:text-[#FF5A36] transition-colors">
                                    "우리 동네 핫플레이스 되는 홍보 영상, 1분이면 완성!"
                                </p>
                            </div>
                            <button
                                onClick={() => onNavigate('promotion', { title: '우리 동네 핫플레이스, 여기 어때요?', vibe: 'energetic' })}
                                className="bg-[#FF5A36] text-white px-5 py-3 rounded-xl font-bold text-[13px] hover:bg-[#FF5A36]/90 transition-all shadow-md hover:translate-y-[-2px] flex items-center gap-2 whitespace-nowrap shrink-0"
                            >
                                <Clapperboard size={16} className="fill-current" />
                                홍보 영상 만들기
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL: AI Chat (30%) */}
            <div className="w-[30%] flex flex-col h-full min-h-0 rounded-[24px] overflow-hidden shadow-sm border border-[#002B7A05]">
                {/* Header */}
                <div className="bg-[#002B7A] p-5 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shadow-sm text-white backdrop-blur-sm">
                            <MessageCircle size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-white">AI 상권 분석가</h3>
                            <p className="text-xs text-white/60">궁금한 상권 정보를 물어보세요</p>
                        </div>
                    </div>
                </div>

                {/* Chat Body */}
                <div className="flex-1 bg-[#002B7A1A] p-5 flex flex-col relative overflow-hidden">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto min-h-0 space-y-4 scrollbar-hide pb-4">
                        <ChatMessage isAi={true} text={`${LOCAL_DATA.areaName} 상권의 주요 특징을 분석해드렸어요. 더 궁금한 점이 있으신가요?`} />
                        <div className="flex flex-wrap gap-2 pl-2">
                            <SuggestionChip text="📉 유동인구가 가장 많은 시간은?" />
                            <SuggestionChip text="👥 주말 방문자 특성은?" />
                            <SuggestionChip text="💰 평균 객단가는 얼마인가요?" />
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="mt-4 relative shrink-0">
                        <input
                            type="text"
                            placeholder="질문을 입력하세요..."
                            className="w-full bg-white/80 backdrop-blur-sm border border-white/40 rounded-xl px-4 py-3.5 pr-12 text-[14px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#002B7A]/20 shadow-sm"
                        />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#002B7A] text-white rounded-lg hover:bg-[#002B7A]/90 transition-colors shadow-sm">
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, trend, trendUp, icon, className }) {
    return (
        <div className={`bg-white rounded-xl p-4 border border-[#002B7A]/5 hover:border-[#002B7A]/20 transition-all shadow-sm hover:shadow-md flex items-center justify-between group ${className}`}>
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#F5F7FA] flex items-center justify-center text-[#002B7A] group-hover:bg-[#002B7A] group-hover:text-white transition-colors">
                    {icon}
                </div>
                <div>
                    <div className="text-[12px] text-gray-500 mb-0.5">{label}</div>
                    <div className="text-[16px] font-bold text-[#191F28]">{value}</div>
                </div>
            </div>
            <div className={`text-[13px] font-bold flex items-center gap-0.5 ${trendUp ? 'text-red-500' : 'text-blue-500'}`}>
                {trendUp ? <ArrowUpRight size={16} /> : <ArrowUpRight size={16} className="rotate-90" />}
                {trend}
            </div>
        </div>
    );
}

function SuggestionChip({ text }) {
    return (
        <button className="shrink-0 px-3.5 py-2 bg-white hover:bg-[#002B7A] hover:text-white rounded-full text-[13px] font-medium text-[#002B7A] transition-all border border-[#002B7A]/10 shadow-sm hover:shadow-md">
            {text}
        </button>
    );
}

function ChatMessage({ isAi, text }) {
    return (
        <div className={`flex ${isAi ? 'justify-start' : 'justify-end'} animate-in slide-in-from-bottom-2 fade-in duration-300`}>
            <div className={`max-w-[90%] p-4 rounded-xl text-[15px] leading-relaxed shadow-sm ${isAi
                ? 'bg-white text-[#002B7A] rounded-tl-none border border-[#002B7A]/5'
                : 'bg-[#FF5A36] text-white rounded-tr-none shadow-md'
                }`}>
                {text}
            </div>
        </div>
    );
}
