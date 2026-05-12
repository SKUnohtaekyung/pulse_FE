# PULSE Codex Skills

This directory is the canonical Codex project skill surface for PULSE. Add and edit project skills here only.

`.agent/context` may still hold workflow handoff notes, but `.agent/skills` is intentionally not used to avoid duplicate skill sources.

The active project skill set is intentionally compact: 13 core workflow skills and 6 PULSE-specific skills.

## Imported UI/UX Skill Upgrade

The PULSE UI skill surface now incorporates analysis from five external skills while keeping `.agents/skills/` as the canonical project source:

- UI UX PRO MAX: vendored search data and scripts at `ux-designer/vendor/ui-ux-pro-max/`.
- Frontend Design: distinctive, non-generic frontend direction, adapted to PULSE brand constraints.
- Taste: design variance, motion intensity, visual density, anti-generic UI patterns, and performance guardrails.
- Web Design Guidelines: React/web interface review checks for accessibility, forms, state, animation, images, performance, and i18n.
- UX Heuristics: Krug/Nielsen-style usability scoring, trunk test, severity ratings, and task-based audit flow.

The synthesized PULSE-specific rules live in `ux-designer/references/pulse-design-intelligence.md`. Existing implementation, review, QA, and performance skills reference that file instead of duplicating the full guidance.

## Core Workflow Skills

- `product-manager`: PRD and user value.
- `planner`: technical decomposition.
- `ux-designer`: UI/UX and accessibility design review.
- `frontend-dev`: React/Tailwind implementation.
- `ux-writer`: Korean-first microcopy.
- `tdd-architect`: test-first behavior design.
- `code-reviewer`: quality/security review.
- `performance-engineer`: bundle/runtime performance.
- `doc-manager`: durable project documentation.
- `pr-manager`: commit and PR drafting.
- `problem-solver`: Sequential Thinking workflow.
- `research-assistant`: Context7-based external docs research.
- `video-creator`: video-generation payload thinking.

## PULSE-Specific Added Skills

These were adapted from the structure and ideas in community skill repos, then rewritten for this project:

- `pulse-market-researcher`: from `phuryn/pm-skills` market research and journey mapping patterns.
- `pulse-product-validation`: combines assumption testing, experiment design, North Star/KPI thinking, growth loops, GTM, pricing, value proposition, and marketplace liquidity patterns from `phuryn/pm-skills` and `product-on-purpose/pm-skills`.
- `pulse-acceptance-scenarios`: from acceptance criteria and edge-case patterns in `product-on-purpose/pm-skills`.
- `pulse-visual-qa`: from browser verification patterns in `addyosmani/agent-skills` and Playwright workflow ideas.
- `pulse-security-hardening`: from security hardening patterns in `addyosmani/agent-skills` and OpenAI curated security skills.
- `pulse-api-contract-architect`: from API/interface contract patterns in `addyosmani/agent-skills`.

## Usage Rule

Prefer the narrowest skill that fits the current task. For broad product work, use `product-manager` first, then `pulse-product-validation` only when the work needs assumptions, experiments, metrics, growth, pricing, or marketplace validation.
