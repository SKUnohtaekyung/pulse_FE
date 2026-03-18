/**
 * 인플루언서 매칭 더미 데이터
 * 12명의 인플루언서 (카테고리별 분산: 맛집 5, 카페 3, 뷰티 2, 라이프 2)
 */

export const INFLUENCER_DATA = [
    {
        id: "inf001",
        name: "안양쩝쩝박사",
        profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
        followers: 125000,
        engagementRate: 8.5,
        niche: ["맛집", "로컬"],
        location: "안양시 동안구",
        rating: 4.8,
        matchScore: 98,
        keywords: ['#범계맛집', '#얼큰한', '#매운맛', '#스트레스해소', '#노포감성'],
        followerBase: { age: [20, 30], gender: 'all' },
        activityArea: ['동안구', '만안구', '군포시'],
        matchReasons: ["안양/범계 로컬 맛집 전문 크리에이터", "얼큰한 국물 요리 리뷰 시 반응률 최고", "2030 직장인 타겟 도달률 상위 5%"],
        bio: "안양 토박이가 숨겨진 찐 맛집만 찾아다닙니다🔥 칼칼하고 매운맛 러버! 협업 문의는 DM으로!",
        portfolio: [
            {
                title: "범계역 매운맛 탑3 부수기",
                views: 45000,
                thumbnail: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=300&h=200&fit=crop",
                url: "https://youtube.com/example"
            },
            {
                title: "비오는 날 무조건 가야하는 맛집",
                views: 38000,
                thumbnail: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=200&fit=crop",
                url: "https://youtube.com/example"
            }
        ],
        tags: ["협업가능", "빠른응답", "검증됨", "안양원탑"],
        avgResponseTime: "1시간 이내"
    },
    {
        id: "inf002",
        name: "범계직장인",
        profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
        followers: 89000,
        engagementRate: 7.2,
        niche: ["맛집", "점심"],
        location: "안양시 범계동",
        rating: 4.6,
        matchScore: 95,
        keywords: ['#범계점심', '#범계역', '#가성비', '#해장', '#직장인'],
        followerBase: { age: [25, 40], gender: 'all' },
        activityArea: ['범계역', '평촌역', '인덕원역'],
        matchReasons: ["범계역 인근 직장인 타겟 최적화", "가성비 좋고 든든한 점심/해장 라인업 소구력 높음"],
        bio: "범계역 5년차 직장인의 점심/회식/해장 스팟 아카이브 🍜",
        portfolio: [
            {
                title: "과음한 다음날 무조건 여기로",
                views: 52000,
                thumbnail: "https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=300&h=200&fit=crop",
                url: "https://youtube.com/example"
            }
        ],
        tags: ["협업가능", "검증됨", "해장요정"],
        avgResponseTime: "2시간 이내"
    },
    {
        id: "inf003",
        name: "매코미",
        profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
        followers: 156000,
        engagementRate: 9.1,
        niche: ["맛집", "먹방"],
        location: "경기 남부",
        rating: 4.9,
        matchScore: 92,
        keywords: ['#매운맛', '#수제비', '#맵부심', '#자극적인', '#침샘폭발'],
        followerBase: { age: [15, 25], gender: 'female' },
        activityArea: ['안양시', '수원시', '화성시'],
        matchReasons: ["'바람난 얼큰 수제비' 컨셉과 정확히 부합하는 맵부심 유튜버", "1020 여성 찐팬 다수 확보로 입소문 효과 기대"],
        bio: "매운맛 없인 못 살아! 침샘 자극 먹방 전문 🌶️ 맵부심러들 다 모여!",
        portfolio: [
            {
                title: "핵불맛 수제비 챌린지",
                views: 78000,
                thumbnail: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=200&fit=crop",
                url: "https://youtube.com/example"
            },
            {
                title: "눈물콧물 쏙 빼는 동네 맛집 투어",
                views: 62000,
                thumbnail: "https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=300&h=200&fit=crop",
                url: "https://youtube.com/example"
            }
        ],
        tags: ["협업가능", "빠른응답", "검증됨", "인기"],
        avgResponseTime: "30분 이내"
    },
    {
        id: "inf004",
        name: "최요리",
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        followers: 67000,
        engagementRate: 6.8,
        niche: ["맛집", "가족"],
        location: "경기 군포시",
        rating: 4.5,
        matchScore: 88,
        matchReasons: ["평촌/범계/군포 학원가 타겟 도달률 우수", "가족 외식 타겟 확장 가능"],
        bio: "군포, 안양 지역 가족 외식하기 좋은 맛집들을 소개합니다👨‍👩‍👧",
        portfolio: [
            {
                title: "안양외식장소 추천",
                views: 34000,
                thumbnail: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=300&h=200&fit=crop",
                url: "https://youtube.com/example"
            }
        ],
        tags: ["협업가능"],
        avgResponseTime: "3시간 이내"
    },
    {
        id: "inf005",
        name: "정먹방",
        profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
        followers: 203000,
        engagementRate: 10.2,
        niche: ["맛집", "먹방"],
        location: "경기 의왕시",
        rating: 4.7,
        matchScore: 96,
        matchReasons: ["1020 학생 타겟 도달률 1위", "세숫대야 수제비 같은 대용량 컨셉 시 호응 예측"],
        bio: "먹방 전문! 많이 먹고 맛있게 먹습니다 🍔 푸드파이터 대환영!",
        portfolio: [
            {
                title: "초대형 음식 10분컷 챌린지",
                views: 125000,
                thumbnail: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=300&h=200&fit=crop",
                url: "https://youtube.com/example"
            },
            {
                title: "분식집 메뉴 다 털기",
                views: 98000,
                thumbnail: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop",
                url: "https://youtube.com/example"
            }
        ],
        tags: ["협업가능", "빠른응답", "검증됨", "인기"],
        avgResponseTime: "1시간 이내"
    },
    {
        id: "inf006",
        name: "강카페",
        profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
        followers: 94000,
        engagementRate: 7.9,
        niche: ["카페", "디저트"],
        location: "안양시 만안구",
        rating: 4.8,
        matchScore: 82,
        keywords: ['#평촌카페', '#안양카페', '#디저트', '#커피', '#감성'],
        followerBase: { age: [20, 25], gender: 'female' },
        activityArea: ['동안구', '만안구'],
        matchReasons: ["안양 일대 20대 여성 도달률 확보", "식후 카페 투어객 연계 가능성"],
        bio: "안양 평촌 일대 카페 투어와 디저트 리뷰를 전문으로 합니다 ☕️🍰",
        portfolio: [
            {
                title: "평촌학원가 카페 투어",
                views: 56000,
                thumbnail: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=200&fit=crop",
                url: "https://youtube.com/example"
            },
            {
                title: "안양일번가 디저트 BEST",
                views: 47000,
                thumbnail: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=200&fit=crop",
                url: "https://youtube.com/example"
            }
        ],
        tags: ["협업가능", "빠른응답", "검증됨"],
        avgResponseTime: "1시간 이내"
    },
    {
        id: "inf007",
        name: "윤브런치",
        profileImage: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop",
        followers: 71000,
        engagementRate: 6.5,
        niche: ["카페", "브런치"],
        location: "서울 종로구",
        rating: 4.6,
        matchScore: 89,
        matchReasons: ["주말 브런치 타겟 특화", "디저트 리뷰 전문 크리에이터"],
        bio: "브런치 카페 전문 크리에이터. 주말 브런치 맛집을 찾아다닙니다.",
        portfolio: [
            {
                title: "브런치 카페 TOP 10",
                views: 41000,
                thumbnail: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=300&h=200&fit=crop",
                url: "https://youtube.com/example"
            }
        ],
        tags: ["협업가능", "검증됨"],
        avgResponseTime: "2시간 이내"
    },
    {
        id: "inf008",
        name: "서감성",
        profileImage: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop",
        followers: 112000,
        engagementRate: 8.3,
        niche: ["카페", "인테리어"],
        location: "서울 서초구",
        rating: 4.9,
        matchScore: 97,
        keywords: ['#감성카페', '#사진맛집', '#커피', '#디저트', '#공간'],
        followerBase: { age: [20, 25], gender: 'female' },
        activityArea: ['서초구', '강남구'],
        matchReasons: ["인테리어 특화 리뷰어", "2030 여성 타겟 도달률 최상위"],
        bio: "감성 카페와 인테리어를 담는 크리에이터입니다 📸✨",
        portfolio: [
            {
                title: "감성 카페 VLOG",
                views: 67000,
                thumbnail: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&h=200&fit=crop",
                url: "https://youtube.com/example"
            },
            {
                title: "카페 인테리어 투어",
                views: 54000,
                thumbnail: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=300&h=200&fit=crop",
                url: "https://youtube.com/example"
            }
        ],
        tags: ["협업가능", "빠른응답", "검증됨", "인기"],
        avgResponseTime: "1시간 이내"
    },
    {
        id: "inf009",
        name: "한뷰티",
        profileImage: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop",
        followers: 178000,
        engagementRate: 9.5,
        niche: ["뷰티", "메이크업"],
        location: "서울 강남구",
        rating: 4.8,
        matchScore: 94,
        matchReasons: ["강남구 뷰티 관심 고객 밀집", "메이크업 튜토리얼 스타일 일치"],
        bio: "뷰티 인플루언서 💄 메이크업 튜토리얼과 제품 리뷰를 전문으로 합니다.",
        portfolio: [
            {
                title: "데일리 메이크업 튜토리얼",
                views: 89000,
                thumbnail: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=200&fit=crop",
                url: "https://youtube.com/example"
            },
            {
                title: "립스틱 리뷰 10종",
                views: 72000,
                thumbnail: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&h=200&fit=crop",
                url: "https://youtube.com/example"
            }
        ],
        tags: ["협업가능", "빠른응답", "검증됨", "인기"],
        avgResponseTime: "30분 이내"
    },
    {
        id: "inf010",
        name: "조스킨",
        profileImage: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop",
        followers: 145000,
        engagementRate: 8.7,
        niche: ["뷰티", "스킨케어"],
        location: "서울 서초구",
        rating: 4.9,
        matchScore: 91,
        matchReasons: ["스킨케어 제품 특화", "3040 타겟 신뢰도 매우 높음"],
        bio: "스킨케어 전문 크리에이터. 피부 고민 해결사입니다 ✨",
        portfolio: [
            {
                title: "스킨케어 루틴 공개",
                views: 95000,
                thumbnail: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=200&fit=crop",
                url: "https://youtube.com/example"
            }
        ],
        tags: ["협업가능", "검증됨", "인기"],
        avgResponseTime: "1시간 이내"
    },
    {
        id: "inf011",
        name: "백라이프",
        profileImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
        followers: 83000,
        engagementRate: 7.1,
        niche: ["라이프", "일상"],
        location: "서울 마포구",
        rating: 4.7,
        matchScore: 85,
        matchReasons: ["잔잔한 일상 브이로그 무드", "친근하고 편안한 톤앤매너"],
        bio: "일상 브이로그와 라이프스타일을 공유하는 크리에이터입니다 🌿",
        portfolio: [
            {
                title: "주말 브이로그",
                views: 48000,
                thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=200&fit=crop",
                url: "https://youtube.com/example"
            }
        ],
        tags: ["협업가능", "빠른응답"],
        avgResponseTime: "2시간 이내"
    },
    {
        id: "inf012",
        name: "오홈카페",
        profileImage: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400&h=400&fit=crop",
        followers: 102000,
        engagementRate: 8.0,
        niche: ["라이프", "홈카페"],
        location: "서울 성북구",
        rating: 4.8,
        matchScore: 90,
        matchReasons: ["홈카페 홈쿡 분야 전문", "1인가구 타겟 접근성 우수"],
        bio: "홈카페와 홈쿡 전문 크리에이터. 집에서 즐기는 여유를 담습니다 ☕️🏠",
        portfolio: [
            {
                title: "홈카페 레시피 모음",
                views: 61000,
                thumbnail: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=200&fit=crop",
                url: "https://youtube.com/example"
            },
            {
                title: "홈쿡 브이로그",
                views: 53000,
                thumbnail: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=300&h=200&fit=crop",
                url: "https://youtube.com/example"
            }
        ],
        tags: ["협업가능", "검증됨"],
        avgResponseTime: "1시간 이내"
    }
];

/**
 * 카테고리별 필터링 헬퍼 함수
 */
export const filterInfluencersByCategory = (category) => {
    if (category === "전체") return INFLUENCER_DATA;
    return INFLUENCER_DATA.filter(inf => inf.niche.includes(category));
};

/**
 * 카테고리 목록
 */
export const CATEGORIES = ["전체", "맛집", "카페", "뷰티", "라이프"];
