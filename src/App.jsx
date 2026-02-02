import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import AuthPage from './features/auth/AuthPage';
import LandingPage from './pages/LandingPage';
import './styles/globals.css';

// 개발 모드: true로 설정하면 로그인 없이 대시보드 접근 가능
const DEV_MODE = true;

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage />} />
            <Route path="/landing" element={<LandingPage />} /> /*나중에 메인으로 바꾸기*/
            <Route path="/dashboard" element={<DashboardLayout />} />
            <Route path="/subscription" element={<DashboardLayout initialPage="subscription" />} />
            <Route path="/" element={DEV_MODE ? <DashboardLayout /> : <LandingPage />} />
            <Route path="*" element={<DashboardLayout />} />
        </Routes>
    );
}
