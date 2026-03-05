/**
 * kakaoPlacesService.js
 * 카카오 지도 Places API를 이용한 상권 데이터 실시간 조회
 *
 * 사용 API: kakao.maps.services.Places.categorySearch()
 * 문서: https://apis.map.kakao.com/web/documentation/#services_Places_categorySearch
 */

// 분석할 카테고리 목록
const CATEGORY_CONFIGS = [
    { code: 'FD6', label: '음식점' },
    { code: 'CE7', label: '카페' },
    { code: 'CS2', label: '편의점' },
    { code: 'HP8', label: '병원' },
    { code: 'PM9', label: '약국' },
    { code: 'SW8', label: '지하철역' },
    { code: 'SC4', label: '학교' },
    { code: 'AC5', label: '학원' },
];

// 앵커 타입 판별 기준
const ANCHOR_WEIGHTS = {
    SW8: { weight: 3, label: '지하철역' },
    SC4: { weight: 2, label: '학교' },
    AC5: { weight: 2, label: '학원' },
    HP8: { weight: 1, label: '병원' },
};

/**
 * 하나의 카테고리 코드로 반경 내 장소를 모두 조회 (페이지네이션 포함)
 * @param {object} ps   - kakao.maps.services.Places 인스턴스
 * @param {string} code - 카테고리 코드 (예: 'FD6')
 * @param {{ lat: number, lng: number }} center
 * @param {number} radiusM - 검색 반경 (미터)
 * @returns {Promise<Array>} 장소 목록
 */
function searchCategoryAll(ps, code, center, radiusM) {
    return new Promise((resolve) => {
        const allPlaces = [];
        let currentPage = 1;

        const fetchPage = () => {
            ps.categorySearch(
                code,
                (data, status, pagination) => {
                    if (status !== window.kakao.maps.services.Status.OK) {
                        resolve(allPlaces); // 결과 없거나 오류 → 빈 배열
                        return;
                    }

                    allPlaces.push(...data);

                    // 다음 페이지가 있고 최대 3페이지까지만 (과도한 요청 방지)
                    if (pagination.hasNextPage && currentPage < 3) {
                        currentPage++;
                        fetchPage();
                    } else {
                        resolve(allPlaces);
                    }
                },
                {
                    location: new window.kakao.maps.LatLng(center.lat, center.lng),
                    radius: radiusM,
                    useMapBounds: false,
                    size: 15,
                    page: currentPage,
                }
            );
        };

        fetchPage();
    });
}

/**
 * 카카오 Places API로 반경 내 상권 데이터 전체 조회
 *
 * @param {{ lat: number, lng: number }} center - 중심 좌표
 * @param {number} radiusM - 검색 반경 (미터)
 * @param {string} primaryCategory - 내 가게 업종 코드 (기본: 'FD6')
 * @returns {Promise<object>} marketData (SummaryPanel에서 소비하는 구조)
 */
export async function fetchRealMarketData(center, radiusM, primaryCategory = 'FD6') {
    if (!window.kakao?.maps?.services) {
        throw new Error('카카오 지도 API가 아직 로드되지 않았습니다.');
    }

    const ps = new window.kakao.maps.services.Places();

    // 모든 카테고리 병렬 조회
    const results = await Promise.all(
        CATEGORY_CONFIGS.map(({ code }) => searchCategoryAll(ps, code, center, radiusM))
    );

    // 카테고리별 결과 매핑
    const categoryPlaces = {};
    const counts = {};

    CATEGORY_CONFIGS.forEach(({ code, label }, i) => {
        const places = results[i];
        counts[code] = { label, total: places.length };

        // 지도 마커용 장소 목록 (상위 10개)
        categoryPlaces[code] = places.slice(0, 10).map(p => ({
            id: p.id,
            name: p.place_name,
            lat: parseFloat(p.y),
            lng: parseFloat(p.x),
            distanceM: parseInt(p.distance, 10) || 0,
            address: p.road_address_name || p.address_name,
            phone: p.phone,
            url: p.place_url,
        }));
    });

    // 경쟁 업소 (내 업종 상위 5개, 거리 오름차순)
    const competitorPlaces = categoryPlaces[primaryCategory] || [];
    const sortedCompetitors = [...competitorPlaces]
        .sort((a, b) => a.distanceM - b.distanceM)
        .slice(0, 5);

    // 앵커 점수 계산
    const anchorBreakdown = Object.entries(ANCHOR_WEIGHTS).map(([code, { weight, label }]) => ({
        categoryGroupCode: code,
        label,
        count: counts[code]?.total || 0,
        weight,
    })).filter(a => a.count > 0);

    const anchorScore = anchorBreakdown.reduce(
        (sum, a) => sum + Math.min(a.count, 3) * a.weight, // 카테고리당 최대 3 스택
        0
    );

    const anchorType =
        (counts['SW8']?.total || 0) >= 1 ? '역세권형' :
        (counts['SC4']?.total || 0) + (counts['AC5']?.total || 0) >= 5 ? '학원가형' :
        (counts['HP8']?.total || 0) >= 5 ? '의료상권형' :
        anchorScore >= 5 ? '복합상권형' :
        '일반상권형';

    // km² 밀도 계산 (원 면적 = π * r²)
    const areKm2 = Math.PI * Math.pow(radiusM / 1000, 2);
    const densityPerKm2 = Math.round((counts[primaryCategory]?.total || 0) / areKm2 * 10) / 10;

    return {
        center,
        radius: radiusM,
        generatedAt: new Date().toISOString(),
        counts,
        competition: {
            categoryGroupCode: primaryCategory,
            label: `내 업종(${counts[primaryCategory]?.label || '음식점'})`,
            total: counts[primaryCategory]?.total || 0,
            densityPerKm2,
            nearest: sortedCompetitors,
        },
        anchors: {
            score: anchorScore,
            typeLabel: anchorType,
            breakdown: anchorBreakdown,
        },
        // AI 액션 추천은 백엔드 담당 → 공란 or 기본값 유지
        actions: [],
        note: null,
        _categoryPlaces: categoryPlaces, // 지도 마커용
    };
}
