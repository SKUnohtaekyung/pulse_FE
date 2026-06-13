/**
 * ============================================================================
 * DEV MOCK OWNER — 단일 진실 원천(SSOT)
 * ============================================================================
 * 개발(dev) 모드에서 "사장님 자동 로그인" 시 모든 화면이 공유하는
 * 단 한 명의 가상 사장님 데이터입니다.
 *
 *   사장님 : 김든든  (owner@pulse.dev)
 *   가게   : 범계 든든국밥 (한식·국밥, 경기 안양시 동안구 범계역 인근)
 *   상태   : ★4.5 · 리뷰 128개 · 평일 점심/해장 수요 강함 · 재방문율 높음
 *
 * 이 한 명의 데이터가 손님분석 → 리뷰 → 가게현황 → 상권 → 인플루언서 →
 * 홍보까지 모순 없이 흐르도록 설계되어 있습니다.
 *
 * ⚠️ 이 파일은 dev 전용 목 데이터이며, 기존 백엔드 연결 코드는 건드리지
 *    않습니다. (fetch 인터셉터 + localStorage 시딩으로만 주입)
 * ============================================================================
 */

// ── 가게 기본 정체성 (모든 슬라이스의 기준점) ──────────────────────────────
const STORE = {
  storeId: 'store_001',
  shopName: '범계 든든국밥',
  ownerName: '김든든',
  email: 'owner@pulse.dev',
  phone: '010-1234-5678',
  // Spring Category enum 코드. MyPage CATEGORY_LABELS / influencerMatchingUtils
  // CATEGORY_ALIASES 둘 다 'KOREAN' → '한식' 으로 매핑한다.
  shopCategory: 'KOREAN',
  categoryLabelKo: '한식',
  shopAddress: '경기 안양시 동안구 범계로 18',
  lat: 37.3900,
  lng: 126.9510,
  averageRating: 4.5,
  totalReviews: 128,
  plan: 'Growth',
};

// ── 1. 프로필 (localStorage['userProfile'] 시딩 대상) ──────────────────────
// readCachedProfile(authApi) + getLocalStoreProfile(influencerMatchingUtils)
// 둘 다 이 객체를 읽는다.
const profile = {
  email: STORE.email,
  name: STORE.ownerName,
  role: 'OWNER',
  ownerName: STORE.ownerName,
  shopName: STORE.shopName,
  shopCategory: STORE.shopCategory,
  shopAddress: STORE.shopAddress,
  phone: STORE.phone,
  plan: STORE.plan,
};

// 레거시 'user' 키 (InfluencerSidebar, InfluencerInbox 등이 참조)
const legacyUser = {
  id: 'owner_001',
  role: 'owner',
  name: STORE.ownerName,
  storeName: STORE.shopName,
  email: STORE.email,
};

