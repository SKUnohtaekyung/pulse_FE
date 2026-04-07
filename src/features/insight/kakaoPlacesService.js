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

    // --- 동적 액션 생성 로직 (MVP용, 추후 백엔드 연동) ---
    // 백엔드에서 actions 데이터가 내려오면 우선 적용하도록 설계할 수 있습니다.
    const dynamicActions = [];

    // 1. 경쟁 강도 기반 액션
    if ((counts[primaryCategory]?.total || 0) >= 30) {
        dynamicActions.push({
            title: "동종 경쟁 심화 분석",
            why: `사장님, 반경 내 ${counts[primaryCategory]?.label || '동종 업소'}가 ${counts[primaryCategory]?.total}개로 꽤 많습니다 📊`,
            todo: ["비슷한 가게들 사이에서 돋보이도록 대표 메뉴 1개에 USP(핵심 장점) 고정하기", "메뉴 사진 매력적으로 재촬영하기"],
            cta: { label: "USP 문구 생성하기", action: "OPEN_COPY_GENERATOR", payload: { type: "usp" } }
        });
    } else {
        dynamicActions.push({
            title: "독점적 상권 기회 포착",
            why: `사장님, 반경 내 경쟁이 비교적 적습니다. 우리 가게 점유율을 팍팍 늘릴 기회입니다 💡`,
            todo: ["배달 반경을 조금 더 넓혀서 신규 고객 유입 늘리기", "우리 가게만의 시그니처 메뉴 강력 추천하기"],
            cta: { label: "시그니처 메뉴 홍보 만들기", action: "OPEN_CONTENT_BUILDER", payload: { theme: "signature" } }
        });
    }

    // 2. 앵커 상권 기반 액션
    if (counts['SW8']?.total >= 1) {
        dynamicActions.push({
            title: "대중교통 유입 타겟팅",
            why: "지하철역 접근성이 뛰어나 대중교통 이용객 유입이 기대되는 역세권 상권입니다 🚉",
            todo: ["퇴근길 직장인들이 확 끌리게 출퇴근 시간대 숏폼 콘텐츠 집중 노출하기", "가는 길에 가져가기 좋도록 포장 주문 유도 동선 안내하기"],
            cta: { label: "퇴근길 타겟 숏폼 제작", action: "OPEN_CONTENT_BUILDER", payload: { theme: "commute" } }
        });
    } else if ((counts['SC4']?.total || 0) + (counts['AC5']?.total || 0) >= 3) {
        dynamicActions.push({
            title: "학생 타겟 간식 시간 공략",
            why: "학교와 학원이 많아서 10~20대 학생들이 북적거리는 활기찬 상권입니다 🎒",
            todo: ["아이들이 출출할 하교 시간에 맞춘 세트 메뉴 홍보 훅 던지기", "학생 타겟으로 가벼운 할인 쿠폰 발행하기"],
            cta: { label: "하교 타임 숏폼 제작", action: "OPEN_CONTENT_BUILDER", payload: { theme: "after_school" } }
        });
    } else if (counts['HP8']?.total >= 2) {
        dynamicActions.push({
            title: "병원 방문객 특화 마케팅",
            why: "의료 시설 방문객과 의료진들의 유입이 많은 특수 상권입니다 🏥",
            todo: ["환자분들이 챙겨가기 편한 속편한 건강 메뉴 강조하기", "보호자들의 대기 시간 타겟팅 메뉴 안내하기"],
            cta: { label: "건강 맞춤 메뉴 숏폼 제작", action: "OPEN_CONTENT_BUILDER", payload: { theme: "health" } }
        });
    } else {
        dynamicActions.push({
            title: "단골 손님 관리 최적화",
            why: "주민분들이 편하게 찾아오기 좋은 주거/생활 밀착형 상권 특성이 보입니다 🏠",
            todo: ["가족 단위 단골 고객님을 위해 따뜻한 리뷰 이벤트 진행하기", "스탬프나 포인트 적립 등 재방문 유도 혜택 점검하기"],
            cta: { label: "방문 감사 숏폼 제작", action: "OPEN_CONTENT_BUILDER", payload: { theme: "thank_you" } }
        });
    }

    // 3. 지도 탐색 유입 기반 액션
    dynamicActions.push({
        title: "지도 앱 탐색 유입 강화",
        why: "길을 걷다가 주변 랜드마크 검색 후 우연히 유입될 확률이 매우 높습니다 🗺️",
        todo: ["지도 앱(카카오맵, 네이버지도)에 영업시간 및 휴무일 최신화 확인하기", "메뉴 설명에 손님들이 검색할 만한 핵심 카테고리 추가하기"],
        cta: { label: "지도로 숏폼 노출 설정", action: "OPEN_CONTENT_BUILDER", payload: { theme: "map_seo" } }
    });

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
        actions: dynamicActions,
        note: null,
        _categoryPlaces: categoryPlaces, // 지도 마커용
    };
}
