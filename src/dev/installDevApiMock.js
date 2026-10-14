/**
 * ============================================================================
 * DEV / DEMO API MOCK — 전역 fetch 인터셉터
 * ============================================================================
 * 백엔드로 나가는 fetch 요청을 가로채 통합 사장님(mockOwner) 응답을 돌려준다.
 *
 *  - dev 모드: "사장님 자동 로그인"(accessToken === 'dev-bypass-token')일 때만 동작
 *  - 전시 데모 모드(VITE_DEMO_MODE): 항상 동작. 로그인·회원가입까지 전부 응답하고,
 *    목에 없는 백엔드 요청은 밖으로 내보내지 않고 503 으로 즉시 실패시킨다.
 *  - 기존 백엔드 fetch 호출부(authApi/reviewManagementApi/mapInsightApi/
 *    analysisApi/influencerApi/promotionApi 등)는 한 줄도 수정하지 않는다.
 *  - 인터셉터 내부 오류는 삼키고 원래 fetch 로 폴백한다.
 * ============================================================================
 */

import { DEMO_MODE, FASTAPI_BASE_URL, SPRING_API_BASE_URL } from '../config/env';
import { MOCK_OWNER } from './mockOwner';
import {
  DEMO_INFLUENCER_EMAIL,
  DEMO_INFLUENCER_POOL,
  buildInfluencerAccount,
  findDemoInfluencer,
  toRecommendationItem,
} from './demoInfluencers';
import {
  createOwnerProposal,
  listInboxProposals,
  listOwnerProposals,
  resetDemoProposals,
  updateProposalStatus,
} from './demoState';
import { buildChatReply, buildMarketActions, buildReviewReplies } from './demoResponders';

const DEV_BYPASS_TOKEN = 'dev-bypass-token';
const DEMO_OWNER_TOKEN = 'demo-owner-token';
const DEMO_INFLUENCER_TOKEN = 'demo-influencer-token';
const DEMO_ANALYSIS_TASK_ID = 'demo-analysis-001';

let installed = false;

