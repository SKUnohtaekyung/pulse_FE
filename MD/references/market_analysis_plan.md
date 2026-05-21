# 주변 상권 분석 페이지 구현 계획 (Kakao Map JS API 기반)

> 대상: AI Agent / 백엔드 개발자 / 프론트엔드 개발자  
> 화면 참고: 첨부 이미지(대시보드 내 “주변 상권 분석” 페이지)  
> 핵심 입력: **회원가입/로그인 시 저장한 “가게 주소”**  
> 핵심 출력: **지도 + 반경 내 상권 데이터(카테고리/경쟁/앵커) + 실행 액션 3개**

---

## 0) JS API 키 (필수)
- **Kakao Map JavaScript 키**: `d1da9dd2848f73ded20a8263501cfce1`

### 보안/운영 주의
- 키는 레포에 하드코딩하지 말고 `.env`/배포 환경변수로 주입 권장
- 카카오 개발자 콘솔에서 **플랫폼(웹) 도메인 등록**을 하지 않으면 지도 로딩이 실패할 수 있음

---

## 1) 이 기획의 의도 + UI/UX 레이아웃 제안

### 1.1 기획 의도 (사용자 가치)
이 페이지는 “데이터 나열”이 아니라, 사장님이 **바로 의사결정**하도록 돕는 목적이다.

- **내 가게 기준 반경 안에 뭐가 얼마나 있는지**(경쟁/기회) 빠르게 파악
- “유동인구”처럼 구하기 어려운 지표 대신, 구현 가능한 데이터로 **유입 요인(앵커)**을 추정
- 마지막엔 반드시 **이번 주 실행 액션 3개**를 제시해 “그래서 뭘 하지?”를 제거

---

### 1.2 최적 레이아웃 (첨부 UI에 자연스럽게 삽입)
첨부 화면은 좌측 고정 사이드바 + 상단 헤더 + 중앙 큰 카드 구조다.  
따라서 메인 카드 내부를 아래처럼 분할하는 구성이 가장 안전하다.

#### A안 (권장): “지도 중심 + 우측 요약 패널”
- **좌측(70%)**: 지도 (Store Marker + 반경 Circle + 카테고리 레이어 마커)
- **우측(30%)**: 요약 패널 (스크롤 가능)
  - (1) 상권 스냅샷 카드 (총량/Top 카테고리/반경)
  - (2) 경쟁 분석 카드 (내 업종 동종 수 + 가까운 경쟁 TOP N)
  - (3) 앵커 점수 카드 (역/학교/병원 등)
  - (4) 이번 주 액션 3개 (CTA 버튼 포함)

#### B안: “지도 전체 + 하단 드로어(요약)”
- 지도 몰입감을 높이고 싶을 때
- 우측 패널 대신 하단 드로어로 요약/리스트 표시

> MVP는 **A안**이 개발/유지보수/가독성 면에서 유리.

---

### 1.3 주요 인터랙션 (MVP)
- 반경 선택: `300m / 500m / 1km`
  - 선택 즉시 Circle 변경 + 데이터 재조회/재집계
- 레이어 토글:
  - 음식점(FD6), 카페(CE7), 편의점(CS2), 병원(HP8), 약국(PM9), 지하철역(SW8), 학교(SC4), 학원(AC5)
- 리스트 ↔ 지도 연동:
  - 우측 “가까운 경쟁 TOP N” 클릭 시 해당 마커 강조 + 지도 panTo
- 오류 상태:
  - 지도 로딩 실패 / 데이터 조회 실패 시 “재시도” 버튼 제공

---

## 2) 구현 범위 (무조건 구현 가능한 기능만)

### 2.1 필수 데이터 파이프라인
1. **가게 주소(회원 정보)** 확보  
2. **주소 → 좌표(위경도)** 변환  
3. 지도 센터링 + 가게 마커 표시  
4. 반경 내 카테고리 데이터 조회(카카오 Places)  
5. 집계(카운트/밀도/점수) + 액션 추천(JSON) 생성  
6. 지도/패널 렌더

---

### 2.2 “REST 키 없이도” 가능한 이유 (중요)
현재 제공된 키는 **JS Map 키**이며, Kakao Maps JS SDK의 `services(Places)` 기능을 사용하면 **프론트에서 카테고리 검색/키워드 검색**이 가능하다.

