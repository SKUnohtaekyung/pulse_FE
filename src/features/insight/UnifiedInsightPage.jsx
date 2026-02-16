import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Users, Sparkles, AlertCircle, ChevronRight, Trophy, Clock, Store, TrendingUp, Film, Loader2 } from 'lucide-react';
import JourneyMapSection from './JourneyMapSection';
import LocalAnalysisSection from './LocalAnalysisSection';
import ReelCreationModal from './components/ReelCreationModal';

// FastAPI 서버 주소
const FASTAPI_URL = 'http://127.0.0.1:8000/api';

export default function UnifiedInsightPage({ onNavigate }) {
    // API에서 가져온 분석 데이터
    const [analysisData, setAnalysisData] = useState(null);
    const [personas, setPersonas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ID 'local' stands for the Market Analysis View (Macro)
    const [selectedId, setSelectedId] = useState('local');

    // API에서 페르소나 데이터 가져오기
    useEffect(() => {
        const fetchAnalysisData = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`${FASTAPI_URL}/analysis/latest`);

                if (!response.ok) {
                    if (response.status === 404) {
                        setError('아직 분석 결과가 없습니다. 회원가입을 통해 분석을 먼저 실행해주세요.');
                    } else {
                        setError('분석 데이터를 불러오는 중 오류가 발생했습니다.');
                    }
                    return;
                }

                const data = await response.json();
                console.log('📊 분석 데이터 로드 완료:', data);

                setAnalysisData(data);
                setPersonas(data.personas || []);
            } catch (err) {
                console.error('❌ 분석 데이터 로드 실패:', err);
                setError('AI 분석 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
            } finally {
                setLoading(false);
            }
        };

        fetchAnalysisData();
    }, []);

    // Helper to find persona if ID is a number
    const selectedPersona = typeof selectedId === 'number'
        ? personas.find(p => p.id === selectedId)
        : null;

    // Mapping for Promotion Page (ID 기반 동적 매핑)
    const PERSONA_MAPPING = {};
    personas.forEach((p, idx) => {
        const keys = ['hangover', 'worker', 'couple', 'family', 'student'];
        PERSONA_MAPPING[p.id] = keys[idx] || `persona_${p.id}`;
    });

    return (
        <div className="flex flex-1 overflow-hidden bg-[#F5F7FA] p-5 gap-5 font-sans h-full min-h-0 text-[#191F28]">

            {/* Loading State */}
            {loading && (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 size={40} className="text-[#002B7A] animate-spin mx-auto mb-4" />
                        <p className="text-[#8B95A1] font-medium">AI 분석 데이터를 불러오는 중...</p>
                    </div>
                </div>
            )}

            {/* Error State */}
            {!loading && error && (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center bg-white rounded-[24px] p-8 shadow-sm border border-[#E5E8EB] max-w-md">
                        <AlertCircle size={48} className="text-[#FF5A36] mx-auto mb-4" />
                        <h3 className="text-[18px] font-bold text-[#191F28] mb-2">데이터 로드 실패</h3>
                        <p className="text-[#8B95A1] text-[14px] mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-[#002B7A] text-white rounded-xl text-sm font-bold hover:bg-[#001F5C] transition-colors"
                        >
                            다시 시도
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content - only show when data is loaded */}
            {!loading && !error && (
                <>
                    {/* [LEFT PANE] Unified List (Flex 0.35) */}
                    <div className="flex-[0.35] flex flex-col min-h-0 gap-4">

                        {/* 1. Brief Summary Card */}
                        <div className="bg-white rounded-[24px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#E5E8EB] shrink-0">
                            <div className="flex items-center gap-2 mb-3">
                                <Trophy size={18} className="text-[#FFB300]" />
                                <span className="text-[#8B95A1] font-bold text-xs uppercase tracking-wider">AI Insight</span>
                            </div>
                            <h2 className="text-[22px] font-bold leading-[1.3] text-[#191F28] mb-1">
                                <span className="bg-gradient-to-r from-[#002B7A] to-blue-500 bg-clip-text text-transparent">{analysisData?.store_name || '가게'}</span>의<br />
                                고객 분석이 완료되었어요.
                            </h2>
                            {analysisData?.store_summary && (
                                <p className="text-[13px] text-[#8B95A1] mt-2 leading-relaxed">
                                    {analysisData.store_summary}
                                </p>
                            )}
                            {analysisData && (
                                <div className="flex gap-3 mt-3">
                                    <span className="px-2.5 py-1 bg-blue-50 text-[#002B7A] text-[11px] font-bold rounded-full border border-blue-100">
                                        ⭐ 평균 {analysisData.average_rating}점
                                    </span>
                                    <span className="px-2.5 py-1 bg-blue-50 text-[#002B7A] text-[11px] font-bold rounded-full border border-blue-100">
                                        📝 리뷰 {analysisData.total_reviews}개 분석
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* 2. Scrollable List (Unified: Market + Personas) */}
                        <div className="flex-1 bg-white rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#E5E8EB] overflow-hidden flex flex-col">
                            <div className="p-5 border-b border-[#F2F4F6] shrink-0">
                                <h3 className="text-[16px] font-bold text-[#191F28]">분석 리포트 목록</h3>
                            </div>
                            <div className="flex-1 overflow-y-auto scrollbar-hide p-2">

                                {/* A. Market Analysis Item (Macro) */}
                                <div
                                    onClick={() => setSelectedId('local')}
                                    className={`p-4 mb-2 rounded-[20px] cursor-pointer transition-all border group ${selectedId === 'local'
                                        ? 'bg-[#E8F3FF] border-[#002B7A] shadow-sm'
                                        : 'bg-white border-transparent hover:bg-[#F5F7FA] hover:border-[#E5E8EB]'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center shrink-0 border transition-colors ${selectedId === 'local' ? 'bg-[#002B7A] border-[#002B7A] text-white' : 'bg-[#F5F7FA] border-[#F5F7FA] text-[#8B95A1] group-hover:bg-[#E5E8EB]'
                                            }`}>
                                            <Store size={22} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <h4 className={`text-[16px] font-bold truncate ${selectedId === 'local' ? 'text-[#002B7A]' : 'text-[#333D4B]'}`}>
                                                    주변 상권 분석
                                                </h4>
                                                {selectedId === 'local' && (
                                                    <ChevronRight size={16} className="text-[#002B7A]" />
                                                )}
                                            </div>
                                            <p className={`text-[13px] truncate ${selectedId === 'local' ? 'text-[#002B7A]/80' : 'text-[#8B95A1]'}`}>
                                                범계역 로데오거리 전체 현황
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-[#F2F4F6] mx-4 my-2" />

                                {/* B. Personas Items (Micro) */}
                                {personas.map(persona => (
                                    <div
                                        key={persona.id}
                                        onClick={() => setSelectedId(persona.id)}
                                        className={`p-4 mb-2 rounded-[20px] cursor-pointer transition-all border group ${selectedId === persona.id
                                            ? 'bg-[#E8F3FF] border-[#002B7A] shadow-sm'
                                            : 'bg-white border-transparent hover:bg-[#F5F7FA] hover:border-[#E5E8EB]'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-[16px] overflow-hidden shrink-0 border ${selectedId === persona.id ? 'border-[#002B7A]/20' : 'border-[#F5F7FA]'}`}>
                                                <img src={persona.img} alt={persona.nickname} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-center mb-0.5">
                                                    <h4 className={`text-[16px] font-bold truncate ${selectedId === persona.id ? 'text-[#002B7A]' : 'text-[#333D4B]'}`}>
                                                        {persona.nickname}
                                                    </h4>
                                                    {selectedId === persona.id && (
                                                        <ChevronRight size={16} className="text-[#002B7A]" />
                                                    )}
                                                </div>
                                                <p className="text-[13px] text-[#8B95A1] truncate">{persona.summary}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* [RIGHT PANE] Detail View (Flex 0.65) */}
                    <div className="flex-[0.65] flex flex-col min-h-0">
                        <AnimatePresence mode="wait">

                            {/* CASE 1: Local Analysis (Macro) */}
                            {selectedId === 'local' && (
                                <motion.div
                                    key="local"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex-1 h-full"
                                >
                                    <LocalAnalysisSection isEmbedded={true} />
                                </motion.div>
                            )}

                            {/* CASE 2: Persona Detail (Micro) */}
                            {selectedPersona && (
                                <motion.div
                                    key={selectedPersona.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex-1 flex flex-col gap-4 overflow-y-auto scrollbar-hide pb-10"
                                >
                                    <div className="bg-white rounded-[32px] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[#E5E8EB]">
                                        {/* Header */}
                                        <div className="flex justify-between items-start mb-8">
                                            <div className="flex items-center gap-5">
                                                <div className="w-20 h-20 rounded-[28px] overflow-hidden border border-[#E5E8EB] shadow-sm">
                                                    <img src={selectedPersona.img} alt={selectedPersona.nickname} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <div className="flex gap-2 mb-2">
                                                        {selectedPersona.tags.map(tag => (
                                                            <span key={tag} className="px-2 py-1 bg-[#F2F4F6] text-[#4E5968] text-[12px] font-bold rounded-lg">#{tag}</span>
                                                        ))}
                                                    </div>
                                                    <h1 className="text-[28px] font-bold text-[#191F28] leading-tight mb-1">{selectedPersona.nickname}</h1>
                                                    <p className="text-[#6B7684] font-medium">{selectedPersona.summary}</p>
                                                </div>
                                            </div>

                                            {/* [NEW] Action Button for AI Reel */}
                                            <button
                                                onClick={() => {
                                                    onNavigate('promotion', {
                                                        personaId: PERSONA_MAPPING[selectedPersona?.id],
                                                        title: `[${selectedPersona?.nickname}] 맞춤 홍보 영상`
                                                    });
                                                }}
                                                className="px-5 py-3 bg-[#FF5A36] hover:bg-[#E0492A] text-white rounded-xl text-[14px] font-bold shadow-lg shadow-orange-100 flex items-center gap-2 transition-all transform hover:scale-105"
                                            >
                                                <Film size={18} />
                                                이 손님 맞춤 릴스 제작
                                            </button>
                                        </div>

                                        {/* Journey Map */}
                                        <div className="mb-0">
                                            <h3 className="text-[18px] font-bold text-[#191F28] mb-4 flex items-center gap-2">
                                                <MapPin size={20} className="text-[#333D4B]" />
                                                고객 여정 지도
                                            </h3>
                                            <JourneyMapSection persona={selectedPersona} />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>
                </>
            )}
        </div>
    );
}
