# 📘 PULSE UI/UX Design System Guide v1.2

**Project:** 외식업 자영업자 마케팅 자동화 플랫폼 'PULSE'
**Version:** 1.2 (Refined & Standardized)
**Target Audience:** **20~50대 외식업 사장님** (디지털 네이티브부터 중장년층까지 아우르는 범용성)
**Design Philosophy:** **"Modern Professional & Universal Clarity"**

---

## 1. Core Principles (핵심 원칙)

### 💎 Smart Trust (스마트한 신뢰)
* **Blue & White:** 전체적인 무드는 신뢰감을 주는 **딥 로얄 블루**와 **화이트**를 베이스로 합니다.
* **Modern SaaS:** 토스(Toss)와 같은 깔끔하고 모던한 UI를 지향하되, 자영업자에게 필요한 정보 밀도를 유지하여 전문성을 강조합니다.

### ⚡ Vitality Action (직관적 행동)
* **Point Orange:** 오직 사용자의 **'행동(클릭, 생성, 저장)'**이 필요한 곳에만 오렌지 컬러를 사용합니다.
* **Focus:** 차분한 블루톤 배경 속에서 오렌지색 버튼은 사용자가 무엇을 해야 할지 즉각적으로 인지하게 만듭니다.

### 👁️ Universal Clarity (보편적 명확성)
* **Contrast & Spacing:** 억지로 글자를 키우기보다, **확실한 명도 대비**와 **여유로운 행간(160%)**을 통해 20대부터 50대까지 모두 편안하게 읽을 수 있는 가독성을 확보합니다.

---

## 2. Color System (컬러 시스템)

> **Strict Rule:** 지정된 Hex Code 외의 색상은 사용하지 않습니다. (Green, Red 등 불필요한 색상 배제)

### 🎨 Primary Palette (Base & Trust)
안정감과 무게중심을 잡는 브랜드 컬러입니다.

| Token Name | Hex Code | Usage |
| :--- | :--- | :--- |
| **Primary Main** | **`#002B7A`** | 사이드바 배경, 로고, 헤드라인, 2차 버튼 텍스트 |
| **Primary Hover** | `#002B7AE6` | Primary 요소의 호버 상태 |
| **Primary Sub** | `#002B7ACC` | 어두운 배경 위 보조 텍스트 (Opacity 80%) |
| **Primary Inactive** | `#002B7A99` | 비활성 텍스트/아이콘 (Opacity 60%) |
| **Primary Border** | `#002B7A66` | 비활성 버튼, 경계선 (Opacity 40%) |
| **Primary Tint** | `#002B7A1A` | **채팅창 배경**, 영역 구분용 아주 연한 블루 |
| **Table Stripe** | `#002B7A0D` | 테이블 행(Row) 교차 배경 |

### 🔥 Point Palette (Action)
행동을 유도하는 포인트 컬러입니다.

| Token Name | Hex Code | Usage |
| :--- | :--- | :--- |
| **Action Main** | **`#FF5A36CC`** | **핵심 CTA 버튼 (릴스 만들기, 저장하기)** |
| **Action Bg** | `#FF5A361A` | 오렌지 텍스트 뒤에 깔리는 배지(Badge) 배경 |
| **Action Hover** | `#FF5A3633` | 오렌지 버튼/텍스트의 호버 효과 |

### 🏳️ Neutrals (Layout)
| Token Name | Hex Code | Usage |
| :--- | :--- | :--- |
| **Text Main** | **`#191F28`** | 기본 본문, 제목 (Cool Black) |
| **Bg Page** | **`#F5F7FA`** | 웹사이트 전체 배경색 (Cool Gray) |
| **Bg Card** | **`#FFFFFF`** | 카드, 모달, 컨테이너 배경 (Pure White) |

---

## 3. Typography (타이포그래피)

* **Font Family:** `Pretendard Variable`
* **Strategy:** 20~50대 타겟을 위해 기본 크기는 **16px(표준)**로 하되, 중요 정보는 **17px 이상**으로 키우고, 줄 간격을 넓게 설정합니다.

