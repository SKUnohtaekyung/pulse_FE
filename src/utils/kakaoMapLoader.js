/**
 * Kakao Map SDK Dynamic Loader
 *
 * 환경변수에서 API 키를 가져와 SDK를 동적으로 로드한다.
 *
 * 예전에는 키가 없을 때 불완전한 Mock SDK 를 주입했는데,
 * Circle·MarkerImage·event 같은 필수 API 가 빠져 있어 지도 화면이 통째로 크래시했다.
 * 지금은 "지도를 쓸 수 없다"는 사실을 명확한 오류로 알리고, 화면 쪽에서 텍스트 대체 UI 를 보여준다.
 */

import { KAKAO_MAP_API_KEY } from '../config/env';

/** 스크립트 로드 타임아웃 — 응답이 없어도 영원히 대기하지 않는다. */
const LOAD_TIMEOUT_MS = 12000;

let loadPromise = null;

/** 지도 기능 사용 가능 여부 — 화면에서 미리 확인해 대체 UI 로 분기할 수 있다. */
export const isKakaoMapConfigured = () => !!KAKAO_MAP_API_KEY && !KAKAO_MAP_API_KEY.includes('your_');

/** 사용자에게 그대로 보여줄 수 있는 지도 오류 */
export class KakaoMapLoadError extends Error {
    constructor(reason) {
        super('지도를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.');
        this.name = 'KakaoMapLoadError';
        this.reason = reason;
    }
}

export const loadKakaoMapSDK = () => {
    // 이미 로드됨
    if (window.kakao?.maps?.Map) {
        return Promise.resolve(window.kakao);
    }

    // 로딩 중이면 기존 Promise 재사용 (중복 스크립트 주입 방지)
    if (loadPromise) return loadPromise;

    if (!isKakaoMapConfigured()) {
        // 개발자에게는 원인을 명확히 알리고, 사용자에게는 일반 문구만 전달한다.
        if (import.meta.env.DEV) {
            console.warn('[PULSE map] VITE_KAKAO_MAP_API_KEY 가 설정되지 않아 지도를 사용할 수 없습니다.');
        }
        return Promise.reject(new KakaoMapLoadError('missing-key'));
    }

    loadPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        const scriptUrl = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_API_KEY}&libraries=services&autoload=false`;

        let settled = false;
        const finish = (fn, value) => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            // 실패한 경우 다음 시도에서 다시 로드할 수 있도록 캐시를 비운다.
            if (fn === reject) loadPromise = null;
            fn(value);
        };

        const timer = setTimeout(() => finish(reject, new KakaoMapLoadError('timeout')), LOAD_TIMEOUT_MS);

        script.src = scriptUrl;
        script.async = true;

        script.onload = () => {
            if (!window.kakao?.maps) {
                finish(reject, new KakaoMapLoadError('sdk-missing'));
                return;
            }
            try {
                window.kakao.maps.load(() => finish(resolve, window.kakao));
            } catch (error) {
                if (import.meta.env.DEV) console.error('[PULSE map] SDK 초기화 실패', error);
                finish(reject, new KakaoMapLoadError('init-failed'));
            }
        };

        script.onerror = () => {
            if (import.meta.env.DEV) {
                console.error(
                    '[PULSE map] SDK 스크립트를 불러오지 못했습니다. ' +
                    'Kakao Developers 에서 Web 플랫폼과 사이트 도메인이 등록되어 있는지 확인해 주세요.',
                );
            }
            finish(reject, new KakaoMapLoadError('script-error'));
        };

        document.head.appendChild(script);
    });

    return loadPromise;
};
