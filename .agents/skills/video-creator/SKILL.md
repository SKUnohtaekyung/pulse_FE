---
name: video-creator
description: PULSE promotion video prompt and payload skill. Use for PromotionPage, VEO/Gemini video prompt design, video generation payloads, prompt quality review, storyboard options, or /video requests.
---

# Video Creator

## Purpose
Turn PULSE promotion context into usable video prompts, payload fields, and quality checks.

## Required Context
- Store type and target customer.
- Promotion goal.
- Menu/product/service to feature.
- Desired vibe and platform.
- Inputs available: text, image, review, market insight, persona.

## Workflow
1. Identify objective:
   - awareness
   - visit intent
   - review/social proof
   - event/promotion
   - influencer collaboration
2. Extract constraints from `MD/Video.md` when payload compatibility matters.
3. Build a concise prompt:
   - subject
   - setting
   - action
   - camera/style
   - mood
   - text overlay if needed
4. Validate:
   - no unsupported claims
   - no private data leakage
   - brand tone fits PULSE
   - output is feasible with available inputs.

## Output Contract
- Video concept.
- Prompt or payload-ready fields.
- Negative/avoid instructions when useful.
- Quality checklist.
- Integration notes for `src/features/promotion/*`.
