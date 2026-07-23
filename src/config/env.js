/**
 * 환경변수 단일 접근 지점.
 *
 * 각 파일에서 import.meta.env 를 직접 읽으면서 생기던 문제를 정리한다.
 * - 값이 없을 때 문자열 "undefined" 가 URL 에 그대로 붙는 문제
 * - 끝 슬래시 유무가 파일마다 달라 "//api" 같은 경로가 만들어지는 문제
 * - 키 이름 오타를 배포 후에야 발견하는 문제
 *
 * 개발 환경에서는 누락된 필수 환경변수를 콘솔에 명확히 알린다.
 * 운영 환경에서는 사용자 화면에 키 이름·설정값을 노출하지 않는다.
 */

/** "undefined" / "null" / 공백만 있는 값은 미설정으로 취급한다. */
const readEnv = (key) => {
    const raw = import.meta.env[key];
    if (typeof raw !== 'string') return '';
    const trimmed = raw.trim();
    if (!trimmed || trimmed === 'undefined' || trimmed === 'null') return '';
    return trimmed;
};

/** 끝 슬래시를 제거해 `${base}/path` 조합이 항상 안전하도록 만든다. */
const normalizeBaseUrl = (value) => value.replace(/\/+$/, '');

const isValidHttpUrl = (value) => {
    if (!value) return false;
    try {
        const url = new URL(value);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
};

export const SPRING_API_BASE_URL = normalizeBaseUrl(readEnv('VITE_SPRING_API_BASE_URL') || 'http://localhost:8080/api');
export const FASTAPI_BASE_URL = normalizeBaseUrl(readEnv('VITE_FASTAPI_BASE_URL') || 'http://localhost:8000');
export const KAKAO_MAP_API_KEY = readEnv('VITE_KAKAO_MAP_API_KEY');
export const KAKAO_REST_API_KEY = readEnv('VITE_KAKAO_REST_API_KEY');
export const BYPASS_AUTH = readEnv('VITE_BYPASS_AUTH') === 'true';

// The local UI workflow is mock-first. Live API integration must be explicitly
// enabled so stale development environment files cannot trigger failing calls.
const useLiveApiInDev = readEnv('VITE_USE_LIVE_API') === 'true';
export const USE_MOCK_API = import.meta.env.DEV
    ? !useLiveApiInDev
    : readEnv('VITE_USE_MOCK_API') === 'true';

// Production can independently opt into mock analysis when required.
const mockAnalysisSetting = readEnv('VITE_USE_MOCK_ANALYSIS');
export const USE_MOCK_ANALYSIS = import.meta.env.DEV
    ? USE_MOCK_API
    : mockAnalysisSetting === 'true';

/** 기능별 필수 환경변수 — 없으면 해당 기능만 우아하게 실패시킨다. */
export const FEATURE_REQUIREMENTS = {
    map: { key: KAKAO_MAP_API_KEY, envName: 'VITE_KAKAO_MAP_API_KEY', label: '지도' },
    placeSearch: { key: KAKAO_REST_API_KEY, envName: 'VITE_KAKAO_REST_API_KEY', label: '장소 검색' },
};

export const isFeatureConfigured = (feature) => !!FEATURE_REQUIREMENTS[feature]?.key;

/**
 * 앱 부팅 시 1회 호출. 개발 환경에서만 경고를 남긴다.
 * 사용자 화면에는 아무것도 노출하지 않는다.
 */
export const verifyEnv = () => {
    if (!import.meta.env.DEV) return;

    const problems = [];

    if (!readEnv('VITE_SPRING_API_BASE_URL')) {
        problems.push('VITE_SPRING_API_BASE_URL 미설정 — http://localhost:8080/api 로 대체합니다.');
    } else if (!isValidHttpUrl(SPRING_API_BASE_URL)) {
        problems.push('VITE_SPRING_API_BASE_URL 이 올바른 http(s) 주소가 아닙니다.');
    }

    if (!readEnv('VITE_FASTAPI_BASE_URL') && !USE_MOCK_ANALYSIS) {
        problems.push('VITE_FASTAPI_BASE_URL 미설정 — http://localhost:8000 으로 대체합니다.');
    } else if (!isValidHttpUrl(FASTAPI_BASE_URL)) {
        problems.push('VITE_FASTAPI_BASE_URL 이 올바른 http(s) 주소가 아닙니다.');
    }

    Object.values(FEATURE_REQUIREMENTS).forEach(({ key, envName, label }) => {
        if (!key) problems.push(`${envName} 미설정 — ${label} 기능이 비활성화됩니다.`);
    });

    if (problems.length === 0) return;

    console.group('[PULSE env] 환경변수 점검');
    problems.forEach((message) => console.warn(message));
    console.info('.env 파일을 확인한 후 dev 서버를 다시 시작해 주세요.');
    console.groupEnd();
};
