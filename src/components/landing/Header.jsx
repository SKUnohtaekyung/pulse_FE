import React from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../../constants';

const Header = () => {
    const navigate = useNavigate();

    return (
        <header className="flex justify-between items-center px-6 py-4 max-w-[1400px] mx-auto w-full">
            <div className="cursor-pointer" onClick={() => navigate('/')}>
                <img src="/PULSE_LOGO.png" alt="PULSE" className="h-8 w-auto" />
            </div>
            <div className="flex items-center gap-6">
                <button
                    onClick={() => navigate('/login')}
                    className="text-[15px] font-medium transition-colors hover:opacity-70"
                    style={{ color: COLORS.textMain }}
                >
                    로그인
                </button>
                <button
                    onClick={() => navigate('/login')}
                    className="text-[15px] font-medium transition-colors hover:opacity-70"
                    style={{ color: COLORS.textMain }}
                >
                    회원가입
                </button>
            </div>
        </header>
    );
};

export default Header;
