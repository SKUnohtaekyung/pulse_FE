# 랜딩페이지 리팩토링 진행 태스크

- [x] **Phase 1: 갭 분석 및 코드 베이스라인 진단**
  - [x] Hero 영역 분석 및 컴포넌트 분리 완료 (CTA, 핵심 카피 `HeroSection.jsx` 내 독립된 motion.div로 안전하게 분리되어 있음 확인)
  - [x] 랜딩페이지 각 섹션 Level 1~3 태깅 작업
    - Level 1 (전환 핵심): `HeroSection`, `CTASection`
    - Level 2 (정보 전달): `ProblemSection`, `FeatureSection`, `HowItWorksSection`, `FAQSection`
    - Level 3 (브랜딩/임팩트): `SocialProofSection`

- [x] **Phase 2: UX 연동 및 Red Collar 스타일 인터랙션 설계** (완료)
  - [x] 각 섹션별 구체적인 GSAP 인터랙션 / 카피 스크립트 도출 (`v2_interaction_map.md` 맵핑 수립)
  - [x] CTA를 해치지 않으면서 진행되는 애니메이션 설계 문서화 (스크롤 하이재킹 전면 배제 검증 완료)

- [x] **Phase 3: 마이크로카피 작성 및 최적화** (완료)
  - [x] 주요 버튼 문구 및 긴 문단 요약라이팅 작성 (`v2_microcopy_draft.md` 도출 완료)

- [x] **Phase 4: 컴포넌트 코딩 및 GSAP 인터랙션 적용**
  - [x] 전역 Lenis Smooth Scroll 및 GSAP 연동 (완료)
  - [x] Level 1 영역 리팩토링 (Hero & CTA) 완료: 진입 애니메이션 최소화 
  - [ ] Level 2 (Problem, Feature) 리팩토링 진행 예정
  - [ ] Level 3 (SocialProof) 리팩토링 진행 예정

- [ ] **Phase 5: 최종 UX 검증 및 스크롤 Jank 최적화**
  - [ ] 성능 프로파일링 및 60fps 방어 점검
  - [ ] `walkthrough.md` 업데이트
