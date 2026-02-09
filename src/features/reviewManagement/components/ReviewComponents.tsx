/**
 * ============================================================================
 * REVIEW COMPONENTS
 * ============================================================================
 * 이 파일은 리뷰 관련 컴포넌트들을 포함합니다.
 * 
 * 포함된 컴포넌트:
 * - ReviewCard: 개별 리뷰 카드 표시
 * - ReviewDashboard: 리뷰 목록 대시보드
 * ============================================================================
 */

import { Star, Camera, FileText } from 'lucide-react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface Review {
  reviewerName: string;
  rating: number;
  date: string;
  text: string;
  hasPhoto: boolean;
  keywords: string[];
}

interface ReviewCardProps {
  review: Review;
}

// ============================================================================
// REVIEW CARD COMPONENT
// ============================================================================
/**
 * 개별 리뷰 카드 컴포넌트
 * - 리뷰어 이름, 별점, 날짜 표시
 * - 리뷰 텍스트 및 키워드 표시
 * - 사진/텍스트 리뷰 구분
 * - 낮은 평점(2점 이하)일 경우 CS Mode 표시
 */
export function ReviewCard({ review }: ReviewCardProps) {
  const isLowRating = review.rating <= 2;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-neutral-900">{review.reviewerName}</h3>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < review.rating
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-neutral-300'
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-sm text-neutral-500">{review.date}</p>
        </div>

        <div className="flex items-center gap-2">
          {review.hasPhoto ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#002B7A1A] text-[#002B7A] rounded-lg text-sm font-medium">
              <Camera className="w-4 h-4" />
              Photo review
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 text-neutral-700 rounded-lg text-sm font-medium">
              <FileText className="w-4 h-4" />
              Text review
            </span>
          )}
        </div>
      </div>

      <p className="text-neutral-700 leading-relaxed mb-3">
        {review.text}
        {review.text.length > 150 && (
          <button className="text-[#002B7A] hover:text-[#002B7AE6] ml-1 font-medium">
            more
          </button>
        )}
      </p>

      {review.keywords.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {review.keywords.map((keyword) => (
            <span
              key={keyword}
              className="px-2.5 py-1 bg-neutral-100 text-neutral-600 rounded-lg text-sm"
            >
              #{keyword}
            </span>
          ))}
        </div>
      )}

      {/* CS Mode for low ratings */}
      {isLowRating && (
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg text-sm font-semibold">
              CS Mode
            </span>
            <span className="text-sm text-amber-800">Low rating detected</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 bg-white border border-amber-300 text-amber-900 rounded-lg text-sm font-medium hover:bg-amber-50 transition-colors">
              Apologize + resolution
            </button>
            <button className="px-4 py-2 bg-white border border-amber-300 text-amber-900 rounded-lg text-sm font-medium hover:bg-amber-50 transition-colors">
              Ask to contact
            </button>
            <button className="px-4 py-2 bg-white border border-amber-300 text-amber-900 rounded-lg text-sm font-medium hover:bg-amber-50 transition-colors">
              Polite explanation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// REVIEW DASHBOARD COMPONENT
// ============================================================================
/**
 * 리뷰 대시보드 컴포넌트
 * - 최근 리뷰 목록 표시
 * - 각 리뷰를 ReviewCard로 렌더링
 */
export function ReviewDashboard() {
  // Mock data - 실제 사용 시 props나 API로 대체
  const mockReviews: Review[] = [
    {
      reviewerName: 'Sarah Kim',
      rating: 5,
      date: '2 hours ago',
      text: 'Amazing coffee and cozy atmosphere! The Dutch&Bean latte was perfect. Will definitely come back!',
      hasPhoto: true,
      keywords: ['coffee', 'atmosphere', 'latte']
    },
    {
      reviewerName: 'John Park',
      rating: 4,
      date: '5 hours ago',
      text: 'Great place for work. WiFi is fast and seats are comfortable. Coffee is good too.',
      hasPhoto: false,
      keywords: ['work-friendly', 'wifi', 'comfortable']
    },
    {
      reviewerName: 'Emma Lee',
      rating: 2,
      date: '1 day ago',
      text: 'Coffee was cold when served. Service was slow. Not satisfied with my visit.',
      hasPhoto: false,
      keywords: ['service', 'cold-coffee']
    }
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
        <h2 className="font-semibold text-neutral-900 mb-4">Recent Reviews</h2>
        <div className="space-y-4">
          {mockReviews.map((review, index) => (
            <ReviewCard key={index} review={review} />
          ))}
        </div>
      </div>
    </div>
  );
}
