import { Calendar, Camera, MessageSquare, Star } from 'lucide-react';

const SOURCE_STYLES = {
  naver: 'bg-[#03C75A1A] text-[#03C75A]',
  kakao: 'bg-[#FEE50033] text-[#3C1E1E]',
};

function SourceBadge({ source, label }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold ${SOURCE_STYLES[source] || 'bg-neutral-100 text-neutral-700'}`}>
      <MessageSquare className="w-3 h-3" />
      {label || (source === 'naver' ? '네이버' : '카카오')}
    </span>
  );
}

function RatingStars({ rating }) {
  if (!rating) {
    return <span className="text-xs text-neutral-400">평점 정보 없음</span>;
  }

  const rounded = Math.round(rating);
  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className="w-3.5 h-3.5"
            fill={index < rounded ? '#F5B700' : 'none'}
            color={index < rounded ? '#F5B700' : '#D4D8DD'}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-neutral-500">{rating.toFixed(1)}</span>
    </div>
  );
}

export function ReviewCard({ review, isSelected = false, onClick = null }) {
  const clickable = typeof onClick === 'function';

  return (
    <button
      type="button"
      onClick={clickable ? () => onClick(review.id) : undefined}
      className={`w-full text-left bg-white rounded-2xl p-6 shadow-sm border transition-all ${
        clickable ? 'hover:shadow-md cursor-pointer' : 'hover:shadow-md'
      } ${isSelected ? 'border-[#002B7A] ring-2 ring-[#002B7A1A]' : 'border-neutral-200'}`}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <SourceBadge source={review.source} label={review.sourceLabel} />
            {review.hasPhoto && (
              <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#002B7A1A] text-[#002B7A] rounded-lg text-xs font-semibold">
                <Camera className="w-3 h-3" />
                사진 리뷰
              </span>
            )}
            {isSelected && (
              <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#002B7A] text-white rounded-lg text-xs font-semibold">
                답변 대상
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap text-sm text-neutral-500">
            <span className="font-medium text-neutral-700">{review.author || '리뷰어'}</span>
            {review.date && (
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {review.date}
              </span>
            )}
          </div>
        </div>
        <RatingStars rating={review.rating} />
      </div>

      <p className="text-neutral-700 leading-relaxed whitespace-pre-line">{review.content}</p>
    </button>
  );
}

export function ReviewList({ reviews, selectedReviewIds = [], onReviewClick = null }) {
  const naverCount = reviews.filter((review) => review.source === 'naver').length;
  const kakaoCount = reviews.filter((review) => review.source === 'kakao').length;
  const selectedSet = new Set(selectedReviewIds);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">최신 리뷰 ({reviews.length})</h3>
          <p className="mt-1 text-xs text-neutral-500">카드를 클릭하면 빠른 설정 탭에서 해당 리뷰 답변을 생성합니다.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="px-2.5 py-1 rounded-lg bg-[#03C75A1A] text-[#03C75A]">네이버 {naverCount}</span>
          <span className="px-2.5 py-1 rounded-lg bg-[#FEE50033] text-[#3C1E1E]">카카오 {kakaoCount}</span>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            isSelected={selectedSet.has(review.id)}
            onClick={onReviewClick}
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
