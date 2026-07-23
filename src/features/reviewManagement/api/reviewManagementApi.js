import { SPRING_API_BASE_URL } from '../../../config/env';
import { apiRequest } from '../../../utils/httpClient';

/**
 * 리뷰 관리 API.
 * 인증 헤더·타임아웃·401 처리·오류 정규화는 공통 httpClient 가 담당한다.
 */
const request = (path, options = {}) =>
    apiRequest(`${SPRING_API_BASE_URL}${path}`, { ...options, context: `review${path}` });

export function fetchReviewManagementContext(signal) {
  return request('/review-management/context', { signal });
}

export function saveReviewManagementSettings(settings, signal) {
  return request('/review-management/settings', { method: 'PUT', body: settings, signal });
}

export function createReviewTemplate(template, signal) {
  return request('/review-management/templates', { method: 'POST', body: template, signal });
}

export function updateReviewTemplate(templateId, template, signal) {
  return request(`/review-management/templates/${encodeURIComponent(templateId)}`, {
    method: 'PUT',
    body: template,
    signal,
  });
}

export function deleteReviewTemplate(templateId, signal) {
  return request(`/review-management/templates/${encodeURIComponent(templateId)}`, {
    method: 'DELETE',
    signal,
  });
}

export function generateReviewReplies(payload, signal) {
  // AI 답변 생성은 일반 조회보다 오래 걸린다.
  return request('/review-management/replies/generate', {
    method: 'POST',
    body: payload,
    signal,
    timeout: 60000,
  });
}
