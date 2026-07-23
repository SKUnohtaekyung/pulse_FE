import React from 'react';
import { Users } from 'lucide-react';
import InfluencerCard from './InfluencerCard';
import { CardSkeleton, EmptyState } from '../../components/common/StateViews';
import { toArray } from '../../utils/safeFormat';

export default function InfluencerList({ influencers, onViewDetail, isLoading = false }) {
    const items = toArray(influencers);

    // 로딩과 "결과 없음"을 구분한다. (예전에는 로딩 중에도 "없습니다"가 보였다)
    if (isLoading && items.length === 0) {
        return (
            <>
                {Array.from({ length: 3 }).map((_, index) => (
                    <CardSkeleton key={index} lines={4} />
                ))}
            </>
        );
    }

    if (items.length === 0) {
        return (
            <div className="col-span-full">
                <EmptyState
                    icon={Users}
                    title="조건에 맞는 인플루언서가 없어요"
                    description="검색어를 지우거나 다른 카테고리를 선택하면 더 많은 파트너를 볼 수 있어요."
                />
            </div>
        );
    }

    return (
        <>
            {items.map((influencer, index) => (
                <InfluencerCard
                    key={influencer?.id || index}
                    influencer={influencer}
                    onViewDetail={onViewDetail}
                />
            ))}
        </>
    );
}
