📱 PULSE: AI Smart Reels Studio 통합 개발 명세서

문서 버전: v1.1 (Refined for Production)
작성자: PULSE 사고 엔진
목적: Antigravity(AI/Dev)가 본 문서를 바탕으로 **'외식업 사장님을 위한 AI 릴스 자동 생성 웹 애플리케이션'**을 구현할 수 있도록 상세 명세를 정의함.

1. 프로젝트 개요 및 UX 전략

1.1 핵심 가치 (Core Value)

Target: 마케팅 지식이 없고 바쁜 외식업 자영업자.

Concept: "편집 도구(Editor)"가 아닌 "영상 자판기(Vending Machine)".

Model: Kapwing (Product-to-Video) 방식 벤치마킹. 복잡한 타임라인 편집을 제거하고, 입력 즉시 결과물을 제공함.

1.2 UX 원칙 (Design Principles)

Zero Learning Curve: 튜토리얼 없이 직관적으로 사용 가능해야 한다.

3-Click Rule: [사진 업로드] → [옵션 클릭] → [생성 버튼] 단 3번의 클릭으로 끝낸다.

Wait = Process (Gamification): Gemini Veo의 긴 생성 시간(15~30초)을 지루한 대기가 아닌, "AI가 요리하는 과정"으로 시각화한다.

No Scroll Policy: 데스크탑 환경에서는 모든 과정이 한 화면(Viewport) 내에서 이루어져야 한다.

2. 시스템 아키텍처 및 데이터 흐름

2.1 데이터 흐름 (Data Flow - 3 Tier Architecture)

User: 이미지(1~3장) 업로드 + 분위기 선택.

Frontend (React): FormData 구성 → POST /api/video/generate 요청 (Spring Boot).

Main Backend (Spring Boot): 요청 수신, 사용자 인증 확인 → FastAPI로 요청 위임 (Proxy).

AI Server (FastAPI): 이미지 전처리 및 **Gemini Veo API** 호출.

Video Generation: 영상 생성 완료 시 S3 또는 로컬 스토리지에 저장.

Response: 최종 영상 URL 반환 (FastAPI → Spring Boot → React).

Frontend: 로딩 종료 → 결과 화면 전환 → <video> 태그 자동 재생.

2.2 API 인터페이스 (Contract)

Endpoint: POST /api/video/generate

Request (Multipart/Form-data):

files: 이미지 파일 배열 (Max 3)

category: cafe | sushi | bbq | snack

vibe: emotional | energetic | luxury

Response (JSON):

const [step, setStep] = useState('INPUT'); // 'INPUT' | 'GENERATING' | 'RESULT'
const [images, setImages] = useState([]); // File Objects
const [options, setOptions] = useState({ category: 'cafe', vibe: 'emotional' });
const [videoUrl, setVideoUrl] = useState(null);
const [logs, setLogs] = useState([]); // 로딩 로그 배열

4.2 주요 컴포넌트 구조

SmartReelStudio.jsx: 전체 로직을 관장하는 메인 페이지.
InputSection.jsx: 이미지 업로더(Dropzone) + 옵션 칩(Chips).
LoadingSection.jsx: 로딩 애니메이션 + 로그 롤링 로직.
ResultSection.jsx: 비디오 플레이어 + 다운로드 버튼 핸들러.

4.3 핵심 로직 (Core Logic)

타임아웃 처리: fetch 요청 시 AbortController를 사용하여 120초 타임아웃 설정 (Veo 생성 시간 고려).
이미지 리사이징: 업로드 전 브라우저 단에서 이미지를 압축(Max width 1080px)하여 전송 속도 최적화.

4.4 스타일 가이드 (Tailwind CSS - Design Guide v1.2 준수)

Primary Color: **bg-[#002B7A]** (신뢰감).
Action Color: **bg-[#FF5A36CC]** (행동 유도).
Font: font-sans (Pretendard).
Radius: `rounded-[24px]` (컨테이너), `rounded-xl` (카드).

5. 백엔드 연동 체크리스트 (Spring Boot & FastAPI)

CORS: 프론트엔드 도메인 허용.
Static Mount: 생성된 영상 파일 접근 권한 설정.
Blocking 방지: 비동기 처리 필수.
File Naming: UUID 적용.

6. 개발자 제언 (To Antigravity)

우선순위: 화려한 디자인보다 "매끄러운 로딩 경험" 구현에 집중하십시오.
모바일 테스트: 반응형 레이아웃 확인 필수.
프롬프트 최적화: 백엔드에서 category, vibe를 받아 최적화된 프롬프트 템플릿에 주입하는 방식을 권장합니다.