| Role | Size | Weight | Line Height | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Display H1** | **32px** | **Bold (700)** | 140% | 메인 환영 메시지 |
| **Heading H2** | **24px** | **Bold (700)** | 140% | 섹션 타이틀 |
| **Title H3** | **20px** | **SemiBold (600)** | 145% | 카드 타이틀, 모달 제목 |
| **Body 1 (Focus)**| **17px** | **Medium (500)** | **160%** | **강조 본문, 대화형 텍스트** |
| **Body 2 (Base)** | **16px** | **Regular (400)** | 150% | 일반 설명, 리스트 (웹 표준) |
| **Button** | **16px** | **Bold (700)** | 100% | 버튼 텍스트 |
| **Caption** | **14px** | Medium (500) | 140% | 날짜, 태그, 부가 정보 |

---

## 4. Layout Principles (레이아웃 원칙)

### 🚫 No Scroll Policy (스크롤 금지 정책)
* **Viewport Fit:** 모든 메인 대시보드 및 핵심 기능 화면은 **표준 데스크탑 뷰포트(100vh)** 내에 완벽하게 들어와야 합니다.
* 단, 손님 마음 읽기 페이지는 스크롤되는 화면을 허용합니다.
* **Vertical Space:** `h-full`, `flex-1`, `min-h-0` 등의 유틸리티를 활용하여 수직 공간을 꽉 채우되, 내부 스크롤이 발생하지 않도록 설계합니다.
* **Reason:** 바쁜 자영업자가 한눈에 모든 정보를 파악하고 즉시 행동할 수 있도록 하기 위함입니다.


### 🎩 Global Header Standard (공통 헤더)
모든 페이지의 최상단에는 동일한 규격의 헤더가 위치해야 합니다.

*   **Structure:** `flex justify-between items-center mb-3 pl-2`
*   **Greeting (Fixed):**
    *   Text: **"범계 로데오점 사장님, 안녕하세요!"**
    *   Font: **26px Bold (700)**
    *   Color: **Primary Main (`#002B7A`)**
*   **Subtitle (Dynamic):**
    *   Text: 페이지별 맞춤 문구 (예: "오늘도 힘차게 시작해볼까요?")
    *   Font: 15px Medium, Opacity 70%
*   **Header Tools (Right Side):**
    *   **Layout:** `flex gap-2 items-center` (Perfect vertical alignment)
    *   **AI Chatbot Trigger:**
        *   Style: **White Rounded Square (`rounded-xl`)**, Shadow-sm, Border (Default: Transparent, Active: Primary Blue)
        *   Icon: MessageCircle / Sparkles (Primary Color)
        *   Motion: Hover Scale (1.05), Active Ring
    *   **Notification Icon:**
        *   Style: Same as Chatbot (White, Shadow-sm)
        *   Icon: Bell (22px, Primary Color)
        *   Badge: Point Color (`#FF5A36`) Dot

### 🌓 Auth & Full Screen Layout (인증 및 스플릿 스크린 규격)
회원가입/로그인 등 초기 진입 화면은 서비스의 첫인상(Premium Experience)을 결정하므로 특별한 레이아웃을 사용합니다.

*   **Split Screen (50:50):** 화면을 좌우 50% 분할 레이아웃으로 구성합니다.
*   **Left Canvas (브랜드 무드):**
    *   3D 인터랙티브 배경(`@react-three/fiber` 기반 곡면 왜곡 효과 등)을 적용하여 동적이고 현대적인 느낌을 줍니다.
    *   브랜드 로고와 함께 서비스의 핵심 가치를 보여주는 큰 볼드체 텍스트(예: "우리 가게 마케팅, 이제 펄스가 알아서")를 배치합니다.
