# PULSE Documentation Map

This directory contains durable product, technical, design, business, meeting, and archive documents for PULSE.

## Read Order

1. `../prd.md`: active feature intent, PRD, and user stories.
2. `MD/about_pulse.md`: product vision, user value, IA, and feature scope.
3. `MD/tech.md`: architecture, stack, data flow, and API assumptions.
4. `MD/design_guide.md`: visual system, layout, typography, and component rules.
5. `MD/PULSE.md`: agent quick index for route/component orientation only.

If documents conflict, use the order above and update the stale document with `doc-manager`.

## Directory Roles

- `BM/`: business model, pricing, and monetization references.
- `meetings/`: decision logs and meeting notes. Decisions must still be reflected in SSOT docs.
- `presentations/`: deck planning and presentation materials.
- `references/`: implementation ideas, metrics, API plans, and reusable domain references.
- `archive/`: old operations docs, retired skills, and historical material.

## Agent Notes

- Current task state lives in `.agent/context/`.
- Active skills live in `.agents/skills/`.
- Do not write secrets, `.env` values, tokens, or provider keys into docs.
