import { getToken } from '../../auth/api/authApi';

const SPRING_API_BASE_URL = import.meta.env.VITE_SPRING_API_BASE_URL || 'http://localhost:8080/api';

async function authorizedRequest(path, options = {}) {
  const token = getToken();
  const response = await fetch(`${SPRING_API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let message = '요청 처리에 실패했습니다.';
    try {
      const errorBody = await response.json();
      message = errorBody.message || errorBody.detail || message;
    } catch (_) {
      // ignore parsing error
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function fetchReviewManagementContext() {
  return authorizedRequest('/review-management/context');
}

export function saveReviewManagementSettings(settings) {
  return authorizedRequest('/review-management/settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  });
}

export function createReviewTemplate(template) {
  return authorizedRequest('/review-management/templates', {
    method: 'POST',
    body: JSON.stringify(template),
  });
}

export function updateReviewTemplate(templateId, template) {
  return authorizedRequest(`/review-management/templates/${templateId}`, {
    method: 'PUT',
    body: JSON.stringify(template),
  });
}

export function deleteReviewTemplate(templateId) {
  return authorizedRequest(`/review-management/templates/${templateId}`, {
    method: 'DELETE',
  });
}

export function generateReviewReplies(payload) {
  return authorizedRequest('/review-management/replies/generate', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