*   **Right Form (입력 영역):**
    *   사용자 입력 폼이 위치하며, 화이트 배경(`bg-white`)을 사용하여 텍스트 가독성을 극대화합니다.
    *   2-Step 회원가입 플로우(기본정보 입력 → 가게정보 입력)를 부드러운 트랜지션(Framer Motion)과 함께 제공합니다.

---

## 5. Component Styling (컴포넌트 스타일링)

### 🔲 Border Radius System (라운드 시스템)
일관된 부드러움을 위해 계층별로 라운드 값을 통일합니다.

*   **Main Container:** **`rounded-[24px]`** (메인 패널, 대형 카드)
*   **Inner Card:** **`rounded-xl` (12px)** (내부 통계 카드, 리스트 아이템)
*   **Small Element:** **`rounded-lg` (8px)** (버튼, 배지, 작은 요소)
*   **Sidebar Item:** **`rounded-l-[40px]`** (사이드바 메뉴 아이템)

### 🧭 Sidebar Navigation (Floating Pill Style)
사이드바 메뉴는 배경과 유기적으로 연결되는 'Floating Pill' 스타일을 사용합니다.

```css
/* Menu Item Base */
.menu-item {
  border-top-left-radius: 40px;
  border-bottom-left-radius: 40px;
  margin-left: 8px;
  width: calc(100% - 8px);
}

/* Active State */
.menu-item.active {
  background-color: #F5F7FA; /* Bg Page Color */
  color: #002B7A;
  font-weight: 700;
}

/* Inverted Curves (Radial Gradient Method) */
.menu-item.active::before {
  content: '';
  position: absolute;
  top: -40px; right: 0;
  width: 40px; height: 40px;
  background: radial-gradient(circle at 0 0, transparent 40px, #F5F7FA 40.5px);
  pointer-events: none;
}

.menu-item.active::after {
  content: '';
  position: absolute;
  bottom: -40px; right: 0;
  width: 40px; height: 40px;
  background: radial-gradient(circle at 0 100%, transparent 40px, #F5F7FA 40.5px);
  pointer-events: none;
}
```

### 🤖 AI Chatbot Interface (PULSE AI)
AI 챗봇은 사용자가 언제든 호출할 수 있는 **'Global Overlay'** 형태로 제공됩니다.

*   **Trigger Position:** 헤더 우측 상단 (알림 벨 좌측), `Relative` 포지셔닝으로 레이아웃 틀어짐 방지
*   **Window Style:**
    *   **Glassmorphism Header:** `bg-white/80 backdrop-blur-md` (세련된 투명감)
    *   **Dimension:** Width 360px, Height 600px (충분한 정보 표시)
    *   **Shadow:** `shadow-2xl` + `ring-1 ring-black/5` (깊이감 강조)
*   **Message Bubbles:**
    *   **User:** `bg-[#002B7A]` (Primary), White Text, `rounded-[20px] rounded-tr-sm` (아이메시지 스타일)
    *   **AI:** `bg-[#F5F7FA]` (Bg Page), Dark Text, `rounded-[20px] rounded-tl-sm`
*   **Motion:** `Spring` Animation (Stiffness 350, Damping 25)
    *   버튼 위치에서 **'Pop'** 하며 펴지는 자연스러운 등장 효과 (`transformOrigin: top right`)

---

## 6. Assets (에셋)

### 🖼️ Logo Files
* **Main Logo:** `/public/PULSE_LOGO.png` (웹사이트 로고, 사이드바 상단)
* **Favicon:** `/public/favicon.png` (브라우저 탭 아이콘)
* **Note:** 모든 로고 파일은 `PULSE_LOGO.png`를 원본으로 사용하며, 배경이 투명해야 합니다.

---

## 7. Box Usage & Layout Structure (박스 및 레이아웃 가이드)

### 7.1. 핵심 원칙: 대시보드는 '읽히는 화면'
* **One Sentence Rule:** 박스(카드)는 허용하되 **'강조/조작/상태'**를 담는 1차 컨테이너로만 사용합니다. 박스 중첩 및 무분별한 그리드 남발은 절대 금지합니다.
* 박스의 정의: 배경색 분리, 테두리/그림자/라운드로 영역이 구분되는 위젯 카드형 컨테이너.

