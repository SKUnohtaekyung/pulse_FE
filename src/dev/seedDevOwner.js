/**
 * ============================================================================
 * DEV OWNER SEEDING
 * ============================================================================
 * dev "사장님 자동 로그인" 시 localStorage 에 통합 사장님 프로필을 심는다.
 *
 *  - userProfile : readCachedProfile(authApi) + getLocalStoreProfile 가 읽음
 *                  → 사이드바·헤더·마이페이지·인플루언서·상권의 가게 정체성
 *  - user        : 레거시 키 (InfluencerSidebar 등) 호환
 *  - accessToken : 'dev-bypass-token' (인터셉터 활성 트리거)
 *
 * analysisTaskId 는 일부러 심지 않는다 → analysisApi 가 /analysis/latest 로
 * 가도록 두고, 그 응답은 fetch 인터셉터가 mockOwner 로 돌려준다.
 * ============================================================================
 */

import { MOCK_OWNER } from './mockOwner';

export const DEV_BYPASS_TOKEN = 'dev-bypass-token';

export function seedDevOwner() {
  try {
    localStorage.setItem('userProfile', JSON.stringify(MOCK_OWNER.profile));
    localStorage.setItem('user', JSON.stringify(MOCK_OWNER.legacyUser));
    localStorage.setItem('accessToken', DEV_BYPASS_TOKEN);
    // 이전 세션에서 남은 분석 task id 가 있으면 제거 (latest 경로로 통일)
    localStorage.removeItem('analysisTaskId');
  } catch (error) {
    console.warn('[devMock] 사장님 시딩 실패:', error);
  }
}

export default seedDevOwner;
