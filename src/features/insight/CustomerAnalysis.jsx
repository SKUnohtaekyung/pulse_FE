import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MessageCircle, ThumbsUp, AlertCircle, Lightbulb, ChevronRight, User, Send, Zap, ChevronDown, Frown, Smile, Clock, Wallet, Utensils, Calendar, Clapperboard, X, Sparkles, HelpCircle, CreditCard, ArrowUpRight } from 'lucide-react';
import { COLORS } from '../../constants';

// Mock Data
const PERSONAS = [
    {
        id: 1,
        nickname: "시원 국물파",
        tags: ["#해장러", "#혼밥", "#국물사랑"],
        visitRate: 45,
        img: "https://api.dicebear.com/7.x/notionists/svg?seed=happy-woman-1&backgroundColor=fef3c7",
        summary: "전날 술 마신 다음날은 무조건 방문하는 해장 러버. 조용히 식사만 하고 가시지만 재방문율이 매우 높아요.",
        stats: {
            menu: "해장국"
        },
        journey: {
            explore: { text: "숙취로 '시원한 국물' 검색", type: 'neutral' },
            visit: { text: "점심 피크 피해 1시 방문", type: 'good', detail: "웨이팅 없어서 좋아함" },
            eat: { text: "말 없이 국물까지 싹 비움", type: 'good', detail: "푸짐한 양에 만족" },
            share: { text: "리뷰 안 쓰고 조용히 퇴장", type: 'pain', detail: "이벤트 참여 귀찮아함" }
        }
    },
    {
        id: 2,
        nickname: "가성비 직장인",
        tags: ["#점심할인", "#빠른식사", "#더치페이"],
        visitRate: 30,
        img: "https://api.dicebear.com/7.x/notionists/svg?seed=happy-man-2&backgroundColor=d1fae5",
        summary: "점심값 방어를 위해 할인 메뉴 위주로 공략하는 알뜰살뜰 직장인 그룹입니다.",
        stats: {
            menu: "오늘의 백반"
        },
        journey: {
            explore: { text: "회사 근처 '가성비' 검색", type: 'neutral' },
            visit: { text: "12시 땡 하고 도착", type: 'pain', detail: "웨이팅 길어지면 이탈" },
            eat: { text: "오늘의 메뉴 빠르게 흡입", type: 'good', detail: "음식 빨리 나와서 만족" },
            share: { text: "동료에게 구두로 추천", type: 'good', detail: "가성비 좋다고 소문냄" }
        }
    },
    {
        id: 3,
        nickname: "미식가 커플",
        tags: ["#데이트", "#분위기", "#사진필수"],
        visitRate: 25,
        img: "https://api.dicebear.com/7.x/notionists/svg?seed=happy-woman-2&backgroundColor=fce7f3",
        summary: "맛과 분위기 모두 잡아야 하는 까다로운 미식가. 사진이 잘 나오는 메뉴를 선호해요.",
        stats: {
            menu: "파스타 세트"
        },
        journey: {
            explore: { text: "인스타 '분위기 맛집' 검색", type: 'good', detail: "비주얼 보고 기대감 상승" },
            visit: { text: "저녁 시간 예약 후 방문", type: 'neutral' },
            eat: { text: "플레이팅 예쁜 메뉴 주문", type: 'good', detail: "사진 찍느라 식사 늦음" },
            share: { text: "인스타 스토리 업로드", type: 'good', detail: "태그 이벤트 참여" }
        }
    }
];

