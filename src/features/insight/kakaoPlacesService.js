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

const REPORT_STATE = {
    READY: 'ready',
    EMPTY: 'empty',
};

const isDev = import.meta.env.DEV;

function logMarket(level, event, payload = {}, devOnly = false) {
    if (devOnly && !isDev) return;

    console[level](event, {
        ...payload,
        timestamp: new Date().toISOString(),
    });
}

function getKakaoStatusName(status) {
    const statuses = window.kakao?.maps?.services?.Status || {};
    const match = Object.entries(statuses).find(([, value]) => value === status);
    return match?.[0] || String(status || 'UNKNOWN');
}

function createMarketError({ code, title, message, actionLabel = '다시 시도', details = {} }) {
    const error = new Error(message);
    error.code = code;
    error.title = title;
    error.actionLabel = actionLabel;
    error.details = details;
    return error;
}

function validateCenter(center) {
    const lat = Number(center?.lat);
    const lng = Number(center?.lng);
    const isValidLat = Number.isFinite(lat) && lat >= -90 && lat <= 90;
    const isValidLng = Number.isFinite(lng) && lng >= -180 && lng <= 180;

    if (!isValidLat || !isValidLng) {
        logMarket('error', '[CommercialAnalysis] invalid_center', { rawCenter: center }, false);
        throw createMarketError({
            code: 'invalid_center',
            title: '분석할 위치를 확인할 수 없습니다',
            message: '장소를 다시 검색하거나 저장된 가게 위치를 확인해 주세요.',
            actionLabel: '장소 다시 검색',
            details: { rawCenter: center },
        });
    }

    return { lat, lng };
}

function validateRadius(radiusM) {
    const radius = Number(radiusM);
    const allowed = [300, 500, 1000];

    if (!allowed.includes(radius)) {
        throw createMarketError({
            code: 'invalid_radius',
            title: '분석 반경을 다시 선택해 주세요',
            message: '지원하지 않는 반경입니다. 300m, 500m, 1km 중 하나를 선택해 주세요.',
            actionLabel: '500m로 재설정',
            details: { radiusM },
        });
    }

    return radius;
}

/**
 * 하나의 카테고리 코드로 반경 내 장소를 모두 조회 (페이지네이션 포함)
 * @param {object} ps   - kakao.maps.services.Places 인스턴스
 * @param {{ code: string, label: string }} category
 * @param {{ lat: number, lng: number }} center
 * @param {number} radiusM - 검색 반경 (미터)
 * @returns {Promise<object>} 카테고리 조회 결과
 */
