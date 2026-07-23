/**
 * ============================================================================
 * REVIEW SUMMARY COMPONENT
 * ============================================================================
 * 리뷰 총 평점 및 평가요소 표시 컴포넌트
 * ============================================================================
 */

import { Star, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { EmptyState } from '../../../components/common/StateViews';
import { formatNumber, toArray, toFiniteNumber } from '../../../utils/safeFormat';

// 평가 등급별 색상 정의
const RATING_COLORS = {
    great: '#3B82F6',  // 파란색
    good: '#10B981',   // 초록색
    soso: '#8B5CF6',   // 보라색
    bad: '#F97316',    // 주황색
    worst: '#EF4444'   // 빨간색
};

// 평가 등급별 라벨
const RATING_LABELS = {
    great: '평균 평점 · Great',
    good: '평균 평점 · Good',
    soso: '평균 평점 · So-so',
    bad: '평균 평점 · Bad',
    worst: '평균 평점 · Worst'
};

/**
 * 평가요소 바 컴포넌트
 * @param {Object} props
 * @param {Object} props.metric - 평가 지표 데이터
 */
function EvaluationBar({ metric, index }) {
    const [showReason, setShowReason] = useState(false);
    const reasonId = `evaluation-reason-${index}`;

    // 응답 필드가 비어 있어도 "undefined%" 같은 값이 화면에 나오지 않도록 방어한다.
    const color = RATING_COLORS[metric?.rating] || '#94A3B8';
    const label = RATING_LABELS[metric?.rating] || '평균 평점';
    const percentValue = toFiniteNumber(metric?.percentage);
    const clampedPercent = percentValue === null ? null : Math.max(0, Math.min(100, percentValue));
    const reason = typeof metric?.reason === 'string' && metric.reason.trim() ? metric.reason.trim() : null;

    return (
        <div className="mb-6">
            <div className="flex justify-between items-center mb-2 gap-2">
                <span className="text-gray-700 font-medium break-keep">{metric?.name || '평가 항목'}</span>
                <span className="font-bold shrink-0" style={{ color }}>
                    {label}
                </span>
            </div>

            {/* 그라데이션 바 */}
            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full transition-transform duration-500 origin-left"
                    style={{
                        width: '100%',
                        transform: `scaleX(${(clampedPercent ?? 0) / 100})`,
                        background: `linear-gradient(to right, #FCD34D, ${color})`
                    }}
                />
            </div>

            <div className="flex justify-between items-center mt-1">
                <span className="text-sm text-gray-500">
                    {clampedPercent === null ? '집계 중' : `${Math.round(clampedPercent)}%`}
                </span>
                {reason && (
                    <button
                        type="button"
                        onClick={() => setShowReason(!showReason)}
                        aria-expanded={showReason}
                        aria-controls={reasonId}
                        className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 rounded
                                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                        자세히 보기
                        <ChevronDown
                            size={16}
                            className={`transition-transform ${showReason ? 'rotate-180' : ''}`}
                            aria-hidden="true"
                        />
                    </button>
                )}
            </div>

            {/* 이유 표시 */}
            {showReason && reason && (
                <div id={reasonId} className="mt-3 p-4 bg-gray-50 rounded-lg text-sm text-gray-700 break-keep">
                    {reason}
                </div>
            )}
        </div>
    );
}

/**
 * 별점 표시 컴포넌트
 * @param {Object} props
 * @param {number} props.rating - 평점 (0-5)
 */
function StarRating({ rating }) {
    // rating 이 NaN 이거나 5를 넘으면 Array(NaN) / Array(음수) 로 RangeError 가 났다.
    // 항상 0~5 사이 유한한 값으로 고정한다.
    const safeRating = Math.max(0, Math.min(5, toFiniteNumber(rating) ?? 0));
    const fullStars = Math.floor(safeRating);
    const hasHalfStar = safeRating % 1 >= 0.5;
    const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));

    return (
        <div className="flex gap-1 justify-center" role="img" aria-label={`5점 만점에 ${safeRating.toFixed(1)}점`}>
            {/* 꽉 찬 별 */}
            {[...Array(fullStars)].map((_, i) => (
                <Star key={`full-${i}`} size={32} fill="#FCD34D" color="#FCD34D" />
            ))}
            
            {/* 반 별 */}
            {hasHalfStar && (
                <div className="relative">
                    <Star size={32} color="#FCD34D" fill="none" />
                    <div className="absolute top-0 left-0 overflow-hidden" style={{ width: '50%' }}>
                        <Star size={32} fill="#FCD34D" color="#FCD34D" />
                    </div>
                </div>
            )}
            
            {/* 빈 별 */}
            {[...Array(emptyStars)].map((_, i) => (
                <Star key={`empty-${i}`} size={32} color="#D1D5DB" fill="none" />
            ))}
        </div>
    );
}

/**
 * 리뷰 요약 컴포넌트
 * @param {Object} props
 * @param {number} props.averageRating - 평균 평점
 * @param {number} props.totalReviews - 총 리뷰 수
 * @param {Array} props.evaluationMetrics - 평가 지표 배열
 */
export function ReviewSummary({ averageRating, totalReviews, evaluationMetrics }) {
    // 응답 필드가 일부만 와도 표시 가능한 정보는 그대로 보여준다.
    const rating = toFiniteNumber(averageRating);
    const metrics = toArray(evaluationMetrics);

    return (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            {/* 총 평점 */}
            <div className="text-center mb-8 pb-8 border-b border-gray-200">
                <div className="text-6xl font-bold mb-3">{rating === null ? '—' : rating.toFixed(2)}</div>
                <StarRating rating={rating} />
                <div className="text-gray-500 mt-3">
                    ({formatNumber(totalReviews, { fallback: '0' })}건의 평가)
                </div>
            </div>

            {/* 평가요소 */}
            <div>
                <h3 className="text-xl font-bold mb-6">평가요소</h3>
                {metrics.length > 0 ? (
                    metrics.map((metric, index) => (
                        <EvaluationBar key={metric?.name || index} metric={metric} index={index} />
                    ))
                ) : (
                    <EmptyState
                        compact
                        icon={Star}
                        title="아직 평가요소를 계산하지 못했어요"
                        description="리뷰가 쌓이면 맛·응대·분위기 같은 항목별 평가를 확인할 수 있어요."
                    />
                )}
            </div>
        </div>
    );
}
