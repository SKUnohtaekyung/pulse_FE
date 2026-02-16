# PULSE Project Changelog (변경 이력)
> 이 파일은 PULSE 프로젝트의 개발 진행 상황, 주요 업데이트 내역, 그리고 버그 수정 사항을 날짜별로 기록하는 문서입니다.

## 2026-02-08

### 🤖 Agent Skills System Migration (에이전트 스킬 시스템 마이그레이션)
*   **Modular Skills Architecture:** 프로젝트 전체를 `.agent/skills/` 디렉토리 기반의 모듈식 스킬 시스템으로 전환.
    *   **10개 전문 스킬 구축:**
        *   Core Workflow (4): `planner`, `code-reviewer`, `doc-manager`, `tdd-architect`
        *   Design & Development (2): `ux-designer`, `frontend-dev`
        *   Efficiency Multipliers (2): `ux-writer`, `performance-engineer`
        *   MCP Integration (2): `research-assistant` (context7), `problem-solver` (Sequential Thinking)
    *   **The Trinity Documentation:** 모든 스킬이 3대 핵심 문서를 참조하도록 설계:
        *   `about_pulse.md` (프로젝트 헌법 - Why)
        *   `design_guide.md` (디자인 가이드 - How it looks)
        *   `PULSE.md` (실행 매뉴얼 - How to build)
*   **Legacy Files Cleanup:** 구형 에이전트 시스템 파일 제거 및 참조 정리.
    *   **Deprecated:** `SYSTEM_PROMPTS.md`, `MASTER_PROMPT_GUIDE.md`, `ROLE_DEFINITIONS.md`, `Agent.md`
## 2025-11-15 **Local Analysis Section (상권 분석):**
    - **Total Overhaul:** 디자인 시스템에 맞춰 엄격한 **3단 레이아웃** (아이덴티티, 분석, 채팅)으로 전면 개편.
    - **Golden Time Chart:** "피크 타임" 배지와 현실적인 데이터 시각화를 포함한 막대 차트 구현.
    - **Keyword Ranking:** 진행률 표시줄이 포함된 컴팩트한 상위 4개 키워드 리스트 추가.
    - **No-Scroll Policy:** 뷰포트(100vh) 내에 완벽하게 맞도록 모든 요소를 과감하게 압축 배치.

### 🎨 UI/UX Improvements (UI/UX 개선)
- **Design System Standardization (디자인 시스템 표준화):**
    - **Border Radius:** `rounded-[24px]` (메인), `rounded-xl` (카드), `rounded-lg` (요소)로 통일.
    - **Sidebar:** 40px 역방향 곡선과 방사형 그라디언트를 적용한 "Floating Pill" 스타일 구현.
    - **Typography:** 폰트 크기(Pretendard), 줄 간격, 텍스트 색상(`#191F28`, `#002B7A`) 표준화.
- **Assets & Branding (에셋 및 브랜딩):**
    - **Logo Update:** 모든 로고 에셋을 `PULSE_LOGO.png`로 교체 (사이드바, 파비콘).
    - **Favicon:** 브라우저 탭 아이콘을 공식 PULSE 로고로 업데이트.
- **Global Styles (글로벌 스타일):**
    - 불필요한 스크롤 방지를 위해 body에 `overflow-hidden` 강제 적용.
    - 새로운 컬러 팔레트(Primary: `#002B7A`, Action: `#FF5A36`)로 `tailwind.config.js` 업데이트.

### 🐛 Bug Fixes & Refactoring (버그 수정 및 리팩토링)
- **Syntax Errors:** `SuggestionChip` 컴포넌트(`LocalAnalysisSection.jsx`)의 닫는 태그 누락 수정.
- **Layout Issues:** 프로필 카드 및 여정 지도의 콘텐츠 잘림 현상 해결.
- **Z-Index Conflicts:** 헤더와 여정 지도 간의 겹침 문제 해결.
- **Code Cleanup:** 불필요한 버튼 및 미사용 CSS 클래스 제거.

---

## 2025-11-24

