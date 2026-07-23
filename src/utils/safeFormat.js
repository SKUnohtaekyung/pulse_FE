/**
 * 안전한 숫자·날짜 포맷터.
 *
 * null / undefined / NaN / Infinity / "" 가 화면에 그대로 노출되는 것을 막는다.
 * 값이 없을 때는 항상 placeholder(기본 '—')를 반환한다.
 */

export const EMPTY_PLACEHOLDER = '—';

/** 화면에 그릴 수 있는 유한한 숫자인지 판별 */
export const isFiniteNumber = (value) => typeof value === 'number' && Number.isFinite(value);

/**
 * 문자열·숫자를 유한한 숫자로 변환한다. 변환 불가 시 null.
 * 빈 문자열, 공백, 'NaN', null, undefined, boolean 은 모두 null 로 본다.
 */
export const toFiniteNumber = (value) => {
    if (isFiniteNumber(value)) return value;
    if (typeof value !== 'string') return null;
    const trimmed = value.trim();
    if (!trimmed) return null;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
};

/**
 * 천 단위 구분 숫자. (예: 12345 → "12,345")
 * @param {unknown} value
 * @param {{ fallback?: string, digits?: number, suffix?: string }} [options]
 */
export const formatNumber = (value, options = {}) => {
    const { fallback = EMPTY_PLACEHOLDER, digits = 0, suffix = '' } = options;
    const num = toFiniteNumber(value);
    if (num === null) return fallback;
    return `${num.toLocaleString('ko-KR', { minimumFractionDigits: digits, maximumFractionDigits: digits })}${suffix}`;
};

/** 퍼센트. (예: 12.34 → "12.3%") */
export const formatPercent = (value, options = {}) => {
    const { fallback = EMPTY_PLACEHOLDER, digits = 0, withSign = false } = options;
    const num = toFiniteNumber(value);
    if (num === null) return fallback;
    const sign = withSign && num > 0 ? '+' : '';
    return `${sign}${num.toFixed(digits)}%`;
};

/** 원화. (예: 12000 → "12,000원") */
export const formatCurrency = (value, options = {}) => {
    const { fallback = EMPTY_PLACEHOLDER } = options;
    const num = toFiniteNumber(value);
    if (num === null) return fallback;
    return `${num.toLocaleString('ko-KR')}원`;
};

/**
 * 안전한 나눗셈. 분모가 0 이거나 값이 없으면 fallback.
 * 퍼센트 계산에서 Infinity / NaN 이 생기는 것을 막는다.
 */
export const safeDivide = (numerator, denominator, fallback = null) => {
    const a = toFiniteNumber(numerator);
    const b = toFiniteNumber(denominator);
    if (a === null || b === null || b === 0) return fallback;
    const result = a / b;
    return Number.isFinite(result) ? result : fallback;
};

/** 증감률(%) 계산. 이전 값이 0/없음이면 null. */
export const calcChangeRate = (current, previous) => {
    const ratio = safeDivide(toFiniteNumber(current) - toFiniteNumber(previous), previous);
    return ratio === null ? null : ratio * 100;
};

/** 파일 용량 표기. (예: 1536000 → "1.5MB") */
export const formatFileSize = (bytes, fallback = EMPTY_PLACEHOLDER) => {
    const num = toFiniteNumber(bytes);
    if (num === null || num < 0) return fallback;
    if (num < 1024) return `${num}B`;
    if (num < 1024 * 1024) return `${(num / 1024).toFixed(0)}KB`;
    return `${(num / (1024 * 1024)).toFixed(1)}MB`;
};

/** Date 로 변환 가능한 값이면 Date, 아니면 null */
export const toValidDate = (value) => {
    if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
    if (typeof value !== 'string' && typeof value !== 'number') return null;
    if (typeof value === 'string' && !value.trim()) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
};

/**
 * 날짜 포맷. Invalid Date 가 화면에 노출되지 않는다.
 * @param {unknown} value
 * @param {{ fallback?: string, withTime?: boolean, style?: 'dot'|'korean' }} [options]
 */
export const formatDate = (value, options = {}) => {
    const { fallback = EMPTY_PLACEHOLDER, withTime = false, style = 'dot' } = options;
    const date = toValidDate(value);
    if (!date) return fallback;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const base = style === 'korean' ? `${year}년 ${Number(month)}월 ${Number(day)}일` : `${year}.${month}.${day}`;

    if (!withTime) return base;
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${base} ${hours}:${minutes}`;
};

/** 상대 시간. (예: "3분 전") 유효하지 않으면 fallback. */
export const formatRelativeTime = (value, fallback = EMPTY_PLACEHOLDER) => {
    const date = toValidDate(value);
    if (!date) return fallback;

    const diffSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diffSeconds < 0) return formatDate(date, { fallback });
    if (diffSeconds < 60) return '방금 전';
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}분 전`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}시간 전`;
    if (diffSeconds < 86400 * 7) return `${Math.floor(diffSeconds / 86400)}일 전`;
    return formatDate(date, { fallback });
};

/** 비어 있지 않은 문자열만 통과. 아니면 fallback. */
export const formatText = (value, fallback = EMPTY_PLACEHOLDER) => {
    if (typeof value !== 'string') return typeof value === 'number' && Number.isFinite(value) ? String(value) : fallback;
    const trimmed = value.trim();
    return trimmed || fallback;
};

/** 배열이 아닌 값(누락된 응답 필드 등)이 .map 을 만나 터지는 것을 막는다. */
export const toArray = (value) => (Array.isArray(value) ? value : []);