- 장점: REST 키가 없어도 MVP 구현 가능
- 단점: 호출 제어/캐싱/보안은 백엔드 프록시보다 약함 (그래도 대학생 수준 MVP엔 충분)

> 운영 단계(V1.1)에서는 REST 키를 백엔드에 두고 프록시/캐시를 두는 구조로 확장 가능.

---

## 3) 시스템 구성(권장 아키텍처)

### 3.1 MVP 아키텍처 (가장 단순)
- **Backend**
  - 로그인/회원정보(가게 주소, 업종) 제공
  - (선택) 주소→좌표 변환(지오코딩)도 백엔드에서 처리 가능
- **Frontend**
  - Kakao Map JS SDK로 지도 렌더
  - Places(Category Search)로 반경 내 데이터 조회
  - 집계/분석/추천은 프론트에서 계산 가능 (또는 백엔드에 위임)

### 3.2 확장 아키텍처 (운영 친화)
- Backend가 카카오 Local REST를 프록시 호출(REST 키 보관)
- Redis 캐시로 쿼터/속도 안정화
- 프론트는 `/api/market/*`만 호출

---

## 4) API 명세서 (우리 서비스 API)

> 공통 응답 포맷
```json
{
  "success": true,
  "data": {},
  "error": null
}
```

### 4.1 내 가게 정보 조회
**GET** `/api/v1/me/store`

**Response 200**
```json
{
  "success": true,
  "data": {
    "storeId": "store_001",
    "storeName": "범계 로데오점",
    "address": "경기도 안양시 동안구 ...",
    "lat": 37.0000,
    "lng": 127.0000,
    "primaryCategoryGroupCode": "FD6"
  },
  "error": null
}
```

---

### 4.2 내 가게 주소 업데이트 (선택: 재지오코딩 포함)
**PATCH** `/api/v1/me/store`

**Request**
```json
{
  "storeName": "범계 로데오점",
  "address": "경기도 안양시 동안구 ..."
}
```

**Response 200**
```json
{
  "success": true,
  "data": {
    "storeId": "store_001",
    "storeName": "범계 로데오점",
    "address": "경기도 안양시 동안구 ...",
    "lat": 37.0000,
    "lng": 127.0000
  },
  "error": null
}
```

**오류**
- 422: 주소를 좌표로 변환 실패(지오코딩 결과 없음)

---

### 4.3 상권 분석 요약 (메인 패널용)
**GET** `/api/v1/market/summary?radius=500`

- `radius`: 300 | 500 | 1000 (m)

**Response 200**
```json
{
  "success": true,
  "data": {
    "center": { "lat": 37.0, "lng": 127.0 },
    "radius": 500,
    "generatedAt": "2026-02-16T07:00:00Z",

    "counts": {
      "FD6": { "label": "음식점", "total": 120 },
      "CE7": { "label": "카페", "total": 45 },
      "CS2": { "label": "편의점", "total": 8 },
      "HP8": { "label": "병원", "total": 12 },
      "PM9": { "label": "약국", "total": 6 },
      "SW8": { "label": "지하철역", "total": 2 },
      "SC4": { "label": "학교", "total": 3 },
      "AC5": { "label": "학원", "total": 14 }
    },

    "competition": {
      "categoryGroupCode": "FD6",
      "label": "내 업종(음식점)",
      "total": 120,
      "densityPerKm2": 152.8,
      "nearest": [
        {
          "id": "place_26338954",
          "name": "경쟁가게A",
          "distanceM": 120,
          "lat": 37.0,
          "lng": 127.0,
          "address": "…",
          "phone": "…",
          "url": "http://place.map.kakao.com/26338954"
        }
      ]
    },

    "anchors": {
      "score": 11,
      "typeLabel": "역세권형",
      "breakdown": [
        { "categoryGroupCode": "SW8", "label": "지하철역", "count": 2, "weight": 3 },
        { "categoryGroupCode": "SC4", "label": "학교", "count": 3, "weight": 2 }
      ]
    },

    "actions": [
      {
        "title": "퇴근 타임 공략",
        "why": "지하철역 기반 유입 가능성이 큼",
        "todo": ["18~20시 세트 노출", "포장/대기 동선 문구 추가"],
        "cta": { "label": "콘텐츠 아이디어 만들기", "action": "OPEN_CONTENT_BUILDER", "payload": { "theme": "commute" } }
      },
      {
        "title": "동종 경쟁 과열 대응",
        "why": "반경 내 동종 업소 수가 많음",
        "todo": ["대표 메뉴 1개 USP 고정", "가격 앵커 1개 만들기"],
        "cta": { "label": "USP 문구 생성", "action": "OPEN_COPY_GENERATOR", "payload": { "type": "usp" } }
      },
      {
        "title": "지도/탐색 유입 최적화",
        "why": "탐색 기반 유입을 놓치기 쉬움",
        "todo": ["영업시간 최신화", "대표 사진/메뉴명 정리"],
        "cta": { "label": "체크리스트 보기", "action": "OPEN_CHECKLIST", "payload": { "id": "map_seo" } }
      }
    ],

    "note": "counts.total은 카카오 검색 결과 기반 추정치이며, 지도에는 일부 결과만 마커로 표시됩니다."
  },
  "error": null
}
```

