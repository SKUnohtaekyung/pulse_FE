---
name: pulse-visual-qa
description: PULSE browser visual QA and interaction verification skill. Use after frontend changes, route/layout changes, responsive UI work, dashboard/influencer/promotion/review screens, Playwright smoke testing, console/network inspection, accessibility checks, or applying upgraded web interface and UX heuristic checks.
---

# Pulse Visual QA

## Overview
Verify PULSE frontend changes in a real browser instead of relying on code inspection alone. Check layout, console, network, accessibility affordances, responsive behavior, and primary interactions.

## Required Routes

Prioritize these paths:

- `/`
- `/login`
- `/dashboard`
- `/store/status-v2`
- `/influencer-matching`
- `/influencer/dashboard`
- `/subscription`

## Workflow

1. Run static checks first when relevant:
   - `npm run lint`
   - `npm run build`
2. Start the dev server if a live app is needed:
   - `npm run dev`
3. Use browser automation or the existing smoke script:
   - `npm run e2e:smoke` only when backend services are running.
4. For each changed route, verify:
   - no console errors
   - primary CTA/control visible
   - no clipped text or overlapping cards
   - keyboard focus is visible
   - mobile viewport is usable
5. Capture screenshots under `output/playwright/` when producing visual evidence.

## Viewports

- Desktop: 1440 x 1024
- Compact desktop: 1024 x 768
- Small desktop/tablet: 768 x 1024
- Mobile: 390 x 844
- Small mobile stress: 375 x 812
- For fixed dashboard shells, verify internal panes do not hide essential controls.

## PULSE Visual Checks

- Left sidebar expansion/collapse does not cover main content.
- Header text aligns with page body.
- Cards do not nest visually as page sections.
- Korean text wraps cleanly and does not overflow buttons.
- Motion from GSAP/Lenis/Framer Motion does not block CTAs or scroll.
- `PULSE_LOGO.png` assets render in build and preview paths.
- Interactive controls have visible hover, active, disabled, loading, and focus-visible states.
- Icon-only buttons have accessible names or visible tooltips; decorative icons are not announced.
- Forms have visible labels, inline errors, useful autocomplete, and focus first invalid field when implemented.
- Empty, loading, and error states do not collapse layout or render broken shells.
- No mobile horizontal scroll, clipped Korean text, hidden fixed-footer content, or card-in-card visual nesting.
- Animation-heavy pages respect reduced-motion expectations where implemented and avoid layout-shifting animation.

## Heuristic QA Pass

For UX review requests, report severity 0-4:
- 4: prevents task completion.
- 3: likely causes task failure or major confusion.
- 2: slows or frustrates users.
- 1: cosmetic polish issue.

Use the trunk test: users should immediately know the product/page, current location, available sections, next options, hierarchy position, and search/filter path when relevant.

## Output Contract

Report checked routes, viewport coverage, console/network status, screenshots if any, and unresolved risks.
