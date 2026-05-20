/**
 * mapInsightApi.js
 * 지도 상권 분석 요약 데이터를 백엔드에 전달하고, AI 마케팅 제안을 받아오는 API 클라이언트
 * 
 * [설계 구조 (프론트 주도형)]
 * 1. 프론트엔드가 카카오맵 API로 수집/계산한 상권 요약 데이터(marketSummary)를 백엔드에 POST로 전송
 * 2. 백엔드는 해당 요약 데이터를 기반으로 LLM을 돌려 마케팅 액션(행동 제안)만 반환
 * 3. 백엔드 통신 실패 시 프론트 자체 Fallback 액션 반환
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/**
 * 프론트가 분석한 상권 요약본을 보내고 AI 행동 제안을 받아오는 함수
 * 
 * @param {Object} payload
 * @param {number} payload.latitude  - 중심 위도
 * @param {number} payload.longitude - 중심 경도
 * @param {number} payload.radius    - 분석 반경 (m)
 * @param {string} payload.category  - 내 업종 (기본 FD6) (이것은 카카오api 에서 공식적으로 사용하는 업종 그룹 코드)
 * @param {Object} payload.marketSummary - 프론트에서 계산한 상권 요약 데이터
 * @param {number} payload.marketSummary.competitionTotal - 반경 내 동종 업소 수
 * @param {number} payload.marketSummary.densityPerKm2    - km²당 밀집도
 * @param {number} payload.marketSummary.anchorScore      - 앵커 시설(지하철, 학교 등) 점수
 * @param {string} payload.marketSummary.anchorType       - 앵커 유형 (예: "역세권형")
 * 
 * @returns {Promise<Array>} - AI가 추천하는 마케팅 액션 배열 반환
 */
export async function fetchAiMarketingActions(payload) {
    const endpoint = `${API_BASE_URL}/api/v1/map-insight/actions`;

    try {
        // 실제 환경에서는 Authorization 토큰 등을 헤더에 추가합니다.
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${localStorage.getItem('token')}` // 향후 추가
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`API 응답 에러 (Status: ${response.status})`);
        }

        const data = await response.json();
        
        // 백엔드가 성공적으로 AI 행동 제안 배열을 내려준 경우
        if (data.status === 'SUCCESS' && Array.isArray(data.data?.aiMarketingActions)) {
            return data.data.aiMarketingActions;
        } else {
            throw new Error('올바르지 않은 API 응답 포맷 (aiMarketingActions 배열 없음)');
        }

    } catch (error) {
        console.warn('[mapInsightApi] AI 행동제안을 가져오는데 실패했습니다. 기본(Fallback) 액션을 반환합니다.', error);
        
        // ----------------------------------------------------
        // [Fallback] 백엔드 미지원 시 프론트 요약 데이터를 기반으로 임시 액션 반환
        // ----------------------------------------------------
        const { marketSummary } = payload;
        const isHighlyCompetitive = marketSummary?.competitionTotal >= 30;
        const isTransitOriented = marketSummary?.anchorType === '역세권형';

        const fallbackActions = [];

        if (isHighlyCompetitive) {
            fallbackActions.push({
                title: "[AI 대기] 동종 경쟁 심화 방어",
                why: `반경 내 비슷한 가게가 ${marketSummary.competitionTotal}개나 있습니다. 확실한 차별화가 필요해요.`,
                todo: ["우리 가게만의 핵심 장점(USP) 1줄로 정리하기", "매력적인 메뉴 사진 재촬영"],
                cta: { label: "USP 문구 생성하기", action: "OPEN_COPY_GENERATOR", payload: { type: "usp" } }
            });
        } else {
            fallbackActions.push({
                title: "[AI 대기] 신규 고객 집중 유입",
                why: "경쟁이 적은 상권입니다. 점유율을 끌어올리기 좋은 기회예요.",
                todo: ["배달 반경 확대하기", "시그니처 메뉴 홍보글 작성하기"],
                cta: { label: "홍보글 템플릿", action: "OPEN_CONTENT_BUILDER", payload: { theme: "signature" } }
            });
        }

        if (isTransitOriented) {
            fallbackActions.push({
                title: "[AI 대기] 퇴근길 직장인 타겟팅",
                why: "역세권 상권이라 대중교통 이용객 유입이 매우 유리합니다.",
                todo: ["퇴근 시간대 타임 세일 걸어두기", "포장하기 편한 동선 마련하기"],
                cta: { label: "타임세일 쿠폰 만들기", action: "OPEN_CONTENT_BUILDER", payload: { theme: "commute" } }
            });
        } else {
            fallbackActions.push({
                title: "[AI 대기] 지역 주민 단골 만들기",
                why: "주민분들이 걸어서 편하게 찾아오기 좋은 위치입니다.",
                todo: ["가족 단위 손님을 위한 리뷰 이벤트 준비", "재방문 쿠폰 발급하기"],
                cta: { label: "리뷰 이벤트 만들기", action: "OPEN_COPY_GENERATOR", payload: { type: "review" } }
            });
        }

        return fallbackActions.slice(0, 2); // 2개만 반환
    }
}
