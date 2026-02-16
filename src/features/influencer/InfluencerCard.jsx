import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Zap, Star, ArrowRight } from 'lucide-react';

/**
 * InfluencerCard (Compact Grid Version)
 * 2열 그리드에 최적화된 컴팩트 카드
 */
export default function InfluencerCard({ influencer, onViewDetail }) {
    const navigate = useNavigate();

    // 포트폴리오 첫 번째 이미지를 대표 이미지로 사용
    const mainPortfolio = influencer.portfolio[0];

    return (
        <div className="bg-white rounded-[20px] border border-[#F2F4F6] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col h-full">

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
                        <div className="flex items-center gap-1 bg-[#FFF4E6] text-[#FF5A36] px-1.5 py-0.5 rounded text-[11px] font-bold">
                            <Zap size={10} fill="currentColor" />
                            {influencer.matchScore}%
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
            <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden cursor-pointer" onClick={() => navigate(`/influencer-matching/request/${influencer.id}`)}>
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
