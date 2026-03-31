import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThreeBackground from './ThreeBackground';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import RoleSelectionForm from './components/RoleSelectionForm';
import './AuthPage.css';

const AuthPage = () => {
    const location = useLocation();
    const [authView, setAuthView] = useState(location.pathname === '/signup' ? 'role-select' : 'login');

    return (
        <div className="auth-split-layout">
            {/* Left Panel: Form Area */}
            <div className="auth-left-panel">
                <div className="auth-header">
                    <Link to="/">
                        <img src={`${import.meta.env.BASE_URL}PULSE_LOGO.png`} alt="PULSE" className="h-8 w-auto" />
                    </Link>

                </div>

                <div className="auth-content">
                    {authView === 'login' && (
                        <LoginForm onSwitch={() => setAuthView('role-select')} />
                    )}
                    {authView === 'role-select' && (
                        <RoleSelectionForm 
                            onSelectRole={(role) => {
                                if (role === 'owner') setAuthView('signup-owner');
                            }} 
                            onSwitchToLogin={() => setAuthView('login')} 
                        />
                    )}
                    {authView === 'signup-owner' && (
                        <SignupForm onSwitch={() => setAuthView('login')} />
                    )}
                </div>

                <div className="auth-footer">
                    <p>© 2025 PULSE. All rights reserved.</p>
                </div>
            </div>

            {/* Right Panel: Visual Area */}
            <div className="auth-right-panel">
                <ThreeBackground />
            </div>
        </div>
    );
};

export default AuthPage;
