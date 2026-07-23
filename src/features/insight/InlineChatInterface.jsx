import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MessageCircle, Bot, MoreHorizontal, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchCurrentProfile } from '../auth/api/authApi';
import { getLocalStoreProfile } from '../influencer/influencerMatchingUtils';
import { fetchLatestAnalysisData, MOCK_ANALYSIS_DATA } from './api/analysisApi';
import { FASTAPI_BASE_URL, USE_MOCK_ANALYSIS } from '../../config/env';
import { apiPost } from '../../utils/httpClient';
import { getErrorMessage, isCanceledError } from '../../utils/apiError';

const FASTAPI_URL = FASTAPI_BASE_URL;
const OWNER_GREETING = '안녕하세요, 사장님! 👋\n매장과 손님 분석에 대해 궁금한 점을 언제든 물어보세요.';
const INFLUENCER_GREETING = '안녕하세요! 👋\n프로필이나 협업 제안에 대해 무엇이든 물어보세요.';
/** LLM 응답은 오래 걸릴 수 있지만, 무한 대기는 막는다. */
const CHAT_TIMEOUT_MS = 60000;
const MAX_MESSAGE_LENGTH = 1000;

const getMockReply = (question) => {
    const normalized = question.trim();

    if (normalized.includes('리뷰')) {
        return '최근 리뷰에서 반복되는 키워드를 먼저 확인한 뒤, 응답 템플릿을 긍정·개선 요청·예외 상황으로 나누어 운영해 보세요.';
    }

    if (normalized.includes('인플루언서') || normalized.includes('홍보')) {
        return '매장과 고객층에 맞는 인플루언서를 먼저 고르고, 방문 일정·제공 메뉴·필수 콘텐츠를 제안서에 명확히 적어 보세요.';
    }

    return '개발용 AI 도우미입니다. 현재는 예시 분석 데이터를 기준으로 안내하고 있어요. 리뷰 관리, 홍보, 인플루언서 매칭 중 궁금한 내용을 물어보세요.';
};

