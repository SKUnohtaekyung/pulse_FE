import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Users, Sparkles, AlertCircle, ChevronRight, Trophy, Clock, Store, TrendingUp, Film } from 'lucide-react';
import JourneyMapSection from './JourneyMapSection';
import LocalAnalysisSection from './LocalAnalysisSection';
import ReelCreationModal from './components/ReelCreationModal';

// Rich HCI Data Structure
const PERSONAS = [
    {
        id: 1,
        nickname: "시원 국물파",
        tags: ["해장러", "혼밥", "점심"],
        img: "https://api.dicebear.com/7.x/notionists/svg?seed=happy-woman-1&backgroundColor=fef3c7",
        summary: "전날 술 마신 다음날은 무조건 방문하는 해장 러버입니다.",
        journey: {
            explore: {
                label: '탐색',
                action: "네이버에 '해장국' 검색",
                thought: "\"아, 속쓰려... 어디 시원한 국물 없나?\"",
                type: 'neutral',
                touchpoint: '네이버 플레이스',
                painPoint: '메뉴판 글씨가 작아서 잘 안 보임',
                opportunity: '대표 메뉴(해장국) 사진을 최상단에 고정하세요.'
            },
            visit: {
                label: '방문',
                action: "점심시간 조금 지나 1시 방문",
                thought: "\"점심 시간 피했으니 자리 있겠지?\"",
                type: 'good',
                touchpoint: '매장 입구',
                painPoint: '없음 (웨이팅 없어서 만족)',
                opportunity: '1시 이후 방문 고객에게 쿠폰을 줘서 분산을 유도하세요.'
            },
            eat: {
                label: '식사',
                action: "말 없이 국물까지 흡입",
                thought: "\"크, 이 맛이지. 오늘따라 양이 더 많네.\"",
                type: 'good',
                touchpoint: '테이블',
                painPoint: '김치 리필 부르기가 귀찮음',
                opportunity: '테이블마다 김치 항아리를 비치하면 만족도가 올라갑니다.'
            },
            share: {
                label: '공유',
                action: "계산 후 빠르게 퇴장",
                thought: "\"리뷰 이벤트? 아 귀찮아 다음에 할게.\"",
                type: 'pain',
                touchpoint: '카운터',
                painPoint: '영수증 리뷰 QR 찍기가 번거로움',
                opportunity: 'QR 대신 "단골 적립" 만으로도 자동 리뷰가 쌓이게 하세요.'
            }
        }
    },
    {
        id: 2,
        nickname: "가성비 직장인",
        tags: ["점심할인", "빠른식사", "더치페이"],
        img: "https://api.dicebear.com/7.x/notionists/svg?seed=happy-man-2&backgroundColor=d1fae5",
        summary: "점심값 방어를 위해 할인 메뉴 위주로 공략합니다.",
        journey: {
            explore: {
                label: '탐색',
                action: "동료들과 '오늘 뭐 먹지' 논의",
                thought: "\"만원 넘어가면 좀 부담스러운데...\"",
                type: 'neutral',
                touchpoint: '구두 대화',
                painPoint: '메뉴 가격 정보를 한눈에 보기 힘듦',
                opportunity: '가게 앞 입간판에 "점심 특선 9,000원"을 크게 적으세요.'
            },
            visit: {
                label: '방문',
                action: "12시 정각 도착",
                thought: "\"자리 없으면 바로 다른 데 가자.\"",
                type: 'pain',
                touchpoint: '매장 대기석',
                painPoint: '웨이팅 10분 넘어가면 바로 이탈함',
                opportunity: '대기 시간에 미리 주문을 받아 조리 시간을 단축하세요.'
            },
            eat: {
                label: '식사',
                action: "음식 나오자마자 흡입",
                thought: "\"음식 빨리 나와서 다행이다. 커피 마실 시간 있네.\"",
                type: 'good',
                touchpoint: '메뉴판/서빙',
                painPoint: '옆 테이블이랑 간격이 좁음',
                opportunity: '점심 시간에는 회전율을 위해 2인석 위주로 배치하세요.'
            },
            share: {
                label: '공유',
                action: "더치페이 결제",
                thought: "\"법카 말고 내돈내산이니까 적립해야지.\"",
                type: 'good',
                touchpoint: '키오스크',
                painPoint: '더치페이 결제 과정이 복잡함',
                opportunity: '테이블오더에서 바로 더치페이/N빵 기능을 지원하세요.'
            }
        }
    },
    {
        id: 3,
        nickname: "미식가 커플",
        tags: ["데이트", "분위기", "사진필수"],
        img: "https://api.dicebear.com/7.x/notionists/svg?seed=happy-woman-2&backgroundColor=fce7f3",
        summary: "맛과 분위기 모두 잡아야 하는 까다로운 미식가입니다.",
        journey: {
            explore: {
                label: '탐색',
                action: "인스타 해시태그 검색",
                thought: "\"오 여기 조명 예쁘다. 사진 잘 나오겠네.\"",
                type: 'good',
                touchpoint: '인스타그램',
                painPoint: '매장 내부 사진이 별로 없음',
                opportunity: '인스타 감성의 매장 내부 사진을 플레이스에 추가하세요.'
            },
            visit: {
                label: '방문',
                action: "저녁 6시 예약 방문",
                thought: "\"예약석이라 창가 자리 줬네? 센스 굿.\"",
                type: 'good',
                touchpoint: '예약 시스템',
                painPoint: '없음',
                opportunity: '예약석에는 "웰컴 카드"를 올려두어 감동을 주세요.'
            },
            eat: {
                label: '식사',
                action: "사진 촬영 후 식사",
                thought: "\"플레이팅은 예쁜데... 음식이 좀 식었어.\"",
                type: 'neutral',
                touchpoint: '음식 플레이팅',
                painPoint: '사진 찍느라 음식이 식어서 맛이 떨어짐',
                opportunity: '식어도 맛있는 오일 파스타 류를 추천 메뉴로 유도하세요.'
            },
            share: {
                label: '공유',
                action: "인스타 스토리 업로드",
                thought: "\"태그하면 음료수 준다는데 지금 올릴까?\"",
                type: 'good',
                touchpoint: 'SNS',
                painPoint: '와이파이 비번 치기가 귀찮음',
                opportunity: 'QR로 바로 연결되는 와이파이 카드를 테이블에 두세요.'
            }
        }
    }
];





