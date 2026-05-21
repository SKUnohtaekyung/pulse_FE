# PULSE Market Research Reference

Use this reference when product work needs market, competitor, persona, journey, or presentation-ready rationale for PULSE.

## Local Context First

- `MD/about_pulse.md`
- `prd.md`
- `MD/tech.md`
- `MD/BM/*.md` when pricing or business model matters
- Relevant UI files under `src/features/influencer`, `src/features/promotion`, `src/features/reviewManagement`, or `src/features/insight`

## PULSE Market Definition

- Buyer side: 외식업 자영업자.
- Supply side: 로컬/마이크로 인플루언서.
- Job: 리뷰, 상권, 콘텐츠, 매칭 기반 마케팅 실행 비용과 불확실성 감소.

## Research Rules

- Separate evidence from inference:
  - Evidence: repo docs, implemented screens, user-provided 자료, cited official or web sources.
  - Inference: market sizing, competitor positioning, expected user behavior.
- Do not describe PULSE as a generic SaaS dashboard.
- Distinguish 사장님 workflow from 인플루언서 workflow.
- For competitor analysis, include indirect substitutes: agency, manual DM, Naver/Kakao review tools, Instagram ads, influencer marketplaces.
- For journey maps, identify the first value moment:
  - 사장님: "내 가게 문제와 실행 액션이 보인다."
  - 인플루언서: "받은 제안의 조건을 빠르게 판단하고 응답할 수 있다."
- For presentation work, keep claims defensible and mark assumptions.

## Output Shape

Use concise Korean tables:

- `근거`: source, evidence, or inference level.
- `인사이트`: what it means for PULSE.
- `제품 반영`: route, feature, copy, metric, or deck section affected.
- `리스크`: what could be wrong or needs validation.
