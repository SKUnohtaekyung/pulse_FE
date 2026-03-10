import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Zap, Star, ArrowRight, Info } from 'lucide-react';

/**
 * InfluencerCard (Compact Grid Version)
 * 2열 그리드에 최적화된 컴팩트 카드
 */
export default function InfluencerCard({ influencer, onViewDetail }) {
    const navigate = useNavigate();
    const [showTooltip, setShowTooltip] = useState(false);

    // 포트폴리오 첫 번째 이미지를 대표 이미지로 사용
    const mainPortfolio = influencer.portfolio?.[0] || influencer.portfolio;

    // 툴팁에서 사용할 예시 상점 데이터 
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

    return (
        <div className="bg-white rounded-[20px] border border-[#F2F4F6] shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col h-full relative z-10 hover:z-50">

            {/* 1. Header (Compact) */}
            <div className="p-4 flex items-center gap-3 border-b border-[#F2F4F6]/50">
                <div className="w-[48px] h-[48px] rounded-full p-[1.5px] bg-gradient-to-tr from-[#FF5A36] to-[#FF8E6F] shrink-0">
                    <img
                        src={influencer.profileImage}
                        alt={influencer.name}
                        className="w-full h-full rounded-full object-cover border border-white"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                        <h3 className="text-[17px] font-bold text-[#191F28] truncate">{influencer.name}</h3>

                        {/* 뱃지와 툴팁 영역 */}
                        <div className="relative flex items-center">
                            <div className="flex items-center gap-1 bg-[#FFF4E6] text-[#FF5A36] px-1.5 py-0.5 rounded text-[11px] font-bold">
                                <Zap size={10} fill="currentColor" />
                                {influencer.matchScore}%

                                {/* Info 아이콘 및 툴팁 호버 그룹 (State 기반 제어) */}
                                <div
                                    className="relative flex items-center"
                                    onMouseEnter={() => setShowTooltip(true)}
                                    onMouseLeave={() => setShowTooltip(false)}
                                >
                                    <div className="p-1 -m-1 cursor-help opacity-70 hover:opacity-100 transition-opacity ml-0.5 z-10">
                                        <Info size={12} />
                                    </div>

                                    {/* Tooltip (Now pops downward) */}
                                    <div className={`absolute left-1/2 -translate-x-[85%] sm:-translate-x-1/2 top-[calc(100%+8px)] w-[240px] bg-white text-[#191F28] border border-[#E5E8EB] shadow-xl rounded-xl p-3 z-[100] transition-all duration-200 pointer-events-none text-left font-normal whitespace-normal ${showTooltip ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                                        <h4 className="text-[12px] font-bold mb-2.5 text-[#002B7A] flex items-center gap-1 border-b border-[#F2F4F6] pb-1.5">
                                            <Star size={12} className="text-[#002B7A]" />
                                            AI 매칭 분석 요약
                                        </h4>
                                        <div className="flex flex-col gap-2.5">
                                            <div>
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-[11px] font-bold text-[#333D4B]">상세 키워드 유사도</span>
                                                    <span className="text-[11px] font-bold text-[#002B7A]">{tagMatchPercent}%</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-[#F2F4F6] rounded-full overflow-hidden">
                                                    <div className="h-full bg-[#002B7A] rounded-full" style={{ width: `${Math.max(tagMatchPercent, 10)}%` }}></div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1.5 mt-1">
                                                <div className="flex items-center gap-1.5">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${isAreaMatch ? 'bg-[#FF5A36]' : 'bg-[#D1D6DB]'}`}></div>
                                                    <span className="text-[11px] text-[#4E5968] leading-none">활동 지역 일치 <strong className="text-[#333D4B]">({storeGu})</strong></span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${isDemographicMatch ? 'bg-[#FF5A36]' : 'bg-[#D1D6DB]'}`}></div>
                                                    <span className="text-[11px] text-[#4E5968] leading-none">타겟 고객 일치 <strong className="text-[#333D4B]">({storeInfo.targetAge}대)</strong></span>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Arrow (Now at top of tooltip) */}
                                        <div className="absolute left-[85%] sm:left-1/2 -translate-x-1/2 bottom-[calc(100%-6px)] w-2.5 h-2.5 bg-white border-t border-l border-[#E5E8EB] transform rotate-45"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="text-[13px] text-[#8B95A1] flex items-center gap-1 mt-0.5 truncate">
                        <span>{influencer.location.split(" ")[1] || influencer.location}</span>
                        <span className="w-0.5 h-2 bg-[#E5E8EB]"></span>
                        <span className="text-[#4E5968]">#{influencer.niche[0]}</span>
                    </div>
                </div>
            </div>

            {/* 2. Main Visual (Single Image) */}
            <div className="aspect-[4/3] bg-gray-100 relative cursor-pointer overflow-hidden" onClick={() => navigate(`/influencer-matching/request/${influencer.id}`)}>
                <img
                    src={mainPortfolio.thumbnail}
                    alt="Portfolio"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full">
                    <div className="flex items-center gap-1">
                        <Star size={10} fill="#FFB300" className="text-[#FFB300]" />
                        {influencer.rating}
                    </div>
                </div>
            </div>

            {/* 3. Bio & Footer */}
            <div className="p-4 flex flex-col flex-1 gap-4">
                <p className="text-[14px] text-[#4E5968] line-clamp-2 h-[42px] leading-relaxed">
                    {influencer.bio}
                </p>

                <div className="mt-auto flex gap-2">
                    <button
                        className="flex-1 h-[42px] rounded-xl border border-[#E5E8EB] bg-white text-[#6B7684] text-[14px] font-bold hover:bg-[#F9FAFB] transition-colors"
                        onClick={() => onViewDetail(influencer)}
                    >
                        프로필 상세
                    </button>
                    <button
                        onClick={() => navigate(`/influencer-matching/request/${influencer.id}`)}
                        className="flex-[1.5] h-[42px] rounded-xl bg-[#191F28] text-white text-[14px] font-bold hover:bg-[#333D4B] transition-colors flex items-center justify-center gap-1"
                    >
                        제안하기
                        <ArrowRight size={14} />
                    </button>
                </div>
            </div>

        </div>
    );
}
