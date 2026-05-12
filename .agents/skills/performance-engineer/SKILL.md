---
name: performance-engineer
description: PULSE web performance review skill. Use when bundle size, route loading, 3D/animation, charts, maps, large lists, image assets, re-renders, or build warnings may affect speed or Core Web Vitals.
---

# Performance Engineer

## Purpose
Find practical performance improvements without speculative rewrites.

## PULSE Hot Spots
- React Three Fiber and Three.js auth visuals.
- GSAP/Lenis/Framer Motion motion paths.
- Recharts dashboards and large widgets.
- Kakao map/search pages.
- Promotion/video flows and large media assets.
- Large route bundle warnings from `npm run build`.
- Continuous micro-interactions, shimmer effects, animated backgrounds, and scroll-driven UI imported from design skills.

## Workflow
1. Measure first when possible:
   - `npm run build`
   - route-level browser inspection
   - bundle size warning review
2. Identify the bottleneck class:
   - initial bundle
   - route chunking
   - render/re-render cost
   - asset size
   - animation/main-thread pressure
   - network/API waterfalls
   - layout shift from async media, charts, or skeleton replacement
3. Recommend the smallest fix:
   - dynamic import/lazy route
   - memoization only where measured or obvious
   - image compression or public asset cleanup
   - defer animation/map initialization
   - reduce expensive chart/3D work off inactive routes
   - isolate continuous animation in memoized leaf components
   - animate transform/opacity only and replace `transition-all` with explicit properties
   - reserve image/chart/video dimensions with width/height or aspect-ratio
4. Verify with the same check used to find the issue.

## Design-Performance Guardrails
- Treat design-intelligence recommendations as performance-budgeted options, not mandates.
- Avoid running grain/noise/backdrop filters on scrolling containers.
- Use `content-visibility`, pagination, or virtualization for large lists above roughly 50 visible rows/items.
- For Framer Motion, avoid parent re-renders driving continuous animation.
- For GSAP/Lenis/Three.js, require `useEffect` cleanup and do not initialize on routes where the surface is not visible.
- Prefer skeletons that match final dimensions to avoid cumulative layout shift.

## Output Contract
- Current evidence.
- Root cause.
- Prioritized fixes with expected impact.
- Verification command or browser check.
- Risks and tradeoffs.
