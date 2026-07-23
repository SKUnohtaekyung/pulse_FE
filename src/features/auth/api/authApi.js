import { SPRING_API_BASE_URL } from '../../../config/env';
import { apiGet, apiPost } from '../../../utils/httpClient';
import { ERROR_TYPES } from '../../../utils/apiError';
import { readJson, removeItem, writeJson, writeString } from '../../../utils/safeStorage';

const USER_PROFILE_STORAGE_KEY = 'userProfile';

/** 로그아웃 시 반드시 비워야 하는 키 — 이전 사용자의 데이터가 남지 않도록 한 곳에서 관리한다. */
const AUTH_STORAGE_KEYS = [
  'accessToken',
  'analysisTaskId',
  'user',
  USER_PROFILE_STORAGE_KEY,
  'pulseStoreProfileDraft',
  'selectedInfluencerForProposal',
  'pulse_dismissed_ids',
];

const isPlainObject = (value) => !!value && typeof value === 'object' && !Array.isArray(value);

const readCachedProfile = () => {
  const cachedProfile = readJson(USER_PROFILE_STORAGE_KEY, null, { validate: isPlainObject });
  if (cachedProfile) return cachedProfile;

  const legacyUser = readJson('user', null, { validate: isPlainObject });
  if (!legacyUser) return null;

  const role = String(legacyUser.role || 'owner').toUpperCase();
  return {
    email: legacyUser.email || '',
    name: legacyUser.name || '',
    role,
    ownerName: role === 'OWNER' ? legacyUser.name || '' : '',
    shopName: legacyUser.storeName || '',
    shopAddress: '',
  };
};

const persistAuth = (data) => {
  if (!isPlainObject(data)) return;

  if (data.accessToken) {
    // 새 토큰이면 이전 사용자의 캐시를 먼저 지운다.
    removeItem(USER_PROFILE_STORAGE_KEY);
    removeItem('user');
    writeString('accessToken', data.accessToken);
  }

  if (data.user) writeJson('user', data.user);
  if (data.analysisTaskId) writeString('analysisTaskId', String(data.analysisTaskId));
};

/**
 * 인증 API 는 아직 토큰이 없는 상태에서 호출되므로 401 자동 로그아웃을 끈다.
 * (로그인 실패 401 이 세션 만료 리다이렉트를 일으키면 무한 루프가 된다)
 */
const postAuth = async (path, body) => {
  const data = await apiPost(`${SPRING_API_BASE_URL}${path}`, body, {
    auth: false,
    handle401: false,
    context: `auth${path}`,
  });
  persistAuth(data);
  return data;
};

export const signup = async (signupData) => postAuth('/auth/signup', signupData);

const dedupeStrings = (list) =>
  [...new Map((list || [])
    .map((value) => String(value || '').trim())
    .filter(Boolean)
    .map((value) => [value.toLowerCase(), value]))
    .values()];

export const signupInfluencer = async (formData) => {
  // niche(주력 분야)와 tags(추구미 해시태그)를 keywords에 한 번만, 중복 없이 담는다.
  // 과거에는 keywords = [niche, ...tags] 로 넣어 niche가 두 번 들어가고,
  // 렌더 단계에서 niches와 또 합쳐지며 #패션이 여러 번 보이는 버그가 있었다.
  const keywords = dedupeStrings(formData.tags);
  const payload = {
    email: formData.email,
    password: formData.password,
    passwordConfirm: formData.passwordConfirm ?? formData.password,
    name: formData.name,
    phone: formData.phone || '',
    privacyAgreed: !!formData.agreedToTerms,
    profile: {
      displayName: formData.name,
      bio: formData.bio,
      location: formData.location,
      profileImageUrl: formData.profileImageUrl || '',
      instagramUrl: formData.instagramUrl,
      youtubeUrl: formData.youtubeUrl,
      niches: formData.niche ? [formData.niche] : [],
      keywords,
      activityAreas: formData.location ? [formData.location] : [],
      audienceKeywords: dedupeStrings(formData.tags),
    },
  };

  return postAuth('/auth/signup/influencer', payload);
};

export const login = async (loginData) => postAuth('/auth/login', loginData);

export const logout = () => {
  AUTH_STORAGE_KEYS.forEach((key) => removeItem(key));
};

export const getToken = () => {
  try {
    return localStorage.getItem('accessToken');
  } catch {
    return null;
  }
};

export const isAuthenticated = () => !!getToken();

/**
 * 현재 로그인 사용자 프로필.
 * 네트워크 오류일 때만 캐시로 폴백하고, 인증 만료(401/403)는 캐시로 감추지 않는다.
 */
export const fetchCurrentProfile = async (signal) => {
  const token = getToken();
  if (!token || token === 'dev-bypass-token') {
    return readCachedProfile();
  }

  try {
    const data = await apiGet(`${SPRING_API_BASE_URL}/auth/me`, { signal, context: 'auth/me' });
    if (isPlainObject(data)) {
      writeJson(USER_PROFILE_STORAGE_KEY, data);
      return data;
    }
    return readCachedProfile();
  } catch (error) {
    // 401 은 httpClient 가 이미 세션 만료 처리를 수행한다. 여기서 캐시로 되돌리지 않는다.
    if (error?.type === ERROR_TYPES.UNAUTHORIZED || error?.type === ERROR_TYPES.FORBIDDEN) {
      throw error;
    }
    return readCachedProfile();
  }
};
