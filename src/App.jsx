import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import InfluencerLayout from './components/layout/InfluencerLayout';
import AuthPage from './features/auth/AuthPage';
import LandingPage from './pages/LandingPage';
import NotFoundPage from './pages/NotFoundPage';
import InfluencerRequestPage from './features/influencer/InfluencerRequestPage';
import ProposalAcceptPage from './features/influencer/ProposalAcceptPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import { ToastProvider } from './components/common/ToastProvider';
import './styles/globals.css';

/**
 * 라우트 단위 오류 경계.
 * 한 화면에서 렌더링 오류가 나도 앱 전체가 흰 화면이 되지 않게 하고,
 * 주소가 바뀌면 오류 상태를 자동으로 푼다.
 */
function RouteBoundary({ name, children }) {
    const location = useLocation();
    return (
        <ErrorBoundary name={name} resetKeys={[location.pathname]}>
            {children}
        </ErrorBoundary>
    );
}

export default function App() {
    return (
        <ToastProvider>
            <Routes>
                {/* Public routes */}
                <Route
                    path="/"
                    element={
                        <RouteBoundary name="LandingPage">
                            <LandingPage />
                        </RouteBoundary>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <RouteBoundary name="AuthPage">
                            <AuthPage />
                        </RouteBoundary>
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <RouteBoundary name="AuthPage">
                            <AuthPage />
                        </RouteBoundary>
                    }
                />
                <Route
                    path="/proposal-accept/:token"
                    element={
                        <RouteBoundary name="ProposalAcceptPage">
                            <ProposalAcceptPage />
                        </RouteBoundary>
                    }
                />

                {/* Protected routes — 로그인 필요 (VITE_BYPASS_AUTH=true면 바로 통과) */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <RouteBoundary name="DashboardLayout">
                                <DashboardLayout />
                            </RouteBoundary>
                        </ProtectedRoute>
                    }
                />
                <Route path="/store/status-v2" element={<Navigate to="/dashboard" replace />} />
                <Route
                    path="/subscription"
                    element={
                        <ProtectedRoute>
                            <RouteBoundary name="SubscriptionPage">
                                <DashboardLayout initialPage="subscription" />
                            </RouteBoundary>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/influencer-matching"
                    element={
                        <ProtectedRoute>
                            <RouteBoundary name="InfluencerMatchingPage">
                                <DashboardLayout initialPage="influencer-matching" />
                            </RouteBoundary>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/influencer-matching/request/:id"
                    element={
                        <ProtectedRoute>
                            <RouteBoundary name="InfluencerRequestPage">
                                <DashboardLayout initialPage="influencer-matching" content={<InfluencerRequestPage />} />
                            </RouteBoundary>
                        </ProtectedRoute>
                    }
                />

                {/* Influencer Routes */}
                <Route
                    path="/influencer/dashboard"
                    element={
                        <ProtectedRoute>
                            <RouteBoundary name="InfluencerLayout">
                                <InfluencerLayout initialPage="inbox" />
                            </RouteBoundary>
                        </ProtectedRoute>
                    }
                />

                {/* 존재하지 않는 주소 — 대시보드를 렌더하지 않고 404를 보여준다 */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </ToastProvider>
    );
}
