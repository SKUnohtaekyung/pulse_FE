---
name: doc-manager
description: Durable documentation maintainer for PULSE. Use when product, architecture, design, workflow, skill, or verification decisions should be recorded in repo docs such as MD/CHANGELOG.md, MD/about_pulse.md, MD/design_guide.md, MD/tech.md, AGENTS.md, or PLANS.md.
---

# Doc Manager

## Purpose
Keep important decisions out of volatile chat and in repo files.

## Update Map
- Product intent or feature scope: `prd.md`, `MD/about_pulse.md`.
- Architecture, API, dependency, build/test flow: `MD/tech.md`, `AGENTS.md`.
- UI rules, visual language, interaction standards: `MD/design_guide.md`.
- Long-running execution pattern: `PLANS.md`.
- Review policy: `code_review.md`.
- Any material change: append to `MD/CHANGELOG.md`.

## Workflow
1. Identify what changed and which docs are affected.
2. Update the smallest durable doc set.
3. Keep `MD/CHANGELOG.md` append-only; do not rewrite history except for direct user request.
4. Check that referenced paths exist and wording does not conflict with `AGENTS.md`.

## Output Contract
- List changed docs and why.
- Mention docs intentionally not changed.
- Report unresolved follow-up documentation debt.
