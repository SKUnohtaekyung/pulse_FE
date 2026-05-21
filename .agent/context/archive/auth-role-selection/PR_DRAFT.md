## 📝 요약 (Synopsis)
회원가입 진입 시 '사장님'과 '인플루언서'를 구분하여 선택할 수 있는 라우팅 관문(Role Selection) 화면을 신규 추가했습니다.

## 🔗 관련 기획 및 이슈 (Related PRD)
- Issue(s): # (요구사항: 회원 유형 분기 처리)

## 🛠️ 변경 유형 (Change Type)
- [x] ✨ 기능 추가 (Feature)
- [x] 🎨 UI/UX 스타일 및 마크업 수정 (Design)
- [ ] 🐛 버그 수정 (Bugfix)
- [x] ♻️ 리팩토링 및 성능 최적화 (Optimizing)
- [ ] 🧪 테스트 코드 작성 및 커버리지 보완 (Testing)
- [x] 📃 문서 업데이트 (Docs)

## 📦 주요 변경점 (Key Changes)
**UI / Components**
- `src/features/auth/components/RoleSelectionForm.jsx`: 기존 Form UI(AuthPage.css)와 일관성을 유지한 신규 회원 유형 선택 컴포넌트 추가 (사장님 / 인플루언서 선택 제공)
- `src/features/auth/components/LoginForm.jsx`: 개발 모드 로그인 우회 버튼(`DEV_MODE`)의 조건을 `.env` 의존성에서 기본 `import.meta.env.DEV` 플래그로 개선하여 편의성 증대

**State / Hooks / API**
- `src/features/auth/AuthPage.jsx`: 불리언(`isSignUp`) 로직을 다중 뷰 상태인 `authView` ('login', 'role-select', 'signup-owner') 트리 구조로 완벽히 리팩토링

## ✅ 테스트 및 검증 체크리스트 (QA)
- [x] 로컬 환경 브라우저 렌더링 정상 작동 확인
- [x] 콘솔(Console) 에러 및 린트(Lint) 경고 없음
- [ ] TDD 유닛 테스트 코드 통과
- [x] `design_guide.md`의 디자인 시스템 룰(색상/폰트 등) 준수 확인
