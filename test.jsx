import React, { useState, useEffect, useRef } from 'react';
import {
    Home,
    BarChart2,
    MessageCircle,
    PlayCircle,
    Users,
    Bell,
    MoreHorizontal,
    Sparkles,
    Utensils,
    Clock,
    ThumbsUp,
    AlertCircle,
    ChevronRight,
    ChevronDown,
    Beer,
    Heart,
    X,
    Send,
    MapPin,
    TrendingUp,
    Briefcase,
    User,
    ArrowLeft,
    Quote,
    Info,
    FileText,
    Lightbulb,
    Clapperboard,
    CheckCircle2,
    Calendar,
    ArrowUpRight,
    Eye,
    Bookmark,
    Share2,
    CloudRain,
    Settings,
    CreditCard,
    LogOut,
    Instagram,
    Globe,
    MessageSquare,
    HelpCircle,
    Sun,
    Smile,
    Frown,
    Zap
} from 'lucide-react';

/* PULSE Design System - Color Constants */
const COLORS = {
    primary: '#002B7A',       // Main Blue
    primaryText: '#191F28',   // Main Text
    secondaryText: '#002B7ACC', // Sub Text
    bgPage: '#F5F7FA',        // Page Background
    bgCard: '#FFFFFF',        // Card Background
    point: '#FF5A36CC',       // Orange (Strong Point)
    pointHover: '#FF5A3633',
    pointTint: '#FF5A361A',   // Badge Background
    border: '#002B7A66',      // Borders
    shadow: '#002B7A1A',      // Soft Shadow
    success: '#059669',       // Success Green
    warning: '#D97706',       // Warning Amber
};

