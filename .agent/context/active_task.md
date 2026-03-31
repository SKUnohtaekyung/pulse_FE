# 🚀 Active Task Context

**Current Goal:** [v3.0] 인플루언서 전용 인박스(대시보드) 구축을 통한 제안-수락 양면루프 완성
**Current Status:** `product-manager`와 `ux-designer`가 PRD 및 디자인 설계를 각각 완료했습니다. (`prd.md`, `implementation_plan.md`)
**Strict Constraints:** 
- 기존 사장님 레이아웃 로직을 마개조하지 말고 `InfluencerLayout.jsx`를 완전히 분리하여 구현할 것.
- `design_guide.md` 폰트(Pretendard Variable) 및 규정 컬러 외 절대 사용 불가.

## Next Immediate Action
**Target Agent:** `frontend-dev` (또는 개발 수행 모드)
**Instruction:** 사용자의 최종 Review 승인이 떨어지면, `implementation_plan.md`의 디자인 스펙을 가져와 React 컴포넌트(`InfluencerLayout.jsx`, `InfluencerSidebar.jsx`, `InfluencerInbox.jsx`)를 App.jsx 라우터에 세팅하고 실제로 그리십시오.
