/**
 * Market Analysis Mock Data
 * 주변 상권 분석 페이지용 Mock 데이터
 * 기준 가게: 바람난 얼큰 수제비 범계점 (경기도 안양시 동안구)
 */

export const MOCK_STORE = {
    storeId: "store_001",
    storeName: "바람난 얼큰 수제비 범계점",
    address: "경기도 안양시 동안구 범계로 15 (범계동)",
    lat: 37.3917,
    lng: 126.9521,
    primaryCategoryGroupCode: "FD6"
};

export const MOCK_MARKET_SUMMARY = {
    center: { lat: 37.3917, lng: 126.9521 },
    radius: 500,
    generatedAt: "2026-03-14T00:00:00Z",
    counts: {
        FD6: { label: "음식점", total: 148 },
        CE7: { label: "카페", total: 38 },
        CS2: { label: "편의점", total: 9 },
        HP8: { label: "병원", total: 12 },
        PM9: { label: "약국", total: 7 },
        SW8: { label: "지하철역", total: 1 },
        SC4: { label: "학교", total: 1 },
        AC5: { label: "학원", total: 22 }
    },
    competition: {
        categoryGroupCode: "FD6",
        label: "내 업종(음식점)",
        total: 148,
        densityPerKm2: 188.5,
        nearest: [
            {
                id: "c001",
                name: "수제비스토리 범계점",
                distanceM: 95,
                lat: 37.3924,
                lng: 126.9528,
                address: "경기도 안양시 동안구 범계로 8",
                phone: "031-381-1234",
                url: "http://place.map.kakao.com/c001"
            },
            {
                id: "c002",
                name: "간장동 페터팸민 범계점",
                distanceM: 170,
                lat: 37.3909,
                lng: 126.9513,
                address: "경기도 안양시 동안구 범계로 24",
                phone: "031-382-2345",
                url: "http://place.map.kakao.com/c002"
            },
            {
                id: "c003",
                name: "안양 범계 칼국수",
                distanceM: 230,
                lat: 37.3903,
                lng: 126.9507,
                address: "경기도 안양시 동안구 범계로 47",
                phone: "031-383-3456",
                url: "http://place.map.kakao.com/c003"
            },
            {
                id: "c004",
                name: "신계 매운 낙지 분식",
                distanceM: 310,
                lat: 37.3928,
                lng: 126.9534,
                address: "경기도 안양시 동안구 범계로 62",
                phone: "031-384-4567",
                url: "http://place.map.kakao.com/c004"
            },
            {
                id: "c005",
                name: "원조 할머니 호박 직접수제비",
                distanceM: 385,
                lat: 37.3898,
                lng: 126.9499,
                address: "경기도 안양시 동안구 범계로 78",
                phone: "031-385-5678",
                url: "http://place.map.kakao.com/c005"
            }
        ]
    },
    anchors: {
        score: 11,
        typeLabel: "역세권형",
        breakdown: [
            { categoryGroupCode: "SW8", label: "지하철역", count: 1, weight: 3 },
            { categoryGroupCode: "SC4", label: "학교", count: 1, weight: 2 },
            { categoryGroupCode: "AC5", label: "학원", count: 22, weight: 2 }
        ]
    },
    actions: [
        {
            title: "웨이팅 타임 콘텐츠 공략",
            why: "웨이팅 평균 20분 → 대기 중 습관적 콘텐츠 노출 기회",
            todo: [
                "대기표 발급 QR 바로가기 링크 삽입",
                "오픈런 시간대(11시~14시) 릴스 직접 파악",
                "팔로워 유도 맺음 \"20분 기다림\" 스토리 제작"
            ],
            cta: {
                label: "릴스 훅 생성하기",
                action: "OPEN_CONTENT_BUILDER",
                payload: { theme: "waiting_hook" }
            }
        },
        {
            title: "동종 경쟁 과열 대응",
            why: "반경 500m 내 음식점 148개 • 분식지 경쟁 심화",
            todo: [
                "'수제비피가 얼마나 없는지' USP 문구 고정",
                "매운맛 복제 불가한 고유 피 무게 강조",
                "네이버 플레이스 대표 키워드 개선"
            ],
            cta: {
                label: "USP 문구 생성하기",
                action: "OPEN_COPY_GENERATOR",
                payload: { type: "usp" }
            }
        },
        {
            title: "학원가 타임 공략",
            why: "학원(22개) 집중 → 16~19시 소화 매출 근거지",
            todo: [
                "수제비 싱글 세트 + 음료 콤세트 픽스 구성",
                "학생 연령 맞춤 릴스 제작",
                "인스타 스토리 시간대(17~18시) 고정"
            ],
            cta: {
                label: "숏폼 훅 생성하기",
                action: "OPEN_CONTENT_BUILDER",
                payload: { theme: "after_school" }
            }
        }
    ],
    note: "바람난 얼큰 수제비 범계점 기준 분석 데이터 (2026.03.14)"
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
            FD6: { label: "음식점", total: 89 },
            CE7: { label: "카페", total: 22 },
            CS2: { label: "편의점", total: 5 },
            HP8: { label: "병원", total: 7 },
            PM9: { label: "약국", total: 4 },
            SW8: { label: "지하철역", total: 1 },
            SC4: { label: "학교", total: 0 },
            AC5: { label: "학원", total: 13 }
        }
    },
    500: MOCK_MARKET_SUMMARY,
    1000: {
        ...MOCK_MARKET_SUMMARY,
        radius: 1000,
        counts: {
            FD6: { label: "음식점", total: 267 },
            CE7: { label: "카페", total: 94 },
            CS2: { label: "편의점", total: 18 },
            HP8: { label: "병원", total: 28 },
            PM9: { label: "약국", total: 14 },
            SW8: { label: "지하철역", total: 2 },
            SC4: { label: "학교", total: 3 },
            AC5: { label: "학원", total: 41 }
        }
    }
};

