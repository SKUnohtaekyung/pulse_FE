import React from 'react';
import { X, Users, Clock, Star, ExternalLink, MapPin, Award, ArrowRight } from 'lucide-react';

/**
 * InfluencerDetailModal (Premium Redesign)
 * High-end profile card layout with split view
 */
export default function InfluencerDetailModal({ influencer, onClose, onRequest }) {
    if (!influencer) return null;

    // Dummy AI Insight Text (In real app, this comes from backend analysis)
    const AI_INSIGHT = `${influencer.name}님은 '${influencer.niche[0]}' 카테고리에서 독보적인 감각을 보유하고 있습니다. 특히 2030 여성 타겟의 인게이지먼트가 평균 대비 150% 높으며, 사장님 가게의 '모던한 분위기'를 릴스로 표현하기에 최적화된 파트너입니다.`;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            {/* Modal Container: Single Card, Split Layout on Desktop */}
            <div className="bg-white rounded-[24px] max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row relative">

                {/* Close Button (Absolute) */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 z-20 p-2 bg-white/50 hover:bg-white rounded-full backdrop-blur-md transition-all text-[#4B5563] hover:text-[#191F28]"
                >
                    <X size={22} />
                </button>

                {/* [LEFT] Profile Sidebar (Gradient Background) */}
                <div className="md:w-[320px] bg-[#F9FAFB] border-r border-[#F2F4F6] flex flex-col overflow-y-auto shrink-0">
                    {/* Profile Header */}
                    <div className="p-8 flex flex-col items-center text-center border-b border-[#F2F4F6] bg-white">
                        <div className="relative mb-4">
                            <div className="w-[120px] h-[120px] rounded-full p-1 bg-gradient-to-tr from-[#FF5A36] to-[#002B7A]">
                                <img
                                    src={influencer.profileImage}
                                    alt={influencer.name}
                                    className="w-full h-full rounded-full object-cover border-4 border-white"
                                />
                            </div>
                            <div className="absolute bottom-0 right-0 bg-[#333D4B] text-white text-[11px] font-bold px-2 py-1 rounded-full border-2 border-white shadow-sm">
                                PRO
                            </div>
                        </div>
                        <h2 className="text-[24px] font-extrabold text-[#191F28] font-pretendard tracking-tight mb-1">
                            {influencer.name}
                        </h2>
                        <div className="flex items-center gap-1.5 text-[#505967] text-[14px] font-medium mb-3">
                            <MapPin size={14} />
                            {influencer.location}
                        </div>
                        <div className="flex flex-wrap justify-center gap-1.5">
                            {influencer.tags.map((tag) => (
                                <span key={tag} className="px-2.5 py-1 bg-[#F2F4F6] text-[#4B5563] text-[12px] font-semibold rounded-md">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Key Stats */}
                    <div className="p-6 grid grid-cols-2 gap-4">
                        <div className="flex flex-col items-center bg-white p-4 rounded-2xl border border-[#F2F4F6] shadow-sm">
                            <span className="text-[12px] text-[#8B95A1] font-bold mb-1">팔로워</span>
                            <span className="text-[20px] font-extrabold text-[#191F28]">{(influencer.followers / 1000).toFixed(1)}K</span>
                        </div>
                        <div className="flex flex-col items-center bg-white p-4 rounded-2xl border border-[#F2F4F6] shadow-sm">
                            <span className="text-[12px] text-[#8B95A1] font-bold mb-1">평점</span>
                            <div className="flex items-center gap-1">
                                <Star size={14} className="fill-[#FFB800] text-[#FFB800]" />
                                <span className="text-[20px] font-extrabold text-[#191F28]">{influencer.rating}</span>
                            </div>
                        </div>
                        <div className="col-span-2 bg-[#E8F3FF] p-4 rounded-2xl flex items-center justify-between border border-[#CFE5FF]">
                            <div className="flex flex-col">
                                <span className="text-[11px] text-[#002B7A] font-bold opacity-80">매칭 적합도</span>
                                <span className="text-[22px] font-extrabold text-[#002B7A]">{influencer.matchScore}점</span>
                            </div>
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#002B7A] shadow-sm">
                                <Award size={20} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* [RIGHT] Main Content Area */}
                <div className="flex-1 overflow-y-auto bg-white flex flex-col">
                    <div className="p-8 pb-32">
                        {/* 1. AI Analysis Card */}
                        <div className="mb-8">
                            <h3 className="text-[18px] font-bold text-[#191F28] mb-3 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-[#002B7A] rounded-full"></span>
                                AI 매칭 분석
                            </h3>
                            <div className="bg-[#F9FAFB] rounded-[20px] p-6 border border-[#F2F4F6]">
                                <div className="flex gap-3">
                                    <div className="mt-1 w-8 h-8 bg-[#E8F3FF] rounded-full flex items-center justify-center text-[#002B7A] shrink-0">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="text-[15px] font-bold text-[#191F28] mb-1">사장님 가게와 <span className="text-[#002B7A]">98% 일치</span>하는 스타일입니다</h4>
                                        <p className="text-[15px] text-[#4B5563] leading-relaxed break-keep">
                                            {AI_INSIGHT}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Portfolio Grid */}
                        <div className="mb-8">
                            <h3 className="text-[18px] font-bold text-[#191F28] mb-3 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-[#FF5A36] rounded-full"></span>
                                주요 포트폴리오
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {influencer.portfolio.map((item, index) => (
                                    <div key={index} className="group cursor-pointer">
                                        <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 border border-[#E5E8EB] mb-2.5">
                                            <img
                                                src={item.thumbnail}
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                <div className="bg-white/90 p-2 rounded-full shadow-md">
                                                    <ExternalLink size={16} className="text-[#191F28]" />
                                                </div>
                                            </div>
                                        </div>
                                        <h4 className="text-[15px] font-bold text-[#191F28] leading-snug line-clamp-1 group-hover:text-[#002B7A] transition-colors">
                                            {item.title}
                                        </h4>
                                        <div className="flex items-center gap-3 mt-1 text-[13px] text-[#8B95A1]">
                                            <span className="flex items-center gap-1">
                                                <Users size={12} /> {(item.views / 1000).toFixed(1)}K Views
                                            </span>
                                            <span className="w-0.5 h-3 bg-[#E5E8EB]"></span>
                                            <span>2일 전</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 3. Bio */}
                        <div>
                            <h3 className="text-[18px] font-bold text-[#191F28] mb-3 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-[#333D4B] rounded-full"></span>
                                소개
                            </h3>
                            <p className="text-[16px] text-[#4B5563] leading-relaxed bg-white whitespace-pre-line">
                                {influencer.bio}
                            </p>
                        </div>
                    </div>

                    {/* Bottom Action Bar (Floating/Sticky inside Modal) */}
                    <div className="absolute bottom-0 left-0 md:left-[320px] right-0 p-6 bg-white border-t border-[#F2F4F6] flex items-center justify-between z-10">
                        <div className="flex flex-col">
                            <span className="text-[12px] text-[#8B95A1] font-medium">예상 원고료</span>
                            <span className="text-[18px] font-bold text-[#191F28]">협의 가능</span>
                        </div>
                        <button
                            onClick={onRequest}
                            className="flex items-center gap-2 px-8 py-3.5 bg-[#191F28] text-white text-[16px] font-bold rounded-xl hover:bg-[#333D4B] transition-all shadow-lg shadow-gray-200 active:scale-95"
                        >
                            제안 보내기 <ArrowRight size={18} />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
