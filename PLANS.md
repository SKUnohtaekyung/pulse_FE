# PULSE Execution Plan Template

Use this file for complex, ambiguous, multi-file, or long-running Codex work. Skip it for tiny, single-step edits.

## Plan Shape

1. Goal
   - State the user-visible outcome in one or two sentences.
2. Context
   - List the files, routes, docs, APIs, or errors that matter.
3. Constraints
   - Note architecture, security, UX, dependency, deadline, or compatibility constraints.
4. Risks
   - Identify likely failure modes, unknowns, and user-impacting regressions.
5. Steps
   - Keep steps small enough to verify independently.
   - Mark one step as in progress at a time.
6. Verification
   - Name the exact checks: `npm run lint`, `npm run typecheck`, `npm run build`, `npm run e2e:smoke`, browser QA, skill validation, or targeted manual checks.
7. Handoff
   - Summarize changed files, verification results, remaining risks, and follow-up work.

## PULSE Defaults

- Product or market strategy: start with `product-manager`, then the narrow PULSE product skill.
- UI implementation: use `ux-designer` before broad layout changes, `frontend-dev` for implementation, and `pulse-visual-qa` for browser verification.
- API or data contract changes: use `pulse-api-contract-architect` before implementation.
- Auth, env, external API, upload, or AI prompt boundaries: use `pulse-security-hardening`.
- Metrics, experiments, growth, pricing, or marketplace validation: use `pulse-product-validation`.
- Acceptance criteria and QA scenarios: use `pulse-acceptance-scenarios`.

## Stop Conditions

- Stop and ask before destructive git operations, secret exposure, production-impacting changes, or unclear data deletion.
- Stop and report if required backend services, MCP tools, browser automation, or credentials are unavailable.