// ── "AI 가 일하는 중" 로딩을 보여주기 위한 의도적 지연(ms) ────────────────────
// 목 응답은 즉시 반환되어 로딩 화면이 순식간에 지나가므로, 인터셉터에서만 지연을 준다.
// (promotionApi 등 실제 구현 코드는 한 줄도 수정하지 않는다.)
const DELAY = {
  promotionGenerate: 5000,
  promptRecommendation: 1200,
  replies: 2200,
  chat: 1200,
  auth: 700,
  proposal: 600,
  default: 250,
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getStoredToken() {
  try {
    return localStorage.getItem('accessToken');
  } catch {
    return null;
  }
}

function isActive() {
  if (DEMO_MODE) return true;
  const token = getStoredToken();
  return token === DEV_BYPASS_TOKEN || token === DEMO_OWNER_TOKEN || token === DEMO_INFLUENCER_TOKEN;
}

function jsonResponse(body, status = 200) {
  const payload = body === null || body === undefined ? null : JSON.stringify(body);
  return new Response(payload, {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function parseBody(rawBody) {
  if (!rawBody || typeof rawBody !== 'string') return {};
  try {
    return JSON.parse(rawBody);
  } catch {
    return {};
  }
}

// 템플릿 생성/수정 echo (id 보강)
function echoTemplate(rawBody, fallbackId) {
  const body = parseBody(rawBody);
  return {
    id: body.id || fallbackId || `tpl_${Date.now()}`,
    name: body.name || '새 템플릿',
    tone: body.tone || '친근함',
    length: body.length || '보통',
    content: body.content || '',
    tags: body.tags || [],
    category: body.category || [],
  };
}

// ── 인증 ────────────────────────────────────────────────────────────────
const OWNER_SESSION_USER = {
  ...MOCK_OWNER.legacyUser,
  role: 'OWNER',
  storeName: MOCK_OWNER.store.shopName,
};

function ownerSession(extra = {}) {
  return { accessToken: DEMO_OWNER_TOKEN, user: OWNER_SESSION_USER, ...extra };
}

function influencerSession() {
  const account = buildInfluencerAccount();
  return {
    accessToken: DEMO_INFLUENCER_TOKEN,
    user: { id: account.influencerProfile.id, role: 'INFLUENCER', name: account.name, email: account.email },
  };
}

function isInfluencerLogin(email = '') {
  const normalized = String(email).trim().toLowerCase();
  return normalized === DEMO_INFLUENCER_EMAIL || normalized.startsWith('creator') || normalized.includes('influencer');
}

function currentProfile(authorization = '') {
  const token = String(authorization).replace(/^Bearer\s+/i, '') || getStoredToken();
  return token === DEMO_INFLUENCER_TOKEN ? buildInfluencerAccount() : MOCK_OWNER.profile;
}

// ── 회원가입 직후 분석 진행률 (요청 시각 기준으로 단계가 넘어간다) ───────────────
const ANALYSIS_STEPS = [
  { until: 1600, progress: 38, message: '네이버·카카오 리뷰 128개를 모으고 있어요' },
  { until: 3400, progress: 56, message: '리뷰에서 자주 나오는 말을 찾고 있어요' },
  { until: 5200, progress: 74, message: '손님 유형 3가지를 나누고 있어요' },
  { until: 7000, progress: 90, message: '손님별 방문 여정을 그리고 있어요' },
];
const analysisStartedAt = new Map();

function analysisStatus(taskId) {
  if (!analysisStartedAt.has(taskId)) analysisStartedAt.set(taskId, Date.now());
  const elapsed = Date.now() - analysisStartedAt.get(taskId);
  const step = ANALYSIS_STEPS.find(({ until }) => elapsed < until);
  if (step) return { status: 'processing', progress: step.progress, message: step.message };
  analysisStartedAt.delete(taskId);
  return { status: 'completed', progress: 100, message: '분석이 완료되었어요.' };
}

// ── 인플루언서 추천 ────────────────────────────────────────────────────────
function recommendations() {
  const { store, analysis } = MOCK_OWNER;
  return {
    storeInsight: {
      shopName: store.shopName,
      category: store.categoryLabelKo,
      address: store.shopAddress,
      keywords: analysis.personas.flatMap((persona) => persona.tags),
    },
    influencers: DEMO_INFLUENCER_POOL.map(toRecommendationItem),
  };
}

/**
 * 라우트 테이블. method + pathname 정규식으로 매칭한다.
 * pathname 은 API base(/api, /api/v1 등)에 무관하게 suffix 로 매칭되도록 설계.
 */
const ROUTES = [
  // ── 인증 (Spring) ────────────────────────────────────────────────────
  {
    method: 'POST',
    re: /\/auth\/login$/,
    wait: DELAY.auth,
    handler: ({ body }) => jsonResponse(isInfluencerLogin(parseBody(body).email) ? influencerSession() : ownerSession()),
  },
  {
    method: 'POST',
    re: /\/auth\/signup$/,
    wait: DELAY.auth,
    handler: () => {
      // 새 사장님 가입 = 새 시연 시작. 협업 제안 상태를 처음으로 되돌린다.
      resetDemoProposals();
      analysisStartedAt.delete(DEMO_ANALYSIS_TASK_ID);
      return jsonResponse(ownerSession({ analysisTaskId: DEMO_ANALYSIS_TASK_ID }), 201);
    },
  },
  {
    method: 'POST',
    re: /\/auth\/signup\/influencer$/,
    wait: DELAY.auth,
    handler: () => jsonResponse(influencerSession(), 201),
  },
  { method: 'GET', re: /\/auth\/me$/, handler: ({ authorization }) => jsonResponse(currentProfile(authorization)) },

  // ── 손님 분석 (FastAPI) ──────────────────────────────────────────────
  { method: 'GET', re: /\/analysis\/latest$/, handler: () => jsonResponse(MOCK_OWNER.analysis) },
  { method: 'GET', re: /\/analysis\/result\/[^/]+$/, handler: () => jsonResponse(MOCK_OWNER.analysis) },
  {
    method: 'GET',
    re: /\/analysis\/status\/[^/]+$/,
    handler: ({ pathname }) => jsonResponse(analysisStatus(decodeURIComponent(pathname.split('/').pop()))),
  },

  // ── 리뷰 관리 (Spring) ───────────────────────────────────────────────
  { method: 'GET', re: /\/review-management\/context$/, handler: () => jsonResponse(MOCK_OWNER.reviewContext) },
  { method: 'PUT', re: /\/review-management\/settings$/, handler: () => jsonResponse({ success: true }) },
  {
    method: 'POST',
    re: /\/review-management\/templates$/,
    handler: ({ body }) => jsonResponse(echoTemplate(body), 201),
  },
  {
    method: 'PUT',
    re: /\/review-management\/templates\/[^/]+$/,
    handler: ({ body, pathname }) => jsonResponse(echoTemplate(body, pathname.split('/').pop())),
  },
  {
    method: 'DELETE',
    re: /\/review-management\/templates\/[^/]+$/,
    handler: () => jsonResponse(null, 204),
  },
  {
    method: 'POST',
    re: /\/review-management\/replies\/generate$/,
    wait: DELAY.replies,
    handler: ({ body }) => jsonResponse(buildReviewReplies(body)),
  },

  // ── 상권 분석 (Spring) ───────────────────────────────────────────────
  { method: 'GET', re: /\/v1\/users\/me\/store$/, handler: () => jsonResponse(MOCK_OWNER.storeInfo) },
  // 상권 리포트는 실시간 카카오 장소 데이터(kakaoPlacesService 폴백)를 쓰도록 503 으로 넘긴다.
  { method: 'POST', re: /\/v1\/map-insight\/report$/, handler: () => jsonResponse({ message: 'demo: kakao fallback' }, 503) },
  {
    method: 'POST',
    re: /\/v1\/map-insight\/actions$/,
    wait: DELAY.proposal,
    handler: ({ body }) => jsonResponse(buildMarketActions(body)),
  },

  // ── 가게 현황 '오늘의 신호' (FastAPI) ────────────────────────────────
  { method: 'POST', re: /\/insights\/search-signal$/, handler: () => jsonResponse(MOCK_OWNER.searchSignal) },

  // ── 인플루언서 매칭 / 협업 제안 (Spring) ─────────────────────────────
  { method: 'GET', re: /\/influencers\/recommendations$/, wait: DELAY.proposal, handler: () => jsonResponse(recommendations()) },
  {
    method: 'POST',
    re: /\/influencer-proposals$/,
    wait: DELAY.proposal,
    handler: ({ body }) => {
      const payload = parseBody(body);
      const influencer = findDemoInfluencer(payload.influencerProfileId);
      return jsonResponse(createOwnerProposal(payload, influencer?.name), 201);
    },
  },
  { method: 'GET', re: /\/influencer-proposals\/owner$/, handler: () => jsonResponse(listOwnerProposals()) },
  { method: 'GET', re: /\/influencer-proposals\/inbox$/, handler: () => jsonResponse(listInboxProposals()) },
  {
    method: 'PATCH',
    re: /\/influencer-proposals\/[^/]+\/(cancel|accept|reject|status)$/,
    wait: DELAY.proposal,
    handler: ({ pathname, body }) => {
      const segments = pathname.split('/');
      const action = segments.pop();
      const id = decodeURIComponent(segments.pop());
      const status = {
        cancel: 'CANCELED',
        accept: 'ACCEPTED',
        reject: 'REJECTED',
        status: parseBody(body).status || 'PENDING',
      }[action];
      return jsonResponse(updateProposalStatus(id, status));
    },
  },

  // ── AI 생성계 ────────────────────────────────────────────────────────
  { method: 'POST', re: /\/chat$/, wait: DELAY.chat, handler: ({ body }) => jsonResponse(buildChatReply(body)) },
  {
    method: 'POST',
    re: /\/info\/prompt-recommendation$/,
    wait: DELAY.promptRecommendation,
    handler: () => jsonResponse(MOCK_OWNER.promotionPrompt),
  },
  {
    method: 'POST',
    re: /\/info\/generate$/,
    // 5초간 "영상 만드는 중" 로딩 화면을 보여준 뒤 생성 결과를 반환한다.
    wait: DELAY.promotionGenerate,
    handler: () => jsonResponse(MOCK_OWNER.promotionGenerate),
  },
  {
    method: 'GET',
    re: /\/info\/status\/[^/]+$/,
    handler: () =>
      jsonResponse({
        status: 'complete',
        progress: 100,
        message: '완성되었어요',
        data: MOCK_OWNER.promotionGenerate.data,
      }),
  },
];

function readAuthorization(input, init) {
  const headers = init?.headers || (typeof input !== 'string' ? input?.headers : null);
  if (!headers) return '';
  if (typeof headers.get === 'function') return headers.get('Authorization') || '';
  return headers.Authorization || headers.authorization || '';
}

function resolveRequest(input, init) {
  const url = typeof input === 'string' ? input : input?.url;
  if (!url) return null;
  const method = (init?.method || (typeof input !== 'string' && input?.method) || 'GET').toUpperCase();
  let pathname;
  try {
    pathname = new URL(url, window.location.origin).pathname;
  } catch {
    return null;
  }
  const body = init?.body;
  return { url, method, pathname, body, authorization: readAuthorization(input, init) };
}

/** 데모 모드에서 백엔드(Spring/FastAPI)로 향하는 요청인지 — 목에 없으면 밖으로 내보내지 않는다. */
function isBackendUrl(url) {
  return [SPRING_API_BASE_URL, FASTAPI_BASE_URL].some((base) => base && String(url).startsWith(base));
}

export function installDevApiMock() {
  if (installed || typeof window === 'undefined') return;
  installed = true;

  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input, init) => {
    try {
      if (isActive()) {
        const req = resolveRequest(input, init);
        if (req) {
          const route = ROUTES.find((candidate) => candidate.method === req.method && candidate.re.test(req.pathname));
          if (route) {
            await delay(route.wait ?? DELAY.default);
            return route.handler(req);
          }
          if (DEMO_MODE && isBackendUrl(req.url)) {
            console.warn(`[demoMock] 목 응답이 없는 요청입니다: ${req.method} ${req.pathname}`);
            return jsonResponse({ message: '데모 모드에서는 지원하지 않는 요청입니다.' }, 503);
          }
        }
      }
    } catch (error) {
      console.warn('[devMock] 인터셉터 오류 — 원래 fetch 로 폴백합니다.', error);
    }
    return originalFetch(input, init);
  };

  if (DEMO_MODE) {
    console.info('[demoMock] 전시 데모 모드 — 모든 백엔드 요청을 범계 든든국밥 목 응답으로 처리합니다.');
  } else {
    console.info('[devMock] dev API 인터셉터 활성화 — 사장님 자동 로그인 시 목 응답을 반환합니다.');
  }
}

export default installDevApiMock;
