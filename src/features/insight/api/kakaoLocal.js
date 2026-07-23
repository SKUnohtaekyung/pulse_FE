/**
 * Kakao Local API Client
 * 주변 장소 검색 API 호출
 *
 * ⚠️ 수동 확인 필요: REST 키는 원래 서버 전용 자격증명이다.
 * 지금은 클라이언트 번들에 포함되므로, 운영 전에 서버 프록시 경유로 옮기는 것을 권장한다.
 */

import { KAKAO_REST_API_KEY } from '../../../config/env';
import { apiGet } from '../../../utils/httpClient';
import { ERROR_TYPES } from '../../../utils/apiError';

const BASE_URL = 'https://dapi.kakao.com/v2/local';

/** 키가 없을 때 사용자에게 그대로 보여줄 수 있는 문구 (설정값·키 이름은 노출하지 않는다) */
const missingKeyError = () => ({
    type: ERROR_TYPES.FORBIDDEN,
    message: '장소 검색 기능을 사용할 수 없어요. 잠시 후 다시 시도해 주세요.',
    retryable: false,
    status: null,
    fieldErrors: null,
    cause: null,
});

const requestKakao = (url, context) => {
    if (!KAKAO_REST_API_KEY) {
        if (import.meta.env.DEV) {
            console.warn('[PULSE map] VITE_KAKAO_REST_API_KEY 가 설정되지 않아 장소 검색을 사용할 수 없습니다.');
        }
        return Promise.reject(missingKeyError());
    }

    return apiGet(url, {
        headers: { Authorization: `KakaoAK ${KAKAO_REST_API_KEY}` },
        // 카카오 API 는 우리 서비스의 accessToken 을 받으면 안 된다.
        auth: false,
        handle401: false,
        context,
    });
};

/**
 * 카테고리별 장소 검색
 * @param {number} lat - 위도
 * @param {number} lng - 경도
 * @param {number} radius - 반경 (미터)
 * @param {string} categoryCode - 카테고리 코드 (FD6, CE7 등)
 * @returns {Promise<Object>} API 응답
 */
export const searchPlacesByCategory = (lat, lng, radius, categoryCode) =>
    requestKakao(
        `${BASE_URL}/search/category.json?category_group_code=${encodeURIComponent(categoryCode)}&x=${lng}&y=${lat}&radius=${radius}&size=15`,
        'kakao/category',
    );

/**
 * 키워드로 장소 검색
 * @param {number} lat - 위도
 * @param {number} lng - 경도
 * @param {number} radius - 반경 (미터)
 * @param {string} keyword - 검색 키워드
 * @returns {Promise<Object>} API 응답
 */
export const searchPlacesByKeyword = (lat, lng, radius, keyword) =>
    requestKakao(
        `${BASE_URL}/search/keyword.json?query=${encodeURIComponent(keyword)}&x=${lng}&y=${lat}&radius=${radius}&size=15`,
        'kakao/keyword',
    );