### 🚀 Refactoring (리팩토링)
* **Project Structure:** `test.jsx` 단일 파일을 Vite + React + Tailwind CSS 구조로 분리 및 재구성.
    * `src/components/layout`: `Sidebar.jsx`, `Header.jsx`
    * `src/features`: `DashboardHome.jsx`, `PersonaSection.jsx`, `LocalAnalysisSection.jsx` 등
    * `src/styles`: `globals.css` (Tailwind Config 및 Custom CSS 통합)
* **Data Extraction:** `mockData.jsx` 및 `constants/index.js`로 데이터와 상수 분리.

### 🎨 Design Updates (디자인 수정)
* **Sidebar Layout:**
    * 로고 영역(투명)과 네비게이션 영역(Deep Blue) 분리.
    * 텍스트 로고 대신 `pulse_logo.png` 이미지 적용 및 사이즈 확대.
    * 사이드바 확장 시 아이콘 위치 고정 (`padding-left: 28px`).
* **Responsive Scaling:**
    * 1920px 해상도 기준 `0.83333vw`를 Root Font Size로 설정하여, 모든 해상도에서 125% 확대된 비율 유지.
* **Insight Page UX Refinement (손님 마음 읽기):**
    * **Layout Overhaul:** 방문 여정(좌측)과 프로필/액션(우측) 위치 교체.
    * **UI Compact:** 프로필 탭을 방문 여정 내부로 이동, AI 전략 카드 슬림화.
    * **Right Panel Switch:** 프로필/채팅/데이터 리포트를 우측 패널에서 전환하는 방식 적용.
    * **Typography:** 제목(`32px`) 및 설명(`17px`) 폰트 사이즈 대폭 확대.
* **Dashboard Redesign (오늘의 장사비서):**
    * **No Scroll Policy:** 메인 화면 스크롤 제거 및 고정 높이(Fixed Height) 레이아웃 적용.
    * **2-Column Structure:** 좌측 메인(9) + 우측 사이드바(3) 구조로 변경.
    * **Expanded Performance:** '지난주 성과' 팝업 제거 후 메인 화면에 상세 그래프/인사이트 통합.
    * **Feature Removal:** '오늘의 루틴 체크리스트' 기능 삭제.
    * **Widget Optimization:** 날씨, 감정 온도, 트렌드 위젯을 우측에 컴팩트하게 배치.
* **My Page Redesign (마이페이지):**
    * **No Scroll Policy:** `overflow-y-auto` 제거 및 고정 높이 적용.
    * **2x2 Grid:** 페르소나, 연동, 멤버십, 고객센터 카드를 2행 2열 그리드로 꽉 차게 배치.

### 📘 Documentation (문서화)
* **Design Guide:** '4. Layout Principles' 섹션 추가 (No Scroll Policy 명시).

### 🐛 Bug Fixes (버그 수정)
* **Syntax Errors:** `PersonaSection.jsx`의 중복 태그 및 `globals.css`의 문법 오류 수정 (500 에러 해결).
* **Configuration:** `vite.config.js`, `postcss.config.js`, `tailwind.config.js` 초기 설정 누락 해결.

---

## 2025-12-01

### 🎨 Auth UI Redesign (로그인/회원가입 UI 개편)
*   **Split Screen Layout:** 좌측 3D 비주얼 영역(60%)과 우측 입력 폼 영역(40%)으로 분할된 모던 레이아웃 적용.
*   **3D Background:** `React Three Fiber`를 활용한 인터랙티브 3D 파티클 및 지오메트릭 애니메이션 배경 구현.
*   **Glassmorphism:** 투명도와 블러 효과(`backdrop-filter`)를 활용한 세련된 글래스모피즘 카드 디자인.
*   **Seamless Flow:** 별도 페이지 이동 없이 로그인/회원가입 모드가 부드럽게 전환되는 슬라이딩 인터페이스.
*   **Input UX:** `floating label` 및 포커스 인터랙션이 적용된 프리미엄 입력 필드 스타일.

### 🛠 Backend Integration (백엔드 연동)
* **Authentication:**
    * **Login:** `localStorage` 모의 로그인 로직을 `/api/auth/login` API 호출로 대체.
    * **Signup:** 회원가입 로직을 `/api/users/store` API 호출로 대체 및 에러 핸들링 추가.

