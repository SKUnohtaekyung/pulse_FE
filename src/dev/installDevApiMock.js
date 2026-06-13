/**
 * ============================================================================
 * DEV API MOCK — 전역 fetch 인터셉터
 * ============================================================================
 * dev 모드에서 "사장님 자동 로그인"(accessToken === 'dev-bypass-token')일 때만,
 * 백엔드로 나가는 fetch 요청을 가로채 통합 사장님(mockOwner) 응답을 돌려준다.
 *
 *  - 기존 백엔드 fetch 호출부(authApi/reviewManagementApi/mapInsightApi/
 *    analysisApi/influencerApi/promotionApi 등)는 한 줄도 수정하지 않는다.
 *  - 매칭되지 않는 요청, dev-bypass 토큰이 아닌 경우는 원래 fetch 로 통과.
 *  - 인터셉터 내부 오류는 삼키고 원래 fetch 로 폴백한다.
 * ============================================================================
 */

import { MOCK_OWNER } from './mockOwner';

const DEV_BYPASS_TOKEN = 'dev-bypass-token';
let installed = false;

function isActive() {
  try {
    return localStorage.getItem('accessToken') === DEV_BYPASS_TOKEN;
  } catch {
    return false;
  }
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

// 선택된 리뷰별 AI 답변을 생성 (QuickSettings 가 response.replies 를 소비)
function buildReplies(rawBody) {
  const { reviews = [], settings = {} } = parseBody(rawBody);
  const useEmojis = settings.useEmojis;
  return {
    replies: (reviews.length ? reviews : [{ id: 'rv_unknown', author: '고객' }]).map((review, index) => ({
      id: `reply_${review.id || index}`,
      reviewId: review.id,
      isRecommended: index === 0,
      content:
        `${review.author || '고객'}님, 소중한 리뷰 진심으로 감사합니다! ` +
        `진한 국물 맛있게 드셨다니 정말 기쁩니다. 다음에도 든든하게 모실게요${useEmojis ? ' 😊' : '.'} ` +
        `범계 든든국밥은 늘 한결같은 맛으로 기다리겠습니다.`,
    })),
  };
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

/**
 * 라우트 테이블. method + pathname 정규식으로 매칭한다.
 * pathname 은 API base(/api, /api/v1 등)에 무관하게 suffix 로 매칭되도록 설계.
 */
const ROUTES = [
  // ── 손님 분석 (FastAPI) ──────────────────────────────────────────────
  { method: 'GET', re: /\/analysis\/latest$/, handler: () => jsonResponse(MOCK_OWNER.analysis) },
  { method: 'GET', re: /\/analysis\/result\/[^/]+$/, handler: () => jsonResponse(MOCK_OWNER.analysis) },
  {
    method: 'GET',
    re: /\/analysis\/status\/[^/]+$/,
    handler: () => jsonResponse({ status: 'completed', progress: 100, message: '분석이 완료되었어요.' }),
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
    handler: ({ body }) => jsonResponse(buildReplies(body)),
  },

  // ── 상권 분석 내 가게 정보 (Spring) ──────────────────────────────────
  { method: 'GET', re: /\/v1\/users\/me\/store$/, handler: () => jsonResponse(MOCK_OWNER.storeInfo) },

  // ── 가게 현황 '오늘의 신호' (FastAPI) ────────────────────────────────
  { method: 'POST', re: /\/insights\/search-signal$/, handler: () => jsonResponse(MOCK_OWNER.searchSignal) },

  // ── 사장님이 보낸 제안 (Spring) ──────────────────────────────────────
  { method: 'GET', re: /\/influencer-proposals\/owner$/, handler: () => jsonResponse(MOCK_OWNER.sentProposals) },

  // ── AI 생성계 ────────────────────────────────────────────────────────
  { method: 'POST', re: /\/chat$/, handler: () => jsonResponse(MOCK_OWNER.chatReply) },
  {
    method: 'POST',
    re: /\/info\/prompt-recommendation$/,
    handler: () => jsonResponse(MOCK_OWNER.promotionPrompt),
  },
  {
    method: 'POST',
    re: /\/info\/generate$/,
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
  return { url, method, pathname, body };
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
          for (const route of ROUTES) {
            if (route.method === req.method && route.re.test(req.pathname)) {
              return route.handler(req);
            }
          }
        }
      }
    } catch (error) {
      console.warn('[devMock] 인터셉터 오류 — 원래 fetch 로 폴백합니다.', error);
    }
    return originalFetch(input, init);
  };

  console.info('[devMock] dev API 인터셉터 활성화 — 사장님 자동 로그인 시 목 응답을 반환합니다.');
}

export default installDevApiMock;
