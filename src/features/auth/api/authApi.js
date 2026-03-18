// [혜린] Auth API 함수들

const SPRING_API_BASE_URL = import.meta.env.VITE_SPRING_API_BASE_URL || 'http://localhost:8080/api';

/**
 * [혜린] 회원가입 API
 * @param {Object} signupData - 회원가입 데이터
 * @returns {Promise} 회원가입 결과
 */
export const signup = async (signupData) => {
  const url = `${SPRING_API_BASE_URL}/auth/signup`;
  const method = 'POST';
  const headers = {
    'Content-Type': 'application/json',
  };

  // [혜린] 테스트 로그 1: 요청 URL
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('회원가입 API 요청');
  console.log('1️⃣ 요청 URL:', url);
  console.log('   Swagger 확인: POST /auth/signup');
  
  // [혜린] 테스트 로그 2: Method & Headers
  console.log('2️⃣ Method:', method);
  console.log('   Headers:', headers);
  
  // [혜린] 테스트 로그 3: Body
  console.log('3️⃣ Request Body:', JSON.stringify(signupData, null, 2));

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(signupData),
    });

    // [혜린] 테스트 로그 4: Status Code
    console.log('4️⃣ Response Status:', response.status, response.statusText);
    console.log('   Swagger 확인: 201 Created (성공) / 400 Bad Request (실패)');

    // [혜린] 응답 처리
    if (!response.ok) {
      const errorData = await response.json();
      console.log('❌ 에러 응답:', errorData);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      throw new Error(errorData.message || '회원가입 실패');
    }

    const data = await response.json();
    console.log('✅ 성공 응답:', data);

    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
      console.log('🔑 회원가입 토큰 저장 완료');
    }

    if (data.analysisTaskId) {
      localStorage.setItem('analysisTaskId', data.analysisTaskId);
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    return data;
  } catch (error) {
    console.error('회원가입 에러:', error);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    throw error;
  }
};

/**
 * [혜린] 로그인 API
 * @param {Object} loginData - 로그인 데이터 (email, password)
 * @returns {Promise} 로그인 결과 (accessToken 포함)
 */
export const login = async (loginData) => {
  const url = `${SPRING_API_BASE_URL}/auth/login`;
  const method = 'POST';
  const headers = {
    'Content-Type': 'application/json',
  };

  // [혜린] 테스트 로그 1: 요청 URL
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('[혜린] 로그인 API 요청');
  console.log('1️⃣ 요청 URL:', url);
  console.log('   Swagger 확인: POST /login');
  
  // [혜린] 테스트 로그 2: Method & Headers
  console.log('2️⃣ Method:', method);
  console.log('   Headers:', headers);
  
  // [혜린] 테스트 로그 3: Body
  console.log('3️⃣ Request Body:', JSON.stringify(loginData, null, 2));

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(loginData),
    });

    // [혜린] 테스트 로그 4: Status Code
    console.log('4️⃣ Response Status:', response.status, response.statusText);
    console.log('   Swagger 확인: 200 OK (성공) / 400/401 (실패)');

    // [혜린] 응답 처리
    if (!response.ok) {
      const errorData = await response.json();
      console.log('❌ 에러 응답:', errorData);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      throw new Error(errorData.message || '로그인 실패');
    }

    const data = await response.json();
    console.log('✅ 성공 응답:', data);
    
    // [혜린] 토큰 저장
    if (data.accessToken) {
      localStorage.removeItem('analysisTaskId');
      localStorage.setItem('accessToken', data.accessToken);
      console.log('🔑 토큰 저장 완료');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    return data;
  } catch (error) {
    console.error('로그인 에러:', error);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    throw error;
  }
};

/**
 * [혜린] 로그아웃 (토큰 삭제)
 */
export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('analysisTaskId');
  localStorage.removeItem('user');
};

/**
 * [혜린] 현재 토큰 가져오기
 * @returns {string|null} 저장된 토큰
 */
export const getToken = () => {
  return localStorage.getItem('accessToken');
};

/**
 * [혜린] 로그인 상태 확인
 * @returns {boolean} 로그인 여부
 */
export const isAuthenticated = () => {
  return !!getToken();
};
