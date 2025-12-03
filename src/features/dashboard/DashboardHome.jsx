import React, { useState } from 'react';
import {
    Clapperboard,
    BarChart2,
    Smile,
    Heart,
    Sparkles,
    ChevronRight,
    RefreshCw,
    HelpCircle,
    ArrowUpRight,
    Search,
    MousePointerClick
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

// --- Constants & Helper Components ---

// Removed flex-col from base to allow specific widgets to choose direction
const WIDGET_BASE_CLASSES = "bg-white rounded-[24px] shadow-sm border border-gray-100 flex relative transition-all duration-300 group";

// Reusable Tooltip Component
const InfoTooltip = ({ text, size = 16, align = 'center', direction = 'top' }) => {
    const positionClasses = {
        center: "left-1/2 -translate-x-1/2",
        left: "left-0",
        right: "right-0"
    };

    const verticalClasses = {
        top: "bottom-full mb-2",
        bottom: "top-full mt-2"
    };

    const arrowPositionClasses = {
        center: "left-1/2 -translate-x-1/2",
        left: "left-4",
        right: "right-4"
    };

    const arrowDirectionClasses = {
        top: "top-full border-t-[#191F28] border-b-transparent border-t-[5px]",
        bottom: "bottom-full border-b-[#191F28] border-t-transparent border-b-[5px]"
    };

    return (
        <div className="group/tooltip relative inline-flex items-center ml-1.5 z-40">
            <HelpCircle size={size} className="text-gray-400 cursor-help hover:text-[#002B7A] transition-colors" />
            <div className={`absolute w-48 bg-[#191F28] text-white text-[11px] p-2.5 rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-all duration-200 pointer-events-none shadow-xl z-[60] ${positionClasses[align]} ${verticalClasses[direction]}`}>
                {text}
                <div className={`absolute w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent ${arrowPositionClasses[align]} ${arrowDirectionClasses[direction]}`}></div>
            </div>
        </div>
    );
};

// Reusable Widget Header Component
const WidgetHeader = ({ icon: Icon, title, tooltipText, iconSize = 20, tooltipSize = 16, rightElement }) => (
    <div className="flex justify-between items-center z-10 shrink-0">
        <h3 className="font-bold text-gray-500 text-base flex items-center gap-2">
            <Icon size={iconSize} className="text-[#002B7A]" /> {title}
            <InfoTooltip text={tooltipText} size={tooltipSize} />
        </h3>
        {rightElement}
    </div>
);

// Weather Animation Component
const WeatherAnimation = ({ animation }) => {
    return (
        <div className="absolute inset-0 opacity-30 pointer-events-none overflow-hidden">
            {/* Rain / Drizzle / Sleet */}
            {(animation === 'rain' || animation === 'rain_heavy' || animation === 'drizzle' || animation === 'sleet') && (
                [...Array(animation === 'rain_heavy' ? 20 : 10)].map((_, i) => (
                    <motion.div
                        key={`rain-${i}`}
                        className="absolute top-[-20px] bg-white/40 w-[1px] h-[20px] rounded-full"
                        style={{ left: `${Math.random() * 100}%` }}
                        animate={{ top: ['0%', '100%'] }}
                        transition={{ duration: 0.8 + Math.random(), repeat: Infinity, ease: "linear", delay: Math.random() }}
                    />
                ))
            )}

            {/* Snow / Sleet */}
            {(animation === 'snow' || animation === 'sleet') && (
                [...Array(15)].map((_, i) => (
                    <motion.div
                        key={`snow-${i}`}
                        className="absolute top-[-10px] bg-white/60 w-1 h-1 rounded-full"
                        style={{ left: `${Math.random() * 100}%` }}
                        animate={{ top: ['0%', '100%'], x: [-10, 10] }}
                        transition={{ duration: 2 + Math.random(), repeat: Infinity, ease: "linear", delay: Math.random() }}
                    />
                ))
            )}

            {/* Stars */}
            {(animation === 'stars') && (
                [...Array(20)].map((_, i) => (
                    <motion.div
                        key={`star-${i}`}
                        className="absolute bg-white rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: Math.random() * 2 + 1,
                            height: Math.random() * 2 + 1
                        }}
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: 1.5 + Math.random(), repeat: Infinity, ease: "easeInOut", delay: Math.random() }}
                    />
                ))
            )}

            {/* Clouds / Fog */}
            {(animation === 'clouds' || animation === 'clouds_heavy' || animation === 'fog') && (
                [...Array(5)].map((_, i) => (
                    <motion.div
                        key={`cloud-${i}`}
                        className={`absolute bg-white/${animation === 'fog' ? '10' : '20'} rounded-full blur-xl`}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 50}%`,
                            width: Math.random() * 100 + 50,
                            height: Math.random() * 60 + 30
                        }}
                        animate={{ x: [-50, 50] }}
                        transition={{ duration: 10 + Math.random() * 10, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                    />
                ))
            )}

            {/* Thunder */}
            {animation === 'thunder' && (
                <motion.div
                    className="absolute inset-0 bg-white/30"
                    animate={{ opacity: [0, 0.5, 0, 0, 0.3, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", times: [0, 0.05, 0.1, 0.8, 0.85, 1] }}
                />
            )}

            {/* Sun */}
            {animation === 'sun' && (
                <motion.div
                    className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
            )}
        </div>
    );
};

// --- Main Component ---

const DashboardHome = ({ onNavigate }) => {
    // State for "Alive UI"
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [weatherType, setWeatherType] = useState('rain'); // Default to rain

    // Mock Data
    const chartData = [
        { name: '월', value: 45 }, { name: '화', value: 50 }, { name: '수', value: 75 },
        { name: '목', value: 60 }, { name: '금', value: 90 }, { name: '토', value: 100 }, { name: '일', value: 85 },
    ];

    // Loading Tips
    const LOADING_TIPS = [
        "비 오는 날에는 파전 키워드가 평소보다 2.5배 많이 검색돼요! ☔️",
        "고객 리뷰에 답글을 달면 재방문율이 15% 올라갑니다. 💬",
        "금요일 저녁 6시, 직장인 타겟 마케팅이 가장 효과적이에요. ⏰",
        "매장 사진을 3장 이상 등록하면 노출 확률이 높아져요. 📸"
    ];
    const [loadingTip, setLoadingTip] = useState(LOADING_TIPS[0]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        setLoadingTip(LOADING_TIPS[Math.floor(Math.random() * LOADING_TIPS.length)]);

        // Randomize weather for demo
        const types = Object.keys(WEATHER_TYPES);
        const randomType = types[Math.floor(Math.random() * types.length)];
        setWeatherType(randomType);

        setTimeout(() => setIsRefreshing(false), 2000);
    };

    const currentWeather = WEATHER_TYPES[weatherType];
    const WeatherIcon = currentWeather.icon;

    return (
        <div className="flex flex-col h-full gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden bg-[#F5F7FA] p-4 relative">

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

            {/* Main Grid */}
            <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">

                {/* Column 1: Header, Weather, Sentiment (Span 3) */}
                <div className="col-span-3 flex flex-col gap-4 h-full min-h-0">

                    {/* Box 1: Header */}
                    <div className="flex flex-col justify-center shrink-0 h-[140px]">
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-[26px] font-bold text-[#002B7A] leading-tight">우리 가게 현황</h2>
                            <div className="flex items-center gap-2 px-2.5 py-1 bg-white rounded-full border border-gray-200 shadow-sm">
                                <span className="text-[11px] text-gray-500">
                                    {new Date().toLocaleDateString()} 기준
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
                        <p className="text-[15px] font-medium text-[#191F28] opacity-80 break-keep leading-relaxed">
                            오늘의 날씨, 매출, 고객 반응을 <span className="text-[#002B7A] font-bold opacity-100">한눈에 확인</span>하고<br />
                            <span className="text-[#002B7A] font-bold opacity-100">마케팅 전략</span>을 세워보세요.
                        </p>
                    </div>

                    {/* Box 3: Weather (Horizontal Layout) */}
                    <div className={`${WIDGET_BASE_CLASSES} flex-row p-5 items-center justify-between flex-[0.4] min-h-0 overflow-hidden`}>
                        {/* Background (Clipped) */}
                        <div className="absolute inset-0 z-0">
                            <div className={`absolute inset-0 bg-gradient-to-br ${currentWeather.gradient} transition-colors duration-500`}></div>
                            <WeatherAnimation animation={currentWeather.animation} />
                        </div>

                        {/* Left: Icon */}
                        <div className="relative z-10 flex flex-col items-center justify-center pl-2">
                            <div className="relative w-16 h-16 flex items-center justify-center filter drop-shadow-2xl">
                                <WeatherIcon size={52} className={`${currentWeather.textColor} fill-white/10`} strokeWidth={1.5} />
                            </div>
                        </div>

                        {/* Right: Text */}
                        <div className="relative z-10 flex flex-col items-end text-right gap-1 pr-1">
                            <h3 className={`font-bold ${currentWeather.textColor} text-xs flex items-center gap-1.5 mb-1 opacity-80`}>
                                날씨
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleRefresh(); }}
                                    className="hover:rotate-180 transition-transform duration-500"
                                    title="날씨 변경"
                                >
                                    <RefreshCw size={12} />
                                </button>
                            </h3>
                            <p className={`text-xl font-bold ${currentWeather.textColor} leading-none`}>{currentWeather.label}</p>
                            <p className={`text-[11px] ${currentWeather.subTextColor} mb-1`}>유동인구 많음</p>
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[13px] font-bold px-2.5 py-1 rounded-full">
                                💡 {currentWeather.recommendation}
                            </div>
                        </div>
                    </div>

                    {/* Box 4: Sentiment */}
                    <div className={`${WIDGET_BASE_CLASSES} flex-col p-5 gap-3 flex-[0.6] min-h-0`}>
                        <WidgetHeader
                            icon={Smile}
                            title="고객 감정"
                            tooltipText="최근 1주일간 수집된 리뷰와 SNS 반응을 분석한 결과입니다."
                        />

                        <div className="flex-1 flex items-center justify-between gap-3 z-10 min-h-0">
                            {/* Left: Circle Chart */}
                            <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 96 96">
                                    <circle cx="48" cy="48" r="40" stroke="#F0F4FF" strokeWidth="6" fill="none" />
                                    <circle cx="48" cy="48" r="40" stroke="#002B7A" strokeWidth="6" fill="none" strokeDasharray="213.6" strokeDashoffset="21.36" strokeLinecap="round" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-xl font-bold text-[#191F28]">92%</span>
                                    <span className="text-[10px] text-gray-500 font-medium">긍정</span>
                                </div>
                            </div>

                            {/* Right: Bars */}
                            <div className="flex-1 flex flex-col gap-3 overflow-hidden min-w-0 justify-center">
                                <div>
                                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                                        <span className="text-gray-600 flex items-center gap-1.5 truncate"><Heart size={12} className="text-red-400 shrink-0" /> 맛이 좋아요</span>
                                        <span className="font-bold text-[#191F28]">45%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden shrink-0">
                                        <div className="bg-red-400 h-full rounded-full" style={{ width: '45%' }}></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                                        <span className="text-gray-600 flex items-center gap-1.5 truncate"><Sparkles size={12} className="text-yellow-400 shrink-0" /> 분위기 깡패</span>
                                        <span className="font-bold text-[#191F28]">30%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden shrink-0">
                                        <div className="bg-yellow-400 h-full rounded-full" style={{ width: '30%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Column 2: AI Marketing, Performance (Span 5) */}
                <div className="col-span-5 flex flex-col gap-4 h-full min-h-0">

                    {/* Box 2: AI Marketing */}
                    <div className="bg-[#002B7A] rounded-[24px] p-6 shadow-lg text-white flex flex-col relative flex-[0.4] min-h-0 transition-all duration-300 group">
                        {/* Background (Clipped) */}
                        <div className="absolute inset-0 rounded-[24px] overflow-hidden z-0">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        </div>

                        <div className="relative z-10 flex-1 flex flex-col">
                            <div className="flex items-center justify-between mb-2">
                                <span className="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-bold text-white border border-white/10">AI 마케팅 제안</span>
                            </div>

                            <h2 className="text-[22px] font-bold leading-tight mb-2">
                                비 오는 날,<br />
                                <span className="text-blue-200">파전 영상</span>으로 매출 2배 UP!
                            </h2>
                            <p className="text-white/70 text-[13px] truncate mb-auto">
                                오늘 파전 검색량 급증! 1분 만에 홍보 영상을 만들어보세요.
                            </p>

                            <div className="flex justify-end mt-auto pt-4">
                                <button
                                    onClick={() => onNavigate && onNavigate('video-creation')}
                                    className="bg-[#FF5A36] text-white px-4 py-3 rounded-xl font-bold text-[13px] hover:bg-[#FF5A36]/90 transition-all shadow-sm flex items-center gap-2 whitespace-nowrap"
                                >
                                    <Clapperboard size={16} className="fill-current" />
                                    홍보 영상 만들기
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Box 5: Performance Chart */}
                    <div className={`${WIDGET_BASE_CLASSES} flex-col p-6 gap-4 flex-[0.6] min-h-0`}>
                        {/* Header & Metrics */}
                        <div className="flex flex-col gap-4 shrink-0">
                            <WidgetHeader
                                icon={BarChart2}
                                title="주간 성과"
                                tooltipText="지난 7일간의 매장 검색량 및 방문자 추이입니다."
                                rightElement={
                                    <button className="text-[11px] text-gray-400 hover:text-[#002B7A] flex items-center gap-0.5 transition-colors">
                                        자세히 보기 <ChevronRight size={12} />
                                    </button>
                                }
                            />

                            <div className="flex items-center gap-8">
                                <div>
                                    <p className="text-[11px] text-gray-500 mb-1 flex items-center gap-1.5">
                                        <Search size={12} /> 매장 검색량
                                    </p>
                                    <div className="flex items-end gap-2">
                                        <span className="text-xl font-bold text-[#191F28]">1,250회</span>
                                        <span className="text-[11px] text-red-500 font-bold flex items-center bg-red-50 px-1.5 py-0.5 rounded">
                                            <ArrowUpRight size={12} className="mr-0.5" /> 15%
                                        </span>
                                    </div>
                                </div>
                                <div className="w-px h-10 bg-gray-100"></div>
                                <div>
                                    <p className="text-[11px] text-gray-500 mb-1 flex items-center gap-1.5">
                                        <MousePointerClick size={12} /> 플레이스 방문
                                    </p>
                                    <div className="flex items-end gap-2">
                                        <span className="text-xl font-bold text-[#191F28]">450명</span>
                                        <span className="text-[11px] text-red-500 font-bold flex items-center bg-red-50 px-1.5 py-0.5 rounded">
                                            <ArrowUpRight size={12} className="mr-0.5" /> 8%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Chart Area */}
                        <div className="flex-1 w-full min-h-0 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#002B7A" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#002B7A" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#8B95A1', fontSize: 11 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#8B95A1', fontSize: 11 }}
                                        domain={[0, 'auto']}
                                        tickCount={5}
                                    />
                                    <RechartsTooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#002B7A"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorValue)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Column 3: Keywords (Span 4) */}
                <div className="col-span-4 h-full min-h-0">
                    {/* Box 6: Keywords */}
                    <div className={`${WIDGET_BASE_CLASSES} flex-col p-6 gap-4 h-full`}>
                        <div className="shrink-0 mb-1">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-lg font-bold text-[#191F28] leading-snug">
                                    이번 주는 <span className="text-[#002B7A]">#가성비</span> 키워드가<br />
                                    가장 핫해요! 🔥
                                </h3>
                                <InfoTooltip
                                    text="우리 가게와 관련된 인기 검색 키워드 순위입니다."
                                    size={16}
                                    align="right"
                                    direction="bottom"
                                />
                            </div>
                            <p className="text-xs text-gray-500">지난주보다 검색량이 <span className="text-red-500 font-bold">15%</span> 늘었어요.</p>
                        </div>

                        <div className="flex-1 overflow-hidden min-h-0 flex flex-col gap-3 pb-2">
                            {[
                                { text: '가성비', value: 85 },
                                { text: '단체석', value: 72 },
                                { text: '빠른서빙', value: 64 },
                                { text: '친절해요', value: 58 },
                                { text: '주차가능', value: 45 },
                                { text: '데이트', value: 42 },
                                { text: '분위기', value: 38 },
                                { text: '혼밥', value: 35 }
                            ].slice(0, 7).map((kw, i) => (
                                <div key={i} className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-gray-50 transition-colors group shrink-0">
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-all ${i === 0
                                        ? 'bg-[#002B7A] text-white shadow-md'
                                        : 'bg-gray-100 text-gray-500'
                                        }`}>
                                        {i + 1}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold text-[#191F28] text-[13px] truncate">#{kw.text}</span>
                                            <span className="text-[11px] text-gray-500 font-medium">{kw.value}%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[#002B7A] rounded-full opacity-80"
                                                style={{ width: `${kw.value}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DashboardHome;
