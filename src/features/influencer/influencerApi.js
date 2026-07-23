import { SPRING_API_BASE_URL, USE_MOCK_API } from '../../config/env';
import { apiRequest } from '../../utils/httpClient';
import { toArray } from '../../utils/safeFormat';
import { INFLUENCER_DATA } from '../../data/mockInfluencers';

/**
 * 인플루언서 매칭 API.
 * 인증 헤더·타임아웃·401 처리·오류 정규화는 공통 httpClient 가 담당한다.
 */
const request = (path, options = {}) =>
    apiRequest(`${SPRING_API_BASE_URL}${path}`, { ...options, context: `influencer${path}` });

let mockOwnerProposals = [];

let mockInboxProposals = [
    {
        id: 'mock-inbox-1',
        shopName: 'PULSE 데모 식당',
        campaignType: '방문 리뷰',
        shopAddress: '서울시 강남구',
        message: '매장 방문 후 짧은 리뷰 콘텐츠 제작을 제안드립니다.',
        budget: 50000,
        provideFood: true,
        desiredDate: '일정 협의',
        createdAt: '2026-07-24',
        contact: '@pulse_demo',
        status: 'PENDING',
    },
];

const copyList = (list) => list.map((item) => ({ ...item }));

const getMockInfluencerName = (profileId) =>
    INFLUENCER_DATA.find((influencer) => String(influencer.id) === String(profileId))?.name
    || '선택한 인플루언서';

const dedupeStrings = (list) =>
    [...new Map(toArray(list)
        .map((value) => String(value || '').trim())
        .filter(Boolean)
        .map((value) => [value.toLowerCase(), value]))
        .values()];

/** 응답 항목의 구조가 달라도 목록 전체가 터지지 않도록 방어한다. */
const mapInfluencer = (item) => {
    const profile = item?.influencer;
    if (!profile || typeof profile !== 'object') return null;

    const followers = profile.instagramFollowers || profile.youtubeSubscribers || 0;

    return {
        id: String(profile.id ?? ''),
        backendProfileId: profile.id,
        name: profile.displayName || '이름 미상',
        profileImage: profile.profileImageUrl || '',
        niche: toArray(profile.niches).length ? profile.niches : ['맛집'],
        location: profile.location || '전국',
        activityArea: toArray(profile.activityAreas),
        keywords: dedupeStrings(profile.keywords),
        audienceKeywords: dedupeStrings(profile.audienceKeywords),
        followers,
        instagramFollowers: profile.instagramFollowers || followers,
        youtubeSubscribers: profile.youtubeSubscribers || 0,
        avgViews: profile.avgViews || 0,
        engagementRate: profile.engagementRate || 0,
        minBudget: profile.minBudget || 0,
        bio: profile.bio || '',
        matchScore: item.score,
        matchBreakdown: item.breakdown,
        matchReasons: toArray(item.matchReasons),
    };
};

export const fetchInfluencerRecommendations = async (signal) => {
    if (USE_MOCK_API) {
        return {
            storeInsight: {
                storeName: 'PULSE 데모 매장',
                category: '한식',
                location: '서울시 강남구',
                keywords: ['직장인', '저녁', '리뷰'],
            },
            influencers: INFLUENCER_DATA,
        };
    }

    const data = await request('/influencers/recommendations', { signal });
    return {
        storeInsight: {
            storeName: data?.storeInsight?.shopName || '',
            category: data?.storeInsight?.category || '',
            location: data?.storeInsight?.address || '',
            keywords: toArray(data?.storeInsight?.keywords),
        },
        influencers: toArray(data?.influencers).map(mapInfluencer).filter(Boolean),
    };
};

export const createInfluencerProposal = (payload, signal) => {
    if (USE_MOCK_API) {
        const proposal = {
            id: `mock-owner-${Date.now()}`,
            influencerName: getMockInfluencerName(payload?.influencerProfileId),
            message: payload?.message || '',
            desiredDate: payload?.desiredDate || '일정 협의',
            budget: payload?.budget || 0,
            status: 'PENDING',
        };
        mockOwnerProposals = [proposal, ...mockOwnerProposals];
        return Promise.resolve({ ...proposal });
    }

    return request('/influencer-proposals', { method: 'POST', body: payload, signal });
};

export const fetchInfluencerInbox = (signal) =>
    USE_MOCK_API ? Promise.resolve(copyList(mockInboxProposals)) : request('/influencer-proposals/inbox', { signal });

export const fetchOwnerInfluencerProposals = (signal) =>
    USE_MOCK_API ? Promise.resolve(copyList(mockOwnerProposals)) : request('/influencer-proposals/owner', { signal });

export const cancelInfluencerProposal = (proposalId, signal) => {
    if (USE_MOCK_API) {
        mockOwnerProposals = mockOwnerProposals.map((proposal) =>
            String(proposal.id) === String(proposalId) ? { ...proposal, status: 'CANCELED' } : proposal,
        );
        return Promise.resolve({ id: proposalId, status: 'CANCELED' });
    }

    return request(`/influencer-proposals/${encodeURIComponent(proposalId)}/cancel`, { method: 'PATCH', signal });
};

export const acceptInfluencerProposal = (proposalId, message = '', signal) => {
    if (USE_MOCK_API) {
        mockInboxProposals = mockInboxProposals.map((proposal) =>
            String(proposal.id) === String(proposalId) ? { ...proposal, status: 'ACCEPTED' } : proposal,
        );
        return Promise.resolve({ id: proposalId, status: 'ACCEPTED' });
    }

    return request(`/influencer-proposals/${encodeURIComponent(proposalId)}/accept`, {
        method: 'PATCH',
        body: { message },
        signal,
    });
};

export const rejectInfluencerProposal = (proposalId, reason = '', signal) => {
    if (USE_MOCK_API) {
        mockInboxProposals = mockInboxProposals.map((proposal) =>
            String(proposal.id) === String(proposalId) ? { ...proposal, status: 'REJECTED' } : proposal,
        );
        return Promise.resolve({ id: proposalId, status: 'REJECTED' });
    }

    return request(`/influencer-proposals/${encodeURIComponent(proposalId)}/reject`, {
        method: 'PATCH',
        body: { reason },
        signal,
    });
};

export const updateInfluencerProposalStatus = (proposalId, status, signal) => {
    if (USE_MOCK_API) {
        mockInboxProposals = mockInboxProposals.map((proposal) =>
            String(proposal.id) === String(proposalId) ? { ...proposal, status } : proposal,
        );
        return Promise.resolve({ id: proposalId, status });
    }

    return request(`/influencer-proposals/${encodeURIComponent(proposalId)}/status`, {
        method: 'PATCH',
        body: { status },
        signal,
    });
};
