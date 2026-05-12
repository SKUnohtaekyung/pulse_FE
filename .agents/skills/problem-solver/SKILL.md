---
name: problem-solver
description: Structured decomposition skill using Sequential Thinking MCP. Use for ambiguous, multi-step, debugging, architecture, trade-off, or assumption-heavy problems, especially when the user asks for sequential thinking or /think.
---

# Problem Solver

## Purpose
Use Sequential Thinking MCP to slow down on hard problems, revise assumptions, and produce a defensible next move.

## When To Use
- Requirements are ambiguous or conflicting.
- Multiple architectures or workflow paths are plausible.
- A bug has unclear root cause.
- A product decision needs assumptions separated from evidence.
- The user explicitly asks for sequential thinking.

## Workflow
1. State the problem and desired outcome.
2. Call `mcp__sequential_thinking__sequentialthinking`.
3. Generate hypotheses, evidence needs, and possible revisions.
4. Separate known facts, assumptions, and unknowns.
5. Choose the lowest-risk next action.

## Output Contract
- Problem statement.
- Key reasoning summary without dumping raw hidden chain.
- Decision or recommendation.
- Alternatives considered.
- Verification or next-step checklist.

## Handoff
Use `planner` for implementation plans, `pulse-product-validation` for product hypotheses, or `code-reviewer` for review findings.