// ── 2. 손님 분석 (/analysis/latest 응답) ───────────────────────────────────
// UnifiedInsightPage.normalizePersona / MyPage 키워드 / StatusV2Page 페르소나 /
// influencerMatchingUtils.buildStoreInsightFromAnalysisData 가 소비.
const analysis = {
  store_name: STORE.shopName,
  store_summary:
    '범계역 직장인 상권의 든든한 국밥집. 평일 점심·해장 수요가 높고, 진한 국물과 푸짐한 양으로 재방문율이 높은 가게입니다.',
  average_rating: STORE.averageRating,
  total_reviews: STORE.totalReviews,
  personas: [
    {
      id: 1,
      nickname: '시원한 국물파',
      summary: '해장이 필요한 직장인, 진한 국물 맛집을 찾아요',
      img: 'https://api.dicebear.com/7.x/adventurer/svg?seed=hangover',
      tags: ['30대', '직장인', '해장'],
      overall_comment:
        '해장 수요가 높은 고객층으로, 국물 퀄리티와 빠른 제공이 핵심입니다. 이 그룹을 잡으면 평일 오전 매출이 올라갑니다.',
      action_recommendation:
        '"10분 완성 해장국밥" 릴스를 만들어 월요일 아침에 올려보세요. 공유율이 높습니다.',
      journey: {
        explore: {
          action: '"범계 해장국밥" 키워드로 네이버 지도 검색',
          thought: '어제 과음했는데... 빨리 속 풀 곳이 필요해.',
          type: 'neutral',
          painPoint: '검색 결과에 대표 메뉴 사진이 흐릿해 선택이 어려움',
          opportunity: '네이버 플레이스에 국밥 대표 사진을 등록하면 클릭률이 오릅니다.',
        },
        visit: {
          action: '출근 전 오전 8시 30분 방문',
          thought: '줄이 없네! 바로 앉을 수 있겠다.',
          type: 'good',
          opportunity: '오전 방문 고객에게 "얼리버드 계란후라이" 서비스로 충성도를 높이세요.',
        },
        eat: {
          action: '순댓국 + 공깃밥 주문, 빠른 서빙 기대',
          thought: '국물이 진하고 뜨끈해서 딱 좋다. 역시 여기야.',
          type: 'good',
          opportunity: '"든든 순댓국" 사진 콘텐츠로 영수증 리뷰 작성을 유도하세요.',
        },
        share: {
          action: '동료에게 "해장은 여기" 카톡 공유',
          thought: '고생하는 동기한테 알려줘야지.',
          type: 'good',
          opportunity: '"영수증 리뷰 이벤트"로 공유 행동을 공식화하면 신규 유입이 늡니다.',
        },
      },
    },
    {
      id: 2,
      nickname: '가성비 직장인',
      summary: '빠른 점심이 필요한 직장인, 가성비와 속도를 중시해요',
      img: 'https://api.dicebear.com/7.x/adventurer/svg?seed=worker',
      tags: ['20-30대', '점심', '가성비'],
      overall_comment:
        '점심 피크 회전율이 핵심입니다. 대기 시간에 민감하지만, 한 번 만족하면 고정 단골이 됩니다.',
      action_recommendation:
        '"5분 안에 나오는 점심 특선"을 만들고 테이블 QR 주문을 도입해보세요.',
      journey: {
        explore: {
          action: '동료와 "오늘 뭐 먹지" 상의 후 결정',
          thought: '1시까지 돌아가야 하는데... 빠른 데 없나?',
          type: 'neutral',
          opportunity: '"점심 10분 보장" 안내판을 입구에 붙이면 선택 확률이 오릅니다.',
        },
        visit: {
          action: '12시 5분 방문, 줄 서서 대기',
          thought: '사람 많네. 빨리 앉을 수 있을까?',
          type: 'pain',
          painPoint: '입구에 대기 인원 안내가 없어 불안함',
          opportunity: '"현재 대기 0명" 보드를 설치하면 이탈을 줄일 수 있습니다.',
        },
        eat: {
          action: '제육국밥 세트 주문, 10분 내 수령',
          thought: '양 많고 든든하다. 가격 대비 만족!',
          type: 'good',
          opportunity: '대표 세트를 #가성비점심 태그와 함께 노출하세요.',
        },
        share: {
          action: '팀 단톡에 "여기 든든해" 공유',
          thought: '다음엔 팀원들이랑 같이 와야지.',
          type: 'good',
          opportunity: '"단체 방문 쿠폰"으로 그룹 방문을 유도하세요.',
        },
      },
    },
    {
      id: 3,
      nickname: '동네 단골 가족',
      summary: '주말에 부모님과 찾는 가족, 편안함과 푸짐함을 중시해요',
      img: 'https://api.dicebear.com/7.x/adventurer/svg?seed=family',
      tags: ['40-50대', '가족', '주말'],
      overall_comment:
        '주말 가족 단위 방문이 핵심입니다. 편안한 자리와 푸짐한 양이 재방문을 만듭니다.',
      action_recommendation:
        '주말 "가족 세트(국밥 4 + 수육)" 구성을 만들고 단골 적립 혜택을 안내하세요.',
      journey: {
        explore: {
          action: '"범계 가족 외식" 검색 후 평점 확인',
          thought: '부모님 모시고 편하게 먹을 곳이면 좋겠다.',
          type: 'neutral',
          painPoint: '단체석 여부가 정보에 없어 망설임',
          opportunity: '"단체석 보유" 정보를 플레이스에 노출하세요.',
        },
        visit: {
          action: '주말 정오, 4인 방문',
          thought: '자리도 넓고 어르신 모시기 편하네.',
          type: 'good',
          opportunity: '어르신 대상 "공깃밥 무한 리필" 안내로 만족도를 높이세요.',
        },
        eat: {
          action: '국밥 4그릇 + 수육 주문',
          thought: '양도 푸짐하고 깔끔하다. 또 와야지.',
          type: 'good',
          opportunity: '"가족 세트" 메뉴판 사진으로 객단가를 올리세요.',
        },
        share: {
          action: '부모님이 이웃에게 입소문',
          thought: '동네에 이런 데 있어 다행이야.',
          type: 'good',
          opportunity: '단골 적립 쿠폰으로 재방문 주기를 짧게 만드세요.',
        },
      },
    },
  ],
};

