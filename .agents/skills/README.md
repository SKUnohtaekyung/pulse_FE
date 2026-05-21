# PULSE Codex Skills

`.agents/skills/` is the canonical Codex project skill surface for PULSE. Add and edit project skills here only.

`.agent/context/` holds current task handoff state. `.agent/skills/` is intentionally not used.

## Active Skill Set

The active set is intentionally kept to 13 skills to improve automatic selection quality.

### Core Workflow

- `product-manager`: PRD, user value, market research, validation, metrics, growth, and pricing references.
- `planner`: technical decomposition from PRD to implementation plan.
- `ux-designer`: UI/UX, accessibility, responsive behavior, visual polish, and Korean copy references.
- `frontend-dev`: React/Vite/Tailwind implementation and performance-aware frontend changes.
- `tdd-architect`: behavior design, acceptance criteria, tests, and QA scenarios.
- `code-reviewer`: risk-focused review for correctness, security, UX, performance, and verification.
- `doc-manager`: durable project documentation updates.
- `pr-manager`: Korean commit messages and PR drafts from real git diff.
- `research-assistant`: Context7 or official-docs research with local fallback.
- `video-creator`: promotion video prompt and payload design.

### PULSE-Specific Specialists

- `pulse-api-contract-architect`: frontend/backend/external API and component contract design.
- `pulse-security-hardening`: auth, env, external API, upload, user input, and AI prompt boundary review.
- `pulse-visual-qa`: browser visual QA, interaction verification, responsive checks, and console/network inspection.

## Merged Skill Mapping

- `pulse-market-researcher` -> `product-manager/references/pulse-market-research.md`
- `pulse-product-validation` -> `product-manager/references/pulse-product-validation.md`
- `pulse-acceptance-scenarios` -> `tdd-architect/references/pulse-acceptance-scenarios.md`
- `ux-writer` -> `ux-designer/references/pulse-copy-rules.md`
- `performance-engineer` -> `frontend-dev` implementation rules and `code-reviewer` performance checks
- `problem-solver` -> `PLANS.md` complex-work planning and Sequential Thinking fallback rule

Archived skill directories live under `MD/archive/skills/` and are not active discovery sources.

## Imported UI/UX Skill Upgrade

The PULSE UI skill surface incorporates analysis from external design skills while keeping `.agents/skills/` as the canonical project source.

- UI UX PRO MAX: vendored search data and scripts at `ux-designer/vendor/ui-ux-pro-max/`.
- Frontend Design, Taste, Web Design Guidelines, and UX Heuristics are synthesized in `ux-designer/references/pulse-design-intelligence.md`.

Use external or vendored design recommendations as advisory only. Translate them into PULSE tokens from `MD/design_guide.md`, `tailwind.config.js`, and `src/constants/index.js`.

## Usage Rule

Prefer the narrowest active skill that fits. For broad product work, start with `product-manager`; for implementation, move through `planner`, `frontend-dev`, `pulse-visual-qa`, and `code-reviewer` as needed.
