/**
 * GET /api/dashboard/{storeId}/store-status
 *
 * @param {string}  storeId   - 가게 식별자 (BE 연결 시 필수, 현재 mock)
 * @param {boolean} isRefresh - 수동 새로고침 여부 (mock 전용 — BE 연결 시 제거)
 *
 * BE 연결 시 교체 예시:
 *   const res = await fetch(`/api/dashboard/${storeId}/store-status`, {
 *     headers: { Authorization: `Bearer ${getAccessToken()}` },
 *   });
 *   return res.json();
 *
 * 응답 스키마 전체는 dashboardV2Api.js mock 반환값을 SSOT로 참조.
 * metadata.baseTime은 ISO 8601 UTC 문자열로 반환.
 *
 * 전시 데모 기준 mock: 범계 든든국밥 인스타그램 28일 일별 도달수 한 벌에서
 * 히어로 수치·전주 대비·릴스 기여도·피크 요일·업로드 전후 그래프를 모두 계산한다.
 * (수치끼리 모순이 없고, 날짜는 항상 "어제"까지의 최근 4주가 된다.)
 */

// 최근 28일 일별 도달수 (index 0 = 28일 전, 27 = 어제). 릴스 업로드일은 주 1회.
const DAILY_REACH = [
    280, 320, 310, 290, 750, 620, 480,
    350, 310, 330, 290, 820, 680, 510,
    380, 340, 360, 310, 890, 740, 560,
    420, 380, 410, 350, 960, 790, 610,
];
const REEL_DAYS = [
    { index: 11, id: 'reel_03', title: '든든 순댓국 한 그릇 클로즈업' },
    { index: 18, id: 'reel_02', title: '점심 특선 순대국밥 정식 소개' },
    { index: 25, id: 'reel_01', title: '출근길 해장국밥 5분 완성' },
];
const WEEKDAYS = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

const pad = (n) => String(n).padStart(2, '0');
const isoDaysAgo = (daysAgo) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};
const sum = (list) => list.reduce((total, value) => total + value, 0);
const percentChange = (current, previous) => Math.round(((current - previous) / previous) * 100);
const signed = (value) => `${value >= 0 ? '+' : ''}${value}%`;

const buildDashboard = () => {
    const days = DAILY_REACH.length;
    const dailySeries = DAILY_REACH.map((reach, index) => ({ date: isoDaysAgo(days - index), reach }));

    // 최근 7일 vs 그 전 7일
    const thisWeekReach = sum(DAILY_REACH.slice(-7));
    const lastWeekReach = sum(DAILY_REACH.slice(-14, -7));
    const reachChange = percentChange(thisWeekReach, lastWeekReach);

    // 저장·댓글·프로필 방문은 도달수에서 일정 비율로 파생 (저장률은 지난주보다 소폭 하락)
    const saveRate = 4.0;
    const lastWeekSaveRate = 4.6;
    const saves = Math.round(thisWeekReach * (saveRate / 100));
    const comments = Math.round(thisWeekReach * 0.007);
    const profileVisits = Math.round(thisWeekReach * 0.095);
    const lastWeekProfileVisits = Math.round(lastWeekReach * 0.09);

    // 릴스 기여도 = 업로드 당일 + 이틀 도달 / 4주 전체 도달
    const totalReach = sum(DAILY_REACH);
    const reelsContribution = [...REEL_DAYS].reverse().map(({ index, id, title }) => {
        const reach = sum(DAILY_REACH.slice(index, index + 3));
        return {
            id,
            title,
            postedAt: dailySeries[index].date,
            reach,
            contributionRate: Math.round((reach / totalReach) * 100),
        };
    });

    // 요일별 평균 도달 → 피크 요일
    const byWeekday = new Map();
    dailySeries.forEach(({ date, reach }) => {
        const weekday = new Date(`${date}T00:00:00`).getDay();
        byWeekday.set(weekday, [...(byWeekday.get(weekday) || []), reach]);
    });
    const [peakWeekday, peakValues] = [...byWeekday.entries()]
        .sort((a, b) => sum(b[1]) / b[1].length - sum(a[1]) / a[1].length)[0];

    // 업로드 전후 그래프: D+3 까지 데이터가 있는 가장 최근 릴스 기준
    const pivot = REEL_DAYS.filter(({ index }) => index + 3 < days).pop().index;
    const seriesData = [-3, -2, -1, 0, 1, 2, 3].map((offset) => ({
        name: offset === 0 ? '업로드' : `D${offset > 0 ? '+' : ''}${offset}`,
        value: DAILY_REACH[pivot + offset],
    }));

    const lastReelDaysAgo = days - REEL_DAYS[REEL_DAYS.length - 1].index;

    return {
        thisWeekReach,
        reachChange,
        saves,
        saveRate,
        lastWeekSaveRate,
        comments,
        profileVisits,
        profileChange: percentChange(profileVisits, lastWeekProfileVisits),
        dailySeries,
        reelsContribution,
        peakDay: {
            dayOfWeek: WEEKDAYS[peakWeekday],
            avgReach: Math.round(sum(peakValues) / peakValues.length),
        },
        seriesData,
        lastReelDaysAgo,
    };
};

