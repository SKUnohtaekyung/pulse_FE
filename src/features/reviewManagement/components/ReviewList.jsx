/**
 * ============================================================================
 * REVIEW LIST COMPONENT
 * ============================================================================
 * 원문 리뷰 목록을 표시하는 컴포넌트
 * ============================================================================
 */

import { Calendar, Camera } from 'lucide-react';

// ============================================================================
// REVIEW CARD COMPONENT
// ============================================================================

function ReviewCard({ review }) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200 hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                    <Calendar className="w-4 h-4" />
                    <span>{review.date}</span>
                    {review.hasPhoto && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#002B7A1A] text-[#002B7A] rounded-lg text-xs font-semibold ml-2">
                            <Camera className="w-3 h-3" />
                            사진 리뷰
                        </span>
                    )}
                </div>

            </div>

            {/* Content */}
            <p className="text-neutral-700 leading-relaxed">{review.content}</p>
        </div>
    );
}

// ============================================================================
// REVIEW LIST COMPONENT
// ============================================================================

/**
 * 원문 리뷰 목록 컴포넌트
 * - 최신 리뷰 표시
 */
export function ReviewList({ reviews }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-neutral-900">
                    최신 리뷰 ({reviews.length})
                </h3>
            </div>

            <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                {reviews.map((review) => (
                    <ReviewCard
                        key={review.id}
                        review={review}
                    />
                ))}
            </div>

            {reviews.length === 0 && (
                <div className="text-center py-12 text-neutral-500">
                    <p>표시할 리뷰가 없습니다.</p>
                </div>
            )}
        </div>
    );
}
