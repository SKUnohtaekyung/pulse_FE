/**
 * ============================================================================
 * DEMO RESPONDERS — "AI 생성" 응답을 요청 맥락에 맞게 만들어 주는 함수들
 * ============================================================================
 *  - 리뷰 답글: 별점·내용·사진 여부·설정(말투/길이/이모지/인사)에 따라 다르게 생성
 *  - 챗(/chat): 사장님 헤더 챗 / 인플루언서 제안서 자동 작성 요청을 구분
 *  - 상권 AI 액션: 범계 든든국밥 페르소나(해장·점심·가족)에 맞춘 행동 제안
 * 재생성 버튼을 누를 때마다 문장이 달라지도록 변형을 순환한다.
 * ============================================================================
 */

import { MOCK_OWNER } from './mockOwner';

const SHOP = MOCK_OWNER.store.shopName;

let variantCursor = 0;
const pick = (list) => {
  const item = list[variantCursor % list.length];
  variantCursor += 1;
  return item;
};

// ── 리뷰 답글 ────────────────────────────────────────────────────────────
const TONE_ENDINGS = {
  격식: { thanks: '소중한 리뷰 남겨주셔서 진심으로 감사드립니다.', close: '다음 방문 때도 정성껏 모시겠습니다.' },
  친근함: { thanks: '소중한 리뷰 정말 감사해요!', close: '다음에도 든든하게 모실게요.' },
  밝음: { thanks: '리뷰 남겨주셔서 너무 감사해요!', close: '또 뵙는 날 기다리고 있을게요!' },
  감성적: { thanks: '정성스러운 리뷰에 마음이 따뜻해졌어요.', close: '추운 날 생각나는 한 그릇으로 늘 이 자리에 있을게요.' },
};

const has = (text, words) => words.some((word) => text.includes(word));

const replyBody = (review) => {
  const text = String(review.content || '');
  const rating = Number(review.rating || 0);
  const parts = [];

  if (rating <= 2) {
    if (has(text, ['싱거', '짜', '맛이 달', '평소'])) {
      parts.push(pick([
        '기대하고 오셨을 텐데 국물 맛이 평소 같지 않아 정말 죄송합니다. 그날 육수 농도를 다시 점검했고, 지금은 매일 아침 간을 두 번씩 확인하고 있어요.',
        '그날 국물이 싱거웠다니 죄송한 마음뿐입니다. 육수 끓이는 시간을 다시 맞췄으니, 다음엔 꼭 제대로 된 한 그릇 대접하고 싶어요.',
      ]));
    } else {
      parts.push('불편을 드려 정말 죄송합니다. 말씀해 주신 부분은 바로 확인하고 고치겠습니다.');
    }
    return parts;
  }

  if (has(text, ['줄', '대기', '기다'])) {
    parts.push(pick([
      '점심 피크에 오래 기다리시게 해 죄송해요. 11시 50분 전에 오시면 바로 앉으실 수 있고, 회전도 계속 개선하고 있어요.',
      '12시대 대기가 길었던 점 죄송합니다. 점심 세트는 주문 후 5분 안에 나가도록 동선을 바꾸고 있어요.',
    ]));
  }
  if (has(text, ['해장'])) parts.push('해장 한 그릇으로 속 편하게 출근하셨다니 저희도 뿌듯해요.');
  if (has(text, ['점심', '양 많', '든든'])) parts.push('바쁜 점심에 든든하게 드셨다니 다행이에요.');
  if (has(text, ['부모님', '가족', '어르신'])) parts.push('부모님 모시고 와주셨군요. 어르신들 입맛에 맞으셨다니 정말 기쁩니다.');
  if (has(text, ['수육'])) parts.push('수육은 매일 아침 삶아 내고 있어요.');
  if (has(text, ['깍두기'])) parts.push('깍두기는 하루 더 익혀 내도록 조정해 볼게요.');
  if (has(text, ['리필'])) parts.push('국물 리필은 언제든 편하게 말씀만 주세요.');
  if (has(text, ['혼밥'])) parts.push('혼자 오셔도 편하게 드실 수 있게 1인석도 늘 비워둘게요.');
  if (has(text, ['변함없', '자주', '한결'])) parts.push('늘 같은 맛을 지키는 게 저희 가게의 제일 큰 약속이에요.');
  if (has(text, ['진하', '국물']) && rating >= 4 && !parts.length) {
    parts.push('진한 국물 맛있게 드셨다니 정말 기쁩니다.');
  }
  if (!parts.length) parts.push('맛있게 드셨다니 정말 기쁩니다.');
  return parts;
};