### 🧭 Context-Aware Navigation (컨텍스트 기반 네비게이션)
* **Navigation Logic:**
    * **Parameter Passing:** 대시보드 및 분석 페이지에서 홍보 영상 제작 페이지로 이동 시, 문맥 데이터(`title`, `vibe`) 전달 기능 구현.
    * **State Management:** `DashboardLayout`에서 네비게이션 파라미터 관리 및 `PromotionPage`로 전달.
    * **State Lifting:** `VideoCreator`의 `prompt` 및 `title` 상태를 `PromotionPage`로 상향 조정하여 외부 초기화 지원.
* **VEO3 Payload Logic:**
    - **Video Creator**:
        - Refactored `VideoCreator.jsx` to bridge UI state with `Video.md` logic.
        - Implemented `generateVeoPayload` function to verify VEO3 JSON output.
        - Added console logging for payload verification.
    - Added detailed Korean comments to critical logic sections (VEO3 Generator, Loading Logic, 3D Components).
    - **Documentation**:
        - Updated `Video.md` with structured tables and Pyton integration examples.
* **CTA Updates:**
    * **Dashboard Home:** "퇴근길 직장인 타겟" (Energetic) 데이터 연동.
    * **Customer Analysis:** "단골 손님 시그니처 메뉴" (Emotional) 데이터 연동.
    * **Local Analysis:** "동네 핫플레이스" (Energetic) 데이터 연동.

### 🐛 Bug Fixes (버그 수정)
* **Syntax Errors:** `CustomerAnalysis.jsx` 및 `LocalAnalysisSection.jsx`의 중첩 태그 오류 수정.

---

## 2025-12-02

### 🎨 Auth Page Overhaul (인증 페이지 전면 개편)
*   **Complete Redesign:** 사용자 피드백을 반영하여 로그인 및 회원가입 페이지 디자인을 처음부터 다시 구축.
*   **2-Step Signup Flow:** 회원가입 과정을 '기본 정보 입력' → '가게 정보 등록' 2단계로 분리하여 사용자 경험 개선.
*   **Layout Standardization:**
    *   **Consistent Width:** 모든 입력 폼(`input`, `button`)의 너비를 `520px`로 통일하여 시각적 안정감 확보.
    *   **Flex Layout:** 이름/휴대폰 번호, 가게 이름/업종 등 가로 배치 필드의 비율과 간격을 정교하게 조정.
*   **Visual Refinements:**
    *   **Hover Effects:** 입력창 호버 시 하단 테두리가 `2px`로 두꺼워지는 인터랙션 추가 (레이아웃 밀림 방지).
    *   **Alignment:** 로그인/회원가입 전환 섹션을 폼 중앙에 정확히 배치하고 상단 여백(`60px`) 확보.
*   **Code Optimization:** `AuthPage.css`를 전면 재작성하여 불필요한 스타일을 제거하고 유지보수성을 높임.

---

## 2025-12-04

### 🎬 Promotion Video Creator Refinement (홍보 영상 제작 페이지 고도화)
*   **Workflow & Logic Improvements (워크플로우 및 로직 개선):**
    *   **Storyboard Step:** '입력(Input)'과 '결과(Result)' 사이에 '기획안(Storyboard)' 단계를 추가하여 3단계 프로세스 구축.
    *   **Persona Prompt:** "누구를 위한 영상인가요?" 섹션을 추가하고, 3가지 페르소나(직장인, 커플, 가족) 선택 시 AI 프롬프트 자동 완성 기능 구현.
    *   **AI Prompt Interaction:** AI가 작성한 프롬프트 수정 시 "AI가 작성함" 뱃지가 사라지도록 로직 개선.
    *   **Quality Mode Selector:** 드롭다운 메뉴 방식의 '표준/프로 모드' 선택 UI 구현 (클릭 기반 인터랙션).
