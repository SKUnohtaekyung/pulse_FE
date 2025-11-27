# 🛠️ PULSE Technical Architecture

> **Project:** PULSE (외식업 자영업자 마케팅 자동화 플랫폼)
> **Architecture Type:** Microservices-oriented Architecture (Frontend / Main Backend / AI Server)

---

## 1. System Overview (시스템 개요)

PULSE는 사용자 경험을 담당하는 **React Frontend**, 비즈니스 로직을 처리하는 **Spring Boot API**, 그리고 데이터 수집 및 생성형 AI 작업을 전담하는 **FastAPI AI Server**로 구성된 3-Tier 아키텍처를 따릅니다.

### 🏗️ High-Level Architecture
전체 시스템은 크게 두 가지 핵심 파이프라인으로 작동합니다.
1.  **Review Analysis Pipeline:** 리뷰 수집 → 분석 → 페르소나/인사이트 도출
2.  **Content Generation Pipeline:** 이미지 업로드 → 영상 렌더링 → 숏폼(Reels) 생성

---

## 2. Tech Stack (기술 스택)

### 💻 Frontend (User Interface)
사용자(사장님)와 상호작용하는 웹 애플리케이션입니다.
* **Framework:** **React**
* **Role:**
    * 회원가입 및 가게 정보 입력 UI
    * 대시보드 렌더링 (분석 결과 시각화)
    * 사진 업로드 및 릴스 생성 요청
    * 최종 결과물(영상) 미리보기 제공

### ☕ Main Backend (API Gateway & Business Logic)
프론트엔드와 AI 서버 간의 중계 및 데이터 관리를 담당합니다.
* **Framework:** **Spring Boot**
* **Role:**
    * RESTful API 제공
    * 사용자 인증 및 가게 정보 관리
    * AI 서버로 분석/생성 요청 위임 (Proxy)
    * 최종 결과 데이터(JSON/MP4 URL) 응답

### 🐍 AI & Data Server (Core Engine)
무거운 데이터 처리, 크롤링, AI 모델링, 영상 생성을 수행합니다.
* **Framework:** **FastAPI (Python)**
* **Data Collection:** **Playwright** (네이버/카카오맵 리뷰 크롤링)
* **NLP & Analysis:**
    * **Kiwi:** 한국어 형태소 분석
    * **BERTopic:** 리뷰 주제 군집화 (Clustering)
* **Generative AI:**
    *   **LLM:** **Gemini / GPT** (키워드 기반 페르소나 및 인사이트 생성)
    *   **Video:** **Gemini Veo API** (이미지 기반 릴스 생성)
* **Video Processing:** **FFmpeg** (최종 포맷 변환 및 메타데이터 처리)

### 💾 Database
데이터의 성격에 따라 관계형과 비관계형 데이터베이스를 혼용합니다.
* **MySQL:** 정형 데이터 저장 (사용자 정보, 가게 기본 정보, 영상 URL 등)
* **MongoDB:** 비정형 데이터 저장 (수집된 원본 리뷰 데이터, 분석 로그 등)

---

## 3. Data Flow & Pipelines (데이터 흐름)

### 🔄 A. 사용자 등록 및 초기 설정
1.  **회원가입 & 가게 URL 입력:** 사용자가 React 프론트엔드에서 정보를 입력합니다.
2.  **가게 정보 저장:** Spring Boot가 MySQL에 해당 정보를 저장하고 관리합니다.

### 📊 B. 리뷰 분석 파이프라인 (Review Analysis)
사장님이 '분석'을 요청하면 실행되는 프로세스입니다.

1.  **분석 요청:** React → Spring Boot (`POST /api/analysis`) → FastAPI로 전달.
2.  **데이터 수집 (Crawling):**
    * FastAPI의 **Playwright**가 네이버/카카오맵에서 리뷰 데이터를 수집합니다.
    * 수집된 **Raw Reviews**는 **MongoDB**에 저장됩니다.
