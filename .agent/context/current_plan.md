# 인플루언서 양면 루프 현재 계획

> 최종 업데이트: 2026-05-19
> 출처: `influencer_next_tasks.md`를 현재 작업 계획으로 승격.

## Current Goal

[v3.0] 인플루언서 전용 인박스와 제안-수락 양면 루프를 실제 로그인/라우팅/API 흐름에 연결합니다.

## Completed Baseline

- 인플루언서 3단계 회원가입 폼: `src/features/auth/components/InfluencerSignupForm.jsx`
- 사장님 회원가입 진행 상태바 디자인 통일: `src/features/auth/components/SignupForm.jsx`
- 인플루언서 전용 레이아웃/사이드바: `src/components/layout/InfluencerLayout.jsx`, `src/components/layout/InfluencerSidebar.jsx`
- 제안 수신함, 상세 모달, 2단계 수락 확인 플로우: `src/features/influencer/InfluencerInbox.jsx`
- 마이 프로필 페이지: `src/features/influencer/InfluencerProfile.jsx`

## Priority Work

1. 역할 기반 자동 라우팅
   - Files: `src/features/auth/components/LoginForm.jsx`, `src/App.jsx`
   - Login API 응답에서 `role: 'influencer'`는 `/influencer/dashboard`, `role: 'owner'`는 `/dashboard`로 분기합니다.
   - 개발 모드 자동 로그인 분기와 실제 `login()` 응답 분기 규칙을 맞춥니다.
   - 인증되지 않은 사용자의 `/influencer/dashboard` 직접 접근은 `/login`으로 보냅니다.

2. 인플루언서 회원가입 완료 후 자동 로그인
   - File: `src/features/auth/components/InfluencerSignupForm.jsx`
   - Step 3 버튼의 `alert()`를 실제 가입 처리 흐름으로 교체합니다.
   - 가입 성공 후 `localStorage`에 `user`, `accessToken`을 세팅하고 `/influencer/dashboard`로 이동합니다.
   - 사장님 폼의 `SignupLoadingScreen`과 동일한 로딩/완료 경험을 적용합니다.

3. 이메일 제안-수락 루프
   - File: `src/features/influencer/ProposalAcceptPage.jsx`
   - 백엔드 토큰 검증/수락 API가 준비되면 토큰 파라미터 기반 수락 처리와 성공/실패 상태 화면을 연결합니다.

4. 실제 API 데이터 연동
   - Files: `src/features/influencer/InfluencerInbox.jsx`, `src/features/influencer/InfluencerMatchingPage.jsx`
   - Mock 제안/인플루언서 목록을 API 응답으로 대체합니다.
   - 수락/거절 액션은 `PATCH /api/proposals/{id}/accept` 또는 `/reject` 형태의 계약을 먼저 확인합니다.

5. 마이 프로필 저장 기능
   - File: `src/features/influencer/InfluencerProfile.jsx`
   - 저장 버튼을 `PATCH /api/influencer/profile` 흐름에 연결합니다.
   - Instagram/YouTube URL 검증과 프로필 이미지 업로드는 API 계약 확인 후 구현합니다.

## Verification

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- 변경 화면 브라우저 QA: `/login`, `/influencer/dashboard`, `/influencer-matching`, `/influencer-matching/request/:id`

## Constraints

- 기존 사장님 대시보드 레이아웃을 마개조하지 않습니다.
- 인플루언서 화면은 분리된 `InfluencerLayout` 계열을 우선 사용합니다.
- 사용자-facing 카피는 한국어 존댓말을 유지합니다.
- API 토큰, 키, `.env` 내용은 출력하거나 문서화하지 않습니다.
