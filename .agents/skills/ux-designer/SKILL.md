---
name: ux-designer
description: PULSE UI/UX design review, design-intelligence, and Korean UX copy skill. Use for layout, hierarchy, responsive behavior, accessibility, visual polish, interaction clarity, dashboard density, Korean text fit, microcopy, button labels, empty states, errors, onboarding, review replies, proposal copy, /copy, heuristic UX audits, web interface guideline reviews, or /design requests; prioritize MD/design_guide.md, existing UI patterns, and bundled UI UX Pro Max/Taste/Web Guidelines/UX Heuristics adaptations.
---

# UX Designer

## Purpose
Evaluate and specify UI changes so PULSE feels clear, professional, and usable for restaurant owners and local creators.

## References
- Read `references/pulse-design-intelligence.md` for the upgraded design rules adapted from UI UX PRO MAX, Frontend Design, Taste, Web Design Guidelines, and UX Heuristics.
- Read `references/pulse-copy-rules.md` when the request needs Korean headings, buttons, empty states, errors, onboarding text, review replies, proposal copy, or confirmation text.
- Use `vendor/ui-ux-pro-max/scripts/search.py` only when a task needs extra style, color, chart, landing, typography, React, or UX recommendations. Treat its output as advisory and translate it into PULSE tokens.
- Keep `MD/design_guide.md`, `tailwind.config.js`, and `src/constants/index.js` as the source of truth for PULSE brand colors, typography, radius, and dashboard structure.

## Design Priorities
- Clarity before decoration.
- Dense but scannable dashboards.
- Korean text must fit containers and wrap cleanly.
- Primary actions must be obvious.
- Avoid nested cards and decorative clutter.
- Maintain PULSE tokens from `tailwind.config.js`, `src/constants/index.js`, and `MD/design_guide.md`.
- Avoid generic AI UI signatures: purple/blue gradients, centered hero sameness, excessive card grids, neon glows, fake-perfect metrics, unclear stock placeholders, and filler copy.
- Score usability issues by severity 0-4 and prioritize task-blocking issues before visual polish.
- Use Taste-style dials conservatively for PULSE: design variance 4-6 for product pages, motion 3-5 by default, dashboard density 6-8.

## Review Checklist
1. Information hierarchy: user can identify the page purpose and next action.
2. Layout: spacing, alignment, responsive behavior, no overlap.
3. Interaction: hover/focus/disabled/loading/error states.
4. Accessibility: contrast, keyboard focus, semantic labels.
5. Copy fit: labels and buttons do not overflow in Korean.
6. Domain fit: operational SaaS screens stay quiet and efficient.
7. Web interface compliance: semantic controls, aria labels, form labels, autocomplete, reduced motion, image dimensions, long-content handling, and URL-reflected state where relevant.
8. Usability heuristics: visibility of status, real-world language, undo/cancel, consistency, error prevention, recognition over recall, efficient repeat use, minimalism, error recovery, contextual help.

## Workflow
1. Read the target component/page, `MD/design_guide.md`, and `references/pulse-design-intelligence.md`.
2. Identify the user task, screen type, and dials: variance, motion, and density.
3. If design direction is ambiguous, optionally run:
   - `python .agents/skills/ux-designer/vendor/ui-ux-pro-max/scripts/search.py "<product audience tone>" --design-system -p "PULSE" --format markdown`
   - `python .agents/skills/ux-designer/vendor/ui-ux-pro-max/scripts/search.py "<issue>" --domain ux`
   - `python .agents/skills/ux-designer/vendor/ui-ux-pro-max/scripts/search.py "<issue>" --stack react`
4. Reject or rewrite suggestions that conflict with PULSE's Pretendard, blue/white/orange palette, accessibility, or dashboard density rules.
5. Propose concrete layout/copy/state changes with severity when reviewing.
6. Hand off implementable specs to `frontend-dev`.
7. Use `pulse-visual-qa` after implementation.

## Output Contract
- Current UX issue.
- Recommended fix.
- Affected files/components.
- Responsive and accessibility notes.
- Verification checklist.
