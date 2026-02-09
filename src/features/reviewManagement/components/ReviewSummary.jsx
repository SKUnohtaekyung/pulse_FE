/**
 * ============================================================================
 * REVIEW SUMMARY COMPONENT
 * ============================================================================
 * 리뷰 총 평점 및 평가요소 표시 컴포넌트
 * ============================================================================
 */

import { Star, ChevronDown } from 'lucide-react';
import { useState } from 'react';

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
function EvaluationBar({ metric }) {
    const [showReason, setShowReason] = useState(false);
    const color = RATING_COLORS[metric.rating];
    const label = RATING_LABELS[metric.rating];

    return (
        <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-medium">{metric.name}</span>
                <span className="font-bold" style={{ color }}>
                    {label}
                </span>
            </div>
            
            {/* 그라데이션 바 */}
            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                        width: `${metric.percentage}%`,
                        background: `linear-gradient(to right, #FCD34D, ${color})`
                    }}
                />
            </div>
            
            <div className="flex justify-between items-center mt-1">
                <span className="text-sm text-gray-500">{metric.percentage}%</span>
                <button
                    onClick={() => setShowReason(!showReason)}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                    자세히 보기
                    <ChevronDown 
                        size={16} 
                        className={`transition-transform ${showReason ? 'rotate-180' : ''}`}
                    />
                </button>
            </div>
            
            {/* 이유 표시 */}
            {showReason && (
                <div className="mt-3 p-4 bg-gray-50 rounded-lg text-sm text-gray-700">
                    {metric.reason}
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
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="flex gap-1 justify-center">
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
    return (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            {/* 총 평점 */}
            <div className="text-center mb-8 pb-8 border-b border-gray-200">
                <div className="text-6xl font-bold mb-3">{averageRating.toFixed(2)}</div>
                <StarRating rating={averageRating} />
                <div className="text-gray-500 mt-3">
                    ({totalReviews.toLocaleString()}건의 평가)
                </div>
            </div>

            {/* 평가요소 */}
            <div>
                <h3 className="text-xl font-bold mb-6">평가요소</h3>
                {evaluationMetrics.map((metric, index) => (
                    <EvaluationBar key={index} metric={metric} />
                ))}
            </div>
        </div>
    );
}