/* Custom CSS */
const customStyles = `
  .font-pretendard {
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
  }

  /* Sidebar Container Transition */
  .sidebar-container {
    transition: width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    background-color: ${COLORS.primary};
    overflow: hidden;
    box-shadow: 4px 0 24px rgba(0, 43, 122, 0.15);
  }

  /* Main Content Layout Transition */
  .main-content {
    transition: margin-left 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  /* Menu Item Base Style */
  .menu-item {
    position: relative;
    display: flex;
    align-items: center;
    height: 56px;
    margin-bottom: 4px;
    color: rgba(255, 255, 255, 0.6);
    transition: all 0.2s ease;
    cursor: pointer;
    white-space: nowrap;
    border-top-left-radius: 30px;
    border-bottom-left-radius: 30px;
    /* Default collapsed state: Center icons */
    justify-content: center; 
    padding-left: 0;
  }

  /* Expanded State Alignment */
  .sidebar-expanded .menu-item {
    justify-content: flex-start;
    padding-left: 28px; /* Exact alignment for 260px width */
  }

  .menu-item:hover {
    color: white;
  }

  .menu-item.active {
    background-color: ${COLORS.bgPage};
    color: ${COLORS.primary};
    font-weight: 700;
  }

  .menu-item.active::before {
    content: '';
    position: absolute;
    top: -30px;
    right: 0;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    box-shadow: 15px 15px 0 ${COLORS.bgPage};
    pointer-events: none;
    z-index: 10;
  }

  .menu-item.active::after {
    content: '';
    position: absolute;
    bottom: -30px;
    right: 0;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    box-shadow: 15px -15px 0 ${COLORS.bgPage};
    pointer-events: none;
    z-index: 10;
  }
  
  /* Icon Container Stability */
  .menu-icon {
    min-width: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* Text Fade Transition */
  .menu-label {
    opacity: 0;
    width: 0;
    transform: translateX(10px);
    transition: all 0.3s ease;
    pointer-events: none;
    overflow: hidden;
  }
  
  .sidebar-expanded .menu-label {
    opacity: 1;
    width: auto;
    margin-left: 16px;
    transform: translateX(0);
    pointer-events: auto;
  }

  .logo-text {
    max-width: 0;
    opacity: 0;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  }
  .sidebar-expanded .logo-text {
    max-width: 200px;
    opacity: 1;
    margin-left: 12px;
  }

  /* Hide Scrollbar but keep functionality */
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  /* Chat Animation */
  .fade-in-up {
    animation: fadeInUp 0.3s ease-out forwards;
  }
  
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

// ... (Previous Mock Data & Components: PERSONA_DATA, LOCAL_DATA, InlineChatInterface, Sidebar, TabNavigation, InsightCard, PersonaSection, LocalAnalysisSection, PerformanceDetailModal)
// Only re-declaring MyPage and DashboardHome as they are the focus of this update. 
// The rest are assumed to be present as in the previous file state.

// Re-declaring Sidebar, Header etc. for full file context if needed, but focusing on the DashboardHome update.
// ... (Include all previous components here to ensure runnable code)

// --- SHARED COMPONENTS START ---
// (These are identical to the previous version, included for completeness)
const PERSONA_DATA = [
    {
        id: 0,
        name: "최윤하",
        role: "미식가 직장인",
        icon: "👩‍💼",
        goal: "특별한 보상 같은 메뉴 경험",
        painPoint: "긴 웨이팅, 불확실한 예약",
        share: 45,
        keywords: ["시그니처메뉴", "비주얼"],
        topKeywords: ["볶음밥", "플레이팅", "사진맛집", "데이트"],
        representativeReview: "웨이팅만 없다면 매일 가고 싶어요. 볶음밥 비주얼이 미쳤고 사진 찍기 너무 좋아요!",
        chatGreeting: "안녕하세요 사장님! 저는 맛있는 건 못 참는 최윤하예요. 웨이팅만 없다면 친구들 다 데리고 갈게요!",
        journey: [
            { step: '탐색', icon: <Sparkles size={18} />, status: 'good', text: '인스타 비주얼 보고 기대감 상승!' },
            { step: '방문', icon: <Clock size={18} />, status: 'bad', text: '웨이팅 안내가 없어 답답함' },
            { step: '식사', icon: <Utensils size={18} />, status: 'good', text: '푸짐한 양에 감동받음' },
            { step: '공유', icon: <ThumbsUp size={18} />, status: 'neutral', text: '태그 이벤트 몰라서 참여 못함' },
        ]
    },
    {
        id: 1,
        name: "박준혁",
        role: "이자카야 애호가",
        icon: "🧔",
        goal: "편안한 술자리 분위기",
        painPoint: "대화가 힘든 시끄러운 소음",
        share: 30,
        keywords: ["하이볼", "분위기"],
        topKeywords: ["조용한", "대화하기좋은", "하이볼맛집", "안주"],
        representativeReview: "친구랑 조용히 얘기 나누기 딱 좋아요. 하이볼도 맛있고 분위기가 아늑해서 자주 찾게 되네요.",
        chatGreeting: "반갑습니다. 친구들이랑 조용히 한잔할 곳을 찾고 있어요. 안주 맛도 중요하지만 분위기가 제일 중요하죠.",
        journey: [
            { step: '탐색', icon: <Beer size={18} />, status: 'neutral', text: '네이버 "조용한 술집" 검색' },
            { step: '방문', icon: <Users size={18} />, status: 'good', text: '4인석 자리가 넉넉함' },
            { step: '식사', icon: <Utensils size={18} />, status: 'bad', text: '옆 테이블 소음 심함' },
            { step: '공유', icon: <Heart size={18} />, status: 'good', text: '인스타 스토리에 업로드' },
        ]
    },
    {
        id: 2,
        name: "김서연",
        role: "서비스 중시형",
        icon: "👩‍🦰",
        goal: "친절하고 세심한 대접",
        painPoint: "불친절한 직원 태도",
        share: 25,
        keywords: ["친절", "서비스"],
        topKeywords: ["사장님최고", "친절해요", "재방문", "센스"],
        representativeReview: "사장님이 너무 친절하셔서 기분 좋게 식사했어요. 바쁘신데도 계속 챙겨주셔서 감동받았습니다.",
        chatGreeting: "안녕하세요~ 사장님이 친절하다는 리뷰 보고 왔어요! 기분 좋은 식사가 되면 좋겠네요.",
        journey: [
            { step: '탐색', icon: <MessageCircle size={18} />, status: 'good', text: '리뷰 "친절해요" 문구 확인' },
            { step: '방문', icon: <Users size={18} />, status: 'neutral', text: '입장 시 인사가 없었음' },
            { step: '식사', icon: <Utensils size={18} />, status: 'good', text: '물 리필이 빨라서 좋았음' },
            { step: '공유', icon: <ThumbsUp size={18} />, status: 'good', text: '영수증 리뷰 별 5개 남김' },
        ]
    }
];

const LOCAL_DATA = {
    areaName: "범계역 로데오거리",
    type: "직장인 점심 & 저녁 회식 상권",
    badges: ["#오피스상권", "#2030유동인구", "#회식명소"],
    peakTime: "금요일 19:00 - 22:00",
    peakTimeDesc: "평일 점심(11:30~13:00)과 금요일 저녁이 가장 붐벼요.",
    keywords: [
        { text: "가성비", value: 85 },
        { text: "단체석", value: 72 },
        { text: "빠른서빙", value: 64 },
        { text: "혼밥", value: 45 },
        { text: "주차가능", value: 30 }
    ],
    strategy: {
        title: "점심엔 '스피드', 저녁엔 '가성비 세트'",
        desc: "직장인 점심 경쟁이 치열해요. '3분 완성 점심 메뉴' 릴스를 추천해요."
    }
};

const InlineChatInterface = ({ persona, onClose }) => {
    const [messages, setMessages] = useState([
        { type: 'bot', text: persona.chatGreeting }
    ]);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!inputText.trim()) return;
        setMessages([...messages, { type: 'user', text: inputText }]);
        setInputText('');

        setTimeout(() => {
            setMessages(prev => [...prev, { type: 'bot', text: `사장님, '${inputText}'에 대해 말씀드리자면... (AI가 답변을 생성중입니다)` }]);
        }, 1000);
    };

    return (
        <div className="flex flex-col h-full bg-[#F5F7FA] rounded-2xl overflow-hidden fade-in-up">
            {/* Chat Header */}
            <div className="bg-[#002B7A] p-4 flex items-center justify-between text-white shrink-0">
                <div className="flex items-center gap-3">
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-lg">
                            {persona.icon}
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">{persona.name}</h3>
                            <p className="text-[10px] text-white/70">현재 대화 가능</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-white/50">
                <div className="text-center text-[10px] text-gray-400 my-1">
                    오늘 {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>

                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div
                            className={`max-w-[85%] p-3 rounded-2xl text-[13px] leading-relaxed shadow-sm ${msg.type === 'user'
                                    ? 'bg-[#002B7A] text-white rounded-tr-none'
                                    : 'bg-white text-[#191F28] rounded-tl-none border border-gray-100'
                                }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Recommendation Chips */}
            <div className="px-4 py-2 bg-white border-t border-gray-50 flex gap-2 overflow-x-auto shrink-0 scrollbar-hide">
                <button className="whitespace-nowrap px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-[11px] text-[#002B7A] font-medium hover:bg-blue-50">
                    웨이팅이 왜 싫어요?
                </button>
                <button className="whitespace-nowrap px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-[11px] text-[#002B7A] font-medium hover:bg-blue-50">
                    좋아하는 메뉴는?
                </button>
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-gray-100 shrink-0">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="궁금한 점을 물어보세요..."
                        className="flex-1 bg-gray-50 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#002B7A]/20"
                    />
                    <button
                        onClick={handleSend}
                        className="p-2.5 bg-[#FF5A36] rounded-xl hover:bg-[#FF5A36]/90 transition-colors shadow-sm flex items-center justify-center"
                    >
                        <Send size={16} color="white" />
                    </button>
                </div>
            </div>
        </div>
    );
};