export default function InlineChatInterface() {
    const [isOpen, setIsOpen] = useState(false);
    const [role, setRole] = useState('owner');
    const [context, setContext] = useState({});
    const [messages, setMessages] = useState([{ role: 'assistant', text: OWNER_GREETING }]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);
    const chatControllerRef = useRef(null);

    // 언마운트 시 진행 중인 요청을 끊는다.
    useEffect(() => () => chatControllerRef.current?.abort(), []);

    // 로그인 사용자(사장님/인플루언서) 컨텍스트 로드.
    // 로그아웃 시 localStorage가 비워지므로 컨텍스트도 자연히 초기화된다.
    useEffect(() => {
        let ignore = false;
        fetchCurrentProfile()
            .then((profile) => {
                if (ignore || !profile) return;

                if (profile.role === 'INFLUENCER') {
                    const p = profile.influencerProfile || {};
                    setRole('influencer');
                    setContext({
                        displayName: p.displayName || profile.name || '',
                        bio: p.bio || '',
                        location: p.location || '',
                        niches: p.niches || [],
                        keywords: p.keywords || [],
                        audienceKeywords: p.audienceKeywords || [],
                        instagramFollowers: p.instagramFollowers || 0,
                        avgViews: p.avgViews || 0,
                    });
                    setMessages([{ role: 'assistant', text: INFLUENCER_GREETING }]);
                    return;
                }

                // 사장님: 가게 기본 정보 + (가능하면) 손님분석 총평/페르소나 주입
                const store = getLocalStoreProfile();
                setRole('owner');
                setContext({
                    storeName: store.storeName,
                    category: store.category,
                    location: store.location,
                });
                setMessages([{ role: 'assistant', text: OWNER_GREETING }]);

                const analysisPromise = USE_MOCK_ANALYSIS
                    ? Promise.resolve(MOCK_ANALYSIS_DATA)
                    : fetchLatestAnalysisData();

                analysisPromise
                    .then((data) => {
                        if (ignore || !data) return;
                        setContext((prev) => ({
                            ...prev,
                            storeName: data.store_name || prev.storeName,
                            storeSummary: data.store_summary || '',
                            personas: (data.personas || []).map((item) => ({
                                nickname: item.nickname,
                                summary: item.summary,
                                action_recommendation: item.action_recommendation,
                            })),
                        }));
                    })
                    .catch(() => { /* 분석 결과가 없어도 기본 가게 정보로 동작 */ });
            })
            .catch(() => { /* 비로그인/오류 시 기본 사장님 컨텍스트 유지 */ });
        return () => { ignore = true; };
    }, []);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        // 전송 중에는 중복 전송을 막는다.
        if (!input.trim() || isTyping) return;
        const userMsg = { role: 'user', text: input.trim().slice(0, MAX_MESSAGE_LENGTH) };
        const nextMessages = [...messages, userMsg];
        setMessages(nextMessages);
        setInput('');
        setIsTyping(true);

        const controller = new AbortController();
        chatControllerRef.current = controller;

        try {
            if (USE_MOCK_ANALYSIS) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    text: getMockReply(userMsg.text),
                }]);
                return;
            }

            const data = await apiPost(
                `${FASTAPI_URL}/chat`,
                {
                    role,
                    context,
                    messages: nextMessages.map((message) => ({
                        role: message.role === 'user' ? 'user' : 'assistant',
                        content: message.text,
                    })),
                },
                { signal: controller.signal, timeout: CHAT_TIMEOUT_MS, context: 'insight/chat' },
            );

            if (controller.signal.aborted) return;
            const reply = typeof data?.reply === 'string' && data.reply.trim() ? data.reply : null;
            setMessages(prev => [...prev, {
                role: 'assistant',
                text: reply || '답변을 받지 못했어요. 질문을 조금 더 구체적으로 적어 주시면 도움이 돼요.',
            }]);
        } catch (error) {
            if (controller.signal.aborted || isCanceledError(error)) return;
            setMessages(prev => [...prev, {
                role: 'assistant',
                text: getErrorMessage(error, '지금 답변을 가져오지 못했어요. 잠시 후 다시 시도해 주세요.'),
            }]);
        } finally {
            if (chatControllerRef.current === controller) chatControllerRef.current = null;
            if (!controller.signal.aborted) setIsTyping(false);
        }
    };

    return (
        <div className="relative z-50 font-pretendard flex flex-col items-end">

            {/* 1. Chat Window (Dropdown) */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10, transformOrigin: "top right" }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        className="absolute top-12 right-0 w-[360px] h-[600px] bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 flex flex-col overflow-hidden ring-1 ring-black/5"
                    >
                        {/* Header: Minimal Clean */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-50 bg-white/80 backdrop-blur-md sticky top-0 z-10 h-[60px]">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#002B7A] to-[#0042BE] flex items-center justify-center text-white shadow-sm">
                                    <Bot size={16} />
                                </div>
                                <div>
                                    <h3 className="text-[14px] font-bold text-[#191F28] leading-tight">PULSE AI</h3>
                                    <div className="flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                        <span className="text-[11px] text-[#8B95A1] font-medium">답변 대기 중</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
                                    <MoreHorizontal size={18} />
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 bg-white p-4 overflow-y-auto custom-scrollbar flex flex-col gap-3" ref={scrollRef}>
                            <div className="text-center py-4">
                                <span className="text-[11px] text-[#8B95A1] bg-[#F5F7FA] px-3 py-1.5 rounded-full">
                                    오늘 {new Date().toLocaleDateString()}
                                </span>
                            </div>

                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] px-4 py-3 text-[14px] leading-relaxed shadow-sm whitespace-pre-wrap ${msg.role === 'user'
                                        ? 'bg-[#002B7A] text-white rounded-[20px] rounded-tr-sm'
                                        : 'bg-[#F5F7FA] text-[#333D4B] rounded-[20px] rounded-tl-sm'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}

                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-[#F5F7FA] px-4 py-3 rounded-[20px] rounded-tl-sm flex gap-1 items-center">
                                        <div className="w-1.5 h-1.5 bg-[#8B95A1] rounded-full animate-bounce" />
                                        <div className="w-1.5 h-1.5 bg-[#8B95A1] rounded-full animate-bounce [animation-delay:0.1s]" />
                                        <div className="w-1.5 h-1.5 bg-[#8B95A1] rounded-full animate-bounce [animation-delay:0.2s]" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area: Floating Style */}
                        <div className="p-4 bg-white border-t border-gray-50">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="relative flex items-center bg-[#F5F7FA] rounded-full px-2 border border-transparent focus-within:border-[#002B7A] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#002B7A]/20 transition-all duration-200"
                            >
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="질문을 입력하세요..."
                                    className="flex-1 bg-transparent border-none outline-none font-medium text-[14px] px-3 py-3.5 text-[#191F28] placeholder:text-[#ADB5BD]"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim()}
                                    className={`p-2 rounded-full transition-all ${input.trim()
                                        ? 'bg-[#002B7A] text-white shadow-md hover:scale-105'
                                        : 'bg-transparent text-[#D1D6DB]'
                                        }`}
                                >
                                    <Send size={18} className={input.trim() ? "translate-x-0.5" : ""} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 2. Trigger Button (Relative Inline) */}
            <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#F9FAFB" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-2.5 rounded-xl transition-all shadow-sm border ${isOpen
                    ? 'bg-blue-50 border-[#002B7A] text-[#002B7A]'
                    : 'bg-white border-transparent hover:bg-gray-50 text-[#191F28]'
                    }`}
            >
                {isOpen ? (
                    <ChevronUp size={22} className="text-[#002B7A]" />
                ) : (
                    <MessageCircle size={22} className="text-[#002B7A]" />
                )}
                {/* Badge */}
                {!isOpen && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#FF5A36] ring-2 ring-white"></span>
                )}
            </motion.button>
        </div>
    );
}
