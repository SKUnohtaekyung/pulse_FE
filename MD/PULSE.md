# PULSE Agent Quick Index

> This document is not the single source of truth. It is a fast navigation index for agents and contributors. Use the SSOT priority in `MD/README.md` when facts conflict.

## Project Essence

PULSE helps restaurant owners run a repeatable marketing loop without becoming marketing experts:

1. Understand customers and local context.
2. Create promotional content.
3. Evaluate store status and choose the next action.
4. Use Pro workflows for review management and influencer collaboration.

## Source Of Truth Order

1. `prd.md`: active feature intent and user stories.
2. `MD/about_pulse.md`: product vision, information architecture, and user value.
3. `MD/tech.md`: architecture, data flow, API assumptions, and stack.
4. `MD/design_guide.md`: color, typography, layout, component, and copy constraints.
5. This file: route/component lookup and agent orientation only.

## Frontend Map

| Surface | Primary Files |
| --- | --- |
| Routing | `src/App.jsx` |
| Owner shell | `src/components/layout/DashboardLayout.jsx`, `src/components/layout/Sidebar.jsx`, `src/components/layout/Header.jsx` |
| Influencer shell | `src/components/layout/InfluencerLayout.jsx`, `src/components/layout/InfluencerSidebar.jsx` |
| Auth | `src/features/auth/*` |
| Dashboard/status/subscription | `src/features/dashboard/*`, `src/features/dashboard-v2/*`, `src/components/subscription/*` |
| Insight and Kakao | `src/features/insight/*`, `src/api/kakaoLocal.js`, `src/utils/kakaoMapLoader.js` |
| Promotion/video | `src/features/promotion/*` |
| Review management | `src/features/reviewManagement/*` |
| Influencer matching/inbox | `src/features/influencer/*` |
| Landing | `src/pages/*`, `src/components/landing*/*` |

## Agent Workflow

- Current handoff: `.agent/context/active_task.md`.
- Current execution plan: `.agent/context/current_plan.md`.
- Skill registry: `.agents/skills/README.md`.
- For complex work, use `PLANS.md` before implementation.

## Guardrails

- Do not expose `.env`, tokens, API keys, or provider secrets.
- User-facing copy is Korean 존댓말 by default.
- Keep PULSE colors and Pretendard typography from `MD/design_guide.md`.
- Do not describe planned features as working unless they exist in `src/`.
- Keep owner and influencer layouts independent unless a shared component is clearly intentional.
