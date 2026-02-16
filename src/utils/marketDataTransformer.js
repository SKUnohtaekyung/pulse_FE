/**
 * Market Data Transformer
 * Kakao Local API 응답을 내부 데이터 구조로 변환
 */

/**
 * 카테고리 코드 → 한글 라벨 매핑
 */
const CATEGORY_LABELS = {
    FD6: '음식점',
    CE7: '카페',
    CS2: '편의점',
    HP8: '병원',
    PM9: '약국',
    SW8: '지하철역',
    SC4: '학교',
    AC5: '학원'
};

/**
 * 카테고리 라벨 가져오기
 */
export const getCategoryLabel = (code) => {
    return CATEGORY_LABELS[code] || code;
};

/**
 * 밀도 계산 (1km² 당 업소 수)
 */
const calculateDensity = (count, radiusM) => {
    const areaKm2 = Math.PI * Math.pow(radiusM / 1000, 2);
    return parseFloat((count / areaKm2).toFixed(1));
};

/**
 * 앵커 점수 계산
 */
const calculateAnchors = (apiResponses) => {
    const weights = {
        SW8: 3, // 지하철역
        SC4: 2, // 학교
        AC5: 2, // 학원
        HP8: 1, // 병원
        PM9: 1  // 약국
    };

    let score = 0;
    const breakdown = [];

    Object.entries(weights).forEach(([code, weight]) => {
        const count = apiResponses[code]?.documents?.length || 0;
        if (count > 0) {
            score += count * weight;
            breakdown.push({
                categoryGroupCode: code,
                label: getCategoryLabel(code),
                count,
                weight
            });
        }
    });

    // 점수 구간별 타입 분류
    const typeLabel =
        score >= 10 ? '역세권형' :
            score >= 7 ? '학원가형' :
                score >= 4 ? '주거지형' : '일반형';

    return { score, typeLabel, breakdown };
};

/**
 * Kakao API 응답 → 내부 Market Summary 구조로 변환
 * @param {Object} apiResponses - 카테고리별 API 응답 { FD6: {...}, CE7: {...}, ... }
 * @param {Object} storeInfo - 가게 정보
 * @param {number} radius - 반경 (미터)
 * @returns {Object} Market Summary
 */
export const transformToMarketSummary = (apiResponses, storeInfo, radius) => {
    // 1. 카테고리별 업소 수 집계
    const counts = {};
    Object.entries(apiResponses).forEach(([code, response]) => {
        counts[code] = {
            label: getCategoryLabel(code),
            total: response.documents?.length || 0
        };
    });

    // 2. 경쟁 분석 (동종 업소)
    const primaryCategory = storeInfo.primaryCategoryGroupCode;
    const competitionData = apiResponses[primaryCategory];

    const competition = {
        categoryGroupCode: primaryCategory,
        label: `내 업종(${getCategoryLabel(primaryCategory)})`,
        total: competitionData.documents?.length || 0,
        densityPerKm2: calculateDensity(competitionData.documents?.length || 0, radius),
        nearest: (competitionData.documents || [])
            .map(doc => ({
                id: doc.id,
                name: doc.place_name,
                distanceM: parseInt(doc.distance) || 0,
                lat: parseFloat(doc.y),
                lng: parseFloat(doc.x),
                address: doc.address_name,
                phone: doc.phone || '',
                url: doc.place_url
            }))
            .sort((a, b) => a.distanceM - b.distanceM)
            .slice(0, 3)
    };

    // 3. 앵커 분석
    const anchors = calculateAnchors(apiResponses);

    // 4. 실행 액션 (임시 템플릿 - 나중에 AI로 교체)
    const actions = generateActionTemplates(counts, competition, anchors);

    return {
        center: { lat: storeInfo.lat, lng: storeInfo.lng },
        radius,
        generatedAt: new Date().toISOString(),
        counts,
        competition,
        anchors,
        actions
    };
};

/**
 * 실행 액션 템플릿 생성 (임시)
 */
const generateActionTemplates = (counts, competition, anchors) => {
    const actions = [];

    // 액션 1: 학원가 타겟팅
    if (counts.AC5?.total > 10) {
        actions.push({
            title: '하교/학원 타임 공략',
            why: `학원(${counts.AC5.total}개) 집중 지역으로 학생 유입 가능성 높음`,
            todo: [
                '16~19시 간식/세트 메뉴 홍보 영상 제작',
                '테이크아웃 동선 안내 강화',
                '학생 할인 이벤트 고려'
            ],
            cta: {
                label: '숏폼 훅 생성하기',
                action: 'OPEN_CONTENT_BUILDER',
                payload: { theme: 'after_school' }
            }
        });
    }

    // 액션 2: 경쟁 과열 대응
    if (competition.total > 50) {
        actions.push({
            title: '동종 경쟁 과열 대응',
            why: `반경 ${competition.densityPerKm2}개/km²로 경쟁 심화`,
            todo: [
                '대표 메뉴 1개에 USP 문장 고정',
                '사진 3장 리라이팅으로 차별화',
                '가격 앵커 메뉴 설정'
            ],
            cta: {
                label: 'USP 문구 생성하기',
                action: 'OPEN_COPY_GENERATOR',
                payload: { type: 'usp' }
            }
        });
    }

    // 액션 3: 지도 탐색 유입 강화
    actions.push({
        title: '지도 탐색 유입 강화',
        why: '근처 카페/음식점 탐색 수요 높음',
        todo: [
            '영업시간/휴무 정확화',
            '대표 메뉴명에 키워드 포함',
            '가게 사진 최신화'
        ],
        cta: {
            label: '체크리스트 보기',
            action: 'OPEN_CHECKLIST',
            payload: { id: 'map_seo' }
        }
    });

    return actions;
};