3.  **전처리 및 분석 (NLP):**
    * **Kiwi**로 형태소를 분석하고 불용어를 제거합니다.
    * **BERTopic**을 통해 리뷰를 의미론적 그룹(Topic)으로 군집화합니다.
4.  **AI 인사이트 생성 (LLM):**
    * 추출된 키워드와 클러스터 정보를 **LLM(Gemini/GPT)**에 프롬프트로 주입합니다.
    * **결과:** 페르소나(Persona) 및 마케팅 인사이트가 담긴 **JSON** 데이터가 생성됩니다.
5.  **결과 반환:** FastAPI → Spring Boot → React (대시보드 렌더링).

### 🎬 C. 숏폼 영상 생성 파이프라인 (Smart Reels Studio)
사장님이 사진을 업로드하고 영상을 요청하면 실행되는 프로세스입니다.

1.  **생성 요청:** React → Spring Boot (사진 업로드) → FastAPI (`POST /api/video`).
2.  **AI 영상 생성 (Generative AI):**
    * FastAPI가 전송받은 이미지와 선택된 옵션(Category, Vibe)을 **Gemini Veo API**에 전송합니다.
    * AI가 이미지의 맥락을 이해하고, 선택된 분위기에 맞는 숏폼 영상을 생성합니다.
3.  **MP4 Output:** 최종 결과물인 `.mp4` 파일이 생성됩니다.
4.  **URL 반환:** 영상 파일의 경로(URL)가 Spring Boot를 통해 React로 전달됩니다.
5.  **미리보기:** 프론트엔드에서 생성된 영상을 즉시 재생합니다.

---

## 4. Database Schema Strategy (데이터 저장 전략)

### 🏗️ PULSE 2.0 Database Schema
**변경사항:** 약관 테이블 제거 -> 유저 테이블에 컬럼으로 통합

