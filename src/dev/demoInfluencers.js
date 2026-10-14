/**
 * ============================================================================
 * DEMO INFLUENCERS — 전시 데모용 인플루언서 풀 / 인플루언서 계정 / 제안 시드
 * ============================================================================
 * 범계 든든국밥(경기 안양시 동안구) 기준으로 매칭이 자연스럽게 나오도록
 * 안양·군포·수원권 가상 크리에이터를 앞에 두고, 기존 서울권 풀을 뒤에 붙인다.
 *
 *  - 모든 이름·핸들은 가상이다. 실존 계정과 겹치지 않도록 일반 명사 조합만 쓴다.
 *  - 프로필 이미지는 외부 URL 대신 이니셜 SVG(data URI)를 써서 오프라인에서도 보인다.
 *  - 날짜는 "오늘" 기준 상대값으로 계산해 전시 날짜가 바뀌어도 최신처럼 보인다.
 * ============================================================================
 */

import { INFLUENCER_DATA } from '../data/mockInfluencers';

// ── 날짜 유틸 (오늘 기준 상대 날짜) ─────────────────────────────────────────
const pad = (n) => String(n).padStart(2, '0');
const shiftDays = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};
/** 2026-10-14 형식 (API createdAt 용) */
export const isoDate = (days = 0) => {
  const d = shiftDays(days);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
/** 2026.10.14 형식 (화면 표기용) */
export const dotDate = (days = 0) => isoDate(days).replace(/-/g, '.');
/** 10.20 ~ 10.31 형식 기간 */
export const dateRange = (fromDays, toDays) => {
  const from = shiftDays(fromDays);
  const to = shiftDays(toDays);
  return `${from.getFullYear()}.${pad(from.getMonth() + 1)}.${pad(from.getDate())} ~ ${pad(to.getMonth() + 1)}.${pad(to.getDate())}`;
};

// ── 이니셜 아바타 (PULSE primary 계열) ──────────────────────────────────────
const AVATAR_COLORS = ['#002B7A', '#123F8F', '#21539C', '#3466A9', '#4577B5'];

export const initialAvatar = (name = '', index = 0) => {
  const initial = Array.from(String(name).trim())[0] || 'P';
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">` +
    `<rect width="96" height="96" fill="${color}"/>` +
    `<text x="48" y="50" text-anchor="middle" dominant-baseline="central" ` +
    `font-family="Pretendard, 'Malgun Gothic', sans-serif" font-size="40" font-weight="700" fill="#FFFFFF">${initial}</text>` +
    `</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

// ── 안양권 가상 크리에이터 ──────────────────────────────────────────────────
// [이름, 분야, 지역, 활동권, 키워드, 오디언스, 팔로워, 평균조회, 참여율, 최소단가, 소개, 태그]
const LOCAL_ACCOUNTS = [
  ['안양맛집탐험가', ['맛집', '한식'], '경기 안양시', ['동안구', '만안구', '군포시'],
    ['국밥', '해장', '순댓국', '범계역', '로컬맛집'], ['직장인', '30대', '점심'],
    32000, 14000, 5.8, 100000, '안양 범계·평촌 로컬 맛집을 릴스로 소개합니다.', ['릴스강점', '응답빠름', '로컬전문']],
  ['경기남부해장러', ['한식', '맛집'], '경기 군포시', ['군포시', '동안구', '의왕시'],
    ['해장', '국밥', '뼈해장국', '아침식사', '노포'], ['30대', '직장인', '남성'],
    41000, 17500, 5.1, 250000, '출근길 해장 한 그릇을 찾아 경기 남부를 돌아다닙니다.', ['검증완료', '릴스강점', '로컬전문']],
  ['범계점심일지', ['맛집', '한식'], '경기 안양시', ['동안구', '만안구'],
    ['직장인점심', '국밥', '빠른식사', '혼밥', '범계역'], ['직장인', '20-30대', '점심'],
    18500, 6200, 4.9, 100000, '범계·평촌 직장인 점심 루틴에 맞는 식당을 기록합니다.', ['응답빠름', '사진리뷰', '로컬전문']],
  ['평촌가족외식', ['한식', '맛집'], '경기 안양시', ['동안구', '의왕시'],
    ['가족외식', '수육', '주말', '부모님', '넓은자리'], ['가족', '40대', '주말'],
    26000, 9800, 4.2, 150000, '부모님 모시고 가기 좋은 평촌·범계 식당을 소개합니다.', ['검증완료', '사진리뷰', '로컬전문']],
  ['오늘도국밥한그릇', ['한식'], '경기 수원시', ['영통구', '장안구', '동안구'],
    ['국밥', '순댓국', '노포', '혼밥', '해장'], ['20-30대', '혼밥'],
    58000, 22000, 4.6, 300000, '하루 한 그릇, 경기도 국밥집을 꾸준히 기록합니다.', ['인기상승', '릴스강점', '검증완료']],
  ['경기도혼밥러', ['맛집', '한식'], '경기 안양시', ['만안구', '동안구'],
    ['혼밥', '1인메뉴', '국밥', '점심', '빠른식사'], ['20대', '1인가구'],
    12400, 4100, 6.3, 80000, '혼자 들어가기 편한 동네 식당을 짧은 영상으로 보여줍니다.', ['응답빠름', '사진리뷰', '로컬전문']],
];

const toDemoInfluencer = (account, index) => {
  const [name, niche, location, activityArea, keywords, audienceKeywords,
    followers, avgViews, engagementRate, minBudget, bio, tags] = account;
  const handle = `pulse_local_${pad(index + 1)}`;
  return {
    id: `local${pad(index + 1)}`,
    name,
    profileImage: initialAvatar(name, index),
    tags,
    niche,
    location,
    activityArea,
    keywords,
    audienceKeywords,
    bio,
    rating: Number((4.9 - (index % 4) * 0.1).toFixed(1)),
    followers,
    instagramFollowers: followers,
    youtubeSubscribers: 0,
    avgViews,
    engagementRate,
    minBudget,
    instagramUrl: `https://instagram.com/${handle}`,
    youtubeUrl: '',
  };
};

