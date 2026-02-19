import React from 'react';
import { Navigate } from 'react-router-dom';

// 개발 모드: true로 설정하면 로그인 없이 대시보드 접근 가능
// 배포 시 반드시 false로 변경
const DEV_MODE = true;

/**
 * 인증이 필요한 라우트를 보호하는 컴포넌트
 * DEV_MODE=true: 인증 없이 통과
 * DEV_MODE=false: localStorage의 user 토큰 확인 후 없으면 /login으로 리다이렉트
 */
const ProtectedRoute = ({ children }) => {
    if (DEV_MODE) {
        return children;
    }

    const user = localStorage.getItem('user');
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