*   **UI/UX Polish (디자인 및 사용성 개선):**
    *   **Style Gallery Redesign:**
        *   카드 높이 확대(`200px`) 및 텍스트 줄바꿈 허용으로 가독성 확보.
        *   선택된 스타일에 따라 테마 색상(Amber, Purple, Rose)이 은은하게 적용되는 'Context-Aware' 디자인 적용.
        *   **PULSE Badge:** "AI 추천" 뱃지를 "PULSE 추천"으로 변경하고 그라데이션 및 아이콘 효과 추가.
    *   **Tooltip & Help:** "누구를 위한 영상인가요?" 및 "영상 설명" 라벨에 도움말 툴팁 추가 (화면 잘림 방지 로직 적용).
    *   **Terminology:** "콘티 확인 중" → "영상 기획안 생성 중..."으로 사용자 친화적 용어 변경.
    *   **Visual Hierarchy:** 왼쪽 패널의 입력 요소들을 하나의 통합 컨테이너로 합치고 스크롤바 디자인 간소화.
    *   **No Scroll Policy:** 결과 화면 및 전체 레이아웃이 뷰포트 내에 완벽히 들어오도록 높이 및 여백 최적화.

---

## 2025-12-03

### 🎨 Insight Page UI Improvements (손님/상권 분석 UI 개선)
*   **Unified FAB (Floating Action Button) & Tooltip:**
    *   **Consistent Positioning:** 두 분석 페이지(`CustomerAnalysis`, `LocalAnalysisSection`) 모두 FAB 위치를 `bottom-2 right-6`로 통일.
    *   **Staggered Layout:** 버튼과 말풍선이 겹치지 않도록 버튼(`mb-4`)과 말풍선(`mb-4`)의 높이를 조정하여 시각적 간섭 제거.
    *   **Hover-Only Tooltip:** 채팅 버튼에 마우스를 올렸을 때만 말풍선("상권 정보 물어보기" / "AI에게 질문하기")이 나타나도록 개선 (`AnimatePresence` 적용).
    *   **Visual Polish:** FAB의 빨간색 알림 점(Red Dot) 제거 및 그림자 효과 최적화.

*   **Local Analysis Section (우리 동네 상권 분석):**
    *   **Peak Time Chart:**
        *   **Layout Spacing:** 그래프 영역의 왼쪽 여백(`pl-10`)을 늘려 키워드 리스트와의 간격 확보.
        *   **Width Expansion:** 오른쪽 여백(`pr-10`)을 줄여 그래프가 더 넓게 펼쳐지도록 수정.
    *   **Header Alignment:** "상권 심층 분석" 타이틀과 설명 문구("피크타임과...")를 하단 정렬(`items-end`)로 나란히 배치.
    *   **CTA Button:** 홍보 영상 제작 버튼의 호버 시 위로 올라가는 효과(`translate-y`) 제거 (그림자 효과만 유지).

*   **Customer Analysis Section (단골 손님 유형 분석):**
    *   **Text & Logic Updates:**
        *   **Chat Title:** "AI 컨설턴트" → `~ 유형 분석중` (또는 "손님 유형 분석")으로 동적 변경.
        *   **Default Message:** 손님 유형 미선택 시 "좌측 목록에서 손님 유형을 선택해주세요." 안내 메시지 표시.
        *   **Journey Header:** "~님의 방문 여정" → "~ 유형의 방문여정"으로 변경 및 설명 문구("손님이 우리 가게를...") 추가.
        *   **Chat Header:** "~님 분석 중" 부제 제거.

*   **Layout & Navigation:**
    *   **Tab Navigation Alignment:**
        *   탭 버튼("단골 손님 유형 분석", "우리 동네 상권 분석")의 위치를 사이드바 네비게이션 시작점과 정확히 맞춤 (`mt-4`).
        *   상단 타이틀("오늘도 힘차게 시작해볼까요?") 복구 및 정렬 유지.
        *   **Button Sizing:** 탭 버튼의 높이를 살짝 늘려(`py-2.5`) 클릭 편의성 및 안정감 향상.

### 🛠 Dashboard Refactoring (대시보드 리팩토링)
*   **Component Extraction:**
    *   **WeatherAnimation:** 날씨 위젯의 애니메이션 로직을 별도 컴포넌트로 분리하여 재사용성 확보.
    *   **WidgetHeader:** 모든 위젯의 헤더(아이콘, 제목, 툴팁)를 `WidgetHeader` 컴포넌트로 표준화.
*   **Code Optimization:**
    *   **Style Unification:** `WIDGET_BASE_CLASSES` 상수를 도입하여 모든 위젯의 배경, 테두리, 그림자 스타일을 중앙에서 관리.
    *   **Readability:** `DashboardHome.jsx`의 중복 코드를 제거하고 로직을 단순화하여 유지보수성 개선.

