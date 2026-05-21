---
name: code-reviewer
description: Risk-focused code review for PULSE. Use when the user says /review, asks for a review, or after implementation needs a pass for correctness, security, regressions, accessibility, web interface guidelines, UX heuristics, performance, and missing verification.
---

# Code Reviewer

## Purpose
Review changes like a senior reviewer. Lead with concrete findings, not summaries.

## Inputs To Read
- `git diff` or the target files/commit.
- `code_review.md` for repo review rules.
- `CODING_CONVENTIONS.md`, `MD/tech.md`, and `MD/design_guide.md` when relevant.
- `.agents/skills/ux-designer/references/pulse-design-intelligence.md` for UI/UX, accessibility, motion, and web interface review criteria.

## Review Checklist
1. Correctness: requested behavior, route flow, state updates, edge cases.
2. Security: secrets, `.env`, auth bypass, raw provider errors, XSS, unsafe AI/user text rendering.
3. API/data contract: Spring Boot, FastAPI, Kakao, AI provider, and component prop shape assumptions.
4. UX/accessibility: Korean text fit, focus state, contrast, responsive layout, primary CTA clarity.
5. Performance: unnecessary heavy imports, 3D/animation cost, large route bundles, avoidable re-renders.
6. Verification: lint, typecheck, build, smoke, browser QA, or explicit reason not run.

## UI Review Additions
- Flag semantic mismatches: clickable divs, action links, navigation buttons, unlabeled icon buttons, and form controls without labels.
- Flag missing state cycles: loading, empty, error, disabled, focus-visible, active/pressed, and success/recovery.
- Flag generic or off-brand UI: unadapted external palettes, purple AI gradients, decorative card overuse, neon glows, emoji-as-icons, and non-PULSE typography.
- Flag motion risks: `transition-all`, animation of layout properties, no reduced-motion path, missing cleanup, and continuous animation coupled to parent renders.
- Flag performance risks: route bundle growth, maps/charts/3D initialized on inactive routes, unbounded lists, missing image/chart/video dimensions, layout-shifting skeletons, and expensive filters on scrolling containers.
- Assign severity 0-4 for UX findings when reviewing screens, with 3-4 reserved for task failure or blocked completion.

## Output Contract
- Findings first, ordered by severity.
- Each finding includes file path, line when available, impact, and fix.
- If no findings, say so and list remaining test gaps.
- Keep summary secondary and short.
