// src/features/reviewManagement/api/reviewManagementApi.js

// 목업 데이터로 덮어씌워진 API (백엔드 통신 없음)

export function fetchReviewManagementContext() {
  return Promise.resolve({
    summary: {
      averageRating: 4.3,
      totalReviews: 312,
      evaluationMetrics: [
        { name: '국물맛', rating: 'great', percentage: 94, reason: '칼칼하고 얼큰한 국물이 강한 인상을 남깁니다. 고소하면서도 깊은 풍미라는 언급이 반복됩니다.' },
        { name: '수제비 식감', rating: 'good', percentage: 76, reason: '쫄깃한 면발에 대한 호평이 많지만, 일부는 두께가 고르지 않다는 의견도 있습니다.' },
        { name: '양/가성비', rating: 'great', percentage: 91, reason: '양이 넉넉하고 가격 대비 만족도가 높다는 평가가 지배적입니다.' },
        { name: '응대/서비스', rating: 'good', percentage: 82, reason: '친절하다는 평이 많고, 웨이팅 안내도 잘 이뤄진다는 긍정 반응이 있습니다.' }
      ]
    },
    reviews: [
      { id: '1', author: '김철수', date: '2026-02-11', rating: 3, content: '순한맛(하), 약간 매운맛(중) 두가지 시켰어요. 매운거 잘 먹는 편인데 매워서 콧물이 자꾸 나더라구요 ㅋ 남편은 순한맛도 매워했구요. 수제비면이 제가 집에서 반죽한 것 같은 질감이라 약간 불만족이여요 ㅋㅋ', hasPhoto: true },
      { id: '2', author: '이영희', date: '2026-01-13', rating: 5, content: '스트레스를 확 날릴 수 있는 얼큰 수제비. 역시 깔끔하고 맛있어요. 김치도 맛있고 . 오늘 친구와 갔는데 이친구 단골 되겠어요. 너무너무 맛있대요. 또 와야죠', hasPhoto: true },
      { id: '3', author: '박민수', date: '2026-01-08', rating: 5, content: '수제비 최애 하는곳~ 칼칼한맛에 중독압니다.', hasPhoto: true }
    ],
    settings: {
      brandPreset: '바람난 얼큰 수제비',
    },
    templates: []
  });
}

export function saveReviewManagementSettings(settings) {
  return Promise.resolve(settings);
}

export function createReviewTemplate(template) {
  return Promise.resolve({ ...template, id: Date.now().toString() });
}

export function updateReviewTemplate(templateId, template) {
  return Promise.resolve({ ...template, id: templateId });
}

export function deleteReviewTemplate(templateId) {
  return Promise.resolve({});
}

export function generateReviewReplies(payload) {
  const replies = payload.reviews.map(review => {
    let content = `안녕하세요! 바람난 얼큰 수제비입니다.\n\n소중한 리뷰 남겨주셔서 진심으로 감사합니다. 언제나 변함없이 맛있는 얼큰 수제비로 보답해 드리겠습니다!\n\n오늘도 좋은 하루 보내세요 😊`;
    
    // 특정 리뷰에 대한 맞춤형 답변 예시
    if (review.rating === 3) {
      content = `안녕하세요, 김철수 고객님.\n바람난 얼큰 수제비 범계점입니다.\n\n매운맛과 수제비 식감에서 다소 아쉬움을 드린 것 같아 죄송한 마음입니다. ㅠㅠ 댁에서 직접 빚으신 것 같은 찰진 식감을 기대하셨을 텐데, 아무래도 저희 제면 방식이 조금 다르게 느껴지셨던 것 같아요. 말씀해주신 소중한 의견 귀 기울여 더욱 만족스러운 식감과 맛 조절이 가능하도록 노력해 나가겠습니다.\n\n아쉬운 점이 있으셨음에도 이렇게 리뷰 남겨주셔서 감사드리며, 다음 번엔 더 큰 만족 드릴 수 있도록 최선을 다하겠습니다!\n\n평안한 하루 보내세요 🍀`;
    } 
    else if (review.author === '이영희') {
      content = `안녕하세요, 이영희 고객님!\n바람난 얼큰 수제비 범계점입니다.\n\n친구분과 함께 만족스럽게 드셨다니 저희가 다 뿌듯하고 행복합니다. 스트레스 확 풀리는 얼큰함과 깔끔한 김치의 조합은 저희 매장의 핵심 포인트랍니다! 단골 예약해주셔서 너무나 감사드리고요, 언제든 다시 방문해주시면 더욱 정성 가득 담은 수제비 끓여서 대접하겠습니다.\n\n오늘도 얼큰하고 기분 좋은 하루 보내세요! 😍`;
    }

    return {
      reviewId: review.id,
      content,
      isRecommended: true
    };
  });
  
  // AI 생성 시뮬레이션 지연 (1.5초)
  return new Promise(resolve => setTimeout(() => resolve({ replies }), 1500));
}