### 7.2. 박스 사용 허용 기준 (단, 중첩 불가)
다음 조건 중 최소 1개 이상 만족 시에만 박스를 사용합니다:
1. **강조 (Anchor):** 시선이 고정되어야 하는 핵심 콘텐츠 (예: 핵심 테이블 1, 핵심 차트 1)
2. **조작 (Interaction):** 사용자 입력 및 오작동 방지가 필요한 영역 (필터, 설정, CTA 묶음, 폼)
3. **상태 (State):** 로딩, 에러, 빈 상태, 알림 등 상태 변화가 잦은 영역
4. **밀도 제어:** 데이터 밀도가 높아 시각적 여백이 필요할 때 (테이블 내부 중첩 금지)

### 7.3. 박스 사용 비권장 및 상한선 (Hard Limits)
* **Strong Box (강한 박스):** 화면당 **최대 2~3개**로 제한 (추천: 테이블 1, 차트 1, 주요 알림 1).
* **Soft Box (약한 배경톤 박스):** 화면당 **최대 4~6개**로 제한하여 '박스 보드' 형태 방지.
* **KPI 표현:** 박스가 아닌 **인라인 지표 스트립(Inline Metrics)** 기본 적용 (경고/상태 변화가 있는 1~2개만 예외).
* **단순 텍스트:** 인사이트, 가이드 등은 박스 대신 타이포+여백+디바이더로 구분.
* **예외:** 모니터링/NOC, 에디터(빌더), 카드형 카탈로그, 모바일 화면은 목적에 맞게 재정의 가능.

### 7.4. 박스 대체 구분 도구 (우선 사용)
구분 목적으로 박스를 남발하지 않고 아래 시각적 도구를 우선 적용합니다.
* **Typography:** 섹션 제목/설명으로 폰트 크기 및 웨이트를 통한 시각적 계층 생성
* **Spacing & Alignment:** 수직 여백 확대 및 그리드 정렬 활용
* **Divider:** 1px 라인으로 섹션 구분
* **Background Tone:** 강한 카드처럼 보이지 않는 아주 약한 톤 차이 적용

### 7.5. 데스크탑(1440px) 권장 구조 템플릿
1. **Header:** 페이지 타이틀 + 기간 필터 + 주요 CTA (1개)
2. **Inline Metrics Strip:** 3~5개의 핵심 지표를 카드 없이 한 줄로 나열
3. **Core Section:** 핵심 테이블 1개 (Strong Box 허용) + 보조 차트 1개 (Strong Box)
4. **Insights/Recommendations:** 텍스트 중심(박스 1개 이하) + 행동 유도(CTA) 버튼 1개 제한

### 7.6. 컴포넌트 디테일 규칙 (UI/UX 품질)
* **버튼 정렬:** 아이콘+라벨은 한 덩어리로 유지하고, 고정된 gap을 사용 (`space-between` 허용 금지).
* **빈 상태/에러:** 박스로 감싸기 전 '제목 + 설명 + 명확한 다음 행동(1개 CTA)'의 3요소로 구성.
* **테이블 우선:** 대시보드의 표출 우선순위는 핵심 테이블/리스트에 두며, 차트는 보조(1~2개) 수단이어야 함.

### 7.7. AI 디자인 출력 요구사항 및 체크리스트
AI가 디자인 또는 코드를 제안할 때 다음 사항을 반드시 한 줄씩 설명해야 합니다:
* **제안 사유:** 박스 사용 요건(강조/조작/상태/밀도) 중 어느 것에 해당하는가?
* **대체 수단:** 박스를 사용하지 않은 섹션은 어떻게 구분했는가? (디바이더, 여백 등)
* **박스 개수:** 화면 내 Strong Box의 총 개수 확인 (2~3개 이하 유지).