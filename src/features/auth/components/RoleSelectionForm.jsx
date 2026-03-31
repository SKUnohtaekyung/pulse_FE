import React from 'react';
import '../AuthPage.css';

const RoleSelectionForm = ({ onSelectRole, onSwitchToLogin }) => {
    return (
        <div className="form-wrapper fade-in">
            <h2 className="form-title">PULSE 시작하기</h2>
            <p className="form-subtitle">
                마케팅 자동화의 첫 걸음, 가입하실 회원 유형을 선택해주세요.
            </p>

            <div className="flex flex-col gap-4 mt-2">
                <button 
                    type="button" 
                    className="submit-btn" 
                    onClick={() => onSelectRole('owner')}
                    style={{ marginTop: 0 }}
                >
                    가게 사장님
                </button>
                
                <button 
                    type="button" 
                    className="back-btn w-full" 
                    onClick={() => onSelectRole('influencer')}
                >
                    인플루언서
                </button>
            </div>

            <div className="form-switch-container">
                <p className="switch-text">이미 계정이 있으신가요?</p>
                <button className="switch-btn" onClick={onSwitchToLogin}>로그인 하러가기</button>
            </div>
        </div>
    );
};

export default RoleSelectionForm;