const buildReplyContent = (review, settings = {}) => {
  const tone = TONE_ENDINGS[settings.tone] || TONE_ENDINGS['친근함'];
  const author = review.author || '고객';
  const rating = Number(review.rating || 0);
  const isShort = String(settings.length || '').includes('짧');
  const isLong = String(settings.length || '').includes('길');

  const sentences = [];
  sentences.push(rating <= 2 ? `${author}님, 솔직한 리뷰 감사합니다.` : `${author}님, ${settings.includeThanks === false ? '' : tone.thanks}`.trim());

  const body = replyBody(review);
  sentences.push(...(isShort ? body.slice(0, 1) : body));

  if (review.hasPhoto && settings.photoThanks !== false && rating >= 3) {
    sentences.push('정성스러운 사진은 저희에게 큰 힘이 돼요.');
  }
  if (isLong && rating >= 3) {
    sentences.push(`${SHOP}은 매일 새벽부터 사골을 우려 한결같은 맛을 지키고 있어요.`);
  }
  sentences.push(rating <= 2 ? '다음 방문 때 꼭 달라진 맛으로 보답하겠습니다.' : tone.close);
  if (settings.includeGreatDay) sentences.push('오늘도 좋은 하루 보내세요.');

  let content = sentences.filter(Boolean).join(' ');
  if (settings.useEmojis && rating >= 3) content += ' 😊';
  return content;
};

export const buildReviewReplies = (rawBody) => {
  let parsed = {};
  try {
    parsed = typeof rawBody === 'string' ? JSON.parse(rawBody) : {};
  } catch {
    parsed = {};
  }
  const reviews = Array.isArray(parsed.reviews) && parsed.reviews.length ? parsed.reviews : [{ id: 'rv_unknown', author: '고객', rating: 5 }];
  const settings = parsed.settings || {};

  return {
    replies: reviews.map((review) => ({
      id: `reply_${review.id}_${Date.now()}_${variantCursor}`,
      reviewId: review.id,
      // 별점이 낮은 리뷰는 "먼저 답하면 좋은 리뷰"로 추천 표시한다.
      isRecommended: Number(review.rating || 5) <= 3,
      content: buildReplyContent(review, settings),
    })),
  };
};

// ── 챗 (/chat) ──────────────────────────────────────────────────────────
const readLine = (text, label) => {
  const match = String(text).match(new RegExp(`${label}\\s*:\\s*([^\\n]+)`));
  return match ? match[1].trim() : '';
};

const buildProposalLetter = (instruction) => {
  const influencerName = readLine(instruction, '인플루언서 활동명') || '크리에이터';
  const type = readLine(instruction, '협업 방식') || '방문 리뷰';
  const budget = readLine(instruction, '제안 금액');
  const provideFood = readLine(instruction, '음식 무료 제공') === '예';

  return [
    `안녕하세요, ${influencerName}님!`,
    `경기 안양 범계역 앞에서 '${SHOP}'을 운영하는 ${MOCK_OWNER.store.ownerName}입니다.`,
    `출근길 해장 손님과 직장인 점심 손님이 많은 국밥집이라, ${influencerName}님의 로컬 맛집 콘텐츠와 잘 어울릴 것 같아 ${type} 협업을 제안드립니다.`,
    provideFood ? '방문해 주시면 대표 메뉴인 순댓국과 수육을 정성껏 대접해 드릴게요.' : '',
    budget ? `제안 금액은 ${budget}이며, 일정은 편하신 날짜에 맞추겠습니다.` : '일정은 편하신 날짜에 맞추겠습니다.',
    '긍정적으로 검토해 주시면 감사하겠습니다.',
  ].filter(Boolean).join('\n');
};

