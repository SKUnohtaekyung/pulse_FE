import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../../features/auth/api/authApi';
import { BYPASS_AUTH } from '../../config/env';
import { LoadingState } from '../common/StateViews';

/**
 * 인증이 필요한 라우트를 보호하는 컴포넌트.
 *
 * - VITE_BYPASS_AUTH=true: 인증 없이 통과 (개발 전용)
 * - 인증 확인이 끝나기 전에는 로그인 화면이 깜빡이지 않도록 중립 로딩을 보여준다.
 * - 로그인 후 원래 가려던 곳으로 돌아갈 수 있도록 state.from 을 넘긴다.
 */
const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    // 'checking' → 'authed' | 'guest'
    const [status, setStatus] = useState(() => (BYPASS_AUTH ? 'authed' : 'checking'));

    useEffect(() => {
        if (BYPASS_AUTH) return;
        // 토큰 확인은 동기지만, 첫 페인트에서 로그인 화면이 스쳐 보이는 것을 막기 위해
        // 판정 결과를 상태로 확정한 뒤 렌더한다.
        setStatus(isAuthenticated() ? 'authed' : 'guest');
    }, [location.pathname]);

    if (status === 'checking') {
        return (
            <div className="min-h-dvh flex items-center justify-center bg-bg-page">
                <LoadingState message="로그인 상태를 확인하고 있어요" minHeight="min-h-0" />
            </div>
        );
    }

    if (status === 'guest') {
        return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
    }

    return children;
};

export default ProtectedRoute;