function searchCategoryAll(ps, category, center, radiusM) {
    return new Promise((resolve) => {
        const { code, label } = category;
        const allPlaces = [];
        let currentPage = 1;
        let pageCount = 0;

        const fetchPage = () => {
            ps.categorySearch(
                code,
                (data, status, pagination) => {
                    const statusName = getKakaoStatusName(status);

                    if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
                        logMarket('info', '[KakaoPlaces] category:zero_result', {
                            code,
                            label,
                            center,
                            radius: radiusM,
                        }, true);

                        resolve({
                            code,
                            label,
                            status: 'ZERO_RESULT',
                            places: allPlaces,
                            pageCount,
                        });
                        return;
                    }

                    if (status !== window.kakao.maps.services.Status.OK) {
                        const resultStatus = allPlaces.length > 0 ? 'PARTIAL_ERROR' : 'ERROR';
                        logMarket(resultStatus === 'ERROR' ? 'error' : 'warn', '[KakaoPlaces] category:failed', {
                            code,
                            label,
                            status: statusName,
                            center,
                            radius: radiusM,
                            collectedCount: allPlaces.length,
                            page: currentPage,
                        }, resultStatus !== 'ERROR');

                        resolve({
                            code,
                            label,
                            status: resultStatus,
                            rawStatus: statusName,
                            places: allPlaces,
                            pageCount,
                        });
                        return;
                    }

                    pageCount++;
                    allPlaces.push(...data);

                    // 다음 페이지가 있고 최대 3페이지까지만 (과도한 요청 방지)
                    if (pagination.hasNextPage && currentPage < 3) {
                        currentPage++;
                        fetchPage();
                    } else {
                        logMarket('info', '[KakaoPlaces] category:ok', {
                            code,
                            label,
                            count: allPlaces.length,
                            pageCount,
                            radius: radiusM,
                        }, true);

                        resolve({
                            code,
                            label,
                            status: 'OK',
                            places: allPlaces,
                            pageCount,
                        });
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
        logMarket('error', '[KakaoMap] sdk:failed', {
            hasKakao: Boolean(window.kakao),
            hasMaps: Boolean(window.kakao?.maps),
            hasServices: Boolean(window.kakao?.maps?.services),
        }, false);

        throw createMarketError({
            code: 'sdk_unavailable',
            title: '지도 서비스를 불러오지 못했습니다',
            message: '지도 서비스가 준비되지 않아 상권 분석을 시작할 수 없습니다.',
            details: {
                hasKakao: Boolean(window.kakao),
                hasMaps: Boolean(window.kakao?.maps),
                hasServices: Boolean(window.kakao?.maps?.services),
            },
        });
    }

    const validCenter = validateCenter(center);
    const validRadius = validateRadius(radiusM);
    const ps = new window.kakao.maps.services.Places();

    logMarket('info', '[CommercialAnalysis] market lookup:start', {
        center: validCenter,
        radius: validRadius,
        primaryCategory,
        categoryCodes: CATEGORY_CONFIGS.map(({ code }) => code),
    }, true);

    // 모든 카테고리 병렬 조회
    const results = await Promise.all(
        CATEGORY_CONFIGS.map((category) => searchCategoryAll(ps, category, validCenter, validRadius))
    );

    const failedResults = results.filter(({ status }) => status === 'ERROR' || status === 'PARTIAL_ERROR');
    const failedCategories = failedResults.map(({ code }) => code);
    const primaryResult = results.find(({ code }) => code === primaryCategory);
    const primaryFailed = primaryResult?.status === 'ERROR' || primaryResult?.status === 'PARTIAL_ERROR';
    const allFailed = failedResults.length === results.length;
    const allEmpty = results.every(({ status, places }) =>
        (status === 'OK' || status === 'ZERO_RESULT') && places.length === 0
    );
    const statusesByCategory = Object.fromEntries(
        results.map(({ code, status, rawStatus }) => [code, rawStatus || status])
    );

    if (allFailed) {
        logMarket('error', '[KakaoPlaces] lookup:failed', {
            statusesByCategory,
            center: validCenter,
            radius: validRadius,
            sdkReady: true,
        }, false);

        if (failedResults.every(({ rawStatus }) => rawStatus === 'ERROR')) {
            logMarket('warn', '[KakaoPlaces] quota: suspected', {
                status: 'ERROR',
                message: '모든 카테고리 조회가 ERROR로 실패했습니다. 앱 키, 도메인 등록, 사용량 제한을 함께 확인해 주세요.',
                failedCategories,
            }, false);
        }

        throw createMarketError({
            code: 'market_lookup_failed',
            title: '상권 데이터를 불러오지 못했습니다',
            message: '잠시 후 다시 시도해 주세요. 문제가 계속되면 지도 서비스 설정이나 사용량 제한을 확인해야 합니다.',
            details: { statusesByCategory, failedCategories, center: validCenter, radius: validRadius },
        });
    }

    if (primaryFailed) {
        logMarket('error', '[KakaoPlaces] primary_category:failed', {
            primaryCategory,
            status: primaryResult?.rawStatus || primaryResult?.status,
            center: validCenter,
            radius: validRadius,
        }, false);

        throw createMarketError({
            code: 'primary_category_failed',
            title: '같은 업종 분석을 불러오지 못했습니다',
            message: '경쟁 업소 데이터를 확인할 수 없어 리포트를 완성하지 못했습니다.',
            details: { primaryCategory, statusesByCategory, center: validCenter, radius: validRadius },
        });
    }

    if (failedResults.length > 0) {
        logMarket('warn', '[KakaoPlaces] category:partial_failure', {
            failedCategories,
            successfulCategories: results.filter(({ status }) => status === 'OK' || status === 'ZERO_RESULT').map(({ code }) => code),
            center: validCenter,
            radius: validRadius,
        }, false);
    }

    // 카테고리별 결과 매핑
    const categoryPlaces = {};
    const counts = {};

    results.forEach(({ code, label, places, status, rawStatus }) => {
        counts[code] = {
            label,
            total: places.length,
            status,
            unavailable: status === 'ERROR' || status === 'PARTIAL_ERROR',
        };

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

        if (status === 'PARTIAL_ERROR') {
            counts[code].note = rawStatus || 'PARTIAL_ERROR';
        }
    });

    if (allEmpty) {
        return {
            reportState: REPORT_STATE.EMPTY,
            emptyState: {
                title: '조회된 상권 데이터가 없습니다',
                message: '선택한 위치와 반경에서 장소 정보가 발견되지 않았습니다. 반경을 넓히거나 다른 장소를 검색해 주세요.',
                actionLabel: validRadius === 1000 ? '장소 다시 검색' : '반경 1km로 보기',
                suggestedRadius: validRadius === 1000 ? null : 1000,
            },
            center: validCenter,
            radius: validRadius,
            generatedAt: new Date().toISOString(),
            counts,
            competition: {
                categoryGroupCode: primaryCategory,
                label: `내 업종(${counts[primaryCategory]?.label || '음식점'})`,
                total: 0,
                densityPerKm2: 0,
                nearest: [],
            },
            anchors: {
                score: 0,
                typeLabel: '데이터 없음',
                breakdown: [],
            },
            actions: [],
            warnings: [],
            note: '선택한 위치와 반경에서 조회된 장소가 없습니다.',
            _categoryPlaces: categoryPlaces,
            diagnostics: { statusesByCategory, failedCategories },
        };
    }

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
    const areKm2 = Math.PI * Math.pow(validRadius / 1000, 2);
    const densityPerKm2 = Math.round((counts[primaryCategory]?.total || 0) / areKm2 * 10) / 10;
    const warnings = failedResults.length > 0
        ? [{
            type: 'partial_failure',
            title: '일부 데이터가 반영되지 않았습니다',
            message: '주요 경쟁 분석은 표시되지만, 주변 시설 일부는 조회되지 않았습니다.',
            failedCategories: failedResults.map(({ code, label }) => ({ code, label })),
        }]
        : [];

    // --- 동적 액션 생성 로직 (MVP용) ---
    // 백엔드 AI 행동제안 계약도 항상 2개입니다. 프론트 fallback도 같은 개수를 유지합니다.
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

    return {
        reportState: REPORT_STATE.READY,
        center: validCenter,
        radius: validRadius,
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
        actions: dynamicActions.slice(0, 2),
        warnings,
        note: warnings.length > 0 ? '일부 주변 시설 데이터는 조회 실패로 집계에서 제외되었습니다.' : null,
        _categoryPlaces: categoryPlaces, // 지도 마커용
        diagnostics: { statusesByCategory, failedCategories },
    };
}
