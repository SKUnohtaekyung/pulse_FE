---
name: frontend-dev
description: Senior React/Vite/Tailwind implementation skill for PULSE. Use for component, route, layout, state, styling, animation, dashboard, influencer, promotion, review, auth UI changes, or applying upgraded UI/UX design-intelligence rules from ux-designer references.
---

# Frontend Developer

## Purpose
Implement focused React changes that follow the existing PULSE architecture and visual system.

## Default Context
- App routes: `src/App.jsx`.
- Layout shells: `src/components/layout/*`.
- Feature surfaces: `src/features/*`, `src/pages/*`.
- Tokens and constants: `tailwind.config.js`, `src/constants/index.js`, `src/styles/globals.css`.
- Product/design docs: `MD/tech.md`, `MD/design_guide.md`, `prd.md`.
- Upgraded UI rules: `.agents/skills/ux-designer/references/pulse-design-intelligence.md`.

## Implementation Rules
- Read nearby code before editing.
- Reuse existing components, tokens, Korean copy tone, and layout conventions.
- Check `package.json` before importing any third-party package; do not assume `framer-motion`, `lucide-react`, `gsap`, charts, maps, or utility libraries are available.
- Keep changes scoped; avoid broad refactors unless required.
- Treat user, review, influencer, store, and AI text as untrusted.
- For heavy routes, maps, charts, 3D, and animation, consider lazy loading or isolated components.
- Build all visible UI states that the workflow can naturally enter: loading, empty, error, disabled, hover, focus-visible, active/pressed, and success/confirmation.
- Prefer CSS grid for reliable multi-column layouts; avoid brittle flex percentage math.
- Use `min-h-dvh`/`min-h-[100dvh]` for viewport-height sections instead of `h-screen` when mobile browser chrome can affect layout.
- Animate only `transform` and `opacity` for routine UI motion; avoid `transition-all` and layout-affecting animation of `top`, `left`, `width`, or `height`.
- Isolate expensive or continuous Framer Motion, GSAP, Lenis, Three.js, chart, and map work in leaf components with cleanup in `useEffect`.
- Use Lucide or the repo's existing icon family for controls; do not use emoji as structural UI icons or alt text.
- Do not touch `.env` contents or generated `dist/` unless explicitly requested.

## PULSE UI Quality Defaults
- Operational dashboards: density 6-8, low decoration, inline metrics, dividers, tables, charts, and only necessary cards.
- Landing/auth/presentation surfaces: density 4-6, stronger visual signature, but still anchored in PULSE blue, white, orange, and Pretendard.
- One primary CTA per screen or panel; secondary actions must be visually subordinate.
- Korean labels must wrap cleanly; prefer shorter 존댓말 copy and visible labels over placeholder-only inputs.
- Use semantic Tailwind tokens from `tailwind.config.js`; external design-system suggestions must be translated into PULSE tokens before implementation.

## Workflow
1. Locate route/component ownership.
2. Identify data and prop contracts.
3. For visible design work, read `pulse-design-intelligence.md`; if the direction is unclear, run the bundled UI search from `ux-designer` and adapt the result to PULSE tokens.
4. Implement the smallest coherent change.
5. Run relevant checks:
   - `npm run lint`
   - `npm run typecheck`
   - `npm run build` when source/runtime behavior changed
   - browser QA for visible UI changes.
6. Report changed files, behavior, and verification.

## Handoff
Use `pulse-visual-qa` after visible UI work, `pulse-security-hardening` for auth/env/API/user input boundaries, and `pulse-api-contract-architect` for API shape changes.
