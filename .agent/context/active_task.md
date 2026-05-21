# 🚀 Active Task Context

**Current Goal:** [v3.0] 인플루언서 전용 인박스(대시보드) 구축을 통한 제안-수락 양면루프 완성
**Current Status:** `product-manager`와 `ux-designer`가 PRD 및 디자인 설계를 각각 완료했습니다. 현재 실행 계획은 `current_plan.md`에 정리되어 있습니다.
**Strict Constraints:** 
- 기존 사장님 레이아웃 로직을 마개조하지 말고 `InfluencerLayout.jsx`를 완전히 분리하여 구현할 것.
- `MD/design_guide.md` 폰트(Pretendard Variable) 및 규정 컬러 외 절대 사용 불가.

## Next Immediate Action
**Target Agent:** `frontend-dev` (또는 개발 수행 모드)
**Instruction:** `current_plan.md`의 우선순위에 따라 역할 기반 라우팅, 인플루언서 회원가입 완료 처리, 제안-수락 루프/API 연동을 순차적으로 구현하십시오. 이미 분리된 React 컴포넌트(`InfluencerLayout.jsx`, `InfluencerSidebar.jsx`, `InfluencerInbox.jsx`)와 `App.jsx` 라우터 구조를 보존하십시오.
