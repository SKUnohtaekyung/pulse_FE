import React from 'react';
import { X, Users, Clock, Star, ExternalLink, MapPin, Award, ArrowRight, Info } from 'lucide-react';

/**
 * InfluencerDetailModal (Premium Redesign)
 * High-end profile card layout with split view
 */
export default function InfluencerDetailModal({ influencer, onClose, onRequest }) {
    // 툴팁에서 사용할 예시 상점 데이터 (실제로는 부모나 전역상태에서 받아옴)
    const storeInfo = {
        tags: ['#데이트', '#모던', '#하이볼', '#감성', '#신상맛집'],
        targetAge: 20,
        targetGender: 'female',
        address: '서울 강남구 역삼동'
    };

    // Jaccard Similarity (교집합 / 합집합)
    const storeTags = storeInfo.tags;
    const infTags = influencer.keywords || [];
    const intersection = storeTags.filter(tag => infTags.includes(tag)).length;
    const union = new Set([...storeTags, ...infTags]).size;
    const tagMatchPercent = union === 0 ? 0 : Math.round((intersection / union) * 100);

    // Activity Area Match
    const storeGu = storeInfo.address.split(' ')[1] || '';
    const isAreaMatch = (influencer.activityArea || []).includes(storeGu);

    // Audience Match
    const isDemographicMatch = influencer.followerBase &&
        storeInfo.targetAge >= influencer.followerBase.age[0] && storeInfo.targetAge <= influencer.followerBase.age[1] &&
        (influencer.followerBase.gender === 'all' || influencer.followerBase.gender === storeInfo.targetGender);
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
                <div className="md:w-[320px] bg-[#F9FAFB] border-r border-[#F2F4F6] flex flex-col overflow-hidden shrink-0">
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
                                <div className="flex items-center gap-1 mb-0.5">
                                    <span className="text-[11px] text-[#002B7A] font-bold opacity-80">매칭 적합도</span>
                                    <div className="relative group flex items-center">
                                        <div className="p-1 -m-1 cursor-help text-[#002B7A] opacity-70 hover:opacity-100 transition-opacity">
                                            <Info size={12} />
                                        </div>
                                        {/* Tooltip */}
                                        <div className="absolute left-0 bottom-[calc(100%+8px)] w-[260px] bg-white text-[#191F28] border border-[#F2F4F6] shadow-xl rounded-xl p-4 z-[100] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none text-left font-normal whitespace-normal">
                                            <h4 className="text-[13px] font-bold mb-3 text-[#002B7A] flex items-center gap-1.5 border-b border-[#F2F4F6] pb-2">
                                                <Star size={14} className="text-[#002B7A]" />
                                                AI 매칭 분석 상세
                                            </h4>
                                            <div className="flex flex-col gap-3.5">
                                                {/* Metric 1 */}
                                                <div>
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-[12px] font-bold text-[#333D4B]">키워드 유사도 (Jaccard)</span>
                                                        <span className="text-[12px] font-bold text-[#002B7A]">{tagMatchPercent}%</span>
                                                    </div>
                                                    <div className="w-full h-1.5 bg-[#F2F4F6] rounded-full overflow-hidden">
                                                        <div className="h-full bg-[#002B7A] rounded-full" style={{ width: `${Math.max(tagMatchPercent, 10)}%` }}></div>
                                                    </div>
                                                </div>
                                                {/* Metric 2 */}
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${isAreaMatch ? 'bg-[#FF5A36]' : 'bg-[#D1D6DB]'}`}></div>
                                                    <span className="text-[12px] text-[#4E5968]">활동 지역 일치 <strong className="text-[#333D4B]">({storeGu})</strong></span>
                                                </div>
                                                {/* Metric 3 */}
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${isDemographicMatch ? 'bg-[#FF5A36]' : 'bg-[#D1D6DB]'}`}></div>
                                                    <span className="text-[12px] text-[#4E5968]">타겟 고객 일치 <strong className="text-[#333D4B]">({storeInfo.targetAge}대 {storeInfo.targetGender === 'female' ? '여성' : '남성'})</strong></span>
                                                </div>
                                            </div>
                                            {/* Arrow */}
                                            <div className="absolute left-4 top-full w-3 h-3 bg-white border-b border-r border-[#F2F4F6] transform rotate-45 -mt-[6.5px]"></div>
                                        </div>
                                    </div>
                                </div>
                                <span className="text-[22px] font-extrabold text-[#002B7A]">{influencer.matchScore}점</span>
                            </div>
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#002B7A] shadow-sm">
                                <Award size={20} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* [RIGHT] Main Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-white flex flex-col">
                    <div className="p-8 pb-32">
                        {/* 1. AI Analysis Card */}
                        <div className="mb-8">
                            <h3 className="text-[18px] font-bold text-[#191F28] mb-3 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-[#002B7A] rounded-full"></span>
                                AI 매칭 분석
                            </h3>
                            <div className="bg-[#F9FAFB] rounded-[20px] p-6 border border-[#F2F4F6]">
                                <div className="flex gap-3">
                                    <div className="mt-1 w-8 h-8 bg-[#E8F3FF] rounded-full flex items-center justify-center text-[#002B7A] shrink-0 font-bold">
                                        ★
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

                        {/* 2. Channel Links */}
                        <div className="mb-8">
                            <h3 className="text-[18px] font-bold text-[#191F28] mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-[#FF5A36CC] rounded-full"></span>
                                채널 바로가기
                            </h3>
                            <div className="flex flex-col gap-3">
                                {influencer.instagramUrl && (
                                    <a
                                        href={influencer.instagramUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full h-[56px] bg-[#F9FAFB] border border-[#E5E8EB] hover:border-[#002B7A] rounded-xl flex items-center justify-between px-5 transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] flex items-center justify-center text-white font-bold text-[14px]">
                                                ig
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[15px] font-bold text-[#191F28] group-hover:text-[#002B7A] transition-colors">Instagram 프로필 가기</span>
                                                <span className="text-[12px] text-[#4E5968] font-medium">팔로워 {(influencer.instagramFollowers || 0).toLocaleString()}명</span>
                                            </div>
                                        </div>
                                        <ExternalLink size={18} className="text-[#8B95A1] group-hover:text-[#002B7A]" />
                                    </a>
                                )}
                                {influencer.youtubeUrl && (
                                    <a
                                        href={influencer.youtubeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full h-[56px] bg-[#F9FAFB] border border-[#E5E8EB] hover:border-[#FF0000] rounded-xl flex items-center justify-between px-5 transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[#FF0000] flex items-center justify-center text-white font-bold text-[14px]">
                                                ▶
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[15px] font-bold text-[#191F28] group-hover:text-[#FF0000] transition-colors">YouTube 채널 가기</span>
                                                <span className="text-[12px] text-[#4E5968] font-medium">구독자 {(influencer.youtubeSubscribers || 0).toLocaleString()}명</span>
                                            </div>
                                        </div>
                                        <ExternalLink size={18} className="text-[#8B95A1] group-hover:text-[#FF0000]" />
                                    </a>
                                )}
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
                            className="flex items-center gap-2 px-8 py-3.5 bg-[#002B7A] text-white text-[16px] font-bold rounded-xl hover:bg-[#002B7AE6] transition-all shadow-md active:scale-95"
                        >
                            제안 보내기 <ArrowRight size={18} />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
