---
name: pulse-api-contract-architect
description: PULSE 전용 frontend/backend/API contract design skill. Use when adding or changing Spring Boot API calls, FastAPI AI calls, Kakao Local/Map API integration, auth/profile calls, proposal accept flows, dashboard/review/promotion payloads, component prop contracts, or adapting addyosmani api-and-interface-design to this React/Vite project.
---

# Pulse Api Contract Architect

## Overview
PULSE 프론트엔드와 Spring/FastAPI/외부 API 사이의 계약을 먼저 정의한다. 구현보다 입력/출력/오류/로딩/권한 상태를 명확히 해 병렬 개발과 QA를 쉽게 만든다.

## Contract Surfaces

- Auth/profile: `src/features/auth/api/*`
- Dashboard V2: `src/features/dashboard-v2/services/*`
- Insight and Kakao: `src/features/insight/api/*`, `src/api/kakaoLocal.js`, `src/utils/kakaoMapLoader.js`
- Review Management: `src/features/reviewManagement/api/*`
- Promotion/video: `src/features/promotion/promotionApi.js`
- Influencer proposals: `src/features/influencer/*`
- Route-level props: `src/App.jsx`, layout components

## Workflow

1. Read the caller and nearest existing API module.
2. Define the contract before code:
   - endpoint or module function
   - method
   - request params/body
   - response shape
   - error shape
   - auth requirement
   - loading/empty/error UI states
3. Prefer additive changes over breaking existing fields.
4. Normalize error semantics:
   - validation
   - unauthenticated
   - unauthorized
   - not found
   - provider unavailable
   - unknown
5. Validate external API responses before using them for UI decisions.

## PULSE Conventions

- Keep API wrapper functions in feature-level `api` or service modules.
- UI components should not assemble provider-specific URLs.
- Do not hardcode secrets or provider keys in contract examples.
- For list data, include pagination or an explicit MVP note when omitted.
- For proposal tokens, avoid exposing raw token except in the required route param.

## Output Contract

Return a contract table plus affected files, compatibility risks, and tests/QA needed.
