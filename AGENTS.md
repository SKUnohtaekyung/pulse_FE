# PULSE Codex Guide

## Response Contract
- 답변은 한국어로 작성한다.
- 요청을 해결할 최적의 전문가 역할을 먼저 선택하고, 그 역할의 판단 기준을 짧게 밝힌다.
- 답변 마지막에는 항상 `[Self-Check]` 섹션을 포함한다. 확신할 수 없거나 교차 검증이 필요한 내용이 있으면 명시하고, 없으면 `특이사항 없음`이라고 쓴다.

## Project Snapshot
- PULSE는 외식업 자영업자를 위한 마케팅 자동화 웹앱이다.
- 현재 repo는 React 18, Vite 5, Tailwind CSS, React Router, Recharts, Three.js, GSAP/Lenis, Framer Motion을 사용한다.
- 주요 화면 축은 랜딩, 사장님 대시보드, 리뷰 관리, 프로모션 영상, 인플루언서 매칭/인박스다.
- 백엔드는 Spring Boot API와 FastAPI AI 서버를 전제로 문서화되어 있으나, 이 repo는 주로 프론트엔드다.

## Codex Operating Defaults
- 사용자 요청은 기본적으로 `Goal`, `Context`, `Constraints`, `Done when`으로 해석한다. 빠진 항목은 repo 문맥에서 합리적으로 추론하되, 보안/배포/데이터 삭제처럼 위험한 경우만 짧게 확인한다.
- 복잡하거나 모호한 다중 파일 작업은 구현 전에 짧은 계획을 세운다. 장기 작업, 리팩터링, 기능 단위 구현은 [PLANS.md](PLANS.md)를 따른다.
- 코드 변경 후에는 관련 체크를 직접 실행하고 결과를 보고한다. 기본 완료 기준은 `git status --short` 확인, 관련 diff 리뷰, 그리고 가능한 범위의 lint/typecheck/build 통과다.
- 리뷰 요청이나 큰 변경 전 자체 점검에는 [code_review.md](code_review.md)를 따른다.
- OpenAI API, ChatGPT Apps SDK, Codex, OpenAI 문서 관련 질문은 사용자가 명시하지 않아도 OpenAI developer documentation MCP를 우선 사용한다.
- 외부 라이브러리/API 문서는 Context7 MCP가 활성화된 세션에서는 Context7를 우선하고, 프로젝트 내부 코드/문서는 로컬 파일을 우선한다.
- 반복되는 작업은 새 프롬프트로 계속 처리하지 말고 `.agents/skills/`의 좁은 skill로 옮길지 검토한다.

## Commands
- Install: `npm install`
- Dev server: `npm run dev`
- Lint: `npm run lint`
- Type check: `npm run typecheck`
- Production build: `npm run build`
- Local preview: `npm run preview`
- Smoke E2E: `npm run e2e:smoke`

`npm run e2e:smoke`는 프론트엔드, Spring API, FastAPI가 모두 떠 있어야 하며 Chrome/Edge 실행 파일이 필요하다.

## Repo Rules
- 절대 `.env` 내용을 출력하거나 커밋하지 않는다. `.env.example`만 문서화 기준으로 사용한다.
- 실제 API 키, 토큰, 비밀번호는 코드와 문서에 쓰지 않는다.
- `dist/`는 빌드 산출물이다. 기능 변경 검토에서는 source 파일을 우선하고, 산출물 변경은 별도 배포 의도가 있을 때만 다룬다.
- 기존 사용자 변경을 되돌리지 않는다. 작업 전후 `git status --short`로 변경 범위를 확인한다.
- 파일을 수정하기 전에 관련 소스와 기존 패턴을 먼저 읽는다.

## Skill Layout
- Codex 표준 프로젝트 skill 위치는 `.agents/skills/`이며, 이 경로가 유일한 정본이다.
- `.agent/context/`는 작업 문맥과 handoff 문서를 보존하는 위치다. `.agent/skills/`는 사용하지 않는다.
- 새 skill을 추가하거나 기존 skill을 수정할 때는 `.agents/skills/<skill-name>/SKILL.md`에만 반영한다.
- skill은 한 가지 반복 작업에 좁게 맞춘다. `SKILL.md` frontmatter의 `description`에는 무엇을 하는지와 언제 써야 하는지를 반드시 포함한다.

## Frontend Rules
- 기존 디자인 토큰은 [tailwind.config.js](tailwind.config.js)와 [src/constants/index.js](src/constants/index.js)를 우선한다.
- 폰트는 Pretendard 계열을 유지한다.
- 사용자-facing 카피는 한국어 존댓말을 기본으로 한다.
- UI 변경 후에는 가능하면 `npm run lint`, `npm run typecheck`, `npm run build`, 브라우저 시각 QA를 수행한다.
- 큰 라우트/무거운 화면은 lazy loading과 route-level suspense를 우선 검토한다.

## Documentation Rules
- 기능 의도는 [prd.md](prd.md), 기술 구조는 [MD/tech.md](MD/tech.md), 디자인 기준은 [MD/design_guide.md](MD/design_guide.md)를 우선한다.
- 중요한 의사결정, 제약, 후속 작업은 `.agent/context/active_task.md` 또는 관련 `MD/` 문서에 남긴다.
