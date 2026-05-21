---
name: pulse-acceptance-scenarios
description: PULSE 전용 acceptance criteria and QA scenario skill. Use when turning PRD/user stories/design changes into Given/When/Then criteria, edge cases, smoke scenarios, browser QA inventories, or adapting phuryn/pm-skills test-scenarios and product-on-purpose deliver-acceptance-criteria/deliver-edge-cases.
---

# Pulse Acceptance Scenarios

## Overview
PULSE 기능 요구사항을 구현자가 바로 검증할 수 있는 인수조건과 QA 시나리오로 바꾼다. `tdd-architect`가 테스트 코드를 설계하기 전, 제품 행동과 사용자-visible 결과를 명확히 하는 단계다.

## Workflow

1. Read the source requirement:
   - `prd.md`
   - `.agent/context/active_task.md`
   - relevant `MD/` plan
   - changed component/page files
2. Identify the feature slice. Do not write criteria for an entire product when only one route or component changed.
3. Write Given/When/Then scenarios:
   - happy path
   - empty/loading states
   - error/recovery states
   - permission/auth states
   - mobile/desktop layout expectations
   - accessibility and performance guardrails
4. Map each scenario to a verification method:
   - unit/integration test
   - Playwright/browser QA
   - manual visual inspection
   - backend/API contract check

## PULSE Required Scenario Areas

- Protected routes respect `ProtectedRoute` behavior.
- Dashboard shell does not break sidebar/header/main content layout.
- Influencer routes remain independent from owner dashboard layout.
- Korean button labels and empty states are specific and actionable.
- API unavailable states do not trap the user.
- Mobile text and buttons do not overflow.

## Output Contract

Return:

- Feature slice
- Assumptions
- Given/When/Then table
- Edge/error cases
- Non-functional criteria
- Recommended verification commands
