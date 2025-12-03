import {
    Sun,
    Moon,
    CloudSun,
    CloudMoon,
    Cloud,
    CloudRain,
    CloudDrizzle,
    CloudSnow,
    CloudLightning,
    CloudFog
} from 'lucide-react';

export const WEATHER_TYPES = {
    clear_day: {
        label: '맑음(낮)',
        icon: Sun,
        gradient: 'from-[#FF8C00] to-[#FFD700]', // Orange to Gold
        textColor: 'text-white',
        subTextColor: 'text-yellow-100',
        recommendation: '시원한 음료, 테라스 추천',
        animation: 'sun'
    },
    clear_night: {
        label: '맑음(밤)',
        icon: Moon,
        gradient: 'from-[#0F2027] to-[#203A43]', // Dark Night
        textColor: 'text-white',
        subTextColor: 'text-blue-200',
        recommendation: '야경 좋은 창가석 추천',
        animation: 'stars'
    },
    partly_cloudy_day: {
        label: '구름 조금(낮)',
        icon: CloudSun,
        gradient: 'from-[#56CCF2] to-[#2F80ED]', // Light Blue
        textColor: 'text-white',
        subTextColor: 'text-blue-100',
        recommendation: '가벼운 점심 메뉴 추천',
        animation: 'clouds'
    },
    partly_cloudy_night: {
        label: '구름 조금(밤)',
        icon: CloudMoon,
        gradient: 'from-[#2C3E50] to-[#4CA1AF]', // Dark Blue Grey
        textColor: 'text-white',
        subTextColor: 'text-gray-300',
        recommendation: '따뜻한 조명 아래 저녁',
        animation: 'clouds'
    },
    cloudy: {
        label: '흐림',
        icon: Cloud,
        gradient: 'from-[#757F9A] to-[#D7DDE8]', // Grey
        textColor: 'text-white',
        subTextColor: 'text-gray-200',
        recommendation: '따뜻한 국물 요리 추천',
        animation: 'clouds_heavy'
    },
    rain: {
        label: '비',
        icon: CloudRain,
        gradient: 'from-[#243B55] to-[#141E30]', // Dark Blue
        textColor: 'text-white',
        subTextColor: 'text-blue-200',
        recommendation: '파전, 막걸리 추천',
        animation: 'rain'
    },
    drizzle: {
        label: '이슬비',
        icon: CloudDrizzle,
        gradient: 'from-[#4B79A1] to-[#283E51]', // Muted Blue
        textColor: 'text-white',
        subTextColor: 'text-blue-100',
        recommendation: '차분한 분위기, 커피 추천',
        animation: 'drizzle'
    },
    shower: {
        label: '소나기',
        icon: CloudRain,
        gradient: 'from-[#000046] to-[#1CB5E0]', // Deep Blue
        textColor: 'text-white',
        subTextColor: 'text-blue-200',
        recommendation: '배달 주문 증가 예상',
        animation: 'rain_heavy'
    },
    snow: {
        label: '눈',
        icon: CloudSnow,
        gradient: 'from-[#83a4d4] to-[#b6fbff]', // Ice Blue
        textColor: 'text-white',
        subTextColor: 'text-blue-50',
        recommendation: '따뜻한 온면, 사케 추천',
        animation: 'snow'
    },
    sleet: {
        label: '진눈깨비',
        icon: CloudSnow, // Using CloudSnow as base
        gradient: 'from-[#3E5151] to-[#DECBA4]', // Slushy Grey
        textColor: 'text-white',
        subTextColor: 'text-gray-200',
        recommendation: '따뜻한 전골 요리 추천',
        animation: 'sleet'
    },
    thunderstorm: {
        label: '뇌우',
        icon: CloudLightning,
        gradient: 'from-[#232526] to-[#414345]', // Stormy Grey
        textColor: 'text-white',
        subTextColor: 'text-gray-400',
        recommendation: '안전한 실내 데이트 추천',
        animation: 'thunder'
    },
    fog: {
        label: '안개',
        icon: CloudFog,
        gradient: 'from-[#3E5151] to-[#DECBA4]', // Misty
        textColor: 'text-white',
        subTextColor: 'text-gray-200',
        recommendation: '분위기 있는 칵테일 추천',
        animation: 'fog'
    }
};