export const LOCAL_INFLUENCERS = LOCAL_ACCOUNTS.map(toDemoInfluencer);

/** 전시 데모 인플루언서 풀 = 안양권 6명 + 기존 서울권 풀 (이미지는 오프라인 아바타로 교체) */
export const DEMO_INFLUENCER_POOL = [
  ...LOCAL_INFLUENCERS,
  ...INFLUENCER_DATA.map((influencer, index) => ({
    ...influencer,
    profileImage: initialAvatar(influencer.name, index + LOCAL_INFLUENCERS.length),
  })),
];

/** 백엔드 /influencers/recommendations 응답 형태로 변환 (influencerApi.mapInfluencer 입력) */
export const toRecommendationItem = (influencer) => ({
  influencer: {
    id: influencer.id,
    displayName: influencer.name,
    profileImageUrl: influencer.profileImage,
    niches: influencer.niche,
    location: influencer.location,
    activityAreas: influencer.activityArea,
    keywords: influencer.keywords,
    audienceKeywords: influencer.audienceKeywords,
    instagramFollowers: influencer.instagramFollowers,
    youtubeSubscribers: influencer.youtubeSubscribers,
    avgViews: influencer.avgViews,
    engagementRate: influencer.engagementRate,
    minBudget: influencer.minBudget,
    bio: influencer.bio,
    instagramUrl: influencer.instagramUrl,
    youtubeUrl: influencer.youtubeUrl,
    tags: influencer.tags,
    rating: influencer.rating,
  },
  // 점수·사유는 화면(influencerMatchingUtils)이 손님분석 기준으로 다시 계산한다.
  score: 0,
  breakdown: null,
  matchReasons: [],
});

// ── 데모 인플루언서 계정 (인플루언서 로그인 시 /auth/me) ────────────────────
export const DEMO_INFLUENCER = LOCAL_INFLUENCERS[0]; // 안양맛집탐험가
export const DEMO_INFLUENCER_EMAIL = 'creator@pulse.dev';

export const buildInfluencerAccount = () => ({
  email: DEMO_INFLUENCER_EMAIL,
  name: DEMO_INFLUENCER.name,
  role: 'INFLUENCER',
  influencerProfile: {
    id: DEMO_INFLUENCER.id,
    email: DEMO_INFLUENCER_EMAIL,
    displayName: DEMO_INFLUENCER.name,
    bio: DEMO_INFLUENCER.bio,
    createdAt: isoDate(-212),
    instagramUrl: DEMO_INFLUENCER.instagramUrl,
    youtubeUrl: '',
    profileImageUrl: DEMO_INFLUENCER.profileImage,
    niches: DEMO_INFLUENCER.niche,
    keywords: DEMO_INFLUENCER.keywords,
    instagramFollowers: DEMO_INFLUENCER.instagramFollowers,
    youtubeSubscribers: 0,
    avgViews: DEMO_INFLUENCER.avgViews,
  },
});

export const findDemoInfluencer = (id) =>
  DEMO_INFLUENCER_POOL.find((influencer) => String(influencer.id) === String(id)) || null;
