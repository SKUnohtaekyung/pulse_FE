import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import '../AuthPage.css';

const LoginForm = ({ onSwitch }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // MOCK LOGIN FOR DEMO
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            const mockUser = {
                id: 1,
                email: formData.email,
                name: '김사장',
                storeName: '펄스 식당'
            };

            localStorage.setItem('user', JSON.stringify(mockUser));
            navigate('/dashboard');
        } catch (error) {
            console.error('Login Error:', error);
            alert('로그인 처리 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="form-wrapper fade-in">
            <h2 className="form-title">사장님, 환영합니다!</h2>
            <p className="form-subtitle">
                복잡한 마케팅은 펄스에게 맡기고<br />
                오늘도 맛있는 요리에만 집중하세요.
            </p>

            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <input
                        type="email"
                        name="email"
                        placeholder="이메일"
                        className="minimal-input"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="input-group">
                    <PasswordInput
                        name="password"
                        placeholder="비밀번호"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" className="submit-btn">
                    로그인
                </button>
            </form>

            <div className="form-switch-container">
                <p className="switch-text">아직 PULSE 계정이 없으신가요?</p>
                <button className="switch-btn" onClick={onSwitch}>회원가입 하러가기</button>
            </div>
        </div>
    );
};

const PasswordInput = ({ name, placeholder, value, onChange }) => {
    const [show, setShow] = useState(false);
    return (
        <div className="password-wrapper-minimal">
            <input
                type={show ? "text" : "password"}
                name={name}
                placeholder={placeholder}
                className="minimal-input"
                value={value}
                onChange={onChange}
                required
            />
            <div className="toggle-icon" onClick={() => setShow(!show)}>
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
        </div>
    );
};

export default LoginForm;
