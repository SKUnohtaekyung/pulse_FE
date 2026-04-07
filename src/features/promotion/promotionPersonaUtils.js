const DEFAULT_PERSONA_ICONS = ['🍜', '💼', '💞', '👨‍👩‍👧‍👦', '🎓'];

const PERSONA_ICON_RULES = [
    { icon: '🍜', keywords: ['중독자', '단골파'] },
    { icon: '🍙', keywords: ['스팸주먹밥', '주먹밥', '소울푸드'] },
    { icon: '🌶️', keywords: ['향수', '풍미', '재방문', '일관성', '도전파'] },
    { icon: '🍜', keywords: ['국물', '해장', '얼큰', '수제비', '칼국수', '뜨끈', '매운'] },
    { icon: '💼', keywords: ['직장', '점심', '퇴근', '가성비', '빠른', '회사', '오피스'] },
    { icon: '💞', keywords: ['커플', '데이트', '감성', '분위기', '인스타', '사진'] },
    { icon: '👨‍👩‍👧‍👦', keywords: ['가족', '아이', '부모', '단체'] },
    { icon: '🎓', keywords: ['학생', '시험', '학원', '대학', '캠퍼스'] },
];

function collectPersonaText(persona = {}) {
    return [
        persona.nickname,
        persona.summary,
        persona.action_recommendation,
        ...(persona.tags || []),
    ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
}

function trimText(text = '', maxLength = 160) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength - 1).trim()}…`;
}

export function inferPersonaIcon(persona, index = 0) {
    const source = collectPersonaText(persona);
    const matchedRule = PERSONA_ICON_RULES.find((rule) =>
        rule.keywords.some((keyword) => source.includes(keyword)),
    );

    return matchedRule?.icon || DEFAULT_PERSONA_ICONS[index % DEFAULT_PERSONA_ICONS.length];
}

export function mapPromotionPersona(persona, index = 0) {
    return {
        ...persona,
        icon: inferPersonaIcon(persona, index),
        label: persona?.nickname || `타겟 손님 ${index + 1}`,
    };
}

export function buildPromotionTarget(persona, analysisData) {
    if (!persona) {
        if (analysisData?.store_summary) {
            return `${analysisData.store_name || '우리 가게'}를 찾는 손님. ${analysisData.store_summary}`;
        }
        return '우리 가게 손님';
    }

    const parts = [
        persona.nickname,
        persona.summary,
        persona.tags?.length ? `핵심 태그: ${persona.tags.join(', ')}` : '',
        persona.action_recommendation ? `추천 포인트: ${persona.action_recommendation}` : '',
    ].filter(Boolean);

    return trimText(parts.join(' | '), 220);
}

export function buildLocalAutoPrompt({ persona, analysisData, vibe }) {
    const vibeCopy = {
        energetic: '빠른 템포와 강한 클로즈업으로 시선을 잡고',
        luxury: '차분하고 고급스러운 무드로 디테일을 살리고',
        emotional: '따뜻하고 감성적인 분위기로 스토리를 담아',
    };

    const personaLabel = persona?.nickname || '우리 가게 손님';
    const personaSummary = persona?.summary || analysisData?.store_summary || '우리 가게의 매력을 좋아할 손님';
    const tagText = persona?.tags?.length ? `${persona.tags.slice(0, 3).join(', ')} 취향을 가진 손님이` : '이 손님이';
    const storeName = analysisData?.store_name || '우리 가게';
    const styleLine = vibeCopy[vibe] || vibeCopy.energetic;

    return trimText(
        `${personaLabel}를 위한 맞춤 릴스로, ${styleLine} ${storeName}의 대표 메뉴와 매장 분위기를 보여주세요. ${tagText} 바로 방문하고 싶어질 만큼 먹는 순간의 매력과 만족감을 강조해주세요.`,
        220,
    );
}
