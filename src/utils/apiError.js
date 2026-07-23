/**
 * API 오류 정규화 유틸리티.
 *
 * 페이지·컴포넌트가 fetch/Response/AxiosError 같은 원본 오류 객체에 직접 의존하지 않도록,
 * 모든 오류를 아래 한 가지 구조로 변환한다.
 *
 *   { type, message, retryable, status, fieldErrors, cause }
 *
 * - message 는 항상 사용자에게 그대로 보여줄 수 있는 한국어 문구다.
 *   (스택 트레이스·API 주소·상태 코드 원문은 절대 포함하지 않는다)
 * - 디버깅용 원본은 cause 에만 담고, 개발 환경에서만 콘솔에 남긴다.
 */

export const ERROR_TYPES = {
    NETWORK_ERROR: 'NETWORK_ERROR',
    TIMEOUT: 'TIMEOUT',
    CANCELED: 'CANCELED',
    BAD_REQUEST: 'BAD_REQUEST',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    NOT_FOUND: 'NOT_FOUND',
    CONFLICT: 'CONFLICT',
    PAYLOAD_TOO_LARGE: 'PAYLOAD_TOO_LARGE',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    RATE_LIMITED: 'RATE_LIMITED',
    SERVER_ERROR: 'SERVER_ERROR',
    PARSE_ERROR: 'PARSE_ERROR',
    EMPTY_RESPONSE: 'EMPTY_RESPONSE',
    UNKNOWN: 'UNKNOWN',
};

/** 상태 코드별 기본 문구·재시도 가능 여부 */
const STATUS_MAP = {
    400: {
        type: ERROR_TYPES.BAD_REQUEST,
        message: '요청 내용을 처리할 수 없어요. 입력한 값을 확인한 후 다시 시도해 주세요.',
        retryable: false,
    },
    401: {
        type: ERROR_TYPES.UNAUTHORIZED,
        message: '로그인 정보가 만료되었어요. 다시 로그인해 주세요.',
        retryable: false,
    },
    403: {
        type: ERROR_TYPES.FORBIDDEN,
        message: '이 기능을 사용할 권한이 없어요. 계정 상태를 확인해 주세요.',
        retryable: false,
    },
    404: {
        type: ERROR_TYPES.NOT_FOUND,
        message: '요청한 정보를 찾을 수 없어요. 주소가 정확한지 확인해 주세요.',
        retryable: false,
    },
    408: {
        type: ERROR_TYPES.TIMEOUT,
        message: '응답이 지연되고 있어요. 잠시 후 다시 시도해 주세요.',
        retryable: true,
    },
    409: {
        type: ERROR_TYPES.CONFLICT,
        message: '이미 등록된 정보예요. 입력한 내용을 확인해 주세요.',
        retryable: false,
    },
    413: {
        type: ERROR_TYPES.PAYLOAD_TOO_LARGE,
        message: '파일 용량이 너무 커요. 용량을 줄인 후 다시 시도해 주세요.',
        retryable: false,
    },
    422: {
        type: ERROR_TYPES.VALIDATION_ERROR,
        message: '입력한 내용을 다시 확인해 주세요.',
        retryable: false,
    },
    429: {
        type: ERROR_TYPES.RATE_LIMITED,
        message: '요청이 많아 잠시 제한되었어요. 잠시 후 다시 시도해 주세요.',
        retryable: true,
    },
};

const SERVER_ERROR = {
    type: ERROR_TYPES.SERVER_ERROR,
    message: '서버에 일시적인 문제가 발생했어요. 잠시 후 다시 시도해 주세요.',
    retryable: true,
};

const NETWORK_ERROR = {
    type: ERROR_TYPES.NETWORK_ERROR,
    message: '인터넷 연결이 불안정해요. 연결 상태를 확인한 후 다시 시도해 주세요.',
    retryable: true,
};

const UNKNOWN_ERROR = {
    type: ERROR_TYPES.UNKNOWN,
    message: '문제가 발생해 요청을 완료하지 못했어요. 잠시 후 다시 시도해 주세요.',
    retryable: true,
};

/** 정규화된 오류인지 판별 */
export const isApiError = (value) =>
    !!value && typeof value === 'object' && typeof value.type === 'string' && typeof value.message === 'string' && 'retryable' in value;

/** 사용자 취소 / 언마운트로 인한 중단인지 판별 (UI 에 오류를 띄우면 안 되는 케이스) */
export const isCanceledError = (value) => {
    if (isApiError(value)) return value.type === ERROR_TYPES.CANCELED;
    return !!value && (value.name === 'AbortError' || value.code === 'ERR_CANCELED');
};

const createError = (base, extra = {}) => ({
    status: null,
    fieldErrors: null,
    cause: null,
    ...base,
    ...extra,
});

/**
 * 서버가 내려준 메시지 중 "사용자에게 보여도 되는" 문구만 통과시킨다.
 * 스택 트레이스, 내부 클래스명, URL, SQL 등이 섞인 원문은 버린다.
 */
