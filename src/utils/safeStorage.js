/**
 * localStorage / sessionStorage 안전 접근 유틸리티.
 *
 * - 프라이빗 모드·용량 초과로 storage 접근 자체가 예외를 던지는 환경 대응
 * - 손상된 JSON 이 저장돼 있어도 앱이 죽지 않고 fallback 을 돌려준다
 * - 구조가 바뀐 오래된 데이터는 validate 로 걸러낸다
 */

const getStore = (kind) => {
    try {
        return kind === 'session' ? window.sessionStorage : window.localStorage;
    } catch {
        return null;
    }
};

/**
 * @param {string} key
 * @param {any} [fallback=null]
 * @param {{ validate?: (value: any) => boolean, kind?: 'local'|'session' }} [options]
 */
export const readJson = (key, fallback = null, options = {}) => {
    const { validate, kind = 'local' } = options;
    const store = getStore(kind);
    if (!store) return fallback;

    let raw;
    try {
        raw = store.getItem(key);
    } catch {
        return fallback;
    }
    if (raw === null || raw === undefined || raw === '') return fallback;

    let parsed;
    try {
        parsed = JSON.parse(raw);
    } catch {
        // 손상된 값은 다음 실행에서 또 실패하지 않도록 제거한다.
        if (import.meta.env.DEV) console.warn(`[PULSE storage] "${key}" 값이 손상되어 제거합니다.`);
        removeItem(key, kind);
        return fallback;
    }

    if (validate && !validate(parsed)) {
        if (import.meta.env.DEV) console.warn(`[PULSE storage] "${key}" 구조가 맞지 않아 무시합니다.`);
        removeItem(key, kind);
        return fallback;
    }

    return parsed;
};

/** 저장 실패(용량 초과 등)해도 예외를 던지지 않고 false 를 돌려준다. */
export const writeJson = (key, value, kind = 'local') => {
    const store = getStore(kind);
    if (!store) return false;
    try {
        store.setItem(key, JSON.stringify(value));
        return true;
    } catch {
        if (import.meta.env.DEV) console.warn(`[PULSE storage] "${key}" 저장에 실패했습니다.`);
        return false;
    }
};

export const readString = (key, fallback = null, kind = 'local') => {
    const store = getStore(kind);
    if (!store) return fallback;
    try {
        const raw = store.getItem(key);
        return raw === null ? fallback : raw;
    } catch {
        return fallback;
    }
};

export const writeString = (key, value, kind = 'local') => {
    const store = getStore(kind);
    if (!store) return false;
    try {
        store.setItem(key, value);
        return true;
    } catch {
        return false;
    }
};

export const removeItem = (key, kind = 'local') => {
    const store = getStore(kind);
    if (!store) return;
    try {
        store.removeItem(key);
    } catch {
        /* noop */
    }
};
