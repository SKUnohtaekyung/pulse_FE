---
name: tdd-architect
description: Test and behavior-design skill for PULSE. Use when the user asks for /tdd, tests-first work, acceptance-level behavior coverage, regression tests, or a verification plan before implementation.
---

# TDD Architect

## Purpose
Turn intended behavior into testable scenarios before or alongside implementation.

## Reality Check
This repo currently has limited automated test structure. Prefer pragmatic verification plans unless a real test harness exists or the user asks to add one.

## Workflow
1. Define behavior in user terms.
2. Identify critical paths and failure paths.
3. Choose verification level:
   - unit test
   - integration/component test
   - route smoke test
   - browser/manual QA
4. Write Given/When/Then cases before code where useful.
5. Map each case to commands or files.

## PULSE Critical Areas
- Auth/profile and route protection.
- Review reply generation and editing.
- Promotion/video request flows.
- Influencer proposal accept/reject.
- Kakao map/search and dashboard data loading.

## Output Contract
- Behavior under test.
- Test/QA cases.
- Required fixtures or mocks.
- Verification commands.
- Gaps that remain manual.
