# 📋 인플루언서 다음 개발 작업 목록

> 최종 업데이트: 2026-03-31  
> 참조 세션: 인플루언서 대시보드 v1 완성

---

## ✅ 이번 세션 완료 항목

- [x] 인플루언서 3단계 회원가입 폼 (`InfluencerSignupForm.jsx`)
- [x] 사장님 회원가입 진행 상태바 디자인 통일 (`SignupForm.jsx`)
- [x] 인플루언서 전용 레이아웃·사이드바 분리 (`InfluencerLayout.jsx`, `InfluencerSidebar.jsx`)
- [x] 제안 수신함 (Inbox): 탭·정렬·가로형 카드 (`InfluencerInbox.jsx`)
- [x] 제안 상세 모달 (클릭 시 사장님 상세 가이드 확인)
- [x] 2단계 수락 확인 플로우 (인라인 컨펌 다이얼로그)
- [x] 마이 프로필 페이지 (채널정보·해시태그·Stats 카드) (`InfluencerProfile.jsx`)
- [x] 인플루언서 버튼 hover 애니메이션 사장님 폼과 통일
- [x] 인플루언서 회원가입 비밀번호 실시간 유효성 검사 UI (사장님 폼과 동일 디자인)

---

## 🔴 다음 세션 필수 개발 항목 (우선순위 순)

### 1순위 — 역할 기반 자동 라우팅 (기초 UX, 즉시 개발 가능)
**파일**: `src/features/auth/components/LoginForm.jsx`, `src/App.jsx`
- [ ] 로그인 API 응답에서 `role: 'influencer'` 판별 → `/influencer/dashboard` 자동 리다이렉트
- [ ] `role: 'owner'` → `/dashboard` 자동 리다이렉트
- [ ] 현재 `[DEV] 자동 로그인` 버튼에만 의존하는 분기 로직을 실제 `login()` API 응답에 연결
- [ ] 라우터 가드: 인증되지 않은 사용자가 `/influencer/dashboard` 직접 접근 시 `/login`으로 redirect

### 2순위 — 회원가입 완료 후 자동 로그인 처리
**파일**: `src/features/auth/components/InfluencerSignupForm.jsx`
- [ ] Step 3 "펄스 파트너 합류하기" 버튼 클릭 시 현재 `alert()` → 실제 API 호출로 교체
- [ ] 가입 성공 후 localStorage에 `user`, `accessToken` 세팅 + `/influencer/dashboard`로 navigate
- [ ] 사장님 폼의 `SignupLoadingScreen`과 동일한 로딩/완료 화면 적용 (일관성)

### 3순위 — 이메일 제안-수락 루프 (백엔드 필요)
**파일**: `src/features/influencer/ProposalAcceptPage.jsx` (이미 존재), 백엔드 API
- [ ] 사장님이 제안 전송 → 인플루언서 이메일로 제안 알림 메일 발송 (백엔드 연동)
- [ ] 이메일 내 "수락하기" 버튼 → 토큰 파라미터로 `ProposalAcceptPage` 진입
- [ ] `ProposalAcceptPage`: 토큰 유효성 검사 후 수락 처리 API 호출
- [ ] 수락/실패 상태에 따른 결과 화면 구현

### 4순위 — 실제 API 데이터 연동
**파일**: `InfluencerInbox.jsx`, `InfluencerMatchingPage.jsx`
- [ ] `InfluencerInbox`의 `INITIAL_PROPOSALS` Mock 데이터 → `GET /api/proposals/received` API 연동
- [ ] `InfluencerMatchingPage`의 Mock 인플루언서 목록 → `GET /api/influencers` API 연동
- [ ] 수락/거절 액션 → `PATCH /api/proposals/{id}/accept` 또는 `/reject` API 연동

### 5순위 — 마이 프로필 저장 기능
**파일**: `src/features/influencer/InfluencerProfile.jsx`
- [ ] "저장" 버튼 클릭 시 현재 로컬 State만 변경 → `PATCH /api/influencer/profile` API 연동
- [ ] Instagram / YouTube URL 유효성 검사 (URL 형식 체크)
- [ ] 프로필 이미지 실제 파일 업로드 기능 (현재 Camera 아이콘만 있음)

---

## 🟡 추후 개선 (Optional)

- [ ] 인박스 수락/거절 시 카운트 배지 숫자 변경 애니메이션
- [ ] 마감일 임박 제안에 빨간색 배지 + 상단 고정 정렬
- [ ] 인플루언서 프로필 페이지 → 팔로워 수 직접 입력 or AI 자동 분석 연동
- [ ] 사이드바 알림 벨 기능 구현 (현재 헤더 우측 아이콘만 존재)
