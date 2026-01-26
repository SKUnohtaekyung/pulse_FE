import React, { useState } from 'react';
import {
    Clapperboard,
    BarChart2,
    Smile,
    Heart,
    Sparkles,
    ChevronRight,
    RefreshCw,
    ArrowUpRight,
    Search,
    MousePointerClick,
    Zap,
    MapPin
} from 'lucide-react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { WEATHER_TYPES } from './weatherData';
import { WIDGET_BASE_CLASSES, LOADING_TIPS, CHART_DATA, KEYWORD_DATA } from './DashboardConstants';
import WeatherAnimation from './components/WeatherAnimation';
import WidgetHeader from './components/WidgetHeader';
import InfoTooltip from './components/InfoTooltip';
import SeasonAlert from './components/SeasonAlert';

const DashboardHome = ({ onNavigate }) => {
    // State
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [weatherType, setWeatherType] = useState('rain');
    const [loadingTip, setLoadingTip] = useState(LOADING_TIPS[0]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        setLoadingTip(LOADING_TIPS[Math.floor(Math.random() * LOADING_TIPS.length)]);
        const types = Object.keys(WEATHER_TYPES);
        const randomType = types[Math.floor(Math.random() * types.length)];
        setWeatherType(randomType);
        setTimeout(() => setIsRefreshing(false), 2000);
    };

    const currentWeather = WEATHER_TYPES[weatherType];
    const WeatherIcon = currentWeather.icon;

    return (
        <div className="flex flex-col flex-1 gap-4 overflow-hidden bg-[#F5F7FA] p-5 relative">

            {/* Loading Overlay */}
            <AnimatePresence>
                {isRefreshing && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[100] bg-[#F5F7FA]/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-8"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="w-10 h-10 border-4 border-[#002B7A] border-t-transparent rounded-full mb-4"
                        />
                        <h3 className="text-xl font-bold text-[#191F28] mb-2">데이터를 분석하고 있어요...</h3>
                        <p className="text-gray-500 text-sm max-w-md break-keep animate-pulse">
                            💡 {loadingTip}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header Section */}
            <div className="flex flex-col justify-center shrink-0 mb-1">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-[#002B7A] leading-tight">우리 가게 현황</h2>
                        <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-gray-200 shadow-sm">
                            <span className="text-xs text-gray-500 font-medium">
                                {new Date().toLocaleDateString()} {new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} 기준
                            </span>
                            <button
                                onClick={handleRefresh}
                                className={`text-gray-400 hover:text-[#002B7A] transition-colors ${isRefreshing ? 'animate-spin' : ''}`}
                                title="데이터 새로고침"
                            >
                                <RefreshCw size={12} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area - Split Layout */}
            <div className="flex-1 flex flex-col gap-3 min-h-0">

                {/* Section 1: Briefing (Flex 0.28) - Reduced Height */}
                <div className="flex-[0.28] flex flex-col gap-2 min-h-0">
                    <div className="flex items-center gap-2 shrink-0">
                        <div className="w-1 h-4 bg-[#002B7A] rounded-full"></div>
                        <h3 className="text-base font-bold text-[#191F28]">매장 브리핑</h3>
                    </div>

                    <div className="grid grid-cols-12 gap-3 flex-1 min-h-0">
                        {/* 1. Weather (Span 3) - Horizontal Layout */}
                        <div className={`${WIDGET_BASE_CLASSES} col-span-3 flex-row p-4 items-center justify-between px-8 overflow-hidden min-h-full`}>
                            <div className="absolute inset-0 z-0">
                                <div className={`absolute inset-0 bg-gradient-to-br ${currentWeather.gradient} transition-colors duration-500`}></div>
                                <WeatherAnimation animation={currentWeather.animation} />
                            </div>

                            {/* Icon (Left) */}
                            <div className="relative z-10 shrink-0">
                                <WeatherIcon size={42} className={`${currentWeather.textColor} fill-white/10`} strokeWidth={1.5} />
                            </div>

                            {/* Text (Right) */}
                            <div className="relative z-10 flex flex-col items-start gap-0.5">
                                <p className={`text-lg font-bold ${currentWeather.textColor} leading-none`}>{currentWeather.label}</p>
                                <p className={`text-[11px] ${currentWeather.subTextColor} opacity-90 mb-1`}>유동인구 많음</p>
                                <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    💡 {currentWeather.recommendation}
                                </div>
                            </div>
                        </div>

                        {/* 2. Season Alert (Span 3) */}
                        <div className="col-span-3 min-h-full">
                            <SeasonAlert />
                        </div>

                        {/* 3. AI Marketing (Span 6) - Action Inducing Card */}
                        <div className="col-span-6 bg-gradient-to-r from-[#002B7A] to-[#001F5C] rounded-[24px] p-0 shadow-lg text-white flex relative overflow-hidden group min-h-full">
                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 w-80 h-80 bg-[#8FB6FF] rounded-full blur-[80px] opacity-20 -translate-y-1/2 translate-x-1/3 group-hover:opacity-30 transition-opacity duration-500"></div>

                            <div className="flex-1 p-5 flex flex-col justify-center relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="bg-[#FF5A36] p-1 rounded-md">
                                        <Zap size={12} className="text-white fill-white" />
                                    </div>
                                    <span className="text-[#FF5A36] font-bold text-xs tracking-wide">AI 제안</span>
                                </div>
                                <h2 className="text-lg font-bold leading-tight mb-1.5 break-keep">
                                    비 오는 날엔 <span className="text-[#FF5A36]">'파전'</span> 검색량이 급증해요! ☔
                                </h2>
                                <p className="text-blue-100/80 text-xs break-keep leading-relaxed">
                                    <span className="font-bold text-white">따뜻하고 감성적인 파전 영상</span>으로
                                    지금 바로 손님을 사로잡아보세요.
                                </p>
                            </div>

                            <div
                                className="flex items-center justify-center pr-6 pt-6"
                                onClick={() => onNavigate && onNavigate('promotion', {
                                    prompt: "비 오는 날, 따뜻하고 바삭한 파전이 지글지글 익어가는 감성적인 영상. 김이 모락모락 나는 클로즈업 샷, 빗소리가 들리는 듯한 분위기.",
                                    title: "비 오는 날엔 파전에 막걸리 한 잔? ☔",
                                    vibe: "emotional"
                                })}
                            >
                                <button className="bg-white text-[#002B7A] px-5 py-2.5 rounded-full font-bold text-xs shadow-lg flex items-center gap-2 hover:bg-blue-50 transition-all transform hover:scale-105">
                                    <Clapperboard size={16} className="text-[#002B7A]" />
                                    영상 만들기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Section 2: Data & Analysis --- */}
                <div className="flex-[0.72] flex gap-4 min-h-0">
                    {/* 1. Store Data Analysis (Left ~60%) */}
                    <div className="flex-[1.4] bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 flex flex-col relative overflow-hidden">
                        {/* Header (Vertical Bar Style - Unified) */}
                        <div className="flex items-center justify-between mb-4 relative z-10 shrink-0">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-4 bg-[#002B7A] rounded-full"></div>
                                <h3 className="text-lg font-bold text-[#191F28]">가게 데이터 분석</h3>
                                <InfoTooltip text="지난 7일간의 매장 검색량 및 방문자 추이입니다." size={14} />
                            </div>
                            <button className="text-xs bg-[#E5EDFF] text-[#002B7A] px-3 py-1.5 rounded-full hover:bg-[#D0E0FF] transition-colors flex items-center gap-1 font-bold">
                                상세 분석 보러가기 <ChevronRight size={12} />
                            </button>
                        </div>

                        {/* Summary Stats */}
                        <div className="flex items-center gap-6 mb-3 relative z-10 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                                    <Search size={16} />
                                </div>
                                <div>
                                    <p className="text-[11px] text-gray-500 mb-0.5">매장 검색량</p>
                                    <div className="flex items-end gap-1.5">
                                        <span className="text-xl font-bold text-[#191F28]">1,250</span>
                                        <span className="text-[10px] font-bold text-red-500 flex items-center bg-red-50 px-1 py-0.5 rounded">
                                            <ArrowUpRight size={10} /> 15%
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-px h-8 bg-gray-100"></div>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                                    <MousePointerClick size={16} />
                                </div>
                                <div>
                                    <p className="text-[11px] text-gray-500 mb-0.5">플레이스 방문</p>
                                    <div className="flex items-end gap-1.5">
                                        <span className="text-xl font-bold text-[#191F28]">450</span>
                                        <span className="text-[10px] font-bold text-red-500 flex items-center bg-red-50 px-1 py-0.5 rounded">
                                            <ArrowUpRight size={10} /> 8%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Chart Area */}
                        <div className="flex-1 w-full min-h-0 relative z-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={CHART_DATA} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#002B7A" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#002B7A" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                                    <RechartsTooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }}
                                        cursor={{ stroke: '#002B7A', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#002B7A" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* 2. Guest Analysis (Right ~40%) - Annotated Split Layout */}
                    <div className="flex-1 bg-white rounded-[24px] shadow-sm border border-gray-100 relative group overflow-hidden flex flex-col p-6 pt-6 min-w-[320px]">
                        {/* Decorative Background Blob */}
                        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-blue-50/50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

                        {/* Top CTA Button */}
                        <div className="flex justify-end mb-4 relative z-10 shrink-0">
                            <button
                                onClick={() => onNavigate && onNavigate('insight')}
                                className="text-xs bg-[#E5EDFF] text-[#002B7A] px-3 py-1.5 rounded-full hover:bg-[#D0E0FF] transition-colors flex items-center gap-1 font-bold"
                            >
                                손님 분석 페이지로 이동 <ChevronRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                            </button>
                        </div>

                        {/* Content Body: Split Layout */}
                        <div className="flex-1 flex gap-6 relative z-10 min-h-0">

                            {/* LEFT COL (42%): Headline + Description */}
                            <div className="w-[42%] flex flex-col">
                                {/* Box 1: Headline Area */}
                                <div className="mb-3">
                                    <h2 className="text-[26px] font-extrabold text-[#191F28] leading-[1.2] tracking-tight break-keep mb-3">
                                        <span className="bg-gradient-to-r from-[#002B7A] to-blue-500 bg-clip-text text-transparent">30대 직장인</span>이<br />
                                        가장 많아요 👔
                                    </h2>
                                    <div className="flex flex-wrap gap-2 items-center">
                                        <span className="px-2.5 py-1 bg-blue-50 text-[#002B7A] text-[11px] font-bold rounded-full border border-blue-100">
                                            🔥 점심 피크 타임
                                        </span>
                                    </div>
                                </div>

                                {/* Box 3: Description Area (Moved Up) */}
                                <div className="bg-[#F8F9FA] rounded-xl p-3.5 border border-gray-100 mb-2">
                                    <p className="text-[11px] text-gray-600 leading-relaxed font-medium break-keep">
                                        주변 오피스 근무자들이 점심 식사를 위해 활발히 이동하며,
                                        <span className="text-[#002B7A] font-bold"> 가성비와 회전율</span>이 중요한
                                        직장인 점심 & 저녁 회식 상권의 특징을 보입니다.
                                    </p>
                                </div>
                            </div>

                            {/* VERTICAL DIVIDER */}
                            <div className="w-px bg-gray-100 h-full my-1"></div>

                            {/* RIGHT COL (Flex-1): Persona List (Pushed Down) */}
                            <div className="flex-1 flex flex-col min-h-0 pt-5">
                                {/* Box 2: Header (Clean) */}
                                <div className="mb-3 shrink-0">
                                    <h3 className="text-sm font-bold text-[#002B7A] tracking-wide">주요 방문 손님</h3>
                                </div>

                                <div className="flex flex-col gap-2.5 flex-1">
                                    {/* Persona 1 */}
                                    <div className="flex items-center gap-3 group/item cursor-pointer p-1.5 rounded-xl hover:bg-gray-50 transition-colors bg-white/50 backdrop-blur-sm border border-transparent hover:border-gray-100">
                                        <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center shrink-0 shadow-sm text-lg">
                                            🥘
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <h4 className="text-xs font-bold text-[#191F28]">비 오면 '국물파'</h4>
                                            </div>
                                            <p className="text-[10px] text-gray-500 truncate">
                                                비 오는 날 <span className="text-[#191F28] font-bold">전골/국밥</span> 찾는 손님 급증
                                            </p>
                                        </div>
                                    </div>

                                    {/* Persona 2 */}
                                    <div className="flex items-center gap-3 group/item cursor-pointer p-1.5 rounded-xl hover:bg-gray-50 transition-colors bg-white/50 backdrop-blur-sm border border-transparent hover:border-gray-100">
                                        <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center shrink-0 shadow-sm text-lg">
                                            💼
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <h4 className="text-xs font-bold text-[#191F28]">가성비 직장인</h4>
                                            </div>
                                            <p className="text-[10px] text-gray-500 truncate">
                                                점심시간 <span className="text-[#191F28] font-bold">런치 세트</span> 선호도 1위
                                            </p>
                                        </div>
                                    </div>

                                    {/* Persona 3 */}
                                    <div className="flex items-center gap-3 group/item cursor-pointer p-1.5 rounded-xl hover:bg-gray-50 transition-colors bg-white/50 backdrop-blur-sm border border-transparent hover:border-gray-100">
                                        <div className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center shrink-0 shadow-sm text-lg">
                                            🍷
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <h4 className="text-xs font-bold text-[#191F28]">미식가 커플</h4>
                                            </div>
                                            <p className="text-[10px] text-gray-500 truncate">
                                                주말 저녁 <span className="text-[#191F28] font-bold">와인/데이트</span> 코스 추천
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DashboardHome;
