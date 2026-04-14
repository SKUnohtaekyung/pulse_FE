// Persona Avatar Configuration
// DiceBear API를 사용하여 세련되고 모던한 아바타 제공
// Notionists 스타일: Notion의 깔끔하고 프로페셔널한 디자인

export const PERSONA_AVATARS = {
    // 스타일 옵션: 세련되고 모던한 스타일들
    styles: {
        // 추천: 비즈니스 친화적 스타일
        notionists: 'notionists',        // Notion 스타일 (현재 사용 중) - 깔끔하고 세련됨
        lorelei: 'lorelei',              // 미니멀 일러스트
        thumbs: 'thumbs',                // 심플한 아바타
        initials: 'initials',            // 이니셜 기반
    },

    // 페르소나별 추천 아바타
    presets: {
        youngProfessional: {
            // 미식가 직장인 (여성)
            style: 'notionists',
            seed: 'happy-woman-1',
            backgroundColor: 'b6e3f4'  // Dicebear Example Color 1
        },
        middleAged: {
            // 이자카야 애호가 (남성)
            style: 'notionists',
            seed: 'happy-man-1',
            backgroundColor: 'c0aede'  // Dicebear Example Color 2
        },
        youngCouple: {
            // 미식가 커플 (여성)
            style: 'notionists',
            seed: 'happy-woman-2',
            backgroundColor: 'd1d4f9'  // Dicebear Example Color 3
        },
        serviceOriented: {
            // 서비스 중시형 (여성)
            style: 'notionists',
            seed: 'happy-woman-3',
            backgroundColor: 'ffd5dc'  // Dicebear Example Color 4
        },
        casual: {
            // 가성비 직장인 (남성)
            style: 'notionists',
            seed: 'happy-man-2',
            backgroundColor: 'ffdfbf'  // Dicebear Example Color 5
        }
    }
};

// 아바타 URL 생성 함수
export function getPersonaAvatar(presetName, customOptions = {}) {
    const preset = PERSONA_AVATARS.presets[presetName];
    if (!preset) {
        console.warn(`Preset "${presetName}" not found. Using default.`);
        return `https://api.dicebear.com/9.x/notionists/svg?seed=default`;
    }

    const { style, seed, backgroundColor } = { ...preset, ...customOptions };

    let url = `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}`;

    if (backgroundColor) url += `&backgroundColor=${backgroundColor}`;

    return url;
}

// 랜덤 아바타 생성
export function getRandomAvatar(style = 'notionists') {
    const randomSeed = Math.random().toString(36).substring(7);
    return `https://api.dicebear.com/9.x/${style}/svg?seed=${randomSeed}`;
}

// 사용 예시:
// import { getPersonaAvatar, PERSONA_AVATARS } from './personaAvatars';
// const avatar = getPersonaAvatar('youngProfessional');
// <img src={avatar} alt="Persona Avatar" />