const Sidebar = ({ activeMenu, setActiveMenu, isExpanded, setIsExpanded }) => {
    const menus = [
        { id: 'home', icon: <Home size={24} />, label: '오늘의 장사 비서' },
        { id: 'insight', icon: <BarChart2 size={24} />, label: '손님 마음 읽기' },
        { id: 'review', icon: <MessageCircle size={24} />, label: '리뷰 관리 & 답변' },
        { id: 'promotion', icon: <PlayCircle size={24} />, label: '홍보 영상 만들기' },
        { id: 'expert', icon: <Users size={24} />, label: '홍보 전문가에게 맡기기' },
        { id: 'mypage', icon: <Settings size={24} />, label: '마이페이지' },
    ];

    return (
        <div
            className={`fixed top-4 bottom-4 left-4 z-50 rounded-[30px] flex flex-col py-8 sidebar-container ${isExpanded ? 'w-[260px] sidebar-expanded' : 'w-[80px]'
                }`}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            <div className="px-5 mb-12 flex items-center h-10 overflow-hidden shrink-0">
                <div className="min-w-[40px] h-10 bg-white rounded-xl flex items-center justify-center text-xl font-bold text-[#002B7A] shadow-md z-10">
                    P
                </div>
                <h1 className="text-2xl font-bold text-white tracking-wide whitespace-nowrap logo-text">
                    PULSE
                </h1>
            </div>

            <div className="flex-1 flex flex-col gap-2 overflow-y-auto scrollbar-hide">
                {menus.map((menu) => (
                    <button
                        key={menu.id}
                        onClick={() => setActiveMenu(menu.id)}
                        className={`menu-item w-full ${activeMenu === menu.id ? 'active' : ''}`}
                    >
                        <div className="menu-icon">
                            {menu.icon}
                        </div>
                        <span className="menu-label text-[17px] font-medium">
                            {menu.label}
                        </span>
                    </button>
                ))}
            </div>

            {/* Profile Section */}
            <div className="mb-4 shrink-0">
                <div
                    className={`relative flex items-center h-14 transition-all duration-200 cursor-pointer ${isExpanded ? 'pl-[28px] justify-start' : 'justify-center'
                        }`}
                    onClick={() => setActiveMenu('mypage')}
                >
                    {/* Profile Icon */}
                    <div className="menu-icon">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center border border-white/10">
                            <User size={16} className="text-white" />
                        </div>
                    </div>

                    {/* Text Container */}
                    <div className={`flex flex-col justify-center overflow-hidden transition-all duration-300 ${isExpanded ? 'opacity-100 max-w-[150px] ml-4' : 'opacity-0 max-w-0 ml-0'
                        }`}>
                        <p className="text-white text-sm font-medium leading-none mb-1">박사장님</p>
                        <p className="text-white/50 text-xs leading-none">Premium</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Header = ({ title }) => (
    <header className="flex justify-between items-center mb-3 pl-2 shrink-0">
        <div>
            <h1 style={{ color: COLORS.primary }} className="text-[26px] font-bold leading-tight mb-0.5">
                범계 로데오점 사장님, 안녕하세요!
            </h1>
            <p style={{ color: COLORS.primaryText }} className="text-[15px] opacity-70">
                {title}
            </p>
        </div>

        <button className="relative p-2.5 rounded-xl bg-white shadow-sm hover:bg-gray-50 transition-colors">
            <Bell size={22} color={COLORS.primary} />
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.point }}></span>
        </button>
    </header>
);

const TabNavigation = ({ activeTab, setActiveTab }) => (
    <div className="flex justify-center mb-4 shrink-0">
        <div className="bg-[#E8EEF5] p-1 rounded-full flex relative">
            <button
                onClick={() => setActiveTab('persona')}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 relative z-10 ${activeTab === 'persona' ? 'bg-white text-[#002B7A] shadow-sm' : 'text-gray-400 hover:text-gray-600'
                    }`}
            >
                단골 손님 유형 분석
            </button>
            <button
                onClick={() => setActiveTab('local')}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 relative z-10 ${activeTab === 'local' ? 'bg-white text-[#002B7A] shadow-sm' : 'text-gray-400 hover:text-gray-600'
                    }`}
            >
                우리 동네 상권 분석
            </button>
        </div>
    </div>
);