---

## 2026.1/25 (Unified Insight & AI Chatbot)

### 📊 Unified Insight Page Redesign (분석 페이지 통합 개편)
*   **Master-Detail Layout (2-Pane Structure):**
    *   기존에 분리되어 있던 '단골 손님 분석'과 '상권 분석'을 **하나의 페이지(`UnifiedInsightPage`)로 통합**했습니다.
    *   **Left Pane (35%):** 'Weekly Insight' 요약 카드와 분석 리포트 목록을 배치하여 탐색 편의성 강화.
    *   **Right Pane (65%):** 선택한 리포트(상권 분석 or 페르소나 상세)가 우측에 즉시 표시되는 반응형 구조.
*   **Top-Down Visual Flow:**
    *   **Macro to Micro:** '주변 상권(거시)'에서 시작하여 '개별 페르소나(미시)'로 이어지는 자연스러운 데이터 탐색 경험 설계.
    *   **Interactive List:** 클릭 시 배경색 변화 및 부드러운 전환 애니메이션(`Framer Motion`) 적용.
*   **UI/UX Refinement:**
    *   **Weekly Insight Card:** 트로피 아이콘과 함께 이번 주의 핵심 키워드를 요약해주는 상단 고정 카드 추가.
    *   **Consistency:** 페르소나 상세 뷰의 헤더, 태그, 여정 지도 레이아웃을 통일감 있게 재정비.

### 🤖 Global AI Chatbot (전역 AI 챗봇 도입)
*   **Header Integration:** 챗봇을 별도의 플로팅 위젯에서 **헤더(Header)의 툴바 요소**로 통합했습니다.
    *   **Position:** 우측 상단 알림 벨과 나란히 (`Flex Gap-2`) 배치하여 완벽한 수평/수직 정렬 구현.
    *   **Structure:** `Fixed` 포지셔닝을 제거하고 `Relative` 포지셔닝으로 변경하여 레이아웃 안정성 확보.
*   **Premium UI Design:**
    *   **Glassmorphism:** 헤더에 배경 블러 및 반투명 효과를 적용하여 현대적인 감각 추가.
    *   **Bubble Style:** 아이메시지(iMessage) 스타일의 말풍선 (User: Blue / AI: Gray) 및 타임스탬프 적용.
    *   **Floating Input:** 둥근 캡슐 형태의 하단 입력창 디자인으로 가벼운 느낌 강조.
*   **Interaction & Motion:**
    *   **Spring Animation:** 버튼 위치에서 자연스럽게 펴지는 (`Scale 0.9 -> 1`) 스프링 애니메이션 적용.
    *   **Auto Scroll:** 메시지 수신 시 자동으로 하단 스크롤 이동.

### 📘 Documentation & Cleanup (문서 및 정리)
*   **Design Guide Update:** `design_guide.md`에 'Global Header Standard' 및 'AI Chatbot Interface' 섹션 추가.
*   **Code Cleanup:** `UnifiedInsightPage` 및 `DashboardLayout`에 남아있던 구형 챗봇 코드 및 미사용 파일(`*_plan.md`) 전체 삭제.

---

## 2026-01-26

### 🎨 Dashboard Redesign (대시보드 리디자인)
*   **Hybrid Layout:** 주간 주말 차트(좌측)와 손님 분석 카드(우측)를 병렬 배치하여 정보 밀도를 높이고, 스크롤 없이 한눈에 파악 가능한 구조로 개선.
*   **Weather Optimized:** 날씨 및 이벤트 정보를 좌측 상단으로 컴팩트하게 정리하고, **AI 홍보 제안 배너**를 헤드라인 우측으로 이동하여 공간 효율 극대화.

