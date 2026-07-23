/**
 * 인증 만료(401) 단일 처리 지점.
 *
 * 여러 요청이 동시에 401 을 받아도 로그아웃·리다이렉트가 한 번만 일어나도록
 * 단일 플래그로 막는다. 이미 /login 에 있는 경우에는 아무것도 하지 않아
 * 무한 리다이렉트를 방지한다.
 */

const SESSION_EXPIRED_FLAG = 'pulseSessionExpired';

let handling = false;

/** 로그인 화면에서 "작업 중이었다" 안내를 띄우기 위한 플래그 */
export const consumeSessionExpiredNotice = () => {
    try {
        const raw = sessionStorage.getItem(SESSION_EXPIRED_FLAG);
        if (raw) sessionStorage.removeItem(SESSION_EXPIRED_FLAG);
        return !!raw;
    } catch {
        return false;
    }
};

const markSessionExpired = () => {
    try {
        sessionStorage.setItem(SESSION_EXPIRED_FLAG, '1');
    } catch {
        /* 프라이빗 모드 등에서 sessionStorage 가 막혀도 흐름은 계속되어야 한다 */
    }
};

const clearAuthStorage = () => {
    ['accessToken', 'analysisTaskId', 'user', 'userProfile'].forEach((key) => {
        try {
            localStorage.removeItem(key);
        } catch {
            /* noop */
        }
    });
};

/**
 * 인증 만료 처리. 동시에 여러 번 호출되어도 실제 동작은 한 번만 수행한다.
 * 라우터 밖(API 계층)에서도 호출되므로 location 을 직접 사용한다.
 */
export const handleSessionExpired = () => {
    if (handling) return;

    const loginPath = `${import.meta.env.BASE_URL || '/'}login`.replace(/\/{2,}/g, '/');
    const alreadyOnLogin = typeof window !== 'undefined' && window.location.pathname.replace(/\/{2,}/g, '/') === loginPath;

    clearAuthStorage();

    if (alreadyOnLogin) return;

    handling = true;
    markSessionExpired();

    if (typeof window !== 'undefined') {
        window.location.assign(loginPath);
    }
};

/** 테스트·개발 편의를 위한 초기화 */
export const resetSessionExpiryGuard = () => {
    handling = false;
};