```dbml
// ==========================================
// PULSE 2.0 데이터베이스 설계 (최종 수정본)
// 변경사항: 약관 테이블 제거 -> 유저 테이블에 컬럼으로 통합
// ==========================================

// ------------------------------------------
// 1. 회원 및 인증 (Users & Auth)
// ------------------------------------------

Table users {
  사용자_ID bigint [pk, increment, note: "User PK"]
  이메일 varchar(100) [unique, not null, note: "로그인 ID"]
  비밀번호 varchar(255) [not null, note: "암호화 저장"]
  사용자_이름 varchar(50) [not null]
  휴대폰_번호 varchar(20)
  
  이메일_인증여부 boolean [default: false, note: "true여야 로그인 가능"]
  개인정보_동의여부 boolean [default: true, note: "가입 시 체크박스 값"]
  
  가입일시 timestamp [default: `now()`]
  
  note: "약관 동의 내역을 여기서 바로 관리"
}

Table email_verifications {
  인증_ID bigint [pk, increment]
  이메일 varchar(100) [not null]
  인증번호 varchar(6) [not null, note: "숫자 6자리"]
  만료시간 timestamp [not null, note: "3분 제한"]
  인증성공여부 boolean [default: false]
  
  note: "이메일 인증번호 발송/확인 내역"
}

// ------------------------------------------
// 2. 가게 정보 (Stores)
// ------------------------------------------

Table stores {
  가게_ID bigint [pk, increment]
  사용자_ID bigint [ref: > users.사용자_ID, note: "사장님 연결"]
  
  가게명 varchar(100) [not null, note: "회원가입 시 입력"]
  가게_주소 varchar(255) [not null, note: "회원가입 시 입력"]
  
  // 가입 후 분석 요청 시 입력 (빈 값 허용)
  가게_URL varchar(500) [null, note: "네이버/카카오 지도 URL"]
  플랫폼_타입 varchar(20) [null, note: "NAVER 또는 KAKAO"]
  업종_카테고리 varchar(50) [null, note: "한식, 카페 등"]
  
  등록일시 timestamp [default: `now()`]
}

// ------------------------------------------
// 3. 리뷰 분석 (Understanding Loop)
// ------------------------------------------

Table analysis_jobs {
  분석작업_ID bigint [pk, increment]
  가게_ID bigint [ref: > stores.가게_ID]
  
  진행상태 varchar(20) [note: "대기중, 분석중, 완료, 실패"]
  에러메시지 text
  시작일시 timestamp
  완료일시 timestamp
  
  note: "AI 분석 요청 상태 관리 (비동기)"
}

Table insights {
  인사이트_ID bigint [pk, increment]
  분석작업_ID bigint [ref: - analysis_jobs.분석작업_ID]
  가게_ID bigint [ref: > stores.가게_ID]
  
  니즈_요약 text [note: "손님이 원하는 것 (Card 1)"]
  불만_요약 text [note: "손님의 불만사항 (Card 2)"]
  전략_제안 text [note: "마케팅 전략 (Card 3)"]
  
  페르소나_이름 varchar(50) [note: "예: 깐깐한 미식가"]
  페르소나_특징 text [note: "JSON 형태 저장 권장"]
  
  생성일시 timestamp
}

// ------------------------------------------
// 4. 릴스 생성 (Creation Loop)
// ------------------------------------------

Table video_jobs {
  영상작업_ID bigint [pk, increment]
  가게_ID bigint [ref: > stores.가게_ID]
  인사이트_ID bigint [ref: > insights.인사이트_ID]
  
  업종_카테고리 varchar(50) [note: "cafe, sushi, bbq, snack"]
  분위기_바이브 varchar(50) [note: "emotional, energetic, luxury"]
  진행상태 varchar(20) [note: "생성중, 완료"]
  생성일시 timestamp
}

Table video_assets {
  자산_ID bigint [pk, increment]
  영상작업_ID bigint [ref: > video_jobs.영상작업_ID]
  파일_URL varchar(500) [note: "업로드한 사진 주소"]
  순서 int [note: "1, 2, 3번째"]
}

Table reels {
  릴스_ID bigint [pk, increment]
  영상작업_ID bigint [ref: - video_jobs.영상작업_ID]
  가게_ID bigint [ref: > stores.가게_ID]
  
  최종_영상_URL varchar(500) [note: "생성된 MP4 주소"]
  스크립트_내용 text [note: "영상 문구"]
  썸네일_URL varchar(500)
  
  생성일시 timestamp
}

// ------------------------------------------
// 5. 성과 대시보드 (Action Loop)
// ------------------------------------------

Table daily_metrics {
  지표_ID bigint [pk, increment]
  가게_ID bigint [ref: > stores.가게_ID]
  날짜 date [not null]
  
  조회수 int [default: 0]
  좋아요수 int [default: 0]
  저장수 int [default: 0]
}

Table action_suggestions {
  제안_ID bigint [pk, increment]
  가게_ID bigint [ref: > stores.가게_ID]
  관련_지표_ID bigint [ref: > daily_metrics.지표_ID]
  
  제안_내용 varchar(255) [note: "AI 조언"]
  수행_여부 boolean [default: false]
  
  생성일시 timestamp
}
```

---

## 5. API Interface (Summary)

| Direction | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **FE ↔ BE** | `POST` | `/api/users/store` | 가게 정보 등록 |
| **FE ↔ BE** | `GET` | `/api/dashboard/{id}` | 분석 완료된 대시보드 데이터 조회 |
| **FE ↔ BE** | `POST` | `/api/analysis/request` | 리뷰 분석 시작 요청 |
| **FE ↔ BE** | `POST` | `/api/video/generate` | 릴스 생성 요청 (이미지 포함) |
| **BE ↔ AI** | `POST` | `/internal/crawl` | AI 서버에 크롤링 명령 |
| **BE ↔ AI** | `POST` | `/internal/render` | AI 서버에 영상 렌더링 명령 |