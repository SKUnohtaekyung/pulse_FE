/**
 * ============================================================================
 * DEMO STATE — 사장님 ↔ 인플루언서가 공유하는 협업 제안 저장소
 * ============================================================================
 * 사장님이 보낸 제안이 인플루언서 받은 제안함에 그대로 도착하고,
 * 인플루언서가 수락하면 사장님 화면에도 "수락됨"으로 보이도록
 * 하나의 목록을 localStorage 에 둔다. (로그아웃해도 유지, 회원가입 시 초기화)
 * ============================================================================
 */

import { MOCK_OWNER } from './mockOwner';
import { DEMO_INFLUENCER, LOCAL_INFLUENCERS, dateRange, isoDate } from './demoInfluencers';

const STORAGE_KEY = 'pulseDemoProposals';

const OWNER_SHOP = MOCK_OWNER.store.shopName;
const OWNER_ADDRESS = MOCK_OWNER.store.shopAddress;
const OWNER_CONTACT = '@pulse_beomgye_gukbap';

const influencerByName = (name) => LOCAL_INFLUENCERS.find((influencer) => influencer.name === name);

const seedProposals = () => [
  {
    id: 'prop_01',
    shopName: OWNER_SHOP,
    shopAddress: OWNER_ADDRESS,
    campaignType: '방문 리뷰 + 릴스',
    influencerProfileId: DEMO_INFLUENCER.id,
    influencerName: DEMO_INFLUENCER.name,
    message:
      '범계역 앞 든든국밥입니다. 출근길 해장 손님과 직장인 점심 손님이 많은 가게라, ' +
      '순댓국 방문 리뷰와 릴스 1편을 제안드립니다.',
    budget: 300000,
    provideFood: true,
    desiredDate: dateRange(6, 17),
    contact: OWNER_CONTACT,
    createdAt: isoDate(-1),
    status: 'PENDING',
  },
  {
    id: 'prop_02',
    shopName: OWNER_SHOP,
    shopAddress: OWNER_ADDRESS,
    campaignType: '릴스 1편',
    influencerProfileId: influencerByName('경기남부해장러').id,
    influencerName: '경기남부해장러',
    message: '아침 해장 메뉴를 중심으로 출근길 직장인 타깃 릴스 1편을 부탁드립니다.',
    budget: 250000,
    provideFood: true,
    desiredDate: dateRange(-5, 2),
    contact: OWNER_CONTACT,
    createdAt: isoDate(-9),
    status: 'ACCEPTED',
  },
  {
    id: 'prop_03',
    shopName: OWNER_SHOP,
    shopAddress: OWNER_ADDRESS,
    campaignType: '방문 리뷰',
    influencerProfileId: influencerByName('경기도혼밥러').id,
    influencerName: '경기도혼밥러',
    message: '혼밥하기 편한 국밥집으로 방문 리뷰를 제안드렸습니다.',
    budget: 80000,
    provideFood: true,
    desiredDate: dateRange(-20, -14),
    contact: OWNER_CONTACT,
    createdAt: isoDate(-22),
    status: 'REJECTED',
  },
  // 인플루언서 받은 제안함을 채우는 다른 가게들 (가상)
  {
    id: 'prop_04',
    shopName: '인덕원 수제버거 하우스',
    shopAddress: '경기 안양시 동안구 관양동',
    campaignType: '릴스 1편',
    influencerProfileId: DEMO_INFLUENCER.id,
    influencerName: DEMO_INFLUENCER.name,
    message: '새로 출시한 더블 치즈버거를 짧은 릴스로 소개해 주실 분을 찾고 있어요.',
    budget: 200000,
    provideFood: true,
    desiredDate: '일정 협의',
    contact: '@pulse_induckwon_burger',
    createdAt: isoDate(-3),
    status: 'PENDING',
  },
  {
    id: 'prop_05',
    shopName: '평촌 숯불닭갈비',
    shopAddress: '경기 안양시 동안구 평촌동',
    campaignType: '방문 리뷰',
    influencerProfileId: DEMO_INFLUENCER.id,
    influencerName: DEMO_INFLUENCER.name,
    message: '주말 가족 손님이 많은 숯불닭갈비집입니다. 방문 리뷰를 부탁드려요.',
    budget: 150000,
    provideFood: true,
    desiredDate: dateRange(-12, -8),
    contact: '@pulse_pyeongchon_dakgalbi',
    createdAt: isoDate(-14),
    status: 'ACCEPTED',
  },
];

const read = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // 손상된 값은 시드로 되돌린다.
  }
  const seeded = seedProposals();
  write(seeded);
  return seeded;
};

const write = (list) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // 저장 실패 시에도 이번 응답은 정상 반환한다.
  }
};

export const resetDemoProposals = () => write(seedProposals());

/** 사장님(범계 든든국밥)이 보낸 제안 — OwnerSentProposals 형태 */
export const listOwnerProposals = () => read().filter((proposal) => proposal.shopName === OWNER_SHOP);

/** 데모 인플루언서가 받은 제안 — InfluencerInbox(mapApiProposal) 형태 */
export const listInboxProposals = () =>
  read().filter((proposal) => String(proposal.influencerProfileId) === String(DEMO_INFLUENCER.id));

export const createOwnerProposal = (payload = {}, influencerName = '선택한 인플루언서') => {
  const proposal = {
    id: `prop_${Date.now()}`,
    shopName: OWNER_SHOP,
    shopAddress: OWNER_ADDRESS,
    campaignType: payload.campaignType || '방문 리뷰',
    influencerProfileId: payload.influencerProfileId,
    influencerName,
    message: payload.message || '',
    budget: Number(payload.budget || 0),
    provideFood: !!payload.provideFood,
    desiredDate: payload.desiredDate || '일정 협의',
    contact: payload.contact || OWNER_CONTACT,
    createdAt: isoDate(0),
    status: 'PENDING',
  };
  // 같은 인플루언서에게 대기 중인 제안이 있으면 새 제안으로 교체한다 (시연 중 중복 방지).
  const rest = read().filter((item) => !(
    item.shopName === OWNER_SHOP
    && item.status === 'PENDING'
    && String(item.influencerProfileId) === String(proposal.influencerProfileId)
  ));
  write([proposal, ...rest]);
  return proposal;
};

export const updateProposalStatus = (id, status) => {
  let updated = null;
  write(read().map((proposal) => {
    if (String(proposal.id) !== String(id)) return proposal;
    updated = { ...proposal, status };
    return updated;
  }));
  return updated || { id, status };
};
