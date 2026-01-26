import React, { useState, useEffect } from 'react';
import {
    ThumbsUp,
    AlertCircle,
    Lightbulb,
    MessageCircle,
    FileText,
    BarChart2,
    X,
    Users,
    TrendingUp,
    Quote,
    Clapperboard,
    ChevronRight,
    ArrowLeft
} from 'lucide-react';
import { COLORS } from '../../constants';
import { PERSONA_DATA } from '../../data/mockData';
import InsightCard from '../../components/ui/InsightCard';
import InlineChatInterface from './InlineChatInterface';

const PersonaSection = () => {
    const [activePersonaId, setActivePersonaId] = useState(0);
    const [rightPanelMode, setRightPanelMode] = useState('profile'); // 'profile', 'chat', 'evidence'

    // Reset to profile view when changing persona
    useEffect(() => {
        setRightPanelMode('profile');
    }, [activePersonaId]);

    const activePersona = PERSONA_DATA[activePersonaId];

    return (
        <div className="flex flex-col gap-4 flex-1 min-h-0 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden">

            {/* Top Row: Title (Expanded) & Insight Cards (Restored) */}
            <div className="flex items-start justify-between shrink-0 h-[110px] px-2">
                {/* 1. Title Area (Expanded & Larger) */}
                <div className="flex flex-col justify-center w-[480px] h-full">
                    <h2 className="text-[32px] font-bold text-[#191F28] mb-3 leading-tight">단골 손님 유형 분석</h2>
                    <p className="text-[17px] text-gray-500 leading-relaxed">
                        우리 가게를 찾는 <span className="text-[#002B7A] font-bold">진짜 손님</span>이 누구인지,<br />
                        <span className="text-[#002B7A] font-bold">데이터</span>로 정밀하게 분석해 드려요.
                    </p>
                </div>

                {/* 4. Insight Cards (Restored to Original Full Version) */}
                <div className="flex-1 grid grid-cols-3 gap-3 h-full">
                    <InsightCard
                        title="손님들이 가장 원해요"
                        icon={ThumbsUp}
                        tags={['시그니처메뉴', '푸짐한양']}
                        highlight="'볶음밥' 양 칭찬 24% 증가"
                        type="positive"
                    />
                    <InsightCard
                        title="이런 점은 불편해 해요"
                        icon={AlertCircle}
                        tags={['웨이팅정보', '주차공간']}
                        highlight="웨이팅 시간의 불확실성"
                        type="negative"
                    />
                    <InsightCard
                        title="이런 콘텐츠가 먹혀요"
                        icon={Lightbulb}
                        tags={['조리과정', 'ASMR']}
                        highlight="'지글지글' 조리 영상 인기"
                        type="neutral"
                    />
                </div>
            </div>

            {/* Main Content Grid: Left (Journey) vs Right (Action) */}
            <div className="grid grid-cols-12 gap-4 flex-1 min-h-0 overflow-hidden">

                {/* LEFT COLUMN: Journey Map & Strategy (Context) - col-span-8 */}
                <div className="col-span-8 flex flex-col gap-3 min-h-0">
                    <div
                        className="flex-1 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col relative overflow-hidden"
                    >
                        {/* 2. Profile Tabs Moved Inside (Top Left) */}
                        <div className="flex justify-between items-start mb-4 shrink-0">
                            <div className="flex items-center gap-6">
                                {PERSONA_DATA.map((persona) => (
                                    <button
                                        key={persona.id}
                                        onClick={() => setActivePersonaId(persona.id)}
                                        className="group flex flex-col items-center gap-1.5 transition-all duration-300"
                                    >
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-sm transition-all duration-300 ${activePersonaId === persona.id
                                            ? 'bg-[#002B7A] text-white ring-4 ring-[#002B7A]/10 scale-110'
                                            : 'bg-white text-gray-300 group-hover:bg-gray-50 group-hover:text-gray-400'
                                            }`}>
                                            {persona.icon}
                                        </div>
                                        <span className={`text-[11px] font-bold transition-colors ${activePersonaId === persona.id ? 'text-[#002B7A]' : 'text-gray-400'
                                            }`}>
                                            {persona.name}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* Evidence Button */}
                            <button
                                onClick={() => setRightPanelMode('evidence')}
                                className="flex items-center gap-1.5 bg-[#E8F3FF] px-3 py-1.5 rounded-full text-[#002B7A] text-xs font-bold hover:bg-[#002B7A] hover:text-white transition-colors shadow-sm"
                            >
                                <BarChart2 size={14} />
                                <span>상세 데이터 분석</span>
                            </button>
                        </div>

                        {/* Journey Title (Moved Below Tabs) */}
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-[#191F28] flex items-center gap-2">
                                <span className="text-[#002B7A]">{activePersona.name}</span>님의 방문 여정
                                <div className="flex gap-1">
                                    {activePersona.keywords.map((kw, i) => (
                                        <span key={i} className="text-[11px] text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded font-medium">
                                            #{kw}
                                        </span>
                                    ))}
                                </div>
                            </h2>
                        </div>

                        {/* 3. Journey Map Visualization (Height Reduced via flex-1 and padding) */}
                        <div className="relative px-4 flex-1 flex items-center justify-center min-h-0 pb-2">
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 rounded-full -translate-y-1/2"></div>

                            <div className="grid grid-cols-4 gap-4 relative z-10 w-full">
                                {activePersona.journey.map((item, idx) => (
                                    <div key={idx} className="flex flex-col items-center text-center group cursor-default">
                                        <div
                                            className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-2 border-4 border-white shadow-lg transition-all duration-300 group-hover:-translate-y-1 ${item.status === 'good' ? 'bg-[#E8F3FF] text-[#002B7A]' :
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

                    {/* Prominent AI Strategy Card */}
                    <div
                        className="h-20 bg-gradient-to-r from-[#FFF5F2] to-white rounded-2xl border border-[#FF5A3633] px-6 flex items-center justify-between shrink-0 hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                        <div className="relative z-10 flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="bg-[#FF5A36] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">AI 전략</span>
                                <span className="text-[#FF5A36] text-xs font-bold">맞춤형 마케팅 제안</span>
                            </div>
                            <span className="text-[#191F28] text-lg font-bold group-hover:text-[#FF5A36] transition-colors">
                                "{activePersona.name}님을 위한 <span className="text-[#FF5A36]">{activePersonaId === 0 ? '시그니처 메뉴 강조' : '감성 분위기 연출'}</span> 릴스 만들기"
                            </span>
                        </div>

                        <button className="relative z-10 flex items-center gap-2 bg-[#FF5A36] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md group-hover:scale-105 transition-transform">
                            <Clapperboard size={18} />
                            <span>1분 만에 제작하기</span>
                        </button>
                    </div>
                </div>

                {/* RIGHT COLUMN: Dynamic Panel (Profile / Chat / Evidence) - col-span-4 */}
                <div className="col-span-4 relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col">

                    {/* MODE 1: PROFILE (Default) */}
                    {rightPanelMode === 'profile' && (
                        <div className="flex flex-col h-full animate-in fade-in duration-300">
                            {/* Compact Profile Header */}
                            <div className="bg-[#002B7A] p-4 text-white relative overflow-hidden shrink-0 flex items-center gap-4">
                                <div className="absolute top-0 right-0 p-20 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>

                                <div className="relative z-10 w-14 h-14 rounded-full bg-[#F5F7FA] border-2 border-white/20 flex items-center justify-center text-2xl shadow-inner shrink-0">
                                    {activePersona.icon}
                                </div>

                                <div className="relative z-10 flex flex-col">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h2 className="text-lg font-bold">{activePersona.name}</h2>
                                        <span className="px-1.5 py-0.5 bg-white/20 rounded text-[10px] font-medium backdrop-blur-sm">
                                            비중 {activePersona.share}%
                                        </span>
                                    </div>
                                    <p className="text-white/70 text-xs">{activePersona.role}</p>
                                </div>
                            </div>

                            {/* Profile Details (Expanded Space) */}
                            <div className="flex-1 p-5 bg-white flex flex-col gap-4 overflow-y-auto">
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <p className="text-gray-400 text-[11px] mb-1 font-bold">방문 목적</p>
                                    <p className="text-[#191F28] text-sm font-bold leading-snug">"{activePersona.goal}"</p>
                                </div>
                                {/* 5. Reduced Whitespace in Pain Point Box */}
                                <div className="bg-[#FFF0EE] p-4 rounded-xl border border-[#FF5A361A] flex-1 flex flex-col gap-2">
                                    <p className="text-[#FF5A36] text-[11px] font-bold flex items-center gap-1">
                                        <AlertCircle size={12} /> 가장 불편해하는 점
                                    </p>
                                    <p className="text-[#191F28] text-sm font-bold leading-snug">"{activePersona.painPoint}"</p>
                                </div>
                            </div>

                            {/* Chat Button */}
                            <div className="p-4 border-t border-gray-100 bg-white shrink-0">
                                <button
                                    onClick={() => setRightPanelMode('chat')}
                                    className="w-full py-3 rounded-xl bg-[#002B7A] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#002366] transition-colors shadow-md"
                                >
                                    <MessageCircle size={18} />
                                    <span>직접 물어보기</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* MODE 2: CHAT */}
                    {rightPanelMode === 'chat' && (
                        <InlineChatInterface
                            persona={activePersona}
                            onClose={() => setRightPanelMode('profile')}
                        />
                    )}

                    {/* MODE 3: EVIDENCE (Report) */}
                    {rightPanelMode === 'evidence' && (
                        <div className="flex flex-col h-full bg-[#F5F7FA] animate-in slide-in-from-right duration-300">
                            {/* Header */}
                            <div className="bg-white p-4 border-b border-gray-100 flex items-center gap-3 shrink-0">
                                <button
                                    onClick={() => setRightPanelMode('profile')}
                                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                                >
                                    <ArrowLeft size={18} />
                                </button>
                                <h3 className="font-bold text-[#191F28]">상세 데이터 리포트</h3>
                            </div>

                            {/* Report Content */}
                            <div className="flex-1 p-4 overflow-y-auto space-y-3">
                                {/* 1. Keywords */}
                                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-2 mb-3">
                                        <TrendingUp size={16} className="text-[#002B7A]" />
                                        <h4 className="text-sm font-bold text-[#191F28]">핵심 키워드</h4>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {activePersona.keywords.map((keyword, i) => (
                                            <span key={i} className="px-2.5 py-1 bg-[#F5F7FA] text-[#002B7A] rounded-lg text-xs font-bold">
                                                # {keyword}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* 2. Review */}
                                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-2 mb-3">
                                        <FileText size={16} className="text-[#002B7A]" />
                                        <h4 className="text-sm font-bold text-[#191F28]">대표 리뷰</h4>
                                    </div>
                                    <div className="relative p-3 bg-gray-50 rounded-lg">
                                        <Quote size={14} className="absolute top-2 left-2 text-gray-300" />
                                        <p className="text-xs text-[#191F28] font-medium leading-relaxed pl-4 italic">
                                            "{activePersona.representativeReview || '이 페르소나의 특징을 잘 보여주는 대표적인 리뷰 내용이 여기에 표시됩니다.'}"
                                        </p>
                                    </div>
                                </div>

                                {/* 3. Share Analysis */}
                                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <Users size={16} className="text-[#FF5A36]" />
                                            <h4 className="text-sm font-bold text-[#191F28]">고객 비중</h4>
                                        </div>
                                        <span className="text-[#FF5A36] font-bold text-sm">{activePersona.share}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#FF5A36] rounded-full"
                                            style={{ width: `${activePersona.share}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-[11px] text-gray-500 mt-2">
                                        전체 손님 10명 중 약 {Math.round(activePersona.share / 10)}명이 이 유형입니다.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PersonaSection;