export default function UnifiedInsightPage({ onNavigate }) {
    // ID 'local' stands for the Market Analysis View (Macro)
    // Default to 'local' for the "Top-Down" flow
    const [selectedId, setSelectedId] = useState('local');


    // Helper to find persona if ID is a number
    const selectedPersona = typeof selectedId === 'number'
        ? PERSONAS.find(p => p.id === selectedId)
        : null;

    // Mapping for Promotion Page
    const PERSONA_MAPPING = {
        1: 'hangover', // 시원 국물파
        2: 'worker',   // 가성비 직장인
        3: 'couple'    // 미식가 커플
    };

    return (
        <div className="flex flex-1 overflow-hidden bg-[#F5F7FA] p-5 gap-5 font-sans h-full min-h-0 text-[#191F28]">

            {/* [LEFT PANE] Unified List (Flex 0.35) */}
            <div className="flex-[0.35] flex flex-col min-h-0 gap-4">

                {/* 1. Brief Summary Card */}
                <div className="bg-white rounded-[24px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#E5E8EB] shrink-0">
                    <div className="flex items-center gap-2 mb-3">
                        <Trophy size={18} className="text-[#FFB300]" />
                        <span className="text-[#8B95A1] font-bold text-xs uppercase tracking-wider">Weekly Insight</span>
                    </div>
                    <h2 className="text-[22px] font-bold leading-[1.3] text-[#191F28] mb-1">
                        이번 주는<br />
                        <span className="bg-gradient-to-r from-[#002B7A] to-blue-500 bg-clip-text text-transparent">시원 국물파</span> 손님이<br />
                        <span>박사장님의 가게에 자주 방문했어요.</span>
                    </h2>
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
                        {PERSONAS.map(persona => (
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
            <div className="flex-[0.65] flex flex-col min-h-0 relative">
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
        </div>
    );
}
