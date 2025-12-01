import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MessageCircle, ThumbsUp, AlertCircle, Lightbulb, ChevronRight, User, Send, Zap, ChevronDown, Frown, Smile, Clock, Wallet, Utensils, Calendar, Clapperboard } from 'lucide-react';
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

    return (
        <div className="flex h-full gap-3 lg:gap-4 p-2 overflow-hidden min-w-[1024px]">
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

            {/* CENTER PANEL: Journey & Strategy (45%) */}
            <div className="w-[45%] flex flex-col h-full gap-3 min-h-0">
                {/* 3 Insight Cards - Fixed Height 108px */}
                <div className="grid grid-cols-3 gap-2.5 shrink-0 h-[108px]">
                    <InsightCard
                        icon={<ThumbsUp size={18} />}
                        title="가장 원해요"
                        tags={["#시그니처", "#푸짐"]}
                        desc="볶음밥 양 칭찬"
                        color="blue"
                    />
                    <InsightCard
                        icon={<AlertCircle size={18} />}
                        title="불편해요"
                        tags={["#웨이팅", "#주차"]}
                        desc="대기 시간 불확실"
                        color="red"
                    />
                    <InsightCard
                        icon={<Lightbulb size={18} />}
                        title="먹히는 콘텐츠"
                        tags={["#조리", "#ASMR"]}
                        desc="지글지글 영상"
                        color="indigo"
                    />
                </div>

                {/* Horizontal Journey Map - Compact */}
                <div className="bg-white rounded-[24px] p-4 lg:p-5 shadow-sm flex-1 flex flex-col relative overflow-hidden border border-[#002B7A05] min-h-0">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4 shrink-0 gap-3">
                        <h3 className="text-[18px] font-bold text-[#002B7A] flex items-center gap-2 min-w-0">
                            <span className="w-1.5 h-5 bg-[#002B7A] rounded-full inline-block shrink-0"></span>
                            <span className="truncate">{selectedPersona ? `${selectedPersona.nickname}님의 방문 여정` : '방문 여정'}</span>
                        </h3>
                        {selectedPersona && (
                            <button className="flex items-center gap-1.5 text-[12px] font-bold text-[#002B7A] bg-[#F5F7FA] px-3 py-1.5 rounded-full hover:bg-[#002B7A10] transition-colors shrink-0">
                                <Search size={14} />
                                자세히 보기
                            </button>
                        )}
                    </div>

                    {/* Horizontal Steps */}
                    <div className="flex-1 flex items-center relative px-2 min-h-0">
                        {/* Connecting Line */}
                        <div className="absolute top-[35%] left-8 right-8 h-[2px] bg-gray-100 -z-10" />

                        <div className="w-full flex justify-between">
                            <HorizontalJourneyStep
                                step="탐색"
                                data={selectedPersona?.journey.explore}
                                icon="🔍"
                                isActive={!!selectedPersona}
                            />
                            <HorizontalJourneyStep
                                step="방문"
                                data={selectedPersona?.journey.visit}
                                icon="🏃"
                                isActive={!!selectedPersona}
                            />
                            <HorizontalJourneyStep
                                step="식사"
                                data={selectedPersona?.journey.eat}
                                icon="🍽️"
                                isActive={!!selectedPersona}
                            />
                            <HorizontalJourneyStep
                                step="공유"
                                data={selectedPersona?.journey.share}
                                icon="🗣️"
                                isActive={!!selectedPersona}
                            />
                        </div>
                    </div>

                    {/* AI Strategy Button */}
                    <div className="mt-4 pt-4 border-t border-gray-100 shrink-0">
                        <div className="flex items-center justify-between bg-[#FFF4F1] rounded-xl p-3 border border-[#FF5A3620] shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                            <div className="flex-1 min-w-0 mr-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="bg-[#FF5A36] text-white text-[10px] font-bold px-2 py-0.5 rounded">AI 릴스</span>
                                    <span className="text-[#FF5A36] text-[12px] font-bold">자동 제작</span>
                                </div>
                                <p className="text-[#191F28] font-bold text-[14px] truncate group-hover:text-[#FF5A36] transition-colors">
                                    "{selectedPersona ? `${selectedPersona.nickname}님` : '손님'} 취향 저격 릴스, AI가 만들어드려요!"
                                </p>
                            </div>
                            <button
                                onClick={() => onNavigate('promotion', { title: '단골 손님이 사랑하는 우리 가게 시그니처 메뉴', vibe: 'emotional' })}
                                className="bg-[#FF5A36] text-white px-4 py-2.5 rounded-xl font-bold text-[12px] hover:bg-[#FF5A36]/90 transition-all shadow-sm hover:translate-y-[-2px] flex items-center gap-1.5 whitespace-nowrap shrink-0"
                            >
                                <Clapperboard size={14} className="fill-current" />
                                홍보 영상 만들기
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL: Vertical Chat (30%) */}
            <div className="w-[30%] flex flex-col h-full min-h-0 rounded-[24px] overflow-hidden shadow-sm border border-[#002B7A05]">
                {/* Header - Main Blue */}
                <div className="bg-[#002B7A] p-5 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shadow-sm text-white backdrop-blur-sm">
                            <MessageCircle size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-white">직접 물어보기</h3>
                            <p className="text-xs text-white/60">AI에게 궁금한 점을 질문하세요</p>
                        </div>
                    </div>
                </div>

                {/* Body - Light Blue */}
                <div className="flex-1 bg-[#002B7A1A] p-5 flex flex-col relative overflow-hidden">
                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto scrollbar-hide mb-4 z-10 flex flex-col gap-3 min-h-0">
                        <ChatMessage isAi={true} text="안녕하세요 사장님! 오늘 분석된 손님 유형에 대해 궁금한 점이 있으신가요?" />
                        {selectedPersona && (
                            <ChatMessage isAi={true} text={`'${selectedPersona.nickname}' 손님을 공략하기 위한 팁을 알려드릴까요?`} />
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="mt-auto z-10 shrink-0">
                        <div className="flex flex-wrap gap-2 mb-3">
                            <SuggestionChip text="시그니처 메뉴 추천" />
                            <SuggestionChip text="쿠폰 문구 작성" />
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="무엇이든 물어보세요..."
                                className="w-full bg-white border border-[#002B7A]/10 rounded-2xl px-4 py-3 text-[#002B7A] placeholder-[#002B7A]/40 focus:outline-none focus:border-[#002B7A]/30 transition-colors pr-10 text-sm shadow-sm"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#FF5A36] rounded-xl hover:bg-[#FF5A36]/90 transition-colors shadow-lg">
                                <Send size={16} className="text-white" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
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

function ChatMessage({ isAi, text }) {
    return (
        <div className={`flex ${isAi ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-[14px] leading-relaxed shadow-sm ${isAi
                ? 'bg-white text-[#002B7A] rounded-tl-none'
                : 'bg-[#FF5A36] text-white rounded-tr-none'
                }`}>
                {text}
            </div>
        </div>
    );
}
