---
name: pulse-market-researcher
description: PULSE 전용 시장/경쟁/사용자 리서치 skill. Use when analyzing 외식업 마케팅 자동화 시장, 인플루언서 매칭 경쟁 구도, 소상공인/로컬 크리에이터 페르소나, 고객 여정, 발표/사업계획용 시장 근거, or when adapting frameworks from phuryn/pm-skills competitor-analysis, customer-journey-map, market-segments, user-personas to this project.
---

# Pulse Market Researcher

## Overview
PULSE의 양면시장(사장님과 인플루언서)을 기준으로 시장 정의, 경쟁자, 페르소나, 고객 여정을 정리한다. 일반 PM 리서치가 아니라 PULSE의 문서와 현재 구현 상태를 먼저 기준으로 삼는다.

## Workflow

1. Load local context first:
   - `MD/about_pulse.md` if present
   - `prd.md`
   - `MD/tech.md`
   - `MD/BM/*.md` when business model or pricing is involved
   - relevant UI files under `src/features/influencer`, `src/features/promotion`, `src/features/reviewManagement`, or `src/features/insight`
2. Define the market in one sentence:
   - buyer side: 외식업 자영업자
   - supply side: 로컬/마이크로 인플루언서
   - job: 리뷰/상권/콘텐츠/매칭 기반 마케팅 실행 비용과 불확실성 감소
3. Separate evidence from inference:
   - Evidence: repo docs, implemented screens, user-provided 자료, cited web sources
   - Inference: market sizing, competitor positioning, expected user behavior
4. Produce one of these artifacts:
   - competitor brief
   - customer journey map
   - persona/JTBD map
   - segment prioritization
   - presentation-ready market rationale

## PULSE Lens

- Do not describe PULSE as a generic SaaS dashboard.
- Always distinguish 사장님 workflow from 인플루언서 workflow.
- For competitor analysis, include indirect substitutes: agency, manual DM, Naver/Kakao review tools, Instagram ads, influencer marketplaces.
- For journey maps, identify the first value moment:
  - 사장님: “내 가게 문제와 실행 액션이 보인다.”
  - 인플루언서: “받은 제안의 조건을 빠르게 판단하고 응답할 수 있다.”
- For presentation work, keep claims defensible and mark assumptions.

## Output Shape

Use concise Korean tables:

- `근거`: source/evidence/inference level
- `인사이트`: what it means for PULSE
- `제품 반영`: route, feature, copy, metric, or deck section affected
- `리스크`: what could be wrong or needs validation