export const fetchDashboardData = async (storeId = 'store_123', isRefresh = false) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const baseTime = new Date().toISOString();
            const d = buildDashboard();

            resolve({
                success: true,
                data: {
                    metadata: { baseTime, storeId: 'store_123' },
                    reelsImpact: {
                        state: 'default',
                        source: '인스타그램',
                        period: '최근 7일',
                        hero: {
                            // primaryMetric은 선택 필드. FE fallback: primaryMetric → reach → saves
                            reach: {
                                value: d.thisWeekReach,
                                unit: '회',
                                compareText: `지난주 대비 ${signed(d.reachChange)}`,
                                compareStatus: d.reachChange >= 0 ? 'up' : 'down',
                            },
                            saves: { value: d.saves, unit: '명' },
                            saveRate: { value: d.saveRate, unit: '%' },
                            comments: { value: d.comments, unit: '건' },
                        },
                    },
                    searchTrend: {
                        state: 'default',
                        source: '인스타그램',
                        period: '최근 7일',
                        value: d.profileVisits.toLocaleString(),
                        unit: '회',
                        compareText: `지난주 대비 ${signed(d.profileChange)}`,
                        compareStatus: d.profileChange >= 0 ? 'up' : 'down',
                    },
                    // 손님분석·검색 신호 연동 실패 시에만 보이는 기본값
                    todaySignal: {
                        state: 'default',
                        source: '네이버 DataLab',
                        period: '이번 주',
                        keyword: '국밥',
                        signal: '검색 급상승',
                        intensity: 'high',
                    },
                    todayBrief: [
                        { text: '쌀쌀하고 흐린 날, 국물 생각이 나는 날이에요. ', isHighlight: false },
                        { text: `릴스 도달수가 지난주보다 ${d.reachChange}% 늘었어요. `, isHighlight: true },
                        { text: '출근길 해장 콘텐츠를 올리기 좋은 타이밍이에요.', isHighlight: false },
                    ],
                    actions: {
                        aiSuggestion: {
                            id: 'sug_002',
                            evidence: `'국밥' 검색 급상승 · 마지막 릴스 ${d.lastReelDaysAgo}일 전`,
                            confidence: 'high',
                            content:
                                '이번 주 국밥 검색이 크게 늘었어요. 출근길 해장 손님을 겨냥한 릴스를 하나 더 올리면 주말 전에 도달을 끌어올릴 수 있어요.',
                            ctaLabel: '해장 릴스 만들기',
                            isNew: true,
                        },
                        operational: [
                            {
                                id: 'opt_003',
                                title: '저장률 소폭 감소',
                                description:
                                    `도달은 늘었지만 저장률이 지난주 ${d.lastWeekSaveRate}%에서 ${d.saveRate}%로 낮아졌어요. 메뉴 가격과 위치를 자막으로 강조해 보세요.`,
                                ctaLabel: '문구 강조 템플릿 보기',
                                urgency: 'medium',
                            },
                        ],
                    },
                    insights: {
                        weather: { type: 'cloudy' },
                        // 손님분석 결과가 없을 때만 보이는 기본 페르소나
                        personas: [
                            { emoji: '', label: '시원한 국물파', detail: '해장이 필요한 직장인, 뜨끈한 국물 한 그릇을 찾아요' },
                            { emoji: '', label: '가성비 직장인', detail: '빠른 점심이 필요한 직장인, 가성비와 속도를 중시해요' },
                        ],
                    },
                    trendChart: {
                        title: '릴스 업로드 전후 도달수 변화',
                        seriesData: d.seriesData,
                    },
                    // BE 연동 시: GET /api/dashboard/{storeId}/trend-detail 로 교체
                    trendChartDetail: {
                        period: {
                            startDate: d.dailySeries[0].date,
                            endDate: d.dailySeries[d.dailySeries.length - 1].date,
                        },
                        dailySeries: d.dailySeries,
                        reelsContribution: d.reelsContribution,
                        peakDay: {
                            dayOfWeek: d.peakDay.dayOfWeek,
                            avgReach: d.peakDay.avgReach,
                            insightText: `이번 기간에는 릴스를 올린 ${d.peakDay.dayOfWeek} 반응이 가장 높았어요.`,
                        },
                    },
                    dismissedIds: [],
                },
            });
        }, isRefresh ? 900 : 800);
    });
};

// MVP: localStorage 기반 dismiss (MVP+1에서 서버 동기화 추가 예정)
const DISMISS_STORAGE_KEY = 'pulse_dismissed_ids';

export const getLocalDismissedIds = () => {
    try {
        return JSON.parse(localStorage.getItem(DISMISS_STORAGE_KEY) || '[]');
    } catch {
        return [];
    }
};

export const saveLocalDismissedId = (id) => {
    const ids = getLocalDismissedIds();
    if (!ids.includes(id)) {
        localStorage.setItem(DISMISS_STORAGE_KEY, JSON.stringify([...ids, id]));
    }
};
