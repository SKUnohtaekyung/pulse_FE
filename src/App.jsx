import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import AuthPage from './features/auth/AuthPage';
import LandingPage from './pages/LandingPage';
import './styles/globals.css';

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage />} />
            <Route path="/dashboard" element={<DashboardLayout />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="*" element={<DashboardLayout />} />
        </Routes>
    );
}
