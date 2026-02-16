# PULSE Project Changelog (변경 이력)
> 이 파일은 PULSE 프로젝트의 개발 진행 상황, 주요 업데이트 내역, 그리고 버그 수정 사항을 기록합니다.

## 2026-02-16

###  New Features (새로운 기능)
*   **Commercial Analysis Redesign:** 상권 분석 페이지 UI/UX 전면 개편.
    *   **Full-Height Map:** 지도를 컨테이너 전체 높이로 확장하여 시각적 개방감 확보.
    *   **Floating Search Bar:** 검색 바를 지도 위 오버레이('absolute') 형태로 변경하여 접근성 향상.
    *   **Layout Optimization:** 좌측 지도(60%) / 우측 분석 패널(40%) 구조 정립.
    *   **Category Toggle:** 카테고리 필터 위치 조정('top-20')으로 UI 겹침 방지.
*   **Search Functionality:**
    *   **Kakao Local API:** 키워드 검색 및 자동완성 기능 구현.
    *   **User Location:** Geolocation API 기반 '내 위치 찾기' 기능 추가.
*   **Summary Panel:**
    *   **Smart Header:** 패널 헤더를 내부 스크롤 영역에 통합하여 공간 효율성 개선.
    *   **Mock Data:** 상권 데이터 연동 준비를 위한 Mock 데이터 및 로딩 상태 구현.

###  Bug Fixes (버그 수정)
*   **UI Overlap:** 검색 바와 반경 선택 토글이 겹치는 현상을 높이 통일 및 위치 조정으로 해결.
*   **Layout:** 상단 헤더 영역 제거로 인한 지도 상단 여백 문제 해결.