// 카테고리별 장소 Mock 데이터 (마커 표시용)
export const MOCK_CATEGORY_PLACES = {
    FD6: [ // 음식점 — 범계역 인근 경쟁 분식/면류
        { id: '1', name: '수제비스토리 범계점', lat: 37.3924, lng: 126.9528, distanceM: 95, address: '경기도 안양시 동안구 범계로 8', phone: '031-381-1234', url: 'http://place.map.kakao.com/1' },
        { id: '2', name: '간장동 페터팸민 범계점', lat: 37.3909, lng: 126.9513, distanceM: 170, address: '경기도 안양시 동안구 범계로 24', phone: '031-382-2345', url: 'http://place.map.kakao.com/2' },
        { id: '3', name: '안양 범계 칼국수', lat: 37.3903, lng: 126.9507, distanceM: 230, address: '경기도 안양시 동안구 범계로 47', phone: '031-383-3456', url: 'http://place.map.kakao.com/3' },
        { id: '4', name: '신계 매운 낙지 분식', lat: 37.3928, lng: 126.9534, distanceM: 310, address: '경기도 안양시 동안구 범계로 62', phone: '031-384-4567', url: 'http://place.map.kakao.com/4' },
        { id: '5', name: '원조 할머니 호박 직접수제비', lat: 37.3898, lng: 126.9499, distanceM: 385, address: '경기도 안양시 동안구 범계로 78', phone: '031-385-5678', url: 'http://place.map.kakao.com/5' }
    ],
    CE7: [ // 카페
        { id: '11', name: '스타벅스 범계역점', lat: 37.3921, lng: 126.9526, distanceM: 85, address: '경기도 안양시 동안구 범계로 11', phone: '031-391-1111', url: 'http://place.map.kakao.com/11' },
        { id: '12', name: '투썸플레이스 범계점', lat: 37.3914, lng: 126.9516, distanceM: 160, address: '경기도 안양시 동안구 범계로 33', phone: '031-392-2222', url: 'http://place.map.kakao.com/12' },
        { id: '13', name: '메가MGC커피 범계점', lat: 37.3907, lng: 126.9530, distanceM: 210, address: '경기도 안양시 동안구 범계로 55', phone: '031-393-3333', url: 'http://place.map.kakao.com/13' },
        { id: '14', name: '할리스커피 범계역점', lat: 37.3900, lng: 126.9518, distanceM: 290, address: '경기도 안양시 동안구 범계로 70', phone: '031-394-4444', url: 'http://place.map.kakao.com/14' }
    ],
    CS2: [ // 편의점
        { id: '21', name: 'CU 범계역점', lat: 37.3919, lng: 126.9524, distanceM: 45, address: '경기도 안양시 동안구 범계로 5', phone: '031-401-1111', url: 'http://place.map.kakao.com/21' },
        { id: '22', name: 'GS25 범계로점', lat: 37.3912, lng: 126.9510, distanceM: 140, address: '경기도 안양시 동안구 범계로 30', phone: '031-402-2222', url: 'http://place.map.kakao.com/22' },
        { id: '23', name: '세븐일레븐 범계점', lat: 37.3905, lng: 126.9532, distanceM: 255, address: '경기도 안양시 동안구 범계로 58', phone: '031-403-3333', url: 'http://place.map.kakao.com/23' }
    ],
    HP8: [ // 병원
        { id: '31', name: '범계내과의원', lat: 37.3922, lng: 126.9519, distanceM: 110, address: '경기도 안양시 동안구 범계로 12', phone: '031-411-1111', url: 'http://place.map.kakao.com/31' },
        { id: '32', name: '동안구 행복치과', lat: 37.3910, lng: 126.9527, distanceM: 190, address: '경기도 안양시 동안구 범계로 38', phone: '031-412-2222', url: 'http://place.map.kakao.com/32' },
        { id: '33', name: '범계 정형외과', lat: 37.3901, lng: 126.9515, distanceM: 270, address: '경기도 안양시 동안구 범계로 59', phone: '031-413-3333', url: 'http://place.map.kakao.com/33' }
    ],
    PM9: [ // 약국
        { id: '41', name: '범계역 약국', lat: 37.3918, lng: 126.9523, distanceM: 30, address: '경기도 안양시 동안구 범계로 3', phone: '031-421-1111', url: 'http://place.map.kakao.com/41' },
        { id: '42', name: '온누리약국 범계점', lat: 37.3906, lng: 126.9511, distanceM: 200, address: '경기도 안양시 동안구 범계로 45', phone: '031-422-2222', url: 'http://place.map.kakao.com/42' }
    ]
};
