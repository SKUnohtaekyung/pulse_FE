import { FASTAPI_BASE_URL } from '../../config/env';
import { apiRequest } from '../../utils/httpClient';
import { ERROR_TYPES, isCanceledError, normalizeApiError } from '../../utils/apiError';

const API_BASE_URL = FASTAPI_BASE_URL;

const POLL_INTERVAL_MS = 2000;
/** 폴링 전체 상한 — 이 시간을 넘기면 "너무 오래 걸린다"로 사용자에게 알린다. */
const POLL_DEADLINE_MS = 10 * 60 * 1000;
/** 폴링 중 일시적 네트워크 오류를 몇 번까지 넘길지 (수 분짜리 작업이 순간 끊김으로 날아가지 않도록) */
const POLL_MAX_TRANSIENT_FAILURES = 5;
/** 영상 생성 요청 자체의 타임아웃 — 업로드 + 큐잉을 고려해 넉넉히 잡는다. */
const GENERATE_TIMEOUT_MS = 120000;
const STATUS_TIMEOUT_MS = 15000;

const VIBE_TO_STYLE = {
    energetic: 'energy',
    luxury: 'premium',
    emotional: 'mood',
};

const QUALITY_TO_MODE = {
    standard: 'standard',
    pro: 'pro',
};

/** 사용자 문구가 확정된 영상 생성 전용 오류 */
const generationError = (message, { retryable = true, type = ERROR_TYPES.UNKNOWN } = {}) => ({
    type,
    message,
    retryable,
    status: null,
    fieldErrors: null,
    cause: null,
});

const sleep = (ms, signal) =>
    new Promise((resolve, reject) => {
        const timer = setTimeout(resolve, ms);
        if (!signal) return;
        if (signal.aborted) {
            clearTimeout(timer);
            reject(new DOMException('취소됨', 'AbortError'));
            return;
        }
        signal.addEventListener(
            'abort',
            () => {
                clearTimeout(timer);
                reject(new DOMException('취소됨', 'AbortError'));
            },
            { once: true },
        );
    });

/**
 * 서버가 상대 경로를 주는 경우 절대 URL 로 바꾼다.
 * base 의 경로(`/api` 등)를 잃지 않도록 항상 끝에 슬래시를 붙여 해석한다.
 */
function normalizeVideoUrl(videoUrl) {
    if (typeof videoUrl !== 'string' || !videoUrl.trim()) return null;
    const trimmed = videoUrl.trim();

    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    if (trimmed.startsWith('blob:') || trimmed.startsWith('data:')) return trimmed;
    if (!API_BASE_URL) return trimmed;

    try {
        return new URL(trimmed, `${API_BASE_URL}/`).toString();
    } catch {
        return trimmed;
    }
}

const toStringOrNull = (value) => {
    if (typeof value !== 'string') return null;
    const trimmed = value.trim();
    return trimmed || null;
};

/**
 * 서버 응답을 화면이 기대하는 형태로 정규화한다.
 * 필드가 빠져 있어도 렌더 단계에서 터지지 않도록 항상 같은 모양을 보장한다.
 */
function normalizePromotionResult(data) {
    const source = data && typeof data === 'object' ? data : {};
    return {
        videoUrl: normalizeVideoUrl(source.videoUrl ?? source.video_url),
        videoTitle: toStringOrNull(source.videoTitle ?? source.video_title),
        hashtags: Array.isArray(source.hashtags) ? source.hashtags.filter((tag) => typeof tag === 'string' && tag.trim()) : [],
        generationTime: source.generationTime ?? source.generation_time ?? null,
    };
}

/** 진행률이 숫자가 아니면 화면에 NaN 이 뜨지 않도록 null 로 만든다. */
const sanitizeProgress = (value) => {
    const num = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(num)) return null;
    return Math.max(0, Math.min(100, num));
};

const buildFormData = (entries, imageFiles) => {
    const formData = new FormData();
    Object.entries(entries).forEach(([key, value]) => {
        formData.append(key, value == null ? '' : String(value));
    });

    const files = Array.isArray(imageFiles) ? imageFiles : imageFiles ? [imageFiles] : [];
    files.forEach((file, index) => {
        if (!file) return;
        // 서버가 단일 필드만 받는 경우를 고려해 첫 장은 'image' 로도 보낸다.
        if (index === 0) formData.append('image', file);
        formData.append('images', file);
    });

    return formData;
};

