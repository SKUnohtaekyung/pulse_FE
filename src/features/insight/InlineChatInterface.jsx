import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, AlertCircle } from 'lucide-react';

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
        <div className="flex flex-col h-full bg-[#002B7A1A] overflow-hidden animate-in slide-in-from-right duration-300 backdrop-blur-sm">
            {/* Mini Profile Header - Glassmorphism */}
            <div className="bg-white/80 backdrop-blur-md p-3 flex items-center gap-3 shrink-0 shadow-sm z-10 border-b border-white/20">
                <button
                    onClick={onClose}
                    className="p-1.5 hover:bg-gray-100/50 rounded-full transition-colors text-gray-500"
                >
                    <ArrowLeft size={18} />
                </button>

                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-white border border-white/50 flex items-center justify-center text-lg shrink-0 shadow-sm">
                        {persona.icon}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-[#191F28] truncate">{persona.name}</span>
                            <span className="text-[10px] text-white bg-[#002B7A] px-2 py-0.5 rounded-full font-medium whitespace-nowrap shadow-sm">
                                대화 중
                            </span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-gray-500 truncate">
                            <AlertCircle size={10} className="text-[#FF5A36]" />
                            <span className="truncate">불편사항: "{persona.painPoint}"</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                <div className="text-center text-[10px] text-gray-400 my-2 bg-white/40 self-center px-3 py-1 rounded-full backdrop-blur-sm mx-auto w-fit">
                    AI 페르소나와 대화를 시작하세요
                </div>

                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div
                            className={`max-w-[85%] p-3.5 text-[13px] leading-relaxed shadow-sm transition-all hover:shadow-md ${msg.type === 'user'
                                ? 'bg-gradient-to-br from-[#002B7A] to-[#001A4D] text-white rounded-2xl rounded-tr-sm'
                                : 'bg-white/90 backdrop-blur-sm text-[#191F28] rounded-2xl rounded-tl-sm border border-white/50'
                                }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Recommendation Chips */}
            <div className="px-4 py-2 flex gap-2 overflow-x-auto shrink-0 scrollbar-hide mask-linear-fade">
                <button className="whitespace-nowrap px-3 py-1.5 bg-white/60 backdrop-blur-sm border border-white/40 rounded-full text-[11px] text-[#002B7A] font-bold hover:bg-white hover:shadow-md transition-all transform hover:-translate-y-0.5">
                    웨이팅이 왜 싫어요?
                </button>
                <button className="whitespace-nowrap px-3 py-1.5 bg-white/60 backdrop-blur-sm border border-white/40 rounded-full text-[11px] text-[#002B7A] font-bold hover:bg-white hover:shadow-md transition-all transform hover:-translate-y-0.5">
                    자주 시키는 메뉴는?
                </button>
                <button className="whitespace-nowrap px-3 py-1.5 bg-white/60 backdrop-blur-sm border border-white/40 rounded-full text-[11px] text-[#002B7A] font-bold hover:bg-white hover:shadow-md transition-all transform hover:-translate-y-0.5">
                    재방문 의사는?
                </button>
            </div>

            {/* Input Area - Floating Design */}
            <div className="p-4 shrink-0">
                <div className="flex gap-2 bg-white/80 backdrop-blur-md p-1.5 rounded-2xl shadow-lg border border-white/50">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="궁금한 점을 물어보세요..."
                        className="flex-1 bg-transparent px-3 py-2 text-xs focus:outline-none placeholder-gray-400 text-[#191F28]"
                    />
                    <button
                        onClick={handleSend}
                        className="p-2.5 bg-gradient-to-br from-[#FF5A36] to-[#FF3A16] rounded-xl hover:shadow-md transition-all shadow-sm flex items-center justify-center group"
                    >
                        <Send size={16} color="white" className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InlineChatInterface;
