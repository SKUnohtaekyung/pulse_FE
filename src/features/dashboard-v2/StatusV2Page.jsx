import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { fetchDashboardV2Data } from './services/dashboardV2Api';
import V2Skeleton from './components/V2Skeleton';
import V2KpiTile from './components/V2KpiTile';
import V2TodayBrief from './components/V2TodayBrief';
import V2ActionCard from './components/V2ActionCard';
import V2AiSuggestionCard from './components/V2AiSuggestionCard';
import V2PersonaSummary from './components/V2PersonaSummary';
import V2TrendChart from './components/V2TrendChart';
import V2WeatherWidget from './components/V2WeatherWidget';
import V2ErrorBoundary from './components/V2ErrorBoundary';

const LOADING_TIPS = [
    "요즘 뜨는 주변 상권 해시태그를 분석하고 있어요 🔍",
    "오늘의 날씨와 유동인구 데이터를 확인 중이에요 ☀️",
    "우리 가게 방문 손님 데이터를 가져오는 중이에요 🏃‍♂️",
    "가장 효율적인 마케팅 액션을 고민 중이에요 🤔"
];

const StatusV2Page = ({ onNavigate }) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [loadingTip, setLoadingTip] = useState('');
    const [error, setError] = useState(null);

    const loadData = async (isRefreshAction = false) => {
        if (isRefreshAction) {
            setIsRefreshing(true);
            setLoadingTip(LOADING_TIPS[Math.floor(Math.random() * LOADING_TIPS.length)]);
        } else {
            setIsLoading(true);
        }
        setError(null);

        try {
            const response = await fetchDashboardV2Data(isRefreshAction);
            if (response.success) {
                setData(response.data);
            }
        } catch (err) {
            setError('데이터를 불러오는 중 오류가 발생했습니다.');
            console.error("Dashboard V2 API Error:", err);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // AI 제안 숨기기 처리
    const handleHideAiSuggestion = () => {
        console.log("AI Suggestion Hidden");
        // 실제 구현에서는 DB 업데이트나 로컬 상태 업데이트
    };

    return (
        <div className="flex flex-col h-full overflow-hidden bg-[#F5F7FA] relative pt-2">
            {/* Removed Absolute V2 Floating Refresh Button - moved to right pane */}

            {/* Loading Tip Toast */}
            <AnimatePresence>
                {isRefreshing && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-gray-900/80 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-gray-700/50"
                    >
                        <RefreshCw size={16} className="animate-spin text-blue-400" />
                        <span className="text-[13px] font-bold tracking-wide">{loadingTip}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Split Screen 2-Pane Layout with Loading Crossfade */}
            <AnimatePresence mode="wait">
                {(isLoading || isRefreshing) ? (
                    <V2Skeleton key="skeleton" />
                ) : error ? (
                    <motion.div key="error" className="flex-1 flex flex-col items-center justify-center text-red-500 font-bold h-full gap-4">
                        <p>{error}</p>
                        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-red-100 rounded-lg text-sm text-red-700">다시 시도</button>
                    </motion.div>
                ) : data && (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="flex-1 flex gap-6 mt-2 min-h-0"
                    >

                        {/* ---------------------------------------------------------------- */}
                        {/* LEFT PANE: Facts (Flex ~60%) */}
                        {/* ---------------------------------------------------------------- */}
                        <div className="flex-[1.4] flex flex-col gap-6 overflow-y-auto scrollbar-hide pb-6 pr-2">

                            {/* [P0] Core Vitals (Inline Metrics Strip, No Box) */}
                            <div className="flex flex-wrap xl:flex-nowrap items-start gap-6 xl:gap-10 shrink-0 w-full mb-2">
                                <V2KpiTile
                                    label="내 가게 검색 횟수"
                                    currentValue={data.coreVitals.searchVolume.value}
                                    unit={data.coreVitals.searchVolume.unit}
                                    compareText={data.coreVitals.searchVolume.compareText}
                                    compareStatus={data.coreVitals.searchVolume.status}
                                    baseTime={data.metadata.baseTime}
                                />
                                <div className="w-px h-12 bg-gray-200 mt-2 hidden md:block"></div>
                                <V2KpiTile
                                    label="내 가게 찜하기"
                                    currentValue={data.coreVitals.saves.value}
                                    unit={data.coreVitals.saves.unit}
                                    compareText={data.coreVitals.saves.compareText}
                                    compareStatus={data.coreVitals.saves.status}
                                    baseTime={data.metadata.baseTime}
                                />
                                <div className="w-px h-12 bg-gray-200 mt-2 hidden md:block"></div>
                                <V2KpiTile
                                    label="방문 및 문의 (전화/길찾기)"
                                    currentValue={data.coreVitals.conversions.value}
                                    unit={data.coreVitals.conversions.unit}
                                    compareText={data.coreVitals.conversions.compareText}
                                    compareStatus={data.coreVitals.conversions.status}
                                    baseTime={data.metadata.baseTime}
                                />
                            </div>

                            <div className="w-full h-px bg-gray-200 my-1 shrink-0"></div>

                            {/* [P2] External Insights (No Box) */}
                            <div className="flex gap-8 shrink-0">
                                <div className="flex-1">
                                    <V2PersonaSummary personas={data.insights.personas} />
                                </div>
                                <div className="w-px bg-gray-200"></div>
                                <div className="flex-[0.8] flex flex-col gap-4 py-1">
                                    <div className="-mt-1">
                                        <V2ErrorBoundary>
                                            <V2WeatherWidget weatherType={data.insights.weather.type} />
                                        </V2ErrorBoundary>
                                    </div>
                                    <div className="w-full h-px bg-gray-100"></div>
                                    <div>
                                        <h3 className="text-[14px] font-bold text-[#002B7A] tracking-wide mb-2">요즘 손님들이 우리 가게를 부르는 말</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {data.insights.keywords.map((kw, i) => (
                                                <span key={i} className="px-2 py-1 bg-white border border-gray-200 rounded-full text-[12px] text-gray-600 font-bold shadow-sm">
                                                    {kw}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* [P3] Deep Dive Trend Chart (Strong Box) */}
                            <div className="mt-auto shrink-0 pt-4">
                                <V2TrendChart
                                    title="이번 주 손님들의 관심도 변화 📈"
                                    seriesData={data.trendChart}
                                    lineDataKey="value"
                                />
                            </div>
                        </div>


                        {/* ---------------------------------------------------------------- */}
                        {/* RIGHT PANE: Actions (Flex ~40%) */}
                        {/* ---------------------------------------------------------------- */}
                        <div className="flex-1 max-w-[480px] bg-white rounded-t-[24px] rounded-bl-[24px] border border-gray-100 shadow-sm flex flex-col p-6 h-full overflow-y-auto scrollbar-hide isolate flex-shrink-0">

                            {/* [P1] Today Brief (Top) */}
                            <div className="mb-4 shrink-0">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-[14px] font-bold text-gray-400 tracking-wide flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                        오늘의 우리 가게 요약 💡
                                    </h2>
                                    <div
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-sm cursor-pointer transition-all duration-300 ${isRefreshing ? 'bg-gray-100 border-gray-200 opacity-50' : 'bg-[#EBF1FF] hover:bg-[#DCE6FF] border-[#C2D6FF] hover:border-[#99BDFC] hover:shadow-md'}`}
                                        onClick={() => !isRefreshing && loadData(true)}
                                    >
                                        <span className="text-[12px] text-[#002B7A] font-bold tracking-wide">
                                            오늘 {data.metadata.baseTime} 기준
                                        </span>
                                        <RefreshCw size={14} className={`text-[#002B7A] ${isRefreshing ? 'animate-spin' : 'hover:rotate-180 transition-transform duration-500'}`} />
                                    </div>
                                </div>
                                <V2TodayBrief highlightedSegments={data.todayBrief} />
                            </div>

                            <div className="w-full h-px bg-gray-100 my-4 shrink-0"></div>

                            {/* [P1] Immediate Actions */}
                            <div className="flex flex-col gap-4 flex-1">
                                <h2 className="text-[14px] font-bold text-gray-400 tracking-wide mb-1 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[#FF5A36]"></span>
                                    지금 당장 해볼까요? ⚡
                                </h2>

                                {/* 1. AI Suggestion Card (Limit to 1) */}
                                {data.actions.aiSuggestion && (
                                    <V2AiSuggestionCard
                                        evidence={data.actions.aiSuggestion.evidence}
                                        confidence={data.actions.aiSuggestion.confidence}
                                        content={data.actions.aiSuggestion.content}
                                        ctaText={data.actions.aiSuggestion.ctaLabel}
                                        onHide={handleHideAiSuggestion}
                                        onCta={() => onNavigate && onNavigate('promotion')}
                                    />
                                )}

                                {/* 2. Operational Action Card */}
                                {data.actions.operational && (
                                    <V2ActionCard
                                        urgency="high"
                                        title="점유율 경고"
                                        description={data.actions.operational.title}
                                        ctaText={data.actions.operational.ctaLabel}
                                        onAction={() => onNavigate && onNavigate('influencer-matching')}
                                    />
                                )}
                            </div>

                        </div>

                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StatusV2Page;