export async function fetchPromotionPromptRecommendation({
    target,
    storeName,
    storeSummary,
    personaLabel,
    personaSummary,
    personaTags,
    actionRecommendation,
    style,
    mode,
    imageFile,
    signal,
}) {
    const formData = buildFormData(
        {
            target,
            store_name: storeName,
            store_summary: storeSummary,
            persona_label: personaLabel,
            persona_summary: personaSummary,
            persona_tags_json: JSON.stringify(personaTags || []),
            action_recommendation: actionRecommendation,
            style,
            mode,
        },
        imageFile,
    );

    return apiRequest(`${API_BASE_URL}/info/prompt-recommendation`, {
        method: 'POST',
        body: formData,
        signal,
        context: 'promotion/prompt-recommendation',
    });
}

/**
 * 홍보 영상 생성.
 *
 * @param {object} params
 * @param {File[]|File} params.imageFiles 업로드 이미지 (등록 순서 = 장면 순서)
 * @param {(progress: number|null, message: string) => void} [params.onProgress]
 * @param {AbortSignal} [params.signal]
 * @returns {Promise<{videoUrl: string|null, videoTitle: string|null, hashtags: string[], generationTime: any}>}
 */
export async function generatePromotionVideo({ target, concept, mode, style, imageFiles, imageFile, onProgress, signal }) {
    const notify = typeof onProgress === 'function' ? onProgress : () => {};
    const files = imageFiles ?? imageFile;

    const formData = buildFormData({ target, concept, mode, style }, files);

    notify(null, '요청을 전송하고 있어요');

    const startJson = await apiRequest(`${API_BASE_URL}/info/generate`, {
        method: 'POST',
        body: formData,
        signal,
        timeout: GENERATE_TIMEOUT_MS,
        context: 'promotion/generate',
    });

    const taskId = startJson?.task_id ?? startJson?.taskId;
    if (taskId) {
        return pollStatus(String(taskId), notify, signal);
    }

    if (startJson?.status !== 'success' || !startJson?.data) {
        throw generationError('영상 생성 결과를 받지 못했어요. 잠시 후 다시 시도해 주세요.');
    }

    notify(100, '완성되었어요');
    return normalizePromotionResult(startJson.data);
}

async function pollStatus(taskId, onProgress, signal) {
    const statusUrl = `${API_BASE_URL}/info/status/${encodeURIComponent(taskId)}`;
    const startedAt = Date.now();
    let transientFailures = 0;

    // while(true) 가 아니라 명확한 종료 조건을 둔다.
    while (Date.now() - startedAt < POLL_DEADLINE_MS) {
        await sleep(POLL_INTERVAL_MS, signal);

        let json;
        try {
            json = await apiRequest(statusUrl, { signal, timeout: STATUS_TIMEOUT_MS, context: 'promotion/status' });
        } catch (error) {
            if (isCanceledError(error)) throw error;

            const normalized = normalizeApiError(error);
            // 인증 만료·권한 문제는 재시도해도 소용없다.
            if (normalized.retryable === false) throw normalized;

            transientFailures += 1;
            if (transientFailures > POLL_MAX_TRANSIENT_FAILURES) {
                throw generationError('영상 생성 상태를 확인하지 못했어요. 잠시 후 다시 시도해 주세요.', {
                    type: ERROR_TYPES.NETWORK_ERROR,
                });
            }
            onProgress(null, '연결을 다시 시도하고 있어요');
            continue;
        }

        transientFailures = 0;
        const { status, progress, message, data } = json || {};
        onProgress(sanitizeProgress(progress), typeof message === 'string' && message.trim() ? message.trim() : '영상을 만들고 있어요');

        if (status === 'complete') {
            // complete 인데 데이터가 없으면 영원히 도는 대신 명확히 실패시킨다.
            if (!data) {
                throw generationError('영상은 만들어졌지만 결과를 받지 못했어요. 다시 시도해 주세요.');
            }
            return normalizePromotionResult(data);
        }

        if (status === 'error' || status === 'failed') {
            throw generationError('영상 생성에 실패했어요. 입력한 내용은 그대로 남아 있으니 다시 시도할 수 있어요.');
        }
    }

    throw generationError('영상 생성이 예상보다 오래 걸리고 있어요. 잠시 후 다시 시도해 주세요.', {
        type: ERROR_TYPES.TIMEOUT,
    });
}

export function vibeToStyle(vibeId) {
    return VIBE_TO_STYLE[vibeId] || 'energy';
}

export function qualityToMode(qualityMode) {
    return QUALITY_TO_MODE[qualityMode] || 'standard';
}
