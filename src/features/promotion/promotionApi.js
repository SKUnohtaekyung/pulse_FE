/**
 * 홍보 영상 만들기 API 서비스
 * POST /api/info/generate
 *
 * API 연결이 안될 때는 목업데이터를 반환하고,
 * 연결될 때는 실제 API 응답을 반환합니다.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// ─── localStorage 키 (앱 전체에서 동일한 키를 사용해야 함) ──────────────────
// ⚠️ 백엔드 연결 시: 실제 JWT 토큰을 저장하는 키로 변경 필요
// 현재 mock 로그인은 'user' 키에 사용자 정보를 저장함 (LoginForm.jsx 참고)
const AUTH_TOKEN_KEY = 'accessToken'; // 실제 토큰 키 (백엔드 연결 후 확인 필요)

// ─── 목업 데이터 (API 연결 실패 시 fallback) ───────────────────────────────
const MOCK_RESPONSE = {
    status: 'success',
    data: {
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-coffee-pouring-into-a-cup-in-slow-motion-4288-large.mp4',
        videoTitle: '☕️ 시그니처 라떼의 유혹',
        hashtags: ['#카페', '#시그니처라떼', '#오늘의커피', '#감성카페'],
        generationTime: '5.2s'
    }
};

// 목업 지연 시뮬레이션 (8초) - API 없을 때만 사용, 로딩 UX 유지용
const MOCK_DELAY_MS = 8000;

/**
 * vibe ID → API style 파라미터 변환
 * - energetic → "energy"
 * - luxury    → "premium"
 * - emotional → "mood"
 */
const VIBE_TO_STYLE = {
    energetic: 'energy',
    luxury: 'premium',
    emotional: 'mood'
};

/**
 * qualityMode → API mode 파라미터 변환
 * - standard → "standard"
 * - pro       → "standard_fast" (현재 pro는 잠금 상태이므로 standard_fast)
 */
const QUALITY_TO_MODE = {
    standard: 'standard',
    pro: 'standard_fast'
};

/**
 * 홍보 영상 생성 API 호출
 *
 * @param {Object} params
 * @param {string} params.target      - 타겟 손님 (예: "30대 직장인 남성")
 * @param {string} params.concept     - 영상 컨셉 (예: "속쉬에 찌든 직장인이...")
 * @param {string} params.mode        - 생성 모드 ("standard" | "standard_fast")
 * @param {string} params.style       - 영상 스타일 ("energy" | "premium" | "mood")
 * @param {File}   params.imageFile   - 업로드할 이미지 파일
 *
 * @returns {Promise<{ videoUrl, videoTitle, hashtags, generationTime }>}
 */
export async function generatePromotionVideo({ target, concept, mode, style, imageFile }) {
    // API Base URL이 없으면 목업 데이터 반환 (개발 환경)
    if (!API_BASE_URL) {
        console.warn('[promotionApi] VITE_API_BASE_URL 미설정 → 목업 데이터 반환');
        await new Promise(resolve => setTimeout(resolve, MOCK_DELAY_MS));
        return MOCK_RESPONSE.data;
    }

    try {
        // ⚠️ 백엔드 연결 시 실제 토큰 키 확인 필요 (AUTH_TOKEN_KEY 참고)
        const token = localStorage.getItem(AUTH_TOKEN_KEY);

        const formData = new FormData();
        formData.append('target', target);
        formData.append('concept', concept);
        formData.append('mode', mode);
        formData.append('style', style);
        if (imageFile) {
            formData.append('image', imageFile);
        }

        const response = await fetch(`${API_BASE_URL}/api/info/generate`, {
            method: 'POST',
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {})
                // Content-Type은 FormData 사용 시 자동으로 multipart/form-data로 설정됨
            },
            body: formData
        });

        if (!response.ok) {
            console.warn(`[promotionApi] 응답 오류 (${response.status}) → 목업 데이터 대체`);
            await new Promise(resolve => setTimeout(resolve, MOCK_DELAY_MS));
            return MOCK_RESPONSE.data;
        }

        const json = await response.json();

        if (json.status !== 'success' || !json.data) {
            console.warn('[promotionApi] API 응답 형식 오류. 목업 데이터로 대체합니다.', json);
            return MOCK_RESPONSE.data;
        }

        return json.data;

    } catch (error) {
        console.warn('[promotionApi] API 연결 실패. 목업 데이터로 대체합니다.', error.message);
        await new Promise(resolve => setTimeout(resolve, MOCK_DELAY_MS));
        return MOCK_RESPONSE.data;
    }
}

/**
 * vibe ID(프론트 내부 값)를 API style 값으로 변환
 */
export function vibeToStyle(vibeId) {
    return VIBE_TO_STYLE[vibeId] || 'energy';
}

/**
 * qualityMode를 API mode 값으로 변환
 */
export function qualityToMode(qualityMode) {
    return QUALITY_TO_MODE[qualityMode] || 'standard';
}