const OWNER_CHAT_REPLIES = [
  {
    match: ['리뷰', '답글', '답변', '별점'],
    reply:
      '최근 리뷰 중 "국물이 싱거웠다"는 별 2개 리뷰가 아직 답변 전이에요. 사과와 개선 내용을 담은 답글부터 달아보세요. 리뷰 관리 화면에서 AI 답변을 바로 만들 수 있어요.',
  },
  {
    match: ['인플루언서', '협업', '홍보', '마케팅'],
    reply:
      '범계·평촌 활동권에 국밥·해장 키워드를 가진 크리에이터가 잘 맞아요. 인플루언서 매칭에서 "안양맛집탐험가"가 매칭도 1위예요.',
  },
  {
    match: ['영상', '릴스', '숏폼'],
    reply:
      '"주문 5분 만에 나오는 출근길 해장국밥" 컨셉의 릴스를 추천해요. 월요일 아침 8시 전후에 올리면 직장인 손님에게 가장 잘 닿아요.',
  },
  {
    match: ['손님', '고객', '페르소나', '타깃', '타겟'],
    reply:
      '우리 가게 손님은 크게 세 그룹이에요. 출근길 해장 손님, 빠른 점심을 찾는 직장인, 주말에 부모님과 오는 가족 손님입니다. 평일 오전과 점심이 매출의 중심이에요.',
  },
  {
    match: ['상권', '경쟁', '주변'],
    reply:
      '범계역 반경 500m에는 음식점이 많아 경쟁이 센 편이에요. 대신 출근·점심 유동 인구가 많아서, 빠른 제공과 해장 메뉴로 차별화하면 승산이 있어요.',
  },
];

const DEFAULT_OWNER_REPLY =
  `${SHOP}은 평일 점심과 출근길 해장 손님이 핵심이에요. 리뷰 답변, 해장 릴스 만들기, 범계권 인플루언서 찾기 중 무엇부터 도와드릴까요?`;

export const buildChatReply = (rawBody) => {
  let parsed = {};
  try {
    parsed = typeof rawBody === 'string' ? JSON.parse(rawBody) : {};
  } catch {
    parsed = {};
  }
  const messages = Array.isArray(parsed.messages) ? parsed.messages : [];
  const lastUserMessage = [...messages].reverse().find((message) => message?.role === 'user')?.content || '';

  // 인플루언서 제안서 자동 작성 요청 (InfluencerRequestPage)
  if (lastUserMessage.includes('협업 제안 메시지')) {
    return { reply: buildProposalLetter(lastUserMessage) };
  }

  if (parsed.role === 'influencer') {
    return {
      reply: '받은 제안 중 "범계 든든국밥"은 활동권(동안구)과 국밥·해장 키워드가 잘 맞아요. 출근길 해장 릴스로 기획하면 반응이 좋을 거예요.',
    };
  }

  const matched = OWNER_CHAT_REPLIES.find(({ match }) => match.some((word) => lastUserMessage.includes(word)));
  return { reply: matched ? matched.reply : DEFAULT_OWNER_REPLY };
};

// ── 상권 분석 AI 액션 (/v1/map-insight/actions) ──────────────────────────
export const buildMarketActions = (rawBody) => {
  let parsed = {};
  try {
    parsed = typeof rawBody === 'string' ? JSON.parse(rawBody) : {};
  } catch {
    parsed = {};
  }
  const competition = Number(parsed?.marketSummary?.competitionTotal || 0);

  return {
    status: 'SUCCESS',
    data: {
      aiMarketingActions: [
        {
          title: '점심 피크 회전으로 차별화',
          why: competition
            ? `반경 안에 음식점이 ${competition}곳이에요. 범계역 직장인 점심 수요를 먼저 잡아야 해요.`
            : '범계역 직장인 점심 수요를 먼저 잡아야 해요.',
          todo: ['"주문 후 5분" 점심 특선 메뉴 고정하기', '플레이스 대표 사진을 순댓국 클로즈업으로 바꾸기'],
          cta: { label: 'USP 문구 생성하기', action: 'OPEN_COPY_GENERATOR', payload: { type: 'usp' } },
        },
        {
          title: '출근길 해장 수요 공략',
          why: '역 앞 상권이라 오전 출근 동선의 해장 손님이 꾸준히 들어와요.',
          todo: ['오전 해장 메뉴 운영 시간을 플레이스에 표시하기', '월요일 아침 해장 릴스 예약 업로드하기'],
          cta: { label: '해장 릴스 만들기', action: 'OPEN_CONTENT_BUILDER', payload: { theme: 'commute' } },
        },
      ],
    },
  };
};