---

### 4.4 레이어(마커) 데이터 조회 (토글용)
**GET** `/api/v1/market/places?radius=500&categoryGroupCode=CE7&page=1&size=15&sort=distance`

- `categoryGroupCode`: FD6/CE7/CS2/HP8/PM9/SW8/SC4/AC5 …
- `size`: 1~15 권장(마커 과다 방지)

**Response 200**
```json
{
  "success": true,
  "data": {
    "categoryGroupCode": "CE7",
    "label": "카페",
    "radius": 500,
    "meta": { "total": 45, "page": 1, "size": 15, "isEnd": false },
    "places": [
      { "id": "26338954", "name": "카페A", "lat": 37.5120, "lng": 127.0590, "distanceM": 418, "address": "…", "roadAddress": "…", "phone": "…", "url": "http://place.map.kakao.com/26338954" }
    ]
  },
  "error": null
}
```

---

### 4.5 설정/카테고리 구성 조회 (권장: 프론트 하드코딩 방지)
**GET** `/api/v1/market/config`

**Response 200**
```json
{
  "success": true,
  "data": {
    "radiusOptions": [300, 500, 1000],
    "layerCategories": [
      { "code": "FD6", "label": "음식점", "defaultOn": true },
      { "code": "CE7", "label": "카페", "defaultOn": true },
      { "code": "CS2", "label": "편의점", "defaultOn": false },
      { "code": "SW8", "label": "지하철역", "defaultOn": false },
      { "code": "SC4", "label": "학교", "defaultOn": false },
      { "code": "AC5", "label": "학원", "defaultOn": false },
      { "code": "HP8", "label": "병원", "defaultOn": false },
      { "code": "PM9", "label": "약국", "defaultOn": false }
    ],
    "anchorWeights": {
      "SW8": 3,
      "SC4": 2,
      "AC5": 2,
      "HP8": 1
    }
  },
  "error": null
}
```

---

## 5) 프론트 구현 가이드 (Kakao Map JS + Places)

### 5.1 지도 스크립트 로드
- `services` 라이브러리를 포함해야 Places 검색 사용 가능
```html
<script src="//dapi.kakao.com/v2/maps/sdk.js?appkey=d1da9dd2848f73ded20a8263501cfce1&libraries=services"></script>
```

### 5.2 핵심 플로우
1. `/api/v1/me/store`로 가게 좌표 수신  
2. 지도 생성(center=store lat/lng), store marker 표시  
3. 반경 circle 표시(기본 500m)  
4. 요약/레이어 데이터 호출
   - MVP 단순형: 프론트에서 Places 조회 후 즉시 집계  
   - 권장형: `/api/v1/market/summary`, `/api/v1/market/places` 호출

### 5.3 마커 수 제한 UX
- 지도에는 `places`의 상위 N개(예: 50개)만 표시
- 나머지는 “총 개수”로만 보여 주기 (패널 counts.total)

---

## 6) 계산식/추천 룰 (MVP 기준, 완전 구현 가능)

### 6.1 경쟁 밀도
- 면적(km²) = π × (radius_m/1000)²  
- 밀도 = `competition.total / area`