const InsightCard = ({ title, icon: Icon, tags, highlight, type }) => {
    const isNegative = type === 'negative';

    return (
        <div
            className="flex-1 rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 flex flex-col min-h-0"
            style={{ backgroundColor: COLORS.bgCard, boxShadow: `0 4px 12px ${COLORS.shadow}` }}
        >
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${isNegative ? 'bg-red-50' : 'bg-blue-50'}`}>
                        <Icon size={18} color={isNegative ? '#EF4444' : COLORS.primary} />
                    </div>
                    <h3 className="text-[16px] font-bold" style={{ color: COLORS.primaryText }}>{title}</h3>
                </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-2">
                {tags.map((tag, i) => (
                    <span
                        key={i}
                        className="px-2 py-0.5 rounded-md text-[12px] font-medium"
                        style={{
                            backgroundColor: isNegative ? '#FEF2F2' : COLORS.bgPage,
                            color: isNegative ? '#EF4444' : COLORS.secondaryText
                        }}
                    >
                        #{tag}
                    </span>
                ))}
            </div>

            <div className="pt-2 border-t border-gray-100 mt-auto">
                <p className="text-[13px] leading-snug">
                    <span className="font-bold" style={{ color: isNegative ? '#EF4444' : COLORS.primary }}>
                        {highlight}
                    </span>
                </p>
            </div>
        </div>
    );
};

const PersonaSection = () => {
    const [activePersonaId, setActivePersonaId] = useState(0);
    const [showEvidence, setShowEvidence] = useState(false);
    const [isChatMode, setIsChatMode] = useState(false);

    // Reset states when changing persona
    useEffect(() => {
        setIsChatMode(false);
        setShowEvidence(false);
    }, [activePersonaId]);

    const activePersona = PERSONA_DATA[activePersonaId];

    return (
        <div className="flex flex-col gap-4 flex-1 min-h-0 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden">

            {/* 3 Key Insight Cards (Compact) */}
            <div className="grid grid-cols-3 gap-3 shrink-0">
                <InsightCard
                    title="손님들이 가장 원해요"
                    icon={ThumbsUp}
                    tags={['시그니처메뉴', '푸짐한양', '가성비']}
                    highlight="'볶음밥' 양 칭찬 24% 증가"
                    type="positive"
                />
                <InsightCard
                    title="이런 점은 불편해해요"
                    icon={AlertCircle}
                    tags={['웨이팅정보', '주차공간', '소음']}
                    highlight="웨이팅 시간의 불확실성 싫어함"
                    type="negative"
                />
                <InsightCard
                    title="이런 콘텐츠가 먹혀요"
                    icon={Lightbulb}
                    tags={['조리과정', 'ASMR', '퇴근길감성']}
                    highlight="'지글지글' 조리 영상 인기"
                    type="neutral"
                />
            </div>

            {/* Persona Selector Tabs */}
            <div className="flex gap-3 shrink-0">
                {PERSONA_DATA.map((persona) => (
                    <button
                        key={persona.id}
                        onClick={() => setActivePersonaId(persona.id)}
                        className={`flex-1 p-2.5 rounded-xl border transition-all duration-200 flex items-center justify-center gap-2 ${activePersonaId === persona.id
                                ? 'border-[#002B7A] bg-white shadow-sm'
                                : 'border-transparent bg-white/50 hover:bg-white'
                            }`}
                    >
                        <div className="text-lg">{persona.icon}</div>
                        <div className="text-left">
                            <p className={`text-[10px] font-bold ${activePersonaId === persona.id ? 'text-[#002B7A]' : 'text-gray-400'}`}>
                                Type {persona.id + 1}
                            </p>
                            <p className={`text-sm font-bold ${activePersonaId === persona.id ? 'text-[#191F28]' : 'text-gray-500'}`}>
                                {persona.name}
                            </p>
                        </div>
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-12 gap-4 flex-1 min-h-0 overflow-hidden relative">
                {/* Selected Persona Detail or Chat Interface */}
                <div className="col-span-4 rounded-2xl overflow-hidden relative shadow-lg flex flex-col min-h-0 z-20" style={{ backgroundColor: COLORS.primary }}>
                    {isChatMode ? (
                        // INLINE CHAT VIEW
                        <InlineChatInterface persona={activePersona} onClose={() => setIsChatMode(false)} />
                    ) : (
                        // DEFAULT PROFILE VIEW
                        <>
                            <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>

                            <div className="p-5 h-full flex flex-col text-white relative z-10">
                                <div className="flex items-center justify-between mb-3 shrink-0">
                                    <span className="px-2 py-0.5 rounded-full bg-white/20 text-[11px] font-medium backdrop-blur-sm border border-white/10">
                                        프로필 & 특징
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 mb-4 shrink-0">
                                    <div className="w-14 h-14 rounded-full bg-[#F5F7FA] border-4 border-white/20 flex items-center justify-center text-2xl overflow-hidden shadow-inner">
                                        {activePersona.icon}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold mb-0.5">{activePersona.name}</h2>
                                        <p className="text-white/70 text-xs">{activePersona.role}</p>
                                    </div>
                                </div>

                                <div className="space-y-2 flex-1 min-h-0 flex flex-col">
                                    <div className="bg-white/5 p-3 rounded-xl border border-white/5 shrink-0">
                                        <p className="text-white/60 text-[11px] mb-0.5 font-medium">방문 목적</p>
                                        <p className="text-sm font-medium leading-snug">"{activePersona.goal}"</p>
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex flex-col flex-1 min-h-0">
                                        <p className="text-white/60 text-[11px] mb-0.5 font-medium">가장 불편해하는 점</p>
                                        <div className="flex items-start gap-1.5 text-[#FFAB91] mb-2">
                                            <AlertCircle size={14} className="shrink-0 mt-0.5" />
                                            <p className="text-sm font-medium leading-snug">"{activePersona.painPoint}"</p>
                                        </div>

                                        <button
                                            onClick={() => setIsChatMode(true)}
                                            className="mt-auto w-full py-2.5 rounded-lg bg-white text-[#002B7A] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-gray-100 transition-colors shadow-md"
                                        >
                                            <MessageCircle size={16} />
                                            직접 물어보기
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Customer Journey Map & Action - No Scroll */}
                <div className="col-span-8 flex flex-col gap-4 min-h-0 overflow-hidden relative z-10">

                    {/* Evidence Button */}
                    {!showEvidence && (
                        <div className="absolute top-5 right-5 z-40">
                            <button
                                onClick={() => setShowEvidence(true)}
                                className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-[#002B7A]/10 transition-colors hover:bg-[#E8F3FF] hover:border-[#002B7A]/30 group"
                            >
                                <div className="p-1 bg-[#002B7A]/10 rounded-full group-hover:bg-[#002B7A]/20 transition-colors">
                                    <FileText size={12} className="text-[#002B7A]" />
                                </div>
                                <span className="text-[11px] font-bold text-[#002B7A]">상세 분석 보기</span>
                            </button>
                        </div>
                    )}

                    {/* Glassmorphism Evidence Overlay */}
                    {showEvidence && (
                        <div
                            className="absolute inset-0 z-30 bg-white/20 backdrop-blur-lg rounded-2xl p-6 flex flex-col animate-in fade-in zoom-in duration-300 border border-white/40 shadow-inner"
                            onClick={() => setShowEvidence(false)}
                        >
                            <div className="flex items-center justify-between mb-6 shrink-0">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-[#002B7A]/10 rounded-lg">
                                        <BarChart2 size={20} className="text-[#002B7A]" />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#191F28]">데이터 분석 리포트</h3>
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); setShowEvidence(false); }} className="p-1 hover:bg-white/50 rounded-full transition-colors">
                                    <X size={24} className="text-gray-500" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto scrollbar-hide space-y-4 pr-1" onClick={(e) => e.stopPropagation()}>
                                {/* 1. Share Data */}
                                <div className="bg-white/60 p-4 rounded-2xl border border-white/40 shadow-sm">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-[#FF5A36]/10 rounded-lg shrink-0">
                                                <Users size={16} className="text-[#FF5A36]" />
                                            </div>
                                            <h4 className="text-sm font-bold text-[#191F28]">고객 비중 분석</h4>
                                        </div>
                                        <span className="text-xs font-bold text-[#FF5A36] bg-[#FF5A36]/10 px-2 py-0.5 rounded-full">{activePersona.share}%</span>
                                    </div>

                                    <p className="text-sm font-bold text-[#002B7A] mb-2">
                                        "전체 손님 10명 중 <span className="text-[#FF5A36] text-lg">{Math.round(activePersona.share / 10)}명</span>이 이 유형에 해당해요"
                                    </p>
                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#FF5A36] rounded-full"
                                            style={{ width: `${activePersona.share}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* 2. Top Keywords */}
                                <div className="bg-white/60 p-4 rounded-2xl border border-white/40 shadow-sm">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1.5 bg-[#002B7A]/10 rounded-lg shrink-0">
                                            <TrendingUp size={16} className="text-[#002B7A]" />
                                        </div>
                                        <h4 className="text-sm font-bold text-[#191F28]">핵심 키워드 (AI 추출)</h4>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {activePersona.topKeywords ? activePersona.topKeywords.map((keyword, i) => (
                                            <span key={i} className="px-2.5 py-1 bg-white border border-[#002B7A]/10 rounded-lg text-xs font-bold text-[#002B7A] shadow-sm">
                                                # {keyword}
                                            </span>
                                        )) : (
                                            activePersona.keywords.map((keyword, i) => (
                                                <span key={i} className="px-2.5 py-1 bg-white border border-[#002B7A]/10 rounded-lg text-xs font-bold text-[#002B7A] shadow-sm">
                                                    # {keyword}
                                                </span>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* 3. Representative Review */}
                                <div className="bg-white/60 p-4 rounded-2xl border border-white/40 shadow-sm">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1.5 bg-gray-100 rounded-lg shrink-0">
                                            <MessageCircle size={16} className="text-gray-600" />
                                        </div>
                                        <h4 className="text-sm font-bold text-[#191F28]">대표 리뷰</h4>
                                    </div>
                                    <div className="relative p-3 bg-white/80 rounded-xl border border-gray-100">
                                        <Quote size={16} className="absolute top-2 left-2 text-gray-300" />
                                        <p className="text-xs text-[#191F28] font-medium leading-relaxed pl-5 italic">
                                            "{activePersona.representativeReview || '이 페르소나의 특징을 잘 보여주는 대표적인 리뷰 내용이 여기에 표시됩니다.'}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div
                        className={`rounded-2xl p-5 flex-1 flex flex-col min-h-0 transition-all duration-500 ${showEvidence ? 'blur-md scale-[0.98] opacity-50' : ''}`}
                        style={{ backgroundColor: COLORS.bgCard, boxShadow: `0 4px 20px ${COLORS.shadow}` }}
                    >
                        <div className="flex justify-between items-end mb-4 shrink-0">
                            <h2 className="text-[20px] font-bold text-[#191F28]">
                                <span className="text-[#002B7A]">{activePersona.name}</span>님의 방문 여정
                            </h2>
                            <span className="text-[11px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                                # {activePersona.keywords.join(' # ')}
                            </span>
                        </div>

                        <div className="relative px-2 flex-1 flex items-center justify-center min-h-0">
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 rounded-full -translate-y-1/2"></div>

                            <div className="grid grid-cols-4 gap-3 relative z-10 w-full">
                                {activePersona.journey.map((item, idx) => (
                                    <div key={idx} className="flex flex-col items-center text-center group cursor-default">
                                        <div
                                            className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 border-4 border-white shadow-lg transition-all duration-300 group-hover:-translate-y-1 ${item.status === 'good' ? 'bg-[#E8F3FF] text-[#002B7A]' :
                                                    item.status === 'bad' ? 'bg-[#FFF0EE] text-[#FF5A36]' : 'bg-gray-50 text-gray-500'
                                                }`}
                                        >
                                            {item.icon}
                                        </div>
                                        <h4 className="font-bold mb-0.5 text-[#191F28] text-sm">{item.step}</h4>
                                        <p className="text-[11px] text-gray-500 leading-tight break-keep px-1">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Action Callout - MODIFIED BUTTON */}
                    <div
                        className={`rounded-2xl p-5 flex items-center justify-between relative overflow-hidden group cursor-pointer shrink-0 transition-all duration-500 ${showEvidence ? 'blur-md scale-[0.98] opacity-50' : ''}`}
                        style={{ background: 'linear-gradient(95deg, #FFF 0%, #FFF5F2 100%)', border: `1px solid ${COLORS.pointTint}` }}
                    >
                        <div className="absolute inset-0 bg-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="bg-[#FF5A36] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">AI 추천 전략</span>
                                <span className="text-[#FF5A36] font-bold text-xs">
                                    {activePersonaId === 0 ? '시그니처 메뉴 강조' : activePersonaId === 1 ? '편안한 분위기 강조' : '친절 서비스 강조'}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-[#191F28] mb-0.5">
                                "{activePersona.name}님을 위한 맞춤 영상 만들기"
                            </h3>
                            <p className="text-xs text-gray-500">사진 3장만 올리면 AI가 자동으로 기획하고 편집해드려요.</p>
                        </div>

                        <button
                            className="relative z-10 px-5 py-2.5 rounded-xl font-bold text-white flex items-center gap-2 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 hover:brightness-110"
                            style={{ backgroundColor: COLORS.point }}
                        >
                            <Clapperboard size={18} fill="white" className="text-white" />
                            <span className="text-sm">1분 만에 릴스 만들기</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const LocalAnalysisSection = () => {
    return (
        <div className="flex flex-col gap-4 flex-1 min-h-0 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden">

            {/* 1. Neighborhood Identity Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between shrink-0">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="bg-[#E8F3FF] text-[#002B7A] px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1">
                            <MapPin size={10} /> {LOCAL_DATA.areaName}
                        </span>
                        <span className="text-gray-400 text-[11px]">반경 500m 분석</span>
                    </div>
                    <h2 className="text-xl font-bold text-[#191F28] mb-1">
                        "이곳은 <span className="text-[#002B7A]">{LOCAL_DATA.type}</span>이에요"
                    </h2>
                    <div className="flex gap-2 mt-1">
                        {LOCAL_DATA.badges.map((tag, i) => (
                            <span key={i} className="text-gray-500 bg-gray-50 px-2 py-0.5 rounded text-[11px]">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="w-12 h-12 bg-[#F5F7FA] rounded-full flex items-center justify-center">
                    <Briefcase size={24} className="text-[#002B7A]" />
                </div>
            </div>

            {/* Grid Section - Adjusted to fit without scroll */}
            <div className="grid grid-cols-2 gap-4 flex-1 min-h-0 overflow-hidden">
                {/* 2. Golden Time Chart */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col min-h-0">
                    <div className="flex items-center gap-2 mb-4 shrink-0">
                        <div className="p-1.5 bg-orange-50 rounded-lg">
                            <Clock size={16} className="text-[#FF5A36]" />
                        </div>
                        <h3 className="text-base font-bold text-[#191F28]">우리 동네 골든 타임</h3>
                    </div>

                    <div className="flex-1 flex flex-col justify-center items-center min-h-0">
                        <div className="text-center mb-4 shrink-0">
                            <p className="text-gray-500 text-[11px] mb-0.5">가장 붐비는 시간</p>
                            <p className="text-2xl font-bold text-[#002B7A]">{LOCAL_DATA.peakTime}</p>
                        </div>
                        {/* Chart - Responsive Height */}
                        <div className="w-full flex-1 flex items-end justify-between gap-2 px-4 min-h-0">
                            {[30, 45, 80, 60, 90, 100, 85].map((h, i) => (
                                <div key={i} className="flex-1 flex flex-col gap-1 items-center group h-full justify-end">
                                    <div
                                        className={`w-full rounded-t-lg transition-all duration-500 ${i === 5 ? 'bg-[#FF5A36]' : 'bg-[#E8EEF5]'}`}
                                        style={{ height: `${h}%`, minHeight: '10%' }}
                                    ></div>
                                    <span className={`text-[10px] ${i === 5 ? 'font-bold text-[#FF5A36]' : 'text-gray-400'}`}>
                                        {['월', '화', '수', '목', '금', '토', '일'][i]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-3 bg-gray-50 p-2 rounded-lg shrink-0">
                        💡 {LOCAL_DATA.peakTimeDesc}
                    </p>
                </div>

                {/* 3. Competitor Keywords */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col min-h-0">
                    <div className="flex items-center gap-2 mb-4 shrink-0">
                        <div className="p-1.5 bg-blue-50 rounded-lg">
                            <TrendingUp size={16} className="text-[#002B7A]" />
                        </div>
                        <h3 className="text-base font-bold text-[#191F28]">잘 되는 가게 키워드 TOP 5</h3>
                    </div>

                    <div className="flex-1 flex flex-col justify-center gap-2 min-h-0 overflow-hidden">
                        {LOCAL_DATA.keywords.map((kw, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${i < 3 ? 'bg-[#002B7A] text-white' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                    {i + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between mb-0.5">
                                        <span className="font-bold text-[#191F28] text-sm truncate">#{kw.text}</span>
                                        <span className="text-[10px] text-gray-400">{kw.value}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#002B7A] rounded-full opacity-80"
                                            style={{ width: `${kw.value}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 4. Strategy Action Card */}
            <div
                className="rounded-2xl p-5 flex items-center justify-between relative overflow-hidden group cursor-pointer shrink-0"
                style={{ background: 'linear-gradient(95deg, #FFF 0%, #FFF5F2 100%)', border: `1px solid ${COLORS.pointTint}` }}
            >
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className="bg-[#FF5A36] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">AI 상권 공략</span>
                        <span className="text-[#FF5A36] font-bold text-xs">지역 맞춤 전략</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#191F28] mb-0.5">
                        "{LOCAL_DATA.strategy.title}"
                    </h3>
                    <p className="text-xs text-gray-500">{LOCAL_DATA.strategy.desc}</p>
                </div>

                <button
                    className="relative z-10 px-5 py-2.5 rounded-xl font-bold text-white flex items-center gap-2 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 hover:brightness-110"
                    style={{ backgroundColor: COLORS.point }}
                >
                    <Clapperboard size={18} fill="white" className="text-white" />
                    <span className="text-sm">1분 만에 릴스 만들기</span>
                </button>
            </div>
        </div>
    );
};

// --- Performance Detail Modal (Expert Moment) ---
const PerformanceDetailModal = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}>
            <div
                className="w-[800px] h-[600px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-[#002B7A] p-6 flex items-center justify-between text-white shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <BarChart2 size={24} className="text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl">지난주 성과 상세 분석</h3>
                            <p className="text-xs text-white/70">데이터 기준: 2023.10.15 ~ 10.21</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 bg-[#F5F7FA]">

                    {/* 1. Expert Insight (Expert Moment) */}
                    <div className="bg-white p-6 rounded-2xl border border-[#002B7A]/10 shadow-sm mb-6 flex gap-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#002B7A]"></div>
                        <div className="shrink-0">
                            <div className="w-14 h-14 rounded-full bg-[#F0F5FF] flex items-center justify-center border-2 border-[#002B7A]/10">
                                <Briefcase size={24} className="text-[#002B7A]" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-[#002B7A] text-white text-xs font-bold px-2 py-0.5 rounded-md">AI 마케팅 전문가</span>
                                <span className="text-sm text-gray-500">분석 리포트</span>
                            </div>
                            <h4 className="text-lg font-bold text-[#191F28] mb-1">"노출은 훌륭하지만, 저장률 개선이 필요해요!"</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                지난주 대비 노출수가 <span className="text-green-600 font-bold">+15%</span> 증가하며 많은 잠재 고객에게 도달했습니다.
                                하지만 실제 방문 의사를 나타내는 '저장' 비율은 3%에 머물렀어요.
                                <br /><br />
                                <span className="text-[#FF5A36] font-bold">Tip:</span> 릴스 마지막에 "나중에 가보려면 저장!" 문구를 추가하거나,
                                메뉴판/가격 정보를 영상에 포함시키면 저장률이 평균 1.5배 상승합니다.
                            </p>
                        </div>
                    </div>

                    {/* 2. Detailed Charts Grid */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* Chart 1: Trend */}
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                            <h5 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <TrendingUp size={16} className="text-gray-400" /> 주간 노출 추이
                            </h5>
                            <div className="h-40 flex items-end justify-between gap-2 px-2">
                                {[45, 50, 75, 60, 90, 100, 85].map((h, i) => (
                                    <div key={i} className="flex-1 flex flex-col gap-1 items-center group">
                                        <div className="relative w-full flex justify-center">
                                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded transition-opacity">
                                                {h * 10}
                                            </div>
                                        </div>
                                        <div
                                            className={`w-full rounded-t-md transition-all duration-500 ${i === 5 ? 'bg-[#002B7A]' : 'bg-[#E8EEF5]'}`}
                                            style={{ height: `${h}%` }}
                                        ></div>
                                        <span className="text-xs text-gray-400">{['월', '화', '수', '목', '금', '토', '일'][i]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Chart 2: Engagement Split */}
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                            <h5 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Heart size={16} className="text-gray-400" /> 반응 유형 분석
                            </h5>
                            <div className="space-y-4">
                                {[
                                    { label: '좋아요 (단순 호감)', val: 70, color: 'bg-red-400' },
                                    { label: '저장 (방문 의사)', val: 20, color: 'bg-[#002B7A]' },
                                    { label: '공유 (입소문)', val: 10, color: 'bg-green-500' }
                                ].map((item, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-600">{item.label}</span>
                                            <span className="font-bold">{item.val}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className={`h-full ${item.color}`} style={{ width: `${item.val}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 p-3 bg-gray-50 rounded-xl text-xs text-gray-500 text-center">
                                저장 비율을 30%까지 올리는 것을 목표로 해보세요!
                            </div>
                        </div>
                    </div>

                </div>

                <div className="p-4 bg-white border-t border-gray-100 flex justify-end">
                    <button onClick={onClose} className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors">
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- New Dashboard Home Component (Bento Grid Style) ---
const DashboardHome = () => {
    const [today] = useState(new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' }));
    const [showDetail, setShowDetail] = useState(false);

    return (
        <div className="flex flex-col h-full gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden">
            {showDetail && <PerformanceDetailModal onClose={() => setShowDetail(false)} />}

            {/* Bento Grid Container - 3 Columns */}
            <div className="grid grid-cols-3 gap-4 h-full min-h-0">

                {/* 1. Hero Section: Today's Mission (Span 2) */}
                <div
                    className="col-span-2 relative rounded-3xl p-6 flex items-center justify-between overflow-hidden group shadow-md"
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

                {/* 2. Weather & Traffic (Span 1) - NEW */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-50 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
                    <div>
                        <h3 className="font-bold text-gray-500 text-sm flex items-center gap-2 mb-1">
                            <CloudRain size={16} /> 오늘의 날씨 & 상권
                        </h3>
                        <p className="text-xl font-bold text-[#191F28]">비 옴 / 유동인구 많음</p>
                    </div>
                    <div className="mt-4 p-3 bg-[#F5F7FA] rounded-xl">
                        <div className="flex items-center gap-2 text-sm font-medium text-[#002B7A]">
                            <Zap size={16} className="text-yellow-500" />
                            <span>추천: 전 굽는 소리 ASMR</span>
                        </div>
                    </div>
                </div>

                {/* 3. Performance Snapshot (Span 1) */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between group relative">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-[#191F28] text-lg flex items-center gap-2">
                            <BarChart2 size={20} className="text-[#002B7A]" />
                            지난주 성과
                        </h3>
                        <button
                            onClick={() => setShowDetail(true)}
                            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <ArrowUpRight size={20} className="text-gray-400" />
                        </button>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500 mb-1">총 노출수</p>
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-bold text-[#191F28]">1,284</span>
                            <span className="text-sm font-bold text-green-600 mb-1.5 bg-green-50 px-1.5 py-0.5 rounded flex items-center">
                                +15%
                            </span>
                        </div>
                    </div>

                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-[#002B7A] h-full w-[70%]"></div>
                    </div>
                </div>

                {/* 4. Competitor Alert (Span 1) - NEW */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-[#191F28] text-lg flex items-center gap-2 mb-2">
                            <Bell size={20} className="text-[#FF5A36]" /> 실시간 트렌드
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-md">#하이볼</span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-md">#회식</span>
                        </div>
                    </div>
                    <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1">경쟁사 동향</p>
                        <p className="text-sm font-medium text-[#191F28] line-clamp-2">
                            주변 1위 '이자카야 텐'에서 <span className="text-[#FF5A36]">하이볼 2+1 이벤트</span>를 시작했어요.
                        </p>
                    </div>
                </div>

                {/* 5. Review Sentiment (Span 1) - NEW */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                    <h3 className="font-bold text-[#191F28] text-lg flex items-center gap-2">
                        <Smile size={20} className="text-green-500" /> 오늘의 감정 온도
                    </h3>
                    <div className="flex items-center justify-between">
                        <div className="text-center">
                            <span className="text-3xl font-bold text-green-600">36.5°</span>
                            <p className="text-xs text-gray-400">긍정적</p>
                        </div>
                        <div className="w-px h-10 bg-gray-200"></div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-[#191F28]">"친절해요"</p>
                            <p className="text-xs text-gray-500">가장 많이 언급됨</p>
                        </div>
                    </div>
                </div>

                {/* 6. Daily Routine Checklist (Span 3 - Full Width) */}
                <div className="col-span-3 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-[#191F28] text-lg flex items-center gap-2">
                            <CheckCircle2 size={20} className="text-[#002B7A]" />
                            오늘의 루틴 체크리스트
                        </h3>
                        <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full font-medium">{today}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { id: 1, text: "어제 리뷰 3건 답글 남기기", urgent: true },
                            { id: 2, text: "주말 예약 테이블 세팅 확인", urgent: false },
                            { id: 3, text: "오늘의 재료 사진 찍어두기", urgent: false },
                        ].map((task) => (
                            <div key={task.id} className="group flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-[#002B7A]/30 hover:bg-[#F5F7FA] transition-all cursor-pointer">
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.urgent ? 'border-[#FF5A36] text-[#FF5A36] bg-[#FF5A36]/5' : 'border-gray-300 text-transparent hover:border-[#002B7A]'}`}>
                                    {task.urgent && <div className="w-3 h-3 bg-[#FF5A36] rounded-full"></div>}
                                </div>
                                <span className={`flex-1 font-medium text-sm ${task.urgent ? 'text-[#191F28]' : 'text-gray-600'}`}>
                                    {task.text}
                                </span>
                                {task.urgent && <span className="text-[10px] font-bold text-[#FF5A36] bg-[#FF5A36]/10 px-2 py-0.5 rounded">필수</span>}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

// ... (Existing MyPage component remains same)
const MyPage = () => {
    return (
        <div className="flex flex-col h-full gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-y-auto p-2">
            {/* Top: Status Summary */}
            <div className="bg-[#002B7A] rounded-2xl p-6 text-white flex items-center justify-between shadow-lg shrink-0">
                <div>
                    <h2 className="text-2xl font-bold mb-1">박사장님, 안녕하세요!</h2>
                    <p className="text-white/70 text-sm">오늘도 성공적인 하루 보내세요.</p>
                </div>
                <div className="flex items-center gap-4 bg-white/10 px-5 py-3 rounded-xl backdrop-blur-sm border border-white/10">
                    <div>
                        <p className="text-xs text-white/60 mb-0.5">마케팅 준비 완료율</p>
                        <div className="flex items-end gap-2">
                            <span className="text-2xl font-bold text-yellow-300">85%</span>
                            <span className="text-xs text-white/80 mb-1">조금만 더 힘내세요!</span>
                        </div>
                    </div>
                    <div className="w-12 h-12 rounded-full border-4 border-white/20 flex items-center justify-center text-lg font-bold relative">
                        85
                        <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-[#002B7A]"></div>
                    </div>
                </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-2 gap-6 flex-1">

                {/* 1. Store Persona */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-[#191F28] text-lg flex items-center gap-2">
                            <User size={20} className="text-[#002B7A]" />
                            내 가게 페르소나
                        </h3>
                        <button className="text-gray-400 hover:text-[#002B7A] transition-colors">
                            <Settings size={18} />
                        </button>
                    </div>

                    <div className="space-y-4 flex-1">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">가게 이름 / 업종</p>
                            <p className="text-base font-bold text-[#191F28]">범계 로데오점 / 이자카야</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">브랜드 톤앤매너 (AI 설정)</p>
                            <div className="flex gap-2 mt-1">
                                <span className="px-3 py-1 bg-[#E8F3FF] text-[#002B7A] text-xs font-bold rounded-full">친근한</span>
                                <span className="px-3 py-1 bg-[#E8F3FF] text-[#002B7A] text-xs font-bold rounded-full">감성적인</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">주력 메뉴 키워드</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {['#하이볼맛집', '#숙성회', '#데이트코스', '#분위기깡패'].map((tag, i) => (
                                    <span key={i} className="text-sm text-gray-600">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Connection Hub */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-[#191F28] text-lg flex items-center gap-2">
                            <Share2 size={20} className="text-[#002B7A]" />
                            플랫폼 연동 상태
                        </h3>
                    </div>

                    <div className="space-y-4 flex-1">
                        <div className="flex items-center justify-between p-4 bg-[#F5F7FA] rounded-xl border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                                    <Instagram size={20} className="text-pink-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-[#191F28]">Instagram</p>
                                    <p className="text-xs text-gray-500">@bumgye_rodeo</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                <span className="text-xs text-green-600 font-bold">연동됨</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-[#F5F7FA] rounded-xl border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                                    <MapPin size={20} className="text-green-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-[#191F28]">Naver Place</p>
                                    <p className="text-xs text-gray-500">범계 로데오점</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="text-xs text-green-600 font-bold">수집 중</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white border border-dashed border-gray-300 rounded-xl hover:border-[#002B7A] hover:bg-[#F0F5FF] transition-colors cursor-pointer group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-white">
                                    <MessageSquare size={20} className="text-gray-400 group-hover:text-[#002B7A]" />
                                </div>
                                <p className="font-bold text-sm text-gray-400 group-hover:text-[#002B7A]">카카오 채널 연동하기</p>
                            </div>
                            <ChevronRight size={18} className="text-gray-300 group-hover:text-[#002B7A]" />
                        </div>
                    </div>
                </div>

                {/* 3. Subscription & Credit */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-[#191F28] text-lg flex items-center gap-2">
                            <CreditCard size={20} className="text-[#002B7A]" />
                            멤버십 & 크레딧
                        </h3>
                        <span className="bg-[#002B7A] text-white text-xs px-2 py-1 rounded font-bold">Pro Plan</span>
                    </div>

                    <div className="space-y-4 flex-1">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600">이번 달 AI 생성 횟수</span>
                                <span className="font-bold text-[#002B7A]">12 / 30회</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-[#002B7A] w-[40%] rounded-full"></div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600">다음 결제일</span>
                                <span className="text-sm font-bold">2023. 11. 01</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">결제 수단</span>
                                <span className="text-sm font-bold">현대카드 (1234)</span>
                            </div>
                        </div>

                        <button className="w-full py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50 hover:border-gray-300 transition-colors">
                            결제 수단 관리
                        </button>
                    </div>
                </div>

                {/* 4. Support & Guide */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-[#191F28] text-lg flex items-center gap-2">
                            <HelpCircle size={20} className="text-[#002B7A]" />
                            고객센터
                        </h3>
                    </div>

                    <div className="space-y-3 flex-1">
                        <button className="w-full flex items-center justify-between p-4 bg-[#F5F7FA] rounded-xl hover:bg-[#E8F3FF] transition-colors text-left group">
                            <div className="flex items-center gap-3">
                                <MessageCircle size={20} className="text-gray-500 group-hover:text-[#002B7A]" />
                                <span className="font-bold text-sm text-[#191F28] group-hover:text-[#002B7A]">1:1 문의하기</span>
                            </div>
                            <ChevronRight size={18} className="text-gray-300 group-hover:text-[#002B7A]" />
                        </button>

                        <button className="w-full flex items-center justify-between p-4 bg-[#F5F7FA] rounded-xl hover:bg-[#E8F3FF] transition-colors text-left group">
                            <div className="flex items-center gap-3">
                                <FileText size={20} className="text-gray-500 group-hover:text-[#002B7A]" />
                                <span className="font-bold text-sm text-[#191F28] group-hover:text-[#002B7A]">서비스 이용 가이드</span>
                            </div>
                            <ChevronRight size={18} className="text-gray-300 group-hover:text-[#002B7A]" />
                        </button>

                        <div className="mt-auto pt-4 text-center">
                            <button className="text-xs text-gray-400 hover:text-red-500 flex items-center justify-center gap-1 mx-auto transition-colors">
                                <LogOut size={12} /> 로그아웃
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default function App() {
    const [activeMenu, setActiveMenu] = useState('home');
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState('persona');

    return (
        <div className="flex h-screen font-pretendard overflow-hidden" style={{ backgroundColor: COLORS.bgPage }}>
            <style>{customStyles}</style>

            <Sidebar
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
            />

            <main
                className={`flex-1 p-6 h-full flex flex-col main-content ${isExpanded ? 'ml-[276px]' : 'ml-[96px]'}`}
            >
                <div className="max-w-[1400px] h-full flex flex-col w-full mx-auto">
                    {activeMenu === 'home' ? (
                        // DASHBOARD VIEW
                        <>
                            <header className="flex justify-between items-center mb-4 pl-2 shrink-0">
                                <div>
                                    <h1 style={{ color: COLORS.primary }} className="text-[26px] font-bold leading-tight mb-0.5">
                                        범계 로데오점 사장님, 안녕하세요!
                                    </h1>
                                    <p style={{ color: COLORS.primaryText }} className="text-[15px] opacity-70">
                                        오늘도 힘차게 시작해볼까요?
                                    </p>
                                </div>
                                <button className="relative p-2.5 rounded-xl bg-white shadow-sm hover:bg-gray-50 transition-colors">
                                    <Bell size={22} color={COLORS.primary} />
                                    <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.point }}></span>
                                </button>
                            </header>
                            <DashboardHome />
                        </>
                    ) : activeMenu === 'insight' ? (
                        // INSIGHT VIEW
                        <>
                            <Header title="오늘도 데이터를 기반으로 가장 똑똑한 전략을 준비했어요." />
                            <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
                            {activeTab === 'persona' ? <PersonaSection /> : <LocalAnalysisSection />}
                        </>
                    ) : activeMenu === 'mypage' ? (
                        // MYPAGE VIEW
                        <>
                            <header className="flex justify-between items-center mb-4 pl-2 shrink-0">
                                <div>
                                    <h1 style={{ color: COLORS.primary }} className="text-[26px] font-bold leading-tight mb-0.5">
                                        마이페이지
                                    </h1>
                                    <p style={{ color: COLORS.primaryText }} className="text-[15px] opacity-70">
                                        가게 정보와 연동 상태를 관리하세요.
                                    </p>
                                </div>
                                <button className="relative p-2.5 rounded-xl bg-white shadow-sm hover:bg-gray-50 transition-colors">
                                    <Bell size={22} color={COLORS.primary} />
                                    <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.point }}></span>
                                </button>
                            </header>
                            <MyPage />
                        </>
                    ) : (
                        // Placeholder for other menus
                        <div className="flex items-center justify-center h-full text-gray-400 flex-col gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                <MoreHorizontal size={32} className="text-gray-400" />
                            </div>
                            <p>준비 중인 기능입니다.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}