### 💎 Visual Polish (디자인 디테일 강화)
*   **Typography System:** `Pretendard Variable` CDN 적용 및 Tailwind Config에 정교한 타이포그래피 토큰(`text-head-1`, `text-body-1` 등) 시스템 구축 완료.
*   **Guest Analysis Card:** 좌우 분할 레이아웃 적용, 설명 텍스트 위치 위로 이동, "주요 방문 손님" 헤더 강조(`text-sm`), 배지 제거로 깔끔한 디자인 구현.
*   **Sidebar Refinement:** 그림자(Shadow) 제거로 평면적인 일체감 조성, 선택된 메뉴 배경색을 페이지 배경색(`#F5F7FA`)과 완벽 일치시켜 이질감 제거.
*   **Gradient Consistency:** "점심 시간대", "20-30대 직장인", "시원 국물파" 등 핵심 키워드에 브랜드 시그니처(Navy to Blue) 그라데이션 일괄 적용.

### 🚀 UX Improvements (사용성 개선)
*   **CTA Redesign:** 손님 분석 카드의 버튼을 "상세 리포트 보기"에서 **"손님 분석 페이지로 이동"**으로 변경하고 다크 네이비(`bg-[#191F28]`) 스타일을 적용하여 네비게이션 명확화.
*   **Term Unification:** "손님 마음 읽기" 용어를 **"손님 분석"**으로 통일하고, 메뉴명 및 헤더 타이틀에 일관성 있게 반영.

### ✨ Immersive Loading Experience (몰입형 로딩 화면)
*   **3D Interactive Core:** `Three.js`를 활용하여 살아 움직이는 듯한 **Fluid Core**를 구현하고, 마우스 움직임에 반응하는 인터랙티브 경험 제공.
*   **Split-Screen Layout:**
    *   **Visual Balance:** 3D 오브젝트를 좌측, 정보 입력을 우측에 배치하는 **2분할 레이아웃**으로 전면 개편하여 시각적 간섭 제거.
    *   **Focus:** 텍스트와 버튼의 가독성을 극대화하고, 로딩 완료 시 자연스럽게 "시작하기"로 시선을 유도.
*   **Premium UI Detail:**
    *   **Glassmorphic CTA:** "PULSE 시작하기" 버튼에 **글래스모피즘 & 샤인(Shine) 애니메이션**을 적용하여 클릭 유도 강화.
    *   **Seamless Transition:** 로딩 중과 완료 후의 테마 컬러(`#002B7A`)를 동일하게 유지하여 이질감 없는 매끄러운 경험 완성.
*   **System Stability:**
    *   **Custom Hook:** `useSignupProgress` 훅을 도입하여 진행률, 메시지, 에러 상태를 체계적으로 관리.
    *   **Error Handling:** 네트워크 오류 등 예외 상황 발생 시 "재시도" UI가 즉시 노출되도록 안전장치 마련.

---

## 2026-02-01

### 🎬 Promotion Video Creator VEO3 Integration (VEO3 영상 생성 모델 연동)
*   **AI Payload Logic Implementation (VEO3 통신 규격 구현):**
    *   **Payload Generator:** UI 상태(옵션, 프롬프트, 바이브)를 VEO3 모델이 이해할 수 있는 JSON 규격(`Video.md` 명세)으로 변환하는 `generateVeoPayload` 함수 구현.
    *   **Verification Bridge:** 영상 생성 버튼 클릭 시 생성된 JSON 페이로드를 콘솔에 출력(`[VEO3 Payload Verification]`)하여 정합성 검증 가능.
*   **Code Optimization (성능 최적화):**
    *   **Memory Efficiency:** `VIBES`, `PERSONA_PROMPTS` 등 정적 데이터를 컴포넌트 외부로 분리하여 리렌더링 시 메모리 낭비 제거.
    *   **Safety Net:** 페이로드 생성 중 발생할 수 있는 데이터 오류를 방지하기 위해 `try-catch` 기반의 에러 핸들링 및 사용자 알림(`alert`) 로직 추가.
*   **Backend Interface Readiness (백엔드 실연동 준비):**
    *   **Raw File Capture:** 프론트엔드용 `Blob URL`뿐만 아니라 실제 업로드용 `File Object`를 별도 상태(`selectedFile`)로 관리.
    *   **API Callback Update:** `onGenerate` 콜백 호출 시 `payload`(JSON)와 `file`(Object)을 동시에 전달하도록 시그니처 개선.
*   **Documentation (유지보수성 강화):**
    *   **Korean Comments:** VEO3 파이프라인, 3D 로딩 인터랙션, 상태 관리 등 핵심 로직 전반에 상세한 한국어 주석 주입.