// ── 3. 리뷰 관리 (/review-management/context 응답) ─────────────────────────
// ReviewSummary(evaluationMetrics.rating ∈ great|good|soso|bad|worst),
// ReviewList(review: id/source/sourceLabel?/hasPhoto/author/date/rating/content),
// SavedTemplatesTab(template: id/name/tone/length/content/tags[]/category[])
const reviewContext = {
  summary: {
    averageRating: STORE.averageRating,
    totalReviews: STORE.totalReviews,
    evaluationMetrics: [
      { name: '맛', rating: 'great', percentage: 92, reason: '국물이 진하고 깊다는 언급이 가장 많습니다.' },
      { name: '양', rating: 'great', percentage: 88, reason: '공깃밥 인심과 푸짐함에 대한 호평이 많습니다.' },
      { name: '친절', rating: 'good', percentage: 80, reason: '사장님 응대가 따뜻하다는 평이 꾸준합니다.' },
      { name: '가격', rating: 'good', percentage: 76, reason: '가성비가 좋다는 직장인 평가가 많습니다.' },
      { name: '대기시간', rating: 'soso', percentage: 58, reason: '점심 12~1시 피크에 대기가 발생합니다.' },
    ],
  },
  reviews: [
    { id: 'rv_01', source: 'naver', hasPhoto: true, author: '국물러버', date: '2026.06.05', rating: 5,
      content: '해장하러 왔는데 국물이 진짜 진하네요. 출근 전에 딱입니다. 자리도 금방 났어요.' },
    { id: 'rv_02', source: 'naver', hasPhoto: false, author: '범계직장인', date: '2026.06.03', rating: 5,
      content: '점심에 제육국밥 세트 먹었어요. 양 많고 든든해서 오후까지 버팁니다. 또 올게요.' },
    { id: 'rv_03', source: 'kakao', hasPhoto: true, author: '주말가족', date: '2026.06.01', rating: 5,
      content: '부모님 모시고 방문했는데 자리도 넓고 수육도 깔끔했습니다. 어르신들이 좋아하셨어요.' },
    { id: 'rv_04', source: 'naver', hasPhoto: false, author: '순댓국매니아', date: '2026.05.30', rating: 4,
      content: '순댓국 맛은 훌륭합니다. 다만 깍두기가 조금 더 익었으면 좋겠어요.' },
    { id: 'rv_05', source: 'kakao', hasPhoto: false, author: '한끼소중', date: '2026.05.28', rating: 4,
      content: '가성비 좋고 친절합니다. 혼밥하기도 편해요. 국물 리필이 되면 더 좋을 듯.' },
    { id: 'rv_06', source: 'naver', hasPhoto: true, author: '동네주민A', date: '2026.05.26', rating: 5,
      content: '집 근처라 자주 가요. 변함없는 맛이 제일 큰 장점입니다.' },
    { id: 'rv_07', source: 'kakao', hasPhoto: false, author: '점심방랑', date: '2026.05.24', rating: 3,
      content: '맛은 좋은데 12시엔 줄이 길어요. 조금 일찍 가야 바로 먹을 수 있습니다.' },
    { id: 'rv_08', source: 'naver', hasPhoto: false, author: '까칠한미식', date: '2026.05.21', rating: 2,
      content: '이날따라 국물이 평소보다 싱거웠어요. 다음엔 다시 진하게 부탁드립니다.' },
  ],
  settings: {
    tone: '친근함',
    length: '보통',
    includeThanks: true,
    includeGreatDay: true,
    useEmojis: false,
    photoThanks: true,
    brandPreset: '',
    brandPresets: [],
    optionalInstruction: '',
  },
  templates: [
    {
      id: 'tpl_01',
      name: '감사 + 재방문 (친근함)',
      tone: '친근함',
      length: '보통',
      content:
        '소중한 리뷰 감사합니다! 진한 국물 맛있게 드셨다니 정말 기쁩니다. 다음에도 든든하게 모실게요. 또 들러주세요 😊',
      tags: ['긍정', '친근함', '이모지'],
      category: ['감사', '재방문'],
    },
    {
      id: 'tpl_02',
      name: '대기 사과 + 개선 안내',
      tone: '정중함',
      length: '보통',
      content:
        '기다리게 해드려 죄송합니다. 점심 피크 시간 회전을 개선하고 있어요. 다음 방문 때는 더 빠르게 모시겠습니다. 소중한 의견 감사합니다.',
      tags: ['사과', '격식'],
      category: ['사과 & 고객지원'],
    },
  ],
};

// ── 4. 가게 현황 '오늘의 신호' (/insights/search-signal 응답) ───────────────
// StatusV2Page 가 todaySignal = { state:'default', ...signal } 로 병합한다.
const searchSignal = {
  source: '네이버 DataLab',
  period: '이번 주',
  keyword: '국밥',
  signal: '검색 급상승',
  intensity: 'high',
};

