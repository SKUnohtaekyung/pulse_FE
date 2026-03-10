export const fetchDashboardV2Data = async (isRefresh = false) => {
    // Simulate API network latency (800ms) for Skeleton UI demonstration
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulate changing data on refresh
            const getRandomWeather = () => {
                const types = ['sunny', 'cloudy', 'rain', 'snow'];
                return types[Math.floor(Math.random() * types.length)];
            };
            const now = new Date();
            const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

            const baseTime = isRefresh ? timeString : "11:00";
            const searchVal = isRefresh ? (1250 + Math.floor(Math.random() * 50)).toLocaleString() : "1,250";
            const savesVal = isRefresh ? (120 + Math.floor(Math.random() * 10)).toString() : "120";
            const conversionsVal = isRefresh ? (45 + Math.floor(Math.random() * 5)).toString() : "45";
            const weatherType = isRefresh ? getRandomWeather() : "cloudy";

            resolve({
                success: true,
                data: {
                    metadata: { baseTime: baseTime, storeId: "store_123" },
                    coreVitals: {
                        searchVolume: { value: searchVal, unit: "명", status: "up", compareText: "영상 올리고 15% 늘었어요 📈" },
                        saves: { value: savesVal, unit: "명", compareText: "지난주보다 5% 늘었어요 📈", status: "up" },
                        conversions: { value: conversionsVal, unit: "명", status: "up", compareText: "지난주보다 18% 늘었어요 📈" }
                    },
                    todayBrief: [
                        { text: "현재 범계 상권 맛집을 찾는 사람 중 ", isHighlight: false },
                        { text: "70%가 주변 다른 가게로 가고 ", isHighlight: true },
                        { text: "있어요. 장사 시작 전 우리 가게를 다시 한 번 돋보이게 할 타이밍입니다! 🏃‍♂️", isHighlight: false }
                    ],
                    actions: {
                        aiSuggestion: {
                            id: "sug_002",
                            evidence: "소식 안 올린 지 5일째",
                            confidence: "high",
                            content: "이대로 주말을 맞이하면 평소보다 약 45만 원을 덜 벌게 될 수 있어요. 릴스를 하나 올려서 손님들의 발길을 다시 돌려보세요!",
                            ctaLabel: "주말용 추천 릴스 만들기 🎬"
                        },
                        operational: {
                            id: "opt_002",
                            title: "최근 비슷한 주변 가게에는 인플루언서가 3명 왔는데, 우리 가게는 0명이에요.",
                            ctaLabel: "인플루언서 초대하기 🤝"
                        }
                    },
                    insights: {
                        weather: { type: weatherType },
                        personas: [
                            { emoji: "🧀", label: "치즈폭탄", detail: "이번 주 리뷰에서 15번 더 칭찬했어요" },
                            { emoji: "🍷", label: "분위기 좋은", detail: "우리가 원하던 20대 손님 취향 저격!" }
                        ],
                        keywords: ["#치즈폭탄", "#데이트맛집"]
                    },
                    trendChart: [
                        { name: 'D-3', value: 80 },
                        { name: 'D-2', value: 90 },
                        { name: 'D-1', value: 85 },
                        { name: '업로드', value: 160 },
                        { name: 'D+1', value: 155 },
                        { name: 'D+2', value: 180 },
                        { name: 'D+3', value: 210 },
                    ]
                }
            });
        }, 800);
    });
};
