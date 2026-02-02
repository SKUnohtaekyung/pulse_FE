# 🚀 ANTIGRAVITY OPERATION MANUAL (Vibe Coding Standard)

> **"McDonald's System for Code"**
> 안티그래비티는 '천재 셰프'가 아니라 **'완벽한 매뉴얼을 따르는 프랜차이즈 점장'**처럼 행동해야 합니다.
> 모든 컨텍스트는 **저장소(Repository)에 기록된 파일(SSOT)**만을 진실로 믿으며, 채팅 기억에 의존하지 않습니다.

---

## 1. Core Principles (3대 운영 원칙)

### 🛑 Rule 1. Context Diet (컨텍스트 다이어트)
* **무작정 읽지 마라:** 프로젝트의 모든 파일을 한 번에 읽으려 하지 마십시오. 컨텍스트가 200줄을 넘어가면 환각(Hallucination)이 시작됩니다.
* **핵심 파일만 로드:** 작업을 시작할 때는 반드시 지정된 **SSOT(Single Source of Truth) 파일 3개**만 먼저 읽고 시작합니다.
    1.  `about_pulse.md` (기획/의도)
    2.  `design_guide.md` (디자인/스타일)
    3.  `tech.md` (기술/구조)

### 🔗 Rule 2. Appendix Strategy (참조 전략)
* **필요할 때만 찾아라:** 모든 코드를 기억하려 하지 말고, 필요한 순간에만 해당 파일을 열어보십시오.
* **참조 순서:**
    * 디자인 관련 질문 → `design_guide.md` 확인 (다른 파일 보지 말 것)
    * 프로젝트의 기획 내용 → `about_pulse.md` 확인
    * UI 구현 관련 질문 → `PULSE.md` 확인  
    * API/DB 구조 질문 → `tech.md` 확인

### 📝 Rule 3. Volatile Chat, Persistent Repo (휘발성 채팅, 영구적 저장소)
* **채팅은 믿지 마라:** 채팅창의 대화는 작업이 끝나면 사라지는 '휘발성 메모'입니다.
* **기록하라:** 중요한 결정 사항(기획 변경, 디자인 수정 등)이 발생하면, 코드를 짜기 전에 **반드시 `.md` 가이드 파일을 먼저 수정**하여 '의도(Intent)'를 남겨야 합니다.
    * *Bad:* "버튼 색상을 오렌지로 바꿔줘" (채팅에만 남음)
    * *Good:* "`design_guide.md`의 Primary Button 컬러를 오렌지로 수정하고, 이를 코드에 반영해줘" (저장소에 남음)

---

## 2. SSOT Files (진실의 원천)

안티그래비티는 작업을 시작하기 전, 아래 파일들을 **'업무 매뉴얼'**로 인식해야 합니다.

| 파일명 | 역할 (Role) | 핵심 내용 |
| :--- | :--- | :--- |
| **`about_pulse.md`** | **기획서 (Why & What)** | 프로젝트 배경, 페르소나, 기능 명세, 용어 정의 |
| **`design_guide.md`** | **디자인 (How it looks)** | 컬러 코드(Strict), 폰트, UI 컴포넌트, 레이아웃 |
| **`tech.md`** | **설계도 (How it works)** | 아키텍처, 데이터 흐름, 기술 스택, API 명세 |
| **`CHANGELOG.md`** | **작업 이력 (History)** | 날짜별 변경 사항, 수정된 파일 목록, 주요 의사결정 |

---

## 3. Workflow (작업 프로세스)

안티그래비티에게 작업을 지시할 때는 아래 **4단계 프롬프트 구조**를 따릅니다.

### Step 1. Intent Definition (의도 정의)
* **"왜(Why)"** 이 작업을 하는지 명확히 밝힙니다.
* *예시:* "사용자가 리뷰 분석 결과를 더 직관적으로 보기 위해 대시보드 카드를 수정하고 싶어."

### Step 2. Context Loading (문서 로드)
* 관련된 가이드 파일만 호출합니다.
* *예시:* "`design_guide.md`의 'Bento Grid' 스타일과 `about_pulse.md`의 '오늘의 장사 비서' 내용을 참고해."

### Step 3. Priority Check (우선순위 설정)
* **Must-have (필수):** 기능 작동, 디자인 가이드 색상 준수
* **Should-have (권장):** 반응형 처리, 호버 애니메이션
* **Nice-to-have (선택):** 복잡한 인터랙션 (시간 없으면 생략)

### Step 4. Execution & Documentation (실행 및 기록)
* 코드를 작성하고, 변경된 사항이 있다면 가이드 파일도 함께 업데이트합니다.
* **[NEW] Changelog Update:** 작업이 끝나면 반드시 `CHANGELOG.md`에 날짜별 수정 사항을 기록합니다.
* *명령:* "코드를 수정하고, `CHANGELOG.md`에 변경 내역을 남겨줘."

---

## 4. Communication Protocol (대화 규칙)

안티그래비티는 답변할 때 다음 형식을 준수합니다.

1.  **참조 확인:** "네, `design_guide.md`의 **Primary Color(#002B7A)**를 사용하여 작업을 시작합니다." (근거 제시)
2.  **작업 범위:** "이번 작업은 **UI 수정**에 집중하며, 백엔드 로직은 건드리지 않겠습니다." (범위 한정)
3.  **결과 보고:** "작업 완료. 변경된 파일은 `Dashboard.jsx`이며, 관련하여 `tech.md`의 프론트엔드 구조도 최신화가 필요해 보입니다." (추가 제안)

---

> **⚠️ Critical Warning:**
> 안티그래비티는 **'추측'**하지 않습니다.
> 색상 코드가 기억나지 않으면 **"아무 파란색"**을 쓰는 대신 **"`design_guide.md`를 확인하겠습니다"**라고 말해야 합니다.