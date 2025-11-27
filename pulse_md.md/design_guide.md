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
* **Vertical Space:** `h-full`, `flex-1`, `min-h-0` 등의 유틸리티를 활용하여 수직 공간을 꽉 채우되, 내부 스크롤이 발생하지 않도록 설계합니다.
* **Reason:** 바쁜 자영업자가 한눈에 모든 정보를 파악하고 즉시 행동할 수 있도록 하기 위함입니다.

### 📐 3-Column Layout (분석 화면 표준)
* **Left (25%):** Identity & Key Stats (고정 정보)
* **Center (45%):** Deep Analysis & Charts (시각화 정보)
* **Right (30%):** AI Chat & Interaction (대화형 정보)

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
*   **Notification Icon:**
    *   Style: White Bg, Rounded-xl, Shadow-sm
    *   Icon: Bell (22px, Primary Color)
    *   Badge: Point Color (`#FF5A36`) Dot

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

---

## 6. Assets (에셋)

### 🖼️ Logo Files
* **Main Logo:** `/public/PULSE_LOGO.png` (웹사이트 로고, 사이드바 상단)
* **Favicon:** `/public/favicon.png` (브라우저 탭 아이콘)
* **Note:** 모든 로고 파일은 `PULSE_LOGO.png`를 원본으로 사용하며, 배경이 투명해야 합니다.