// ── 5. 상권 분석 내 가게 정보 (/v1/users/me/store 응답) ─────────────────────
// fetchMyStoreInfo 가 result.data.{lat,lng,category,name,address,categoryLabel}
// 를 읽는다. category 텍스트에 '카페/베이커리'가 없으면 FD6 으로 매핑됨.
const store = {
  data: {
    storeId: STORE.storeId,
    lat: STORE.lat,
    lng: STORE.lng,
    name: STORE.shopName,
    address: STORE.shopAddress,
    category: STORE.categoryLabelKo, // '한식' → FD6 매핑
    categoryLabel: STORE.categoryLabelKo,
  },
};

// ── 6. 사장님이 보낸 제안 (/influencer-proposals/owner 응답) ────────────────
// OwnerSentProposals: { id, influencerName, status, message, desiredDate, budget }
const sentProposals = [
  {
    id: 'prop_01',
    influencerName: '안양맛집탐험가',
    status: 'ACCEPTED',
    message: '범계 든든국밥 해장 콘텐츠로 직장인 타깃 릴스 1편 제안드립니다.',
    desiredDate: '2026.06.15 ~ 06.20',
    budget: 300000,
  },
  {
    id: 'prop_02',
    influencerName: '국밥부장관',
    status: 'PENDING',
    message: '순댓국 비주얼이 좋아 방문 리뷰 + 숏폼 1편 협업 원합니다.',
    desiredDate: '일정 협의',
    budget: 200000,
  },
  {
    id: 'prop_03',
    influencerName: '경기도혼밥러',
    status: 'REJECTED',
    message: '혼밥 콘텐츠 협업 제안드렸습니다.',
    desiredDate: '2026.05.10 ~ 05.15',
    budget: 100000,
  },
];

// dev 전용 로컬 미디어 (public/dev/*). BASE_URL 접두로 dev('/')·build('/pulse_FE/') 모두 대응.
// videoUrl 은 반드시 절대경로(origin 포함)여야 한다 — promotionApi.normalizeVideoUrl 이
// 상대경로를 API 서버(FastAPI) 기준으로 재조합해 깨뜨리기 때문.
const DEV_ORIGIN = typeof window !== 'undefined' ? window.location.origin : '';

// 영상 생성 입력으로 자동 세팅될 샘플 사진 (PromotionPage 가 dev-bypass 시 사용)
const promotionSampleImage = `${import.meta.env.BASE_URL}dev/bab.png`;

// ── 7. 홍보 영상 생성 (/info/generate 응답) ────────────────────────────────
// promotionApi.generatePromotionVideo: task_id 없으면 { status, data } 의
// data 를 바로 결과로 사용한다. data: { videoUrl, videoTitle, hashtags, ... }
const promotionGenerate = {
  status: 'success',
  data: {
    videoUrl: `${DEV_ORIGIN}${import.meta.env.BASE_URL}dev/video.mp4`,
    videoTitle: '뜨끈한 든든국밥 한 그릇',
    hashtags: ['#범계국밥', '#든든국밥', '#해장맛집', '#직장인점심', '#범계역맛집'],
    generationTime: '5.4s',
  },
};

// /info/prompt-recommendation 응답 (프롬프트 추천)
// 소비처(PromotionPage)는 응답 루트에서 recommendedPrompt 를 읽으므로 평탄 구조.
const promotionPrompt = {
  recommendedPrompt:
    '김이 모락모락 나는 든든국밥 클로즈업, 진한 국물을 숟가락으로 떠올리는 슬로모션, 따뜻한 조명의 아늑한 국밥집 분위기',
  concept: '추운 날 생각나는 든든한 한 끼',
  hashtags: ['#범계국밥', '#든든국밥', '#해장맛집'],
};

// /chat (FastAPI) 응답 — 인라인 챗 / 제안 AI 문구 생성
const chatReply = {
  reply:
    '범계 든든국밥 사장님, 평일 점심 회전율과 해장 수요가 강점이에요. 직장인 타깃으로 "10분 해장국밥" 메시지를 강조하면 반응이 좋을 거예요.',
};

// ── 통합 SSOT export ───────────────────────────────────────────────────────
export const MOCK_OWNER = {
  store: STORE,
  profile,
  legacyUser,
  analysis,
  reviewContext,
  searchSignal,
  storeInfo: store,
  sentProposals,
  promotionSampleImage,
  promotionGenerate,
  promotionPrompt,
  chatReply,
};

export default MOCK_OWNER;
