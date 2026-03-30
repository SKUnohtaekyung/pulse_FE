## 📝 요약 (Synopsis)
AI 에이전트 파이프라인(PULSE Skills) 구조를 대대적으로 리팩토링하고, `product-manager`, `pr-manager` 신규 스킬과 컨텍스트 핸드오버 체계를 도입했습니다.

## 🔗 관련 기획 및 이슈 (Related PRD)
- Issue(s): # (해당 없음 - Skills 시스템 내부 개선)

## 🛠️ 변경 유형 (Change Type)
- [x] ✨ 기능 추가 (Feature)
- [ ] 🎨 UI/UX 스타일 및 마크업 수정 (Design)
- [ ] 🐛 버그 수정 (Bugfix)
- [x] ♻️ 리팩토링 및 성능 최적화 (Optimizing)
- [ ] 🧪 테스트 코드 작성 및 커버리지 보완 (Testing)
- [x] 📃 문서 업데이트 (Docs)

## 📦 주요 변경점 (Key Changes)
**Skills / Pipelines**
- `.agent/skills/product-manager/SKILL.md`: PM 페르소나 신설 및 PRD, User Story 작성 템플릿 이식
- `.agent/skills/pr-manager/SKILL.md`: `git diff`를 분석하여 PR 작성 템플릿을 자동으로 포매팅하는 기능 신설
- `.agent/skills/planner/SKILL.md`: 기획 역할을 제거하고 기술 아키텍처 설계에만 집중하도록 리팩토링

**Docs / Templates**
- `.github/PULL_REQUEST_TEMPLATE.md`: 프로젝트 표준 Github PR 템플릿 신설
- `.agent/skills/README.md`: 신규 워크플로우 파이프라인 다이어그램, 4대 핵심 문서 체계, Fast-Track 안내 등록
- `.agent/context/active_task.md`: 단기 기억 인수인계(Context Hand-over)를 위한 상태 저장 파일 초기화

## ✅ 테스트 및 검증 체크리스트 (QA)
- [x] 로컬 환경 오류 없음 (시스템 내부 프롬프트 리팩토링이므로 영향 없음)
- [x] 마크다운 문서 및 파이프라인 다이어그램 렌더링 정상 확인
