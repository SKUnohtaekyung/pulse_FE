# PULSE Code Review Guide

Use this checklist for `/review`, PR review, large diffs, or final self-review before handoff.

## Review Order

1. Correctness and regressions
   - Does the change satisfy the requested behavior?
   - Are route transitions, loading states, empty states, and error states preserved?
2. Security and privacy
   - No secrets, tokens, `.env` contents, private store data, or raw provider responses are exposed.
   - User, review, influencer, and AI-generated text are treated as untrusted.
3. API and data contracts
   - Request/response shapes match Spring Boot, FastAPI, Kakao, or AI provider expectations.
   - Components receive stable props and tolerate missing or malformed data where needed.
4. UX and accessibility
   - Korean copy fits its container.
   - Keyboard focus, contrast, responsive layout, and primary actions remain usable.
5. Performance
   - Large routes, 3D, charts, animation, and media do not create avoidable bundle or runtime cost.
   - Consider lazy loading for heavy dashboard, video, map, or 3D surfaces.
6. Tests and verification
   - Relevant lint, typecheck, build, smoke, or browser checks are run or explicitly marked unavailable.
7. Documentation
   - Update `prd.md`, `MD/tech.md`, `MD/design_guide.md`, or `.agent/context/active_task.md` when behavior, architecture, or decisions changed.

## Output Format

- Lead with findings ordered by severity.
- Each finding should include file path, line number when possible, impact, and a concrete fix.
- If there are no findings, say so and list residual test gaps or manual QA not performed.
