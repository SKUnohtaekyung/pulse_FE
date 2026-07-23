import React from 'react';
import { formatNumber, formatText, toArray, toFiniteNumber } from '../../../utils/safeFormat';

const V2ReelsContributionList = ({ reels }) => {
    const items = toArray(reels);
    if (!items.length) {
        return (
            <p className="text-[13px] text-gray-400 text-center py-4">
                이번 기간 업로드된 릴스가 없어요.
            </p>
        );
    }

    return (
        <ol className="flex flex-col gap-4">
            {items.map((reel, i) => {
                // 응답 필드가 비어도 "undefined%" 같은 값이 화면에 나오지 않게 한다.
                const rate = toFiniteNumber(reel?.contributionRate);
                const clampedRate = rate === null ? null : Math.max(0, Math.min(100, rate));
                return (
                <li key={reel?.id ?? i} className="flex items-start gap-3">
                    {/* 순위 배지 */}
                    <span
                        className={[
                            'w-6 h-6 flex items-center justify-center text-[11px] font-bold text-white rounded-full shrink-0 mt-0.5',
                            i === 0 ? 'bg-primary' : i === 1 ? 'bg-primary-sub' : 'bg-primary-inactive',
                        ].join(' ')}
                    >
                        {i + 1}
                    </span>

                    {/* 본문 */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-2 mb-1.5">
                            <span className="text-[13px] font-semibold text-[#191F28] truncate">
                                {formatText(reel?.title, '제목 없는 릴스')}
                            </span>
                            <span className="text-[13px] font-bold text-[#002B7A] shrink-0">
                                {formatNumber(reel?.reach, { suffix: '회' })}
                            </span>
                        </div>
                        {/* 기여율 바 */}
                        <div className="h-1.5 bg-bg-page rounded-full overflow-hidden">
                            <div
                                className={[
                                    'h-full rounded-full origin-left transition-transform duration-300',
                                    i === 0 ? 'bg-primary' : i === 1 ? 'bg-primary-sub' : 'bg-primary-inactive',
                                ].join(' ')}
                                style={{ width: '100%', transform: `scaleX(${(clampedRate ?? 0) / 100})` }}
                            />
                        </div>
                        <span className="text-[11px] text-gray-400 mt-1 block">
                            {clampedRate === null ? '기여도 집계 중' : `${Math.round(clampedRate)}% 기여`}
                        </span>
                    </div>
                </li>
                );
            })}
        </ol>
    );
};

export default V2ReelsContributionList;
