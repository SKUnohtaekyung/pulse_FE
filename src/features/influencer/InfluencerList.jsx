import React from 'react';
import InfluencerCard from './InfluencerCard';

export default function InfluencerList({ influencers, onViewDetail }) {
    if (influencers.length === 0) {
        return (
            <div className="py-20 text-center">
                <p className="text-[#8B95A1] text-lg">
                    해당 조건의 인플루언서가 없습니다.<br />
                    다른 검색어나 카테고리를 선택해보세요.
                </p>
            </div>
        );
    }

    return (
        <>
            {influencers.map((influencer) => (
                <InfluencerCard
                    key={influencer.id}
                    influencer={influencer}
                    onViewDetail={onViewDetail}
                />
            ))}
        </>
    );
}
