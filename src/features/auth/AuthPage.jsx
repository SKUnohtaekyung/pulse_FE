import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ThreeBackground from './ThreeBackground';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import './AuthPage.css';

const AuthPage = () => {
    const [isSignUp, setIsSignUp] = useState(false);

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
                    {isSignUp ? (
                        <SignupForm onSwitch={() => setIsSignUp(false)} />
                    ) : (
                        <LoginForm onSwitch={() => setIsSignUp(true)} />
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
