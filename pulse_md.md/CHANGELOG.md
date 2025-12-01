    - **Interactive Profile List:** 부드러운 스프링 애니메이션이 적용된 "아코디언 스타일" 확장 기능 추가.
    - **Journey Map:** "불편함(Pain Points)"과 "만족(Good Points)"을 시각화한 수평 레이아웃으로 리디자인.
    - **AI Chat Interface:** 깔끔한 연한 파란색 배경의 전용 수직 채팅 패널 통합.
    - **Visual Polish:** 프로필 그라디언트 적용, 버튼 스타일 통일, 호버 효과 개선.
- **Local Analysis Section (상권 분석):**
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
