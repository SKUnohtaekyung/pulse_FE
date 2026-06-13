/**
 * Market Analysis Mock Data
 * 주변 상권 분석 페이지용 Mock 데이터
 */

export const MOCK_STORE = {
    storeId: "store_001",
    storeName: "범계 든든국밥",
    address: "경기도 안양시 동안구 범계로 18",
    lat: 37.3900,
    lng: 126.9510,
    primaryCategoryGroupCode: "FD6"
};

export const MOCK_MARKET_SUMMARY = {
    center: { lat: 37.3900, lng: 126.9510 },
    radius: 500,
    generatedAt: "2026-02-16T07:00:00Z",
    counts: {
        FD6: { label: "음식점", total: 132 },
        CE7: { label: "카페", total: 41 },
        CS2: { label: "편의점", total: 7 },
        HP8: { label: "병원", total: 10 },
        PM9: { label: "약국", total: 6 },
        SW8: { label: "지하철역", total: 1 },
        SC4: { label: "학교", total: 2 },
        AC5: { label: "학원", total: 18 }
    },
    competition: {
        categoryGroupCode: "FD6",
        label: "내 업종(음식점)",
        total: 132,
        densityPerKm2: 168.1,
        nearest: [
            {
                id: "26338954",
                name: "경쟁가게A",
                distanceM: 115,
                lat: 37.3908,
                lng: 126.9517,
                address: "경기도 안양시 동안구 ...",
                phone: "031-123-4567",
                url: "http://place.map.kakao.com/26338954"
            },
            {
                id: "99338421",
                name: "경쟁가게B",
                distanceM: 190,
                lat: 37.3897,
                lng: 126.9502,
                address: "경기도 안양시 동안구 ...",
                phone: "031-234-5678",
                url: "http://place.map.kakao.com/99338421"
            },
            {
                id: "11223344",
                name: "경쟁가게C",
                distanceM: 245,
                lat: 37.3905,
                lng: 126.9495,
                address: "경기도 안양시 동안구 ...",
                phone: "031-345-6789",
                url: "http://place.map.kakao.com/11223344"
            }
        ]
    },
    anchors: {
        score: 9,
        typeLabel: "역세권형",
        breakdown: [
            { categoryGroupCode: "SW8", label: "지하철역", count: 1, weight: 3 },
            { categoryGroupCode: "SC4", label: "학교", count: 2, weight: 2 },
            { categoryGroupCode: "AC5", label: "학원", count: 18, weight: 2 }
        ]
    },
    actions: [
        {
            title: "하교/학원 타임 공략",
            why: "학원(18개) 집중 지역으로 학생 유입 가능성 높음",
            todo: [
                "16~19시 간식/세트 메뉴 훅 제작",
                "테이크아웃 동선 안내 강화",
                "학생 할인 이벤트 고려"
            ],
            cta: {
                label: "숏폼 훅 생성하기",
                action: "OPEN_CONTENT_BUILDER",
                payload: { theme: "after_school" }
            }
        },
        {
            title: "동종 경쟁 과열 대응",
            why: "반경 500m 내 음식점 132개로 경쟁 심화",
            todo: [
                "대표 메뉴 1개에 USP 문장 고정",
                "사진 3장 리라이팅으로 차별화",
                "가격 앵커 메뉴 설정"
            ],
            cta: {
                label: "USP 문구 생성하기",
                action: "OPEN_COPY_GENERATOR",
                payload: { type: "usp" }
            }
        },
        {
            title: "지도 탐색 유입 강화",
            why: "근처 카페/음식점 탐색 수요 높음",
            todo: [
                "영업시간/휴무 정확화",
                "대표 메뉴명에 키워드 포함",
                "가게 사진 최신화"
            ],
            cta: {
                label: "체크리스트 보기",
                action: "OPEN_CHECKLIST",
                payload: { id: "map_seo" }
            }
        }
    ],
    note: "Mock data: 카카오 검색 결과를 가정한 샘플입니다."
};

export const CATEGORY_CONFIG = [
    { code: "FD6", label: "음식점", defaultOn: true, color: "#FF5A36", icon: "🍽️" },
    { code: "CE7", label: "카페", defaultOn: true, color: "#8B4513", icon: "☕" },
    { code: "CS2", label: "편의점", defaultOn: false, color: "#4CAF50", icon: "🏪" },
    { code: "HP8", label: "병원", defaultOn: false, color: "#2196F3", icon: "🏥" },
    { code: "PM9", label: "약국", defaultOn: false, color: "#9C27B0", icon: "💊" },
    { code: "SW8", label: "지하철역", defaultOn: false, color: "#FF9800", icon: "🚇" },
    { code: "SC4", label: "학교", defaultOn: false, color: "#00BCD4", icon: "🏫" },
    { code: "AC5", label: "학원", defaultOn: false, color: "#E91E63", icon: "📚" }
];