### 6.2 앵커 점수
- 점수 = Σ(count(code) × weight(code))  
- 타입 라벨 예시
  - SW8 ≥ 1 → “역세권형”
  - (SC4 + AC5) ≥ 8 → “학원가형”
  - 앵커 점수 낮고 FD6/CE7만 높음 → “생활형(앵커 약함)”

### 6.3 액션 추천(예시 룰)
- 경쟁 total 높음 → USP/대표 메뉴 집중/가격 앵커  
- 역/환승(앵커) 있음 → 출퇴근 타임 숏폼/포장 동선 강조  
- 학원가형 → 간식/테이크아웃/하교 시간 타겟

---

## 7) Mock Data (프론트 개발용) — **AI Agent 필수 사용 포맷**

> 파일 위치 예시: `src/mocks/market/…`  
> 아래 JSON은 그대로 복사해서 사용 가능

### 7.1 `mock_store.json`
```json
{
  "success": true,
  "data": {
    "storeId": "store_001",
    "storeName": "범계 로데오점",
    "address": "경기도 안양시 동안구 범계로 ...",
    "lat": 37.3900,
    "lng": 126.9510,
    "primaryCategoryGroupCode": "FD6"
  },
  "error": null
}
```

### 7.2 `mock_market_summary_500.json`
```json
{
  "success": true,
  "data": {
    "center": { "lat": 37.3900, "lng": 126.9510 },
    "radius": 500,
    "generatedAt": "2026-02-16T07:00:00Z",
    "counts": {
      "FD6": { "label": "음식점", "total": 132 },
      "CE7": { "label": "카페", "total": 41 },
      "CS2": { "label": "편의점", "total": 7 },
      "HP8": { "label": "병원", "total": 10 },
      "PM9": { "label": "약국", "total": 6 },
      "SW8": { "label": "지하철역", "total": 1 },
      "SC4": { "label": "학교", "total": 2 },
      "AC5": { "label": "학원", "total": 18 }
    },
    "competition": {
      "categoryGroupCode": "FD6",
      "label": "내 업종(음식점)",
      "total": 132,
      "densityPerKm2": 168.1,
      "nearest": [
        { "id": "26338954", "name": "경쟁가게A", "distanceM": 115, "lat": 37.3908, "lng": 126.9517, "address": "…", "phone": "…", "url": "http://place.map.kakao.com/26338954" },
        { "id": "99338421", "name": "경쟁가게B", "distanceM": 190, "lat": 37.3897, "lng": 126.9502, "address": "…", "phone": "…", "url": "http://place.map.kakao.com/99338421" }
      ]
    },
    "anchors": {
      "score": 9,
      "typeLabel": "역세권형",
      "breakdown": [
        { "categoryGroupCode": "SW8", "label": "지하철역", "count": 1, "weight": 3 },
        { "categoryGroupCode": "AC5", "label": "학원", "count": 18, "weight": 2 }
      ]
    },
    "actions": [
      { "title": "하교/학원 타임 공략", "why": "학원(18) 집중", "todo": ["16~19시 간식/세트 훅 제작", "테이크아웃 동선 안내"], "cta": { "label": "숏폼 훅 생성", "action": "OPEN_CONTENT_BUILDER", "payload": { "theme": "after_school" } } },
      { "title": "동종 경쟁 과열 대응", "why": "음식점 132개", "todo": ["대표 메뉴 1개에 USP 문장 고정", "사진 3장 리라이팅"], "cta": { "label": "USP 문구 생성", "action": "OPEN_COPY_GENERATOR", "payload": { "type": "usp" } } },
      { "title": "지도 탐색 유입 강화", "why": "근처 카페/음식점 탐색 수요", "todo": ["영업시간/휴무 정확화", "대표 메뉴명 키워드 포함"], "cta": { "label": "체크리스트 보기", "action": "OPEN_CHECKLIST", "payload": { "id": "map_seo" } } }
    ],
    "note": "Mock data: 카카오 검색 결과를 가정한 샘플입니다."
  },
  "error": null
}
```

### 7.3 `mock_market_places_CE7_p1.json`
```json
{
  "success": true,
  "data": {
    "categoryGroupCode": "CE7",
    "label": "카페",
    "radius": 500,
    "meta": { "total": 41, "page": 1, "size": 15, "isEnd": false },
    "places": [
      { "id": "10001", "name": "카페A", "lat": 37.3909, "lng": 126.9514, "distanceM": 120, "address": "…", "roadAddress": "…", "phone": "…", "url": "http://place.map.kakao.com/10001" },
      { "id": "10002", "name": "카페B", "lat": 37.3899, "lng": 126.9508, "distanceM": 210, "address": "…", "roadAddress": "…", "phone": "…", "url": "http://place.map.kakao.com/10002" }
    ]
  },
  "error": null
}
```

