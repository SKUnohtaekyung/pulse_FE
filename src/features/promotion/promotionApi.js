/**
 * 홍보 영상 만들기 API 서비스
 * POST /api/info/generate
 *
 * API 연결이 안될 때는 목업데이터를 반환하고,
 * 연결될 때는 실제 API 응답을 반환합니다.
 */

import mockVideoUrl from '../../assets/mock_video/수제비_영상_제작_요청.mp4';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// ─── localStorage 키 (앱 전체에서 동일한 키를 사용해야 함) ──────────────────
// ⚠️ 백엔드 연결 시: 실제 JWT 토큰을 저장하는 키로 변경 필요
// 현재 mock 로그인은 'user' 키에 사용자 정보를 저장함 (LoginForm.jsx 참고)
const AUTH_TOKEN_KEY = 'accessToken'; // 실제 토큰 키 (백엔드 연결 후 확인 필요)

// ─── 목업 데이터 (API 연결 실패 시 fallback) ───────────────────────────────
const MOCK_RESPONSE = {
    status: 'success',
    data: {
        videoUrl: mockVideoUrl,
        videoTitle: '🔥 범계 수제비 - 얇고 쫄깃한 수제비의 매력',
        hashtags: ['#범계맛집', '#수제비', '#매운수제비', '#범계수제비', '#맛집추천'],
        generationTime: '5.2s'
    }
};

// ─── progress 메시지 단계 ──────────────────────────────────────────────────
const MOCK_PROGRESS_STEPS = [
    { progress: 10, message: '사진을 분석하고 있어요...' },
    { progress: 30, message: '영상 컨셉을 구성하고 있어요...' },
    { progress: 55, message: '영상을 생성하고 있어요...' },
    { progress: 75, message: '장면을 최적화하고 있어요...' },
    { progress: 90, message: '영상을 렌더링하고 있어요...' },
    { progress: 100, message: '완성됐어요!' },
];

// 폴링 간격 (ms)
const POLL_INTERVAL_MS = 2000;

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
 * 홍보 영상 생성 API 호출 (progress 콜백 지원)
 *
 * @param {Object}   params
 * @param {string}   params.target      - 타겟 손님
 * @param {string}   params.concept     - 영상 컨셉
 * @param {string}   params.mode        - 생성 모드 ("standard" | "standard_fast")
 * @param {string}   params.style       - 영상 스타일 ("energy" | "premium" | "mood")
 * @param {File}     params.imageFile   - 업로드할 이미지 파일
 * @param {Function} params.onProgress  - (percent: number, message: string) => void
 *
 * @returns {Promise<{ videoUrl, videoTitle, hashtags, generationTime }>}
 */
export async function generatePromotionVideo({ target, concept, mode, style, imageFile, onProgress }) {
    const notify = onProgress || (() => {});

    // ─── MOCK 모드 (API_BASE_URL 미설정 시) ─────────────────────────────────
    if (!API_BASE_URL) {
        console.warn('[promotionApi] VITE_API_BASE_URL 미설정 → 목업 데이터 반환');
        await _simulateMockProgress(notify);
        return MOCK_RESPONSE.data;
    }

    // ─── 실제 API 모드 ──────────────────────────────────────────────────────
    try {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);

        const formData = new FormData();
        formData.append('target', target);
        formData.append('concept', concept);
        formData.append('mode', mode);
        formData.append('style', style);
        if (imageFile) {
            formData.append('image', imageFile);
        }

        notify(5, '요청을 전송하고 있어요...');

        // STEP 1: 생성 작업 시작 → task_id 수신
        const startRes = await fetch(`${API_BASE_URL}/api/info/generate`, {
            method: 'POST',
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: formData
        });

        if (!startRes.ok) {
            console.warn(`[promotionApi] 응답 오류 (${startRes.status}) → 목업 데이터 대체`);
            await _simulateMockProgress(notify);
            return MOCK_RESPONSE.data;
        }

        const startJson = await startRes.json();

        // 백엔드가 task_id를 즉시 반환하는 비동기 방식인 경우
        const taskId = startJson?.task_id;

        if (taskId) {
            // STEP 2: task_id가 있으면 → 폴링으로 진행률 추적
            return await _pollStatus(taskId, token, notify);
        }

        // 백엔드가 progress 없이 결과를 바로 반환하는 동기 방식인 경우
        if (startJson.status !== 'success' || !startJson.data) {
            console.warn('[promotionApi] API 응답 형식 오류. 목업 데이터로 대체합니다.', startJson);
            return MOCK_RESPONSE.data;
        }

        notify(100, '완성됐어요!');
        return startJson.data;

    } catch (error) {
        console.warn('[promotionApi] API 연결 실패. 목업 데이터로 대체합니다.', error.message);
        await _simulateMockProgress(notify);
        return MOCK_RESPONSE.data;
    }
}

/**
 * task_id 기반 폴링으로 진행률 추적
 * 백엔드 /api/info/status/{task_id} 응답 형식:
 * { status: 'processing' | 'complete' | 'error', progress: 0~100, message: '...' , data?: {...} }
 *
 * @private
 */
async function _pollStatus(taskId, token, onProgress) {
    const statusUrl = `${API_BASE_URL}/api/info/status/${taskId}`;

    while (true) {
        await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS));

        const res = await fetch(statusUrl, {
            headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
        });

        if (!res.ok) {
            console.warn(`[promotionApi] 상태 폴링 오류 (${res.status}) → 목업 전환`);
            await _simulateMockProgress(onProgress);
            return MOCK_RESPONSE.data;
        }

        const json = await res.json();
        const { status, progress, message, data } = json;

        onProgress(progress ?? 0, message ?? '처리 중...');

        if (status === 'complete' && data) {
            return data;
        }

        if (status === 'error') {
            console.warn('[promotionApi] 백엔드 오류 → 목업 전환');
            return MOCK_RESPONSE.data;
        }
    }
}

/**
 * mock 환경에서 자연스러운 progress 시뮬레이션
 * 각 단계마다 딜레이를 두어 실제 진행처럼 보이도록 합니다.
 *
 * @private
 */
async function _simulateMockProgress(onProgress) {
    for (const step of MOCK_PROGRESS_STEPS) {
        // 각 단계의 딜레이를 전체 5000ms 기준으로 분산
        const delay = step.progress === 100 ? 300 : 700;
        await new Promise(resolve => setTimeout(resolve, delay));
        onProgress(step.progress, step.message);
    }
    // 마지막 단계 후 짧은 대기
    await new Promise(resolve => setTimeout(resolve, 300));
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