// 반경별 Mock 데이터 (반경 변경 시 사용)
export const MOCK_MARKET_SUMMARY_BY_RADIUS = {
    300: {
        ...MOCK_MARKET_SUMMARY,
        radius: 300,
        counts: {
            FD6: { label: "음식점", total: 78 },
            CE7: { label: "카페", total: 24 },
            CS2: { label: "편의점", total: 4 },
            HP8: { label: "병원", total: 6 },
            PM9: { label: "약국", total: 3 },
            SW8: { label: "지하철역", total: 1 },
            SC4: { label: "학교", total: 1 },
            AC5: { label: "학원", total: 11 }
        }
    },
    500: MOCK_MARKET_SUMMARY,
    1000: {
        ...MOCK_MARKET_SUMMARY,
        radius: 1000,
        counts: {
            FD6: { label: "음식점", total: 245 },
            CE7: { label: "카페", total: 89 },
            CS2: { label: "편의점", total: 15 },
            HP8: { label: "병원", total: 22 },
            PM9: { label: "약국", total: 12 },
            SW8: { label: "지하철역", total: 2 },
            SC4: { label: "학교", total: 4 },
            AC5: { label: "학원", total: 34 }
        }
    }
};

// 카테고리별 장소 Mock 데이터 (마커 표시용)
export const MOCK_CATEGORY_PLACES = {
    FD6: [ // 음식점
        { id: '1', name: '맛있는 김밥', lat: 37.3905, lng: 126.9515, distanceM: 120, address: '경기도 안양시 동안구 범계로 123', phone: '031-123-4567', url: 'http://place.map.kakao.com/1' },
        { id: '2', name: '행복한 돈까스', lat: 37.3895, lng: 126.9505, distanceM: 180, address: '경기도 안양시 동안구 범계로 124', phone: '031-123-4568', url: 'http://place.map.kakao.com/2' },
        { id: '3', name: '황금 치킨', lat: 37.3910, lng: 126.9520, distanceM: 250, address: '경기도 안양시 동안구 범계로 125', phone: '031-123-4569', url: 'http://place.map.kakao.com/3' },
        { id: '4', name: '신선한 초밥', lat: 37.3892, lng: 126.9512, distanceM: 300, address: '경기도 안양시 동안구 범계로 126', phone: '031-123-4570', url: 'http://place.map.kakao.com/4' },
        { id: '5', name: '든든한 국밥', lat: 37.3908, lng: 126.9508, distanceM: 150, address: '경기도 안양시 동안구 범계로 127', phone: '031-123-4571', url: 'http://place.map.kakao.com/5' }
    ],
    CE7: [ // 카페
        { id: '11', name: '스타벅스 범계점', lat: 37.3903, lng: 126.9513, distanceM: 100, address: '경기도 안양시 동안구 범계로 201', phone: '031-234-5678', url: 'http://place.map.kakao.com/11' },
        { id: '12', name: '투썸플레이스', lat: 37.3898, lng: 126.9518, distanceM: 220, address: '경기도 안양시 동안구 범계로 202', phone: '031-234-5679', url: 'http://place.map.kakao.com/12' },
        { id: '13', name: '카페베네', lat: 37.3907, lng: 126.9507, distanceM: 180, address: '경기도 안양시 동안구 범계로 203', phone: '031-234-5680', url: 'http://place.map.kakao.com/13' },
        { id: '14', name: '할리스커피', lat: 37.3893, lng: 126.9515, distanceM: 280, address: '경기도 안양시 동안구 범계로 204', phone: '031-234-5681', url: 'http://place.map.kakao.com/14' }
    ],
    CS2: [ // 편의점
        { id: '21', name: 'CU 범계점', lat: 37.3901, lng: 126.9511, distanceM: 80, address: '경기도 안양시 동안구 범계로 301', phone: '031-345-6789', url: 'http://place.map.kakao.com/21' },
        { id: '22', name: 'GS25 범계역점', lat: 37.3896, lng: 126.9509, distanceM: 160, address: '경기도 안양시 동안구 범계로 302', phone: '031-345-6790', url: 'http://place.map.kakao.com/22' },
        { id: '23', name: '세븐일레븐', lat: 37.3904, lng: 126.9516, distanceM: 140, address: '경기도 안양시 동안구 범계로 303', phone: '031-345-6791', url: 'http://place.map.kakao.com/23' }
    ],
    HP8: [ // 병원
        { id: '31', name: '범계내과', lat: 37.3906, lng: 126.9514, distanceM: 130, address: '경기도 안양시 동안구 범계로 401', phone: '031-456-7890', url: 'http://place.map.kakao.com/31' },
        { id: '32', name: '행복치과', lat: 37.3894, lng: 126.9508, distanceM: 200, address: '경기도 안양시 동안구 범계로 402', phone: '031-456-7891', url: 'http://place.map.kakao.com/32' },
        { id: '33', name: '건강한의원', lat: 37.3909, lng: 126.9519, distanceM: 260, address: '경기도 안양시 동안구 범계로 403', phone: '031-456-7892', url: 'http://place.map.kakao.com/33' }
    ],
    PM9: [ // 약국
        { id: '41', name: '범계약국', lat: 37.3902, lng: 126.9512, distanceM: 90, address: '경기도 안양시 동안구 범계로 501', phone: '031-567-8901', url: 'http://place.map.kakao.com/41' },
        { id: '42', name: '건강약국', lat: 37.3897, lng: 126.9506, distanceM: 170, address: '경기도 안양시 동안구 범계로 502', phone: '031-567-8902', url: 'http://place.map.kakao.com/42' }
    ]
};