export default function CustomerAnalysis({ onNavigate }) {
    const [selectedPersona, setSelectedPersona] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="flex h-full gap-3 lg:gap-4 p-2 overflow-hidden min-w-[1024px] relative">
            {/* LEFT PANEL: Profile Selection (25%) */}
            <div className="w-[25%] flex flex-col h-full min-h-0">
                {/* Title Section - Fixed Height to match Insight Cards (108px) */}
                <div className="mb-4 shrink-0 h-[108px] flex flex-col justify-center">
                    <h2 className="text-[22px] lg:text-[24px] font-bold text-[#002B7A] mb-2">단골 손님 유형 분석</h2>
                    <p className="text-[14px] lg:text-[15px] font-medium text-[#191F28] opacity-80 break-keep leading-relaxed">
                        우리 가게를 자주 찾는 <span className="text-[#002B7A] font-bold opacity-100 text-[15px] lg:text-[16px]">손님들이 누구인지</span>, <br />
                        <span className="text-[#002B7A] font-bold opacity-100 text-[15px] lg:text-[16px]">데이터로 꼼꼼하게 분석</span>해 드려요.
                    </p>
                </div>

                {/* Profile List - Aligned with Journey Map */}
                <div className="flex-1 flex flex-col gap-2 overflow-y-auto scrollbar-hide pb-2 relative">
                    <AnimatePresence mode='popLayout'>
                        {PERSONAS.map((persona, index) => {
                            if (selectedPersona && selectedPersona.id !== persona.id) {
                                return null;
                            }

                            const isSelected = selectedPersona?.id === persona.id;
                            const opacity = 0.15 - (index * 0.05);
                            const bgStyle = isSelected ? {} : { backgroundColor: `rgba(0, 43, 122, ${Math.max(opacity, 0.02)})` };

                            return (
                                <motion.div
                                    key={persona.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                    onClick={() => setSelectedPersona(isSelected ? null : persona)}
                                    className={`rounded-[24px] cursor-pointer border transition-colors overflow-hidden flex flex-col ${isSelected
                                        ? 'bg-[#002B7A] border-[#002B7A] shadow-xl ring-4 ring-[#002B7A]/10 h-full'
                                        : 'border-transparent hover:bg-[#002B7A]/10'
                                        }`}
                                    style={bgStyle}
                                >
                                    {/* Header Part - Compact Padding */}
                                    <motion.div layout="position" className="p-3 lg:p-3.5 flex items-center gap-3 shrink-0">
                                        <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden shrink-0 border ${isSelected ? 'border-white/20' : 'border-[#002B7A10] bg-white'}`}>
                                            <img src={persona.img} alt={persona.nickname} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className={`text-[15px] lg:text-[16px] font-bold ${isSelected ? 'text-white' : 'text-[#002B7A]'}`}>
                                                {persona.nickname}
                                            </h3>
                                            <div className="flex gap-1 mt-0.5 lg:mt-1">
                                                <span className={`text-[11px] lg:text-[12px] px-2 py-0.5 rounded-full ${isSelected ? 'text-white/80 bg-white/20' : 'text-[#002B7A]/70 bg-white/50'}`}>
                                                    {persona.tags[0]}
                                                </span>
                                            </div>
                                        </div>
                                        {isSelected ? (
                                            <ChevronDown size={20} className="text-white/60" />
                                        ) : (
                                            <ChevronRight size={20} className="text-[#002B7A]/40" />
                                        )}
                                    </motion.div>

                                    {/* Expanded Content (Detailed Card) */}
                                    <AnimatePresence>
                                        {isSelected && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                className="px-3 lg:px-4 pb-4 lg:pb-6 flex-1 flex flex-col min-h-0"
                                            >
                                                <div className="pt-3 lg:pt-4 border-t border-white/10 flex flex-col gap-3 lg:gap-4 flex-1 min-h-0">
                                                    {/* Summary Section */}
                                                    <div className="bg-white/10 rounded-xl p-3 lg:p-4 flex-1 flex items-center overflow-y-auto scrollbar-hide">
                                                        <p className="text-white/90 text-[13px] lg:text-[14px] leading-relaxed font-medium break-keep whitespace-pre-wrap">
                                                            "{persona.summary}"
                                                        </p>
                                                    </div>

                                                    {/* Visit Rate & Menu */}
                                                    <div className="flex flex-col gap-3 lg:gap-4 mt-auto shrink-0">
                                                        <div className="flex items-center justify-between gap-4">
                                                            <div className="flex-1">
                                                                <div className="flex justify-between items-end mb-1.5 lg:mb-2">
                                                                    <span className="text-xs lg:text-sm text-white/60">방문 비중</span>
                                                                    <span className="text-lg lg:text-xl font-bold text-[#FF5A36]">{persona.visitRate}%</span>
                                                                </div>
                                                                <div className="w-full h-2 lg:h-2.5 bg-white/20 rounded-full overflow-hidden">
                                                                    <motion.div
                                                                        initial={{ width: 0 }}
                                                                        animate={{ width: `${persona.visitRate}%` }}
                                                                        transition={{ delay: 0.2, duration: 0.8 }}
                                                                        className="h-full bg-[#FF5A36]"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="bg-white/10 rounded-xl p-3 flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-white/10 flex items-center justify-center text-white">
                                                                    <Utensils size={16} />
                                                                </div>
                                                                <div>
                                                                    <div className="text-[10px] lg:text-xs text-white/60 mb-0.5">가장 선호하는 메뉴</div>
                                                                    <div className="text-[14px] lg:text-[15px] font-bold text-white">{persona.stats.menu}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>

            {/* RIGHT PANEL: Insight & Journey (75%) */}
            <div className="w-[75%] flex flex-col h-full gap-3 min-h-0">
                {/* Top Row: Stats + CTA (Fixed Height 108px) */}
                <div className="flex gap-3 shrink-0 h-[108px]">
                    {/* Stats Cards (Ratio 4) */}
                    <div className="flex-[4] grid grid-cols-2 gap-2.5">
                        <div className="bg-white rounded-xl p-4 border border-[#002B7A]/5 hover:border-[#002B7A]/20 transition-all shadow-sm hover:shadow-md flex items-center gap-4 group px-5">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                                <ThumbsUp size={18} />
                            </div>
                            <div className="flex flex-col justify-center">
                                <div className="text-[11px] text-gray-500 mb-0.5">가장 원해요</div>
                                <div className="text-[15px] font-bold text-[#191F28] mb-1.5">볶음밥 양 칭찬</div>
                                <div className="flex gap-1">
                                    <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-medium">#시그니처</span>
                                    <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-medium">#푸짐</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-4 border border-[#002B7A]/5 hover:border-[#002B7A]/20 transition-all shadow-sm hover:shadow-md flex items-center gap-4 group px-5">
                            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors shrink-0">
                                <AlertCircle size={18} />
                            </div>
                            <div className="flex flex-col justify-center">
                                <div className="text-[11px] text-gray-500 mb-0.5">불편해요</div>
                                <div className="text-[15px] font-bold text-[#191F28] mb-1.5">대기 시간 불확실</div>
                                <div className="flex gap-1">
                                    <span className="text-[10px] text-red-600 bg-red-50 px-1.5 py-0.5 rounded font-medium">#웨이팅</span>
                                    <span className="text-[10px] text-red-600 bg-red-50 px-1.5 py-0.5 rounded font-medium">#주차</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA Card (Ratio 3 - Expanded Horizontal Layout) */}
                    <div className="flex-[3] bg-[#FFF4F1] rounded-[20px] px-6 py-4 border border-[#FF5A3620] shadow-sm flex items-center justify-between relative overflow-hidden group cursor-pointer hover:shadow-md transition-all"
                        onClick={() => onNavigate('promotion', { title: '단골 손님이 사랑하는 우리 가게 시그니처 메뉴', vibe: 'emotional' })}
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5A36] rounded-full blur-[50px] opacity-10 group-hover:opacity-20 transition-opacity"></div>

                        {/* Left: Text Content */}
                        <div className="flex flex-col justify-center relative z-10">
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className="bg-[#FF5A36] text-white text-[11px] font-bold px-2 py-0.5 rounded">홍보 영상</span>
                                <span className="text-[#FF5A36] text-[13px] font-bold">자동 제작</span>
                            </div>
                            <p className="text-[#191F28] font-bold text-[17px] leading-tight group-hover:text-[#FF5A36] transition-colors">
                                "{selectedPersona ? `${selectedPersona.nickname}님` : '손님'} 취향 저격 릴스,<br />AI가 만들어드려요!"
                            </p>
                        </div>

                        {/* Right: Action Button */}
                        <div className="bg-[#FF5A36] text-white px-5 py-2.5 rounded-full font-bold text-[14px] shadow-lg shadow-[#FF5A36]/30 group-hover:shadow-xl group-hover:shadow-[#FF5A36]/40 group-hover:-translate-y-0.5 transition-all flex items-center gap-1.5 relative z-10">
                            <span>바로 만들기</span>
                            <ChevronRight size={16} />
                        </div>
                    </div>
                </div>

                {/* Main: Horizontal Journey Map (Expanded) */}
                <div className="bg-white rounded-[24px] p-5 lg:p-6 shadow-sm flex-1 flex flex-col relative overflow-hidden border border-[#002B7A05] min-h-0">
                    {/* Header */}
                    <div className="flex justify-between items-end mb-6 shrink-0 gap-3">
                        <div className="flex items-end gap-3 min-w-0">
                            <h3 className="text-[20px] font-bold text-[#002B7A] flex items-center gap-2 shrink-0">
                                <span className="w-1.5 h-6 bg-[#002B7A] rounded-full inline-block shrink-0"></span>
                                <span className="truncate">{selectedPersona ? `${selectedPersona.nickname} 유형의 방문여정` : '방문 여정'}</span>
                            </h3>
                            <p className="text-[13px] font-medium text-gray-500 pb-1 truncate">
                                손님이 우리 가게를 경험하는 모든 과정을 분석했어요.
                            </p>
                        </div>
                        {selectedPersona && (
                            <button className="flex items-center gap-1.5 text-[13px] font-bold text-[#002B7A] bg-[#F5F7FA] px-4 py-2 rounded-full hover:bg-[#002B7A10] transition-colors shrink-0">
                                <Search size={14} />
                                자세히 보기
                            </button>
                        )}
                    </div>

                    {/* Horizontal Steps - Spacious Layout */}
                    <div className="flex-1 flex items-center relative px-4 min-h-0">
                        {selectedPersona ? (
                            <>
                                {/* Connecting Line */}
                                <div className="absolute top-[35%] left-12 right-12 h-[2px] bg-gray-100 -z-10" />

                                <div className="w-full flex justify-between gap-4">
                                    <HorizontalJourneyStep
                                        step="탐색"
                                        data={selectedPersona.journey.explore}
                                        icon="🔍"
                                        isActive={true}
                                    />
                                    <HorizontalJourneyStep
                                        step="방문"
                                        data={selectedPersona.journey.visit}
                                        icon="🏃"
                                        isActive={true}
                                    />
                                    <HorizontalJourneyStep
                                        step="식사"
                                        data={selectedPersona.journey.eat}
                                        icon="🍽️"
                                        isActive={true}
                                    />
                                    <HorizontalJourneyStep
                                        step="공유"
                                        data={selectedPersona.journey.share}
                                        icon="🗣️"
                                        isActive={true}
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-center opacity-60">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                    <User size={32} className="text-gray-400" />
                                </div>
                                <h3 className="text-lg font-bold text-[#191F28] mb-1">손님 유형을 선택해 주세요</h3>
                                <p className="text-sm text-gray-500">좌측 목록에서 손님을 선택하면<br />상세한 방문 여정을 확인할 수 있어요.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Floating Action Button (FAB) for Chat */}
            {/* Chat Window (Popover) */}
            <AnimatePresence>
                {isChatOpen && (
                    <ChatWindow
                        selectedPersona={selectedPersona}
                        onClose={() => setIsChatOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Floating Action Button (FAB) - Only visible when chat is closed */}
            <AnimatePresence>
                {!isChatOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute bottom-2 right-6 flex items-end gap-3 z-50"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        {/* Tooltip Label */}
                        <AnimatePresence>
                            {isHovered && (
                                <motion.div
                                    initial={{ opacity: 0, x: 10, scale: 0.9 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: 10, scale: 0.9 }}
                                    className="bg-white px-4 py-2 rounded-full shadow-md border border-gray-100 text-xs font-bold text-[#002B7A] flex items-center gap-1.5 mb-4"
                                >
                                    <span>AI에게 질문하기</span>
                                    <div className="w-2 h-2 bg-[#FF5A36] rounded-full animate-pulse"></div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsChatOpen(true)}
                            className="w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white bg-[#002B7A] hover:bg-[#001F5C] transition-colors mb-4"
                        >
                            <MessageCircle size={24} />
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function InsightCard({ icon, title, tags, desc, color }) {
    const colors = {
        blue: { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'text-blue-600' },
        red: { bg: 'bg-red-50', text: 'text-red-600', icon: 'text-red-600' },
        indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', icon: 'text-indigo-600' },
    };
    const c = colors[color] || colors.blue;

    return (
        <div className="bg-white rounded-[20px] p-3 shadow-sm flex flex-col h-full border border-gray-100 justify-between">
            <div>
                <div className="flex items-center gap-1.5 mb-1">
                    <div className={`w-7 h-7 rounded-full ${c.bg} flex items-center justify-center shrink-0`}>
                        {React.cloneElement(icon, { size: 16, className: c.icon })}
                    </div>
                    <h4 className="font-bold text-[14px] text-[#191F28] truncate">{title}</h4>
                </div>
                <div className="flex flex-wrap gap-1">
                    {tags.map((tag, i) => (
                        <span key={i} className="text-[11px] font-medium text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded-lg">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
            <div className="pt-1.5 border-t border-gray-50 mt-1">
                <p className="text-[13px] font-bold text-blue-500 truncate">{desc}</p>
            </div>
        </div>
    );
}

function HorizontalJourneyStep({ step, data, icon, isActive }) {
    const getTypeIcon = (type) => {
        if (type === 'good') return <Smile size={14} />;
        if (type === 'pain') return <Frown size={14} />;
        return null;
    };

    return (
        <div className={`flex flex-col items-center text-center gap-3 w-1/4 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-50'}`}>
            <div className="w-12 h-12 rounded-[18px] bg-[#F5F7FA] flex items-center justify-center text-xl shadow-sm z-10 shrink-0 border border-white relative">
                {icon}
                {data?.type && data.type !== 'neutral' && (
                    <div className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm ${data.type === 'good' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                        {getTypeIcon(data.type)}
                    </div>
                )}
            </div>
            <div className="w-full px-1">
                <h5 className="font-bold text-[#191F28] text-[14px] mb-1">{step}</h5>
                <p className="text-[12px] text-gray-500 leading-snug break-keep min-h-[36px]">
                    {data?.text || "데이터 없음"}
                </p>
                {data?.detail && (
                    <div className={`mt-1.5 text-[11px] font-bold px-2 py-0.5 rounded-lg inline-block ${data.type === 'good' ? 'bg-blue-50 text-blue-600' : data.type === 'pain' ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-500'}`}>
                        {data.detail}
                    </div>
                )}
            </div>
        </div>
    );
}

function SuggestionChip({ text }) {
    return (
        <button className="shrink-0 px-3 py-1.5 bg-white hover:bg-[#002B7A]/5 rounded-full text-[12px] text-[#002B7A] transition-colors border border-[#002B7A]/10 shadow-sm">
            {text}
        </button>
    );
}

function ChatWindow({ selectedPersona, onClose }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[108px] bottom-4 right-6 w-[380px] bg-white rounded-[24px] shadow-2xl border border-gray-100 flex flex-col overflow-hidden z-50"
        >
            {/* Header */}
            <div className="bg-[#002B7A] p-5 shrink-0 flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shadow-sm text-white backdrop-blur-sm border border-white/20">
                        <Sparkles size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-white">{selectedPersona ? `${selectedPersona.nickname} 유형 분석중` : '손님 유형 분석'}</h3>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Body */}
            <div className="flex-1 bg-[#F5F7FA] p-4 overflow-y-auto flex flex-col gap-4">
                {/* Onboarding Message */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                        <HelpCircle size={16} className="text-[#002B7A]" />
                        <h4 className="font-bold text-sm text-[#191F28]">AI에게 무엇을 물어볼까요?</h4>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed mb-3">
                        단순한 데이터 조회를 넘어, <span className="font-bold text-[#002B7A]">구체적인 실행 전략</span>을 제안해 드립니다.
                    </p>
                    <div className="flex flex-col gap-2">
                        {selectedPersona ? (
                            <>
                                <button className="text-left text-xs bg-[#F5F7FA] p-2.5 rounded-xl hover:bg-[#E5EDFF] hover:text-[#002B7A] transition-colors font-medium">
                                    🍽️ {selectedPersona.nickname}님이 좋아할 신메뉴 추천해줘
                                </button>
                                <button className="text-left text-xs bg-[#F5F7FA] p-2.5 rounded-xl hover:bg-[#E5EDFF] hover:text-[#002B7A] transition-colors font-medium">
                                    🎫 재방문을 유도할 쿠폰 문구 써줘
                                </button>
                            </>
                        ) : (
                            <>
                                <button className="text-left text-xs bg-[#F5F7FA] p-2.5 rounded-xl hover:bg-[#E5EDFF] hover:text-[#002B7A] transition-colors font-medium">
                                    📈 우리 가게 매출을 올릴 방법이 있을까?
                                </button>
                                <button className="text-left text-xs bg-[#F5F7FA] p-2.5 rounded-xl hover:bg-[#E5EDFF] hover:text-[#002B7A] transition-colors font-medium">
                                    👥 20대 손님을 더 많이 모으려면?
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <ChatMessage isAi={true} text={selectedPersona
                    ? `안녕하세요 사장님! '${selectedPersona.nickname}' 손님에 대해 어떤 점이 궁금하신가요?`
                    : "좌측 목록에서 손님 유형을 선택해주세요."}
                />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="질문을 입력하세요..."
                        className="w-full bg-[#F5F7FA] border-none rounded-2xl px-4 py-3 text-[#191F28] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#002B7A]/10 transition-all pr-10 text-sm"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#002B7A] rounded-xl hover:bg-[#001F5C] transition-colors shadow-md">
                        <Send size={14} className="text-white" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

function ChatMessage({ isAi, text }) {
    return (
        <div className={`flex ${isAi ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-[13px] leading-relaxed shadow-sm ${isAi
                ? 'bg-white text-[#191F28] rounded-tl-none border border-gray-100'
                : 'bg-[#002B7A] text-white rounded-tr-none'
                }`}>
                {text}
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
