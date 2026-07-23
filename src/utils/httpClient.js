/**
 * 공통 HTTP 클라이언트.
 *
 * 프로젝트 전체가 fetch 를 직접 쓰고 있어 타임아웃·취소·오류 정규화가 제각각이었다.
 * 이 모듈을 거치면 다음이 항상 보장된다.
 *
 * - 요청 타임아웃 (기본 15초, AI 작업은 호출부에서 늘려 사용)
 * - 외부 AbortSignal 과 타임아웃 시그널 결합 (언마운트 시 취소)
 * - JSON 파싱 실패 / 빈 응답 안전 처리
 * - 401 단일 처리 (중복 리다이렉트 방지)
 * - 모든 실패를 normalizeApiError 구조로 변환
 */

import { ERROR_TYPES, normalizeApiError, normalizeHttpError, isOffline } from './apiError';
import { handleSessionExpired } from './session';

export const DEFAULT_TIMEOUT_MS = 15000;

/** 여러 AbortSignal 을 하나로 묶는다. (AbortSignal.any 미지원 브라우저 대응) */
const combineSignals = (signals) => {
    const valid = signals.filter(Boolean);
    if (valid.length === 0) return { signal: undefined, cleanup: () => {} };
    if (valid.length === 1) return { signal: valid[0], cleanup: () => {} };

    const controller = new AbortController();
    const onAbort = (event) => controller.abort(event?.target?.reason);
    const aborted = valid.find((signal) => signal.aborted);
    if (aborted) {
        controller.abort(aborted.reason);
    } else {
        valid.forEach((signal) => signal.addEventListener('abort', onAbort, { once: true }));
    }

    return {
        signal: controller.signal,
        cleanup: () => valid.forEach((signal) => signal.removeEventListener('abort', onAbort)),
    };
};

const readBody = async (response) => {
    // 204 / 205 / Content-Length: 0 은 본문이 없는 정상 응답이다.
    if (response.status === 204 || response.status === 205) return null;

    const text = await response.text().catch(() => '');
    if (!text) return null;

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('json')) return text;

    try {
        return JSON.parse(text);
    } catch {
        // JSON 이라고 했는데 파싱이 안 되는 경우 — 프록시 오류 페이지 등
        const parseError = new SyntaxError('응답 JSON 파싱 실패');
        parseError.rawText = text.slice(0, 200);
        throw parseError;
    }
};

const getAuthHeader = () => {
    try {
        const token = localStorage.getItem('accessToken');
        return token ? { Authorization: `Bearer ${token}` } : {};
    } catch {
        return {};
    }
};

/**
 * @param {string} url
 * @param {object} [options]
 * @param {string} [options.method='GET']
 * @param {any} [options.body]                JSON 직렬화 대상 (FormData 는 그대로 전달)
 * @param {object} [options.headers]
 * @param {AbortSignal} [options.signal]      호출부 취소 시그널
 * @param {number} [options.timeout]          ms, 0 이면 타임아웃 없음
 * @param {boolean} [options.auth=true]       accessToken 자동 첨부
 * @param {boolean} [options.handle401=true]  401 시 세션 만료 처리 수행
 * @param {string} [options.context]          개발 로그용 라벨
 * @returns {Promise<any>} 파싱된 응답 본문
 * @throws {import('./apiError').ApiError} 정규화된 오류
 */
export const apiRequest = async (url, options = {}) => {
    const {
        method = 'GET',
        body,
        headers = {},
        signal,
        timeout = DEFAULT_TIMEOUT_MS,
        auth = true,
        handle401 = true,
        context,
    } = options;

    if (isOffline()) {
        throw normalizeApiError(new TypeError('Failed to fetch'), { context: context || url });
    }

    const timeoutController = timeout > 0 ? new AbortController() : null;
    const timer = timeoutController
        ? setTimeout(() => timeoutController.abort(new DOMException('요청 시간 초과', 'TimeoutError')), timeout)
        : null;

    const { signal: mergedSignal, cleanup } = combineSignals([signal, timeoutController?.signal]);

    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    const requestHeaders = {
        ...(isFormData || body === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...(auth ? getAuthHeader() : {}),
        ...headers,
    };

    try {
        const response = await fetch(url, {
            method,
            headers: requestHeaders,
            body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
            signal: mergedSignal,
        });

        let parsed;
        try {
            parsed = await readBody(response);
        } catch (parseError) {
            if (!response.ok) throw normalizeHttpError(response.status, null);
            throw normalizeApiError(parseError, { context: context || url });
        }

        if (!response.ok) {
            const normalized = normalizeHttpError(response.status, parsed);
            if (response.status === 401 && handle401) handleSessionExpired();
            if (import.meta.env.DEV) {
                console.error(`[PULSE api] ${context || url} 실패 (${normalized.type})`, { status: response.status, body: parsed });
            }
            throw normalized;
        }

        return parsed;
    } catch (error) {
        // 타임아웃으로 인한 abort 를 사용자 취소와 구분한다.
        if (error?.name === 'AbortError' && timeoutController?.signal.aborted && !signal?.aborted) {
            throw normalizeApiError(new DOMException('요청 시간 초과', 'TimeoutError'), { context: context || url });
        }
        throw normalizeApiError(error, { context: context || url });
    } finally {
        if (timer) clearTimeout(timer);
        cleanup();
    }
};

export const apiGet = (url, options) => apiRequest(url, { ...options, method: 'GET' });
export const apiPost = (url, body, options) => apiRequest(url, { ...options, method: 'POST', body });
export const apiPatch = (url, body, options) => apiRequest(url, { ...options, method: 'PATCH', body });
export const apiPut = (url, body, options) => apiRequest(url, { ...options, method: 'PUT', body });
export const apiDelete = (url, options) => apiRequest(url, { ...options, method: 'DELETE' });

export { ERROR_TYPES };
