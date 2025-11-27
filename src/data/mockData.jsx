import React from 'react';
import {
    Sparkles,
    Clock,
    Utensils,
    ThumbsUp,
    Beer,
    Users,
    Heart,
    MessageCircle
} from 'lucide-react';

export const PERSONA_DATA = [
    {
        id: 0,
        name: "최윤하",
        role: "미식가 직장인",
        icon: "👩‍💼",
        goal: "특별한 보상 같은 메뉴 경험",
        painPoint: "긴 웨이팅, 불확실한 예약",
        share: 45,
        keywords: ["시그니처메뉴", "비주얼"],
        topKeywords: ["볶음밥", "플레이팅", "사진맛집", "데이트"],
        representativeReview: "웨이팅만 없다면 매일 가고 싶어요. 볶음밥 비주얼이 미쳤고 사진 찍기 너무 좋아요!",
        chatGreeting: "안녕하세요 사장님! 저는 맛있는 건 못 참는 최윤하예요. 웨이팅만 없다면 친구들 다 데리고 갈게요!",
        journey: [
            { step: '탐색', icon: <Sparkles size={18} />, status: 'good', text: '인스타 비주얼 보고 기대감 상승!' },
            { step: '방문', icon: <Clock size={18} />, status: 'bad', text: '웨이팅 안내가 없어 답답함' },
            { step: '식사', icon: <Utensils size={18} />, status: 'good', text: '푸짐한 양에 감동받음' },
            { step: '공유', icon: <ThumbsUp size={18} />, status: 'neutral', text: '태그 이벤트 몰라서 참여 못함' },
        ]
    },
    {
        id: 1,
        name: "박준혁",
        role: "이자카야 애호가",
        icon: "🧔",
        goal: "편안한 술자리 분위기",
        painPoint: "대화가 힘든 시끄러운 소음",
        share: 30,
        keywords: ["하이볼", "분위기"],
        topKeywords: ["조용한", "대화하기좋은", "하이볼맛집", "안주"],
        representativeReview: "친구랑 조용히 얘기 나누기 딱 좋아요. 하이볼도 맛있고 분위기가 아늑해서 자주 찾게 되네요.",
        chatGreeting: "반갑습니다. 친구들이랑 조용히 한잔할 곳을 찾고 있어요. 안주 맛도 중요하지만 분위기가 제일 중요하죠.",
        journey: [
            { step: '탐색', icon: <Beer size={18} />, status: 'neutral', text: '네이버 "조용한 술집" 검색' },
            { step: '방문', icon: <Users size={18} />, status: 'good', text: '4인석 자리가 넉넉함' },
            { step: '식사', icon: <Utensils size={18} />, status: 'bad', text: '옆 테이블 소음 심함' },
            { step: '공유', icon: <Heart size={18} />, status: 'good', text: '인스타 스토리에 업로드' },
        ]
    },
    {
        id: 2,
        name: "김서연",
        role: "서비스 중시형",
        icon: "👩‍🦰",
        goal: "친절하고 세심한 대접",
        painPoint: "불친절한 직원 태도",
        share: 25,
        keywords: ["친절", "서비스"],
        topKeywords: ["사장님최고", "친절해요", "재방문", "센스"],
        representativeReview: "사장님이 너무 친절하셔서 기분 좋게 식사했어요. 바쁘신데도 계속 챙겨주셔서 감동받았습니다.",
        chatGreeting: "안녕하세요~ 사장님이 친절하다는 리뷰 보고 왔어요! 기분 좋은 식사가 되면 좋겠네요.",
        journey: [
            { step: '탐색', icon: <MessageCircle size={18} />, status: 'good', text: '리뷰 "친절해요" 문구 확인' },
            { step: '방문', icon: <Users size={18} />, status: 'neutral', text: '입장 시 인사가 없었음' },
            { step: '식사', icon: <Utensils size={18} />, status: 'good', text: '물 리필이 빨라서 좋았음' },
            { step: '공유', icon: <ThumbsUp size={18} />, status: 'good', text: '영수증 리뷰 별 5개 남김' },
        ]
    }
];

export const LOCAL_DATA = {
    areaName: "범계역 로데오거리",
    type: "직장인 점심 & 저녁 회식 상권",
    badges: ["#오피스상권", "#2030유동인구", "#회식명소"],
    peakTime: "금요일 19:00 - 22:00",
    peakTimeDesc: "평일 점심(11:30~13:00)과 금요일 저녁이 가장 붐벼요.",
    keywords: [
        { text: "가성비", value: 85 },
        { text: "단체석", value: 72 },
        { text: "빠른서빙", value: 64 },
        { text: "혼밥", value: 45 },
        { text: "주차가능", value: 30 }
    ],
    strategy: {
        title: "점심엔 '스피드', 저녁엔 '가성비 세트'",
        desc: "직장인 점심 경쟁이 치열해요. '3분 완성 점심 메뉴' 릴스를 추천해요."
    }
};
