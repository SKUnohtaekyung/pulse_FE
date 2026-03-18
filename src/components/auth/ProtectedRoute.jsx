import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../../features/auth/api/authApi';

const DEV_MODE = import.meta.env.VITE_BYPASS_AUTH === 'true';

/**
 * 인증이 필요한 라우트를 보호하는 컴포넌트
 * DEV_MODE=true: 인증 없이 통과
 * DEV_MODE=false: localStorage의 user 토큰 확인 후 없으면 /login으로 리다이렉트
 */
const ProtectedRoute = ({ children }) => {
    if (DEV_MODE) {
        return children;
    }

    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
