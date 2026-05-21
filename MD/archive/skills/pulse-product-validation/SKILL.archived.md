---
name: pulse-product-validation
description: PULSE product validation skill combining assumptions, experiments, metrics, growth loops, pricing, and marketplace liquidity checks. Use when stress-testing feature ideas, defining North Star/KPIs, designing experiments, validating onboarding/dashboard/promotion/influencer loops, or deciding whether to ship, iterate, stop, or research more.
---

# Pulse Product Validation

## Purpose
Validate whether a PULSE feature is worth building or scaling before spending engineering effort.

## Workflow
1. State the feature hypothesis:
   - If we build X for user Y, metric Z will improve because R.
2. Identify risky assumptions:
   - Value: users want it enough.
   - Usability: users understand and complete it.
   - Viability: business, pricing, and operations can support it.
   - Feasibility: current frontend, API, data, and AI constraints can support it.
3. Choose validation lens:
   - experiment/pretotype
   - metrics/instrumentation
   - growth loop/GTM
   - marketplace liquidity
   - pricing/packaging
4. Define leading metrics and guardrails.
5. Pick the cheapest credible test.
6. Set a decision rule: ship, iterate, stop, or research more.

## PULSE Defaults
- North Star candidate: weekly successful marketing actions completed by active stores.
- Store activation: first analysis viewed, first AI reply generated, first promotion request submitted.
- Influencer activation: first proposal opened, first accept/reject action.
- Promotion metric: video generation request rate and prompt acceptance/edit rate.
- Review metric: AI reply edit rate and review response completion.
- Marketplace guardrail: proposals reviewed within 24 hours.

## Growth Loop Checks
- Usage loop: generated replies, reels, or insights create measurable value and repeat use.
- Content loop: generated social content brings new awareness.
- Referral loop: owners or influencers invite peers.
- Marketplace loop: better influencer supply improves owner demand and vice versa.
- Local proof loop: one successful local segment expands to adjacent stores.

## Output Contract
- Feature hypothesis.
- Ranked assumptions.
- Recommended experiment.
- Metrics and guardrails.
- Growth or marketplace loop impact.
- Sample size/duration if knowable, otherwise state unknown.
- Decision rule.
- Implementation surface if validated.
