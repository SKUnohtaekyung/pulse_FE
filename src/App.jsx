import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import AuthPage from './features/auth/AuthPage';
import LandingPage from './pages/LandingPage';
import InfluencerRequestPage from './features/influencer/InfluencerRequestPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './styles/globals.css';

export default function App() {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage />} />

            {/* Protected routes — 로그인 필요 (DEV_MODE=true면 바로 통과) */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>} />
            <Route path="/subscription" element={<ProtectedRoute><DashboardLayout initialPage="subscription" /></ProtectedRoute>} />
            <Route path="/influencer-matching" element={<ProtectedRoute><DashboardLayout initialPage="influencer-matching" /></ProtectedRoute>} />
            <Route path="/influencer-matching/request/:id" element={<ProtectedRoute><DashboardLayout initialPage="influencer-matching" content={<InfluencerRequestPage />} /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>} />
        </Routes>
    );
}
