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
    Zap
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

                {/* Section 2: Analysis (Flex 0.72) - Increased Height */}
                <div className="flex-[0.72] flex flex-col gap-2 min-h-0">
                    <div className="flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-4 bg-[#002B7A] rounded-full"></div>
                            <h3 className="text-base font-bold text-[#191F28]">상세 분석</h3>
                        </div>
                        <button
                            onClick={() => onNavigate && onNavigate('insight')}
                            className="group flex items-center gap-1.5 px-4 py-1.5 bg-[#E5EDFF] text-[#002B7A] rounded-full text-xs font-bold hover:bg-[#D0E0FF] transition-all"
                        >
                            상세 분석 보러가기
                            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>

                    <div className="grid grid-cols-12 gap-3 flex-1 min-h-0">
                        {/* 1. Performance (Span 6) */}
                        <div className={`${WIDGET_BASE_CLASSES} col-span-6 flex-col p-4 gap-2`}>
                            <WidgetHeader
                                icon={BarChart2}
                                title="주간 성과"
                                tooltipText="지난 7일간의 매장 검색량 및 방문자 추이입니다."
                            />
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 flex-1">
                                    <p className="text-xs text-gray-500 flex items-center gap-1.5">
                                        <Search size={14} /> 매장 검색량
                                    </p>
                                    <div className="flex items-end gap-2">
                                        <span className="text-lg font-bold text-[#191F28]">1,250</span>
                                        <span className="text-[10px] text-red-500 font-bold flex items-center bg-red-50 px-1 py-0.5 rounded">
                                            <ArrowUpRight size={10} className="mr-0.5" /> 15%
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 flex-1">
                                    <p className="text-xs text-gray-500 flex items-center gap-1.5">
                                        <MousePointerClick size={14} /> 플레이스 방문
                                    </p>
                                    <div className="flex items-end gap-2">
                                        <span className="text-lg font-bold text-[#191F28]">450</span>
                                        <span className="text-[10px] text-red-500 font-bold flex items-center bg-red-50 px-1 py-0.5 rounded">
                                            <ArrowUpRight size={10} className="mr-0.5" /> 8%
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 w-full min-h-0 relative outline-none [&_.recharts-wrapper]:outline-none [&_.recharts-surface]:outline-none" tabIndex={-1}>
                                <ResponsiveContainer width="100%" height="100%" className="outline-none">
                                    <AreaChart data={CHART_DATA} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#002B7A" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#002B7A" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8B95A1', fontSize: 11 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8B95A1', fontSize: 11 }} domain={[0, 'auto']} tickCount={5} />
                                        <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                                        <Area type="monotone" dataKey="value" stroke="#002B7A" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* 2. Sentiment (Span 3) */}
                        <div className={`${WIDGET_BASE_CLASSES} col-span-3 flex-col p-4 gap-2`}>
                            <WidgetHeader
                                icon={Smile}
                                title="고객 감정"
                                tooltipText="최근 1주일간 수집된 리뷰와 SNS 반응을 분석한 결과입니다."
                            />
                            <div className="flex-1 flex flex-col items-center justify-center gap-3">
                                <div className="relative w-28 h-28 flex items-center justify-center">
                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 96 96">
                                        <circle cx="48" cy="48" r="40" stroke="#F0F4FF" strokeWidth="8" fill="none" />
                                        <circle cx="48" cy="48" r="40" stroke="#002B7A" strokeWidth="8" fill="none" strokeDasharray="213.6" strokeDashoffset="21.36" strokeLinecap="round" />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-2xl font-bold text-[#191F28]">92%</span>
                                        <span className="text-xs text-gray-500 font-medium mt-1">긍정적</span>
                                    </div>
                                </div>
                                <div className="w-full flex flex-col gap-2">
                                    <div>
                                        <div className="flex items-center justify-between text-[10px] mb-1">
                                            <span className="text-gray-600 flex items-center gap-1"><Heart size={12} className="text-red-400" /> 맛이 좋아요</span>
                                            <span className="font-bold text-[#191F28]">45%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-red-400 h-full rounded-full" style={{ width: '45%' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between text-[10px] mb-1">
                                            <span className="text-gray-600 flex items-center gap-1"><Sparkles size={12} className="text-yellow-400" /> 분위기 깡패</span>
                                            <span className="font-bold text-[#191F28]">30%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-yellow-400 h-full rounded-full" style={{ width: '30%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Keywords (Span 3) */}
                        <div className={`${WIDGET_BASE_CLASSES} col-span-3 flex-col p-4 gap-2`}>
                            <div className="shrink-0">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="text-base font-bold text-[#191F28] leading-snug">
                                        인기 키워드 🔥
                                    </h3>
                                    <InfoTooltip text="우리 가게와 관련된 인기 검색 키워드 순위입니다." size={16} align="right" direction="bottom" />
                                </div>
                                <p className="text-[11px] text-gray-500">지난주보다 <span className="text-[#002B7A] font-bold">#가성비</span> 검색이 늘었어요.</p>
                            </div>
                            <div className="flex-1 overflow-hidden min-h-0 flex flex-col justify-between gap-2">
                                {KEYWORD_DATA.slice(0, 6).map((kw, i) => (
                                    <div key={i} className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-50 transition-colors group shrink-0">
                                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-all ${i === 0 ? 'bg-[#002B7A] text-white shadow-md' : 'bg-gray-100 text-gray-500'}`}>{i + 1}</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <span className="font-bold text-[#191F28] text-xs truncate">#{kw.text}</span>
                                                <span className="text-[10px] text-gray-500 font-medium">{kw.value}%</span>
                                            </div>
                                            <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-[#002B7A] rounded-full opacity-80" style={{ width: `${kw.value}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DashboardHome;
