/**
 * Kakao Local API Client
 * 주변 장소 검색 API 호출
 */

const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
const BASE_URL = 'https://dapi.kakao.com/v2/local';

/**
 * 카테고리별 장소 검색
 * @param {number} lat - 위도
 * @param {number} lng - 경도
 * @param {number} radius - 반경 (미터)
 * @param {string} categoryCode - 카테고리 코드 (FD6, CE7 등)
 * @returns {Promise<Object>} API 응답
 */
export const searchPlacesByCategory = async (lat, lng, radius, categoryCode) => {
    if (!REST_API_KEY) {
        throw new Error('Kakao REST API 키가 설정되지 않았습니다.');
    }

    const url = `${BASE_URL}/search/category.json?category_group_code=${categoryCode}&x=${lng}&y=${lat}&radius=${radius}&size=15`;

    const response = await fetch(url, {
        headers: {
            'Authorization': `KakaoAK ${REST_API_KEY}`
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Kakao API Error (${response.status}): ${errorText}`);
    }

    return response.json();
};

/**
 * 키워드로 장소 검색
 * @param {number} lat - 위도
 * @param {number} lng - 경도
 * @param {number} radius - 반경 (미터)
 * @param {string} keyword - 검색 키워드
 * @returns {Promise<Object>} API 응답
 */
export const searchPlacesByKeyword = async (lat, lng, radius, keyword) => {
    if (!REST_API_KEY) {
        throw new Error('Kakao REST API 키가 설정되지 않았습니다.');
    }

    const url = `${BASE_URL}/search/keyword.json?query=${encodeURIComponent(keyword)}&x=${lng}&y=${lat}&radius=${radius}&size=15`;

    const response = await fetch(url, {
        headers: {
            'Authorization': `KakaoAK ${REST_API_KEY}`
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Kakao API Error (${response.status}): ${errorText}`);
    }

    return response.json();
};
