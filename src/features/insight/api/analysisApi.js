import { FASTAPI_BASE_URL, USE_MOCK_ANALYSIS } from '../../../config/env';
import { apiGet } from '../../../utils/httpClient';
import { ERROR_TYPES } from '../../../utils/apiError';

const FASTAPI_URL = FASTAPI_BASE_URL;

export const MOCK_ANALYSIS_DATA = {
    store_name: 'PULSE 데모 매장',
    store_summary: '개발 환경에서 제공하는 예시 분석 데이터입니다.',
    average_rating: 4.6,
    total_reviews: 128,
    personas: [
        {
            id: 1,
            nickname: '퇴근길 직장인',
            summary: '저녁 식사와 회식을 함께 고려하는 고객층입니다.',
            tags: ['직장인', '저녁'],
            action_recommendation: '퇴근 시간대 대표 메뉴와 방문 혜택을 알리세요.',
        },
        {
            id: 2,
            nickname: '주말 데이트 고객',
            summary: '사진과 분위기를 함께 살피는 고객층입니다.',
            tags: ['데이트', '주말'],
            action_recommendation: '공간과 대표 메뉴가 함께 보이는 콘텐츠를 준비하세요.',
        },
    ],
};

/** 분석 결과가 아직 없는 상태 — 오류가 아니라 "빈 상태"로 다뤄야 한다. */
export const ANALYSIS_NOT_READY = 'ANALYSIS_NOT_READY';

export const isAnalysisNotReady = (error) => error?.type === ANALYSIS_NOT_READY;

const notReadyError = () => ({
    type: ANALYSIS_NOT_READY,
    message: '아직 손님 분석 결과가 없어요. 리뷰 수집과 분석이 끝나면 여기에 표시돼요.',
    retryable: true,
    status: 404,
    fieldErrors: null,
    cause: null,
});

/**
 * 최신 손님 분석 결과.
 * 저장된 taskId 결과를 먼저 보고, 없으면 최신 분석으로 넘어간다.
 *
 * @param {AbortSignal} [signal]
 */
export async function fetchLatestAnalysisData(signal) {
    if (USE_MOCK_ANALYSIS) return MOCK_ANALYSIS_DATA;

    let storedTaskId = null;
    try {
        storedTaskId = localStorage.getItem('analysisTaskId');
    } catch {
        storedTaskId = null;
    }

    if (storedTaskId) {
        try {
            return await apiGet(`${FASTAPI_URL}/analysis/result/${encodeURIComponent(storedTaskId)}`, {
                signal,
                context: 'analysis/result',
            });
        } catch (error) {
            // 400/404 는 "이 taskId 로는 결과가 없다"는 뜻이므로 최신 분석으로 넘어간다.
            const isMissing = error?.type === ERROR_TYPES.NOT_FOUND || error?.type === ERROR_TYPES.BAD_REQUEST;
            if (!isMissing) throw error;
        }
    }

    try {
        return await apiGet(`${FASTAPI_URL}/analysis/latest`, { signal, context: 'analysis/latest' });
    } catch (error) {
        if (error?.type === ERROR_TYPES.NOT_FOUND) throw notReadyError();
        throw error;
    }
}
