# PULSE Design Intelligence

This reference adapts external UI/UX skills into PULSE's existing React/Vite/Tailwind product context. It is a synthesis, not a verbatim copy.

Sources analyzed:
- UI UX PRO MAX: `https://github.com/nextlevelbuilder/ui-ux-pro-max-skill`
- Frontend Design: `https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md`
- Taste: `https://github.com/Leonxlnx/taste-skill`
- Web Design Guidelines: `https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md`
- UX Heuristics: `https://github.com/wondelai/skills/tree/main/ux-heuristics`

## Decision Process

1. Classify the screen:
   - Dashboard or review management: operational, dense, scan-first.
   - Landing, auth, promotion, presentation: more expressive, but still clear.
   - Influencer matching and inbox: marketplace workflow, trust, comparison, negotiation.
2. Set design dials:
   - Design variance: 4-6 for most PULSE screens; 6-7 only for landing/auth/presentation.
   - Motion intensity: 3-5 by default; 6 only when motion explains state or product value.
   - Visual density: 6-8 for dashboards; 4-6 for landing/auth; 5-7 for matching/inbox.
3. Apply PULSE source-of-truth constraints:
   - Keep Pretendard and existing Tailwind font tokens.
   - Keep primary blue `#002B7A`, page gray `#F5F7FA`, white surfaces, and orange CTA `#FF5A36CC`.
   - Do not blindly adopt external palettes, Inter defaults, serif dashboards, purple gradients, neon glows, or all-dark systems.
4. Design the complete state cycle before coding: loading, empty, error, disabled, focused, active/pressed, success, and recovery.
5. Verify by screen goal: a user should know where they are, what matters now, and what action is next without reading a long explanation.

## UI UX PRO MAX Usage

The searchable UI UX PRO MAX data and scripts are vendored at:

```powershell
python .agents\skills\ux-designer\vendor\ui-ux-pro-max\scripts\search.py "<query>" --design-system -p "PULSE" --format markdown
python .agents\skills\ux-designer\vendor\ui-ux-pro-max\scripts\search.py "<query>" --domain ux
python .agents\skills\ux-designer\vendor\ui-ux-pro-max\scripts\search.py "<query>" --domain chart
python .agents\skills\ux-designer\vendor\ui-ux-pro-max\scripts\search.py "<query>" --stack react
```

Use it for extra options, not final authority. PULSE often needs to override generated recommendations because the source data may suggest dark themes, unrelated fonts, or non-PULSE accents.

Good PULSE query patterns:
- `restaurant owner marketing automation operational SaaS dashboard trust clear`
- `local restaurant review management dense dashboard accessible Korean`
- `influencer matching marketplace comparison inbox negotiation`
- `promotion video generation workflow loading empty error states`
- `React dashboard chart accessibility tooltip keyboard`

## Anti-Generic Design Rules

- Avoid generic centered hero layouts unless the page already uses that pattern intentionally.
- Avoid the common purple-blue AI gradient look.
- Avoid decorative card walls. Use cards only for anchored content, interactive controls, or stateful groups.
- Avoid fake-perfect numbers such as `99.9%` unless backed by real product data.
- Avoid placeholder-only forms, ambiguous CTAs, and English filler copy.
- Avoid emoji as UI icons. Use the repo's icon set and add accessible labels for icon-only controls.
- Avoid `h-screen` for mobile-height sections; prefer dynamic viewport units.
- Avoid `transition-all`; list animated properties.
- Avoid custom cursors and hover-only critical information.

## Interaction Rules

- Primary CTA: one per screen/panel. Secondary actions should be visibly quieter.
- Tap/click targets: aim for at least 44x44px hit areas and 8px spacing between adjacent controls.
- Button feedback: use visible hover, focus-visible, active/pressed, disabled, and loading states.
- Forms: visible label above input, helper text when useful, inline error below the field, `name`, semantic `type`, and `autocomplete`.
- Async work: show skeletons or layout-matched placeholders for longer loads; preserve layout space to reduce CLS.
- Errors: state what happened and the next recovery action. Preserve user input.
- Destructive actions: require confirmation or provide undo.
- Modal/sheet UI: clear close route, keyboard escape behavior where implemented, and no hidden content behind fixed bars.

## Motion Rules

- Motion must explain cause and state, not decorate every surface.
- Use transform and opacity for routine animation.
- Respect `prefers-reduced-motion`.
- Keep micro-interactions around 150-300ms unless a larger transition has a clear purpose.
- For Framer Motion, keep shared layout transitions inside the same component tree.
- For GSAP, Lenis, Three.js, maps, and charts, isolate work in leaf components and clean up listeners, animation frames, timelines, and instances.
- Never mix GSAP/Three.js canvas choreography and Framer Motion state choreography in the same tightly coupled component tree without a clear boundary.

## Usability Heuristic Audit

Score issues 0-4:
- 0: not a problem.
- 1: cosmetic.
- 2: minor friction.
- 3: major task failure risk.
- 4: blocks task completion.

Use these questions first:
- Can users tell what product/page this is immediately?
- Is the main action obvious?
- Does navigation show where users are and where they can go?
- Does the system show loading, saving, success, and failure?
- Can users undo, cancel, go back, or recover?
- Are labels written in the user's language instead of internal jargon?
- Does the page remove unnecessary words and decoration?
- Does it work without hover?
- Are icon-only controls named for screen readers?
- Does anything make the user stop and interpret?

## Web Interface Review Rules

Check React code for:
- Semantic controls: buttons for actions, links for navigation.
- `aria-label` on icon-only buttons and decorative icons hidden from assistive tech.
- Form labels, `name`, `type`, `inputMode`, and useful `autocomplete`.
- Keyboard handlers only when custom interactive elements are unavoidable.
- Visible `focus-visible` replacement when outlines are customized.
- Images with `alt`, width/height or stable aspect ratio, and lazy loading below the fold.
- Long text handling: `min-w-0`, wrapping, truncation, or line clamp where needed.
- Reduced-motion branches for animation-heavy surfaces.
- URL-reflected state for filters, tabs, pagination, and shareable workflow state when useful.
- `Intl.DateTimeFormat` and `Intl.NumberFormat` for dates, numbers, and currency.
- No hardcoded raw provider errors exposed to users.

## PULSE Screen Guidance

- Dashboard: inline metric strip first, then the main table/chart. Prefer dividers and grouped typography over nested cards.
- Review management: strongest states are unprocessed reviews, AI draft state, manual edit, publish/retry, and error recovery.
- Promotion video: show prompt quality, generation progress, preview failure, retry, and asset limits.
- Influencer matching: comparison needs transparent criteria, fit explanation, compensation state, inbox context, and accept/reject clarity.
- Auth/onboarding: build confidence with clear steps, visible progress, and no surprise data requests.

## Final UI Preflight

- PULSE tokens used; external recommendations adapted.
- Korean copy fits on 390px mobile and does not overflow buttons.
- Focus-visible, hover, active, disabled, loading, empty, and error states exist.
- No horizontal scroll at mobile widths.
- No overlapping UI at 390x844, 1024x768, and 1440x1024.
- Charts have labels/tooltips and do not rely on color alone.
- Motion is interruptible, reduced-motion safe, and not blocking CTAs.
- Strong cards are limited; page sections are not nested inside decorative containers.