const pickSafeServerMessage = (raw) => {
    if (typeof raw !== 'string') return null;
    const text = raw.trim();
    if (!text || text.length > 120) return null;
    if (/(https?:\/\/|\bat\s+\w+\.|Exception|Error:|Traceback|SQL|null pointer|undefined)/i.test(text)) return null;
    // 한글이 한 글자도 없으면 내부 코드성 문자열로 간주한다.
    if (!/[가-힣]/.test(text)) return null;
    return text;
};

/** 서버 응답 본문에서 필드별 검증 오류를 추출 (Spring / FastAPI 형태 모두 대응) */
const extractFieldErrors = (body) => {
    if (!body || typeof body !== 'object') return null;

    // { errors: { email: '...' } } 또는 { fieldErrors: {...} }
    const direct = body.fieldErrors || body.errors;
    if (direct && !Array.isArray(direct) && typeof direct === 'object') {
        const entries = Object.entries(direct)
            .map(([field, message]) => [field, Array.isArray(message) ? message[0] : message])
            .filter(([, message]) => typeof message === 'string' && message.trim());
        return entries.length ? Object.fromEntries(entries) : null;
    }

    // FastAPI: { detail: [{ loc: ['body','email'], msg: '...' }] }
    const list = Array.isArray(direct) ? direct : Array.isArray(body.detail) ? body.detail : null;
    if (list) {
        const entries = list
            .map((item) => {
                if (!item || typeof item !== 'object') return null;
                const field = item.field || (Array.isArray(item.loc) ? item.loc[item.loc.length - 1] : null);
                const message = item.message || item.msg;
                if (!field || typeof message !== 'string') return null;
                return [String(field), message];
            })
            .filter(Boolean);
        return entries.length ? Object.fromEntries(entries) : null;
    }

    return null;
};

/**
 * HTTP 상태 코드 + 응답 본문 → 정규화된 오류
 */
export const normalizeHttpError = (status, body) => {
    const fieldErrors = extractFieldErrors(body);
    const base = STATUS_MAP[status] || (status >= 500 ? SERVER_ERROR : status >= 400 ? STATUS_MAP[400] : UNKNOWN_ERROR);

    // 필드 오류가 있으면 검증 오류로 승격한다.
    if (fieldErrors && base.type !== ERROR_TYPES.UNAUTHORIZED) {
        return createError(
            { type: ERROR_TYPES.VALIDATION_ERROR, message: '입력한 내용을 다시 확인해 주세요.', retryable: false },
            { status, fieldErrors },
        );
    }

    const safeMessage = pickSafeServerMessage(body?.message || body?.detail || body?.error);
    return createError(base, { status, message: safeMessage || base.message });
};

/**
 * 임의의 오류 객체 → 정규화된 오류
 *
 * @param {unknown} error  fetch 실패, TypeError, Response 파싱 실패, 이미 정규화된 오류 등
 * @param {{ fallbackMessage?: string, context?: string }} [options]
 */
export const normalizeApiError = (error, options = {}) => {
    const { fallbackMessage, context } = options;

    if (isApiError(error)) return error;

    let normalized;

    if (!error) {
        normalized = createError(UNKNOWN_ERROR);
    } else if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
        normalized = createError({
            type: ERROR_TYPES.CANCELED,
            message: '요청이 취소되었어요.',
            retryable: true,
        });
    } else if (error.name === 'TimeoutError') {
        normalized = createError({
            type: ERROR_TYPES.TIMEOUT,
            message: '응답이 오래 걸리고 있어요. 잠시 후 다시 시도해 주세요.',
            retryable: true,
        });
    } else if (error instanceof SyntaxError) {
        normalized = createError({
            type: ERROR_TYPES.PARSE_ERROR,
            message: '응답을 이해하지 못했어요. 잠시 후 다시 시도해 주세요.',
            retryable: true,
        });
    } else if (error instanceof TypeError || error.message === 'Failed to fetch' || error.message === 'Load failed') {
        // fetch 는 네트워크 자체가 끊긴 경우 TypeError 를 던진다.
        normalized = createError(NETWORK_ERROR);
    } else if (typeof error.status === 'number') {
        normalized = normalizeHttpError(error.status, error.body);
    } else {
        normalized = createError(UNKNOWN_ERROR, fallbackMessage ? { message: fallbackMessage } : {});
    }

    normalized.cause = error;

    // 옵셔널 체이닝: Vite 밖(노드 테스트 실행)에서도 이 모듈을 그대로 불러올 수 있게 한다.
    if (import.meta.env?.DEV && normalized.type !== ERROR_TYPES.CANCELED) {
        console.error(`[PULSE api] ${context || 'request'} 실패 (${normalized.type})`, error);
    }

    return normalized;
};

/** 오프라인 상태를 먼저 감지해 더 정확한 문구를 준다. */
export const isOffline = () => typeof navigator !== 'undefined' && navigator.onLine === false;

/** 정규화된 오류에서 사용자용 문구만 안전하게 꺼낸다. */
export const getErrorMessage = (error, fallback = UNKNOWN_ERROR.message) => {
    if (isApiError(error)) return error.message;
    return fallback;
};