### 💳 Subscription Page Implementation (구독 페이지 구현)
*   **Clean Fintech Design (구독 페이지):**
    *   **Light Mode:** 기존의 어두운 AI 느낌을 탈피하여, 금융 앱 스타일의 신뢰감 있는 White/Deep Blue 테마 적용 (`SubscriptionPage.jsx`).
    *   **Pricing Card:** `PricingCard.jsx` 컴포넌트화. Growth 플랜(인기) 강조를 위한 **Best Choice 배지** 및 **Shine 효과** 구현.
    *   **Objection Handling:** 결제 전 고객의 불안감을 해소하기 위해 아코디언 스타일의 **FAQ 섹션(`FaqSection.jsx`)** 추가.
*   **Business Logic & UX:**
    *   **Psychological Pricing:** 29,000원(Growth) vs 59,000원(Pro) 앵커링 효과 및 연간 결제 시 20% 할인 토글 인터랙션 구현.
    *   **Entry Points:** 사이드바 프로필 영역 및 영상 제작 페이지의 'Pro 화질' 잠금 버튼을 통한 구독 전환 경로 구축.
    *   **Localization:** 모든 UI 텍스트(플랜명, 버튼 등)를 자연스러운 한국어로 통일.

---

## 2026-02-08

###  Agent Skills System Migration (������Ʈ ��ų �ý��� ���̱׷��̼�)
*   **Modular Skills Architecture:** ������Ʈ ��ü�� .agent/skills/ ���丮 ����� ���� ��ų �ý������� ��ȯ.
    *   **10�� ���� ��ų ����:**
        *   Core Workflow (4): planner, code-reviewer, doc-manager, 	dd-architect
        *   Design and Development (2): ux-designer, rontend-dev
        *   Efficiency Multipliers (2): ux-writer, performance-engineer
        *   MCP Integration (2): esearch-assistant (context7), problem-solver (Sequential Thinking)
    *   **The Trinity Documentation:** ��� ��ų�� 3�� �ٽ� ������ �����ϵ��� ����:
        *   bout_pulse.md (������Ʈ ��� - Why)
        *   design_guide.md (������ ���̵� - How it looks)
        *   PULSE.md (���� �Ŵ��� - How to build)
*   **Legacy Files Cleanup:** ���� ������Ʈ �ý��� ���� ���� �� ���� ����.
    *   **Deprecated:** SYSTEM_PROMPTS.md, MASTER_PROMPT_GUIDE.md, ROLE_DEFINITIONS.md, Agent.md
    *   **Reason:** ��ų �ý��ۿ� ������ ���յǾ� ���� �Ϸ�.
    *   **Retained:** CODING_CONVENTIONS.md (3�� ��ų�� �������� ���� ��)

## 2026-02-16

###  New Features (새로운 기능)
*   **Commercial Analysis Redesign:** 상권 분석 페이지 UI/UX 전면 개편.
    *   **Full-Height Map:** 지도를 컨테이너 전체 높이로 확장하여 시각적 개방감 확보.
    *   **Floating Search Bar:** 검색 바를 지도 위 오버레이(bsolute) 형태로 변경하여 접근성 향상.
    *   **Layout Optimization:** 좌측 지도(60%) / 우측 분석 패널(40%) 구조 정립.
    *   **Category Toggle:** 카테고리 필터 위치 조정(	op-20)으로 UI 겹침 방지.
*   **Search Functionality:**
    *   **Kakao Local API:** 키워드 검색 및 자동완성 기능 구현.
    *   **User Location:** Geolocation API 기반 '내 위치 찾기' 기능 추가.
*   **Summary Panel:**
    *   **Smart Header:** 패널 헤더를 내부 스크롤 영역에 통합하여 공간 효율성 개선.
    *   **Mock Data:** 상권 데이터 연동 준비를 위한 Mock 데이터 및 로딩 상태 구현.

###  Bug Fixes (버그 수정)
*   **UI Overlap:** 검색 바와 반경 선택 토글이 겹치는 현상을 높이 통일 및 위치 조정으로 해결.
*   **Layout:** 상단 헤더 영역 제거로 인한 지도 상단 여백 문제 해결.
