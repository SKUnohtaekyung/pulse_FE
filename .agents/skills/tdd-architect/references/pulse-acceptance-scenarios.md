# PULSE Acceptance Scenarios Reference

Use this reference when turning PRD, user stories, or design changes into Given/When/Then criteria and QA scenarios.

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

## Output Shape

- Feature slice.
- Assumptions.
- Given/When/Then table.
- Edge/error cases.
- Non-functional criteria.
- Recommended verification commands.