### 7.4 `mock_market_places_FD6_p1.json`
```json
{
  "success": true,
  "data": {
    "categoryGroupCode": "FD6",
    "label": "음식점",
    "radius": 500,
    "meta": { "total": 132, "page": 1, "size": 15, "isEnd": false },
    "places": [
      { "id": "20001", "name": "음식점A", "lat": 37.3902, "lng": 126.9512, "distanceM": 90, "address": "…", "roadAddress": "…", "phone": "…", "url": "http://place.map.kakao.com/20001" },
      { "id": "20002", "name": "음식점B", "lat": 37.3906, "lng": 126.9505, "distanceM": 160, "address": "…", "roadAddress": "…", "phone": "…", "url": "http://place.map.kakao.com/20002" }
    ]
  },
  "error": null
}
```

---

## 8) 화면 제작을 위해 “추가로 갖고와야 할 것” (요청 항목 + PM 추가)

### 8.1 사용자 요청 항목(필수)
- (1) 기획 의도 + 최적 레이아웃: **본 문서 1장**  
- (2) API 명세서 + Mockdata: **본 문서 4장/7장**  
- (3) JS API 키: **본 문서 0장**  
- (4) 화면 제작을 위해 가져와야 할 것: 아래 8.2~8.4

### 8.2 카카오 콘솔 설정 체크리스트(필수)
- 카카오 개발자 콘솔에서:
  - **웹 플랫폼 등록(도메인/로컬 개발 포함)**
  - **카카오맵 사용 설정** 확인
  - `libraries=services` 사용 가능 여부 확인(Places)

### 8.3 제품 입력값 정의(필수)
- 회원가입/가게 등록 시 **반드시 받아야 하는 필드**
  - 가게명(storeName)
  - 가게 주소(address)
  - 내 업종(primaryCategoryGroupCode: FD6/CE7 등 1개)
  - (선택) 전화번호/대표 이미지

### 8.4 UI 카피/표기 규칙(권장)
- “총 개수(total)”는 **추정치**임을 작은 안내문으로 표시(오해 방지)
- 데이터 기준:
  - `generatedAt` 표기
  - “반경 N m 기준” 고정 노출

### 8.5 QA 시나리오(필수)
- 주소가 모호한 케이스(검색 결과 0개/다중 결과)
- 반경 변경 반복 시 마커/원 정리(메모리 누수 방지)
- 레이어 토글 연속 클릭(요청 폭주 방지: debounce/throttle)
- 지도 스크립트 로딩 실패(도메인 미등록) 안내

### 8.6 운영/성능 준비(권장)
- 마커 최대 표시 수 제한(예: 50개)
- Places 호출 빈도 제한(레이어 토글 300ms 디바운스)
- (확장 시) 백엔드 캐시/레이트리밋 설계

---

## 9) Acceptance Criteria (완료 기준)
- 로그인 후 저장된 주소로 지도 중심이 이동하고, 가게 마커가 보인다.
- 반경(300/500/1000)을 바꾸면 원과 요약 데이터가 갱신된다.
- 카테고리 토글을 켜면 해당 마커가 지도에 표시된다.
- 우측 패널에 최소 3개 카드(스냅샷/경쟁/앵커) + 액션 3개가 항상 노출된다.
- 오류(지도 로드 실패/데이터 실패) 시 재시도 UX가 있다.

---

## 10) Self-Check
- 제공된 키는 “JS 지도 키”로 명시되었고, 본 문서는 **JS SDK + services(Places)** 기준으로 MVP가 가능하도록 설계했다.  
- 단, “주소→좌표 변환”을 프론트에서 처리할지(Places/지오코더 활용) 백엔드에서 처리할지는 팀의 보안/구조에 따라 달라질 수 있다.  
- 카카오 플랫폼 정책/쿼터/도메인 제한은 운영 단계에서 영향이 있을 수 있어, 배포 전 콘솔 설정과 실제 호출 테스트가 필요하다.
