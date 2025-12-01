import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ChevronDown } from 'lucide-react';
import '../AuthPage.css';

const SignupForm = ({ onSwitch }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        storeName: '',
        category: '',
        storeAddress: '',
        naverLink: '',
        kakaoLink: '',
        agreed: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleNext = (e) => {
        e.preventDefault();
        if (step === 1) {
            if (!formData.name || !formData.phone || !formData.email || !formData.password || !formData.agreed) {
                alert("모든 필수 항목을 입력해주세요.");
                return;
            }
            setStep(2);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        // MOCK SIGNUP FOR DEMO
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            alert("회원가입이 완료되었습니다!");
            onSwitch(); // Switch to login mode
        } catch (error) {
            console.error("Signup Error:", error);
            alert("서버 오류가 발생했습니다.");
        }
    };

    return (
        <div className="form-wrapper fade-in">
            {step === 1 ? (
                <>
                    <h2 className="form-title">PULSE 시작하기</h2>
                    <p className="form-subtitle">
                        마케팅 자동화의 첫 걸음, 계정을 생성해보세요.
                    </p>
                </>
            ) : (
                <>
                    <h2 className="form-title">가게 등록</h2>
                    <p className="form-subtitle">
                        사장님의 소중한 가게 정보를 알려주세요.
                    </p>
                </>
            )}

            <form onSubmit={handleNext}>
                {step === 1 ? (
                    <div className="fade-in">
                        <div className="input-row">
                            <input
                                type="text"
                                name="name"
                                placeholder="이름 (실명)"
                                className="minimal-input"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="tel"
                                name="phone"
                                placeholder="휴대폰 번호"
                                className="minimal-input"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <input
                                type="email"
                                name="email"
                                placeholder="이메일 (아이디)"
                                className="minimal-input"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <PasswordInput
                                name="password"
                                placeholder="비밀번호 (8자 이상)"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="checkbox-group" style={{ marginTop: '24px' }}>
                            <label>
                                <input
                                    type="checkbox"
                                    name="agreed"
                                    checked={formData.agreed}
                                    onChange={handleChange}
                                    required
                                />
                                <span>[필수] 개인정보 수집 및 이용 동의</span>
                            </label>
                        </div>

                        <button type="submit" className="submit-btn">
                            다음으로 &rarr;
                        </button>
                    </div>
                ) : (
                    <div className="fade-in">
                        <div className="input-row">
                            <input
                                type="text"
                                name="storeName"
                                placeholder="가게 이름"
                                className="minimal-input"
                                value={formData.storeName}
                                onChange={handleChange}
                                required
                            />
                            <CustomDropdown
                                name="category"
                                placeholder="업종 선택"
                                options={["한식", "중식", "일식", "양식", "카페/디저트", "주점", "기타"]}
                                value={formData.category}
                                onChange={(val) => setFormData(prev => ({ ...prev, category: val }))}
                            />
                        </div>

                        <div className="input-group">
                            <input
                                type="text"
                                name="storeAddress"
                                placeholder="가게 주소"
                                className="minimal-input"
                                value={formData.storeAddress}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <input
                                type="text"
                                name="naverLink"
                                placeholder="네이버 지도 링크 (선택)"
                                className="minimal-input"
                                value={formData.naverLink}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="input-group">
                            <input
                                type="text"
                                name="kakaoLink"
                                placeholder="카카오맵 링크 (선택)"
                                className="minimal-input"
                                value={formData.kakaoLink}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-actions-row horizontal">
                            <button type="button" className="back-btn" onClick={() => setStep(1)}>
                                이전
                            </button>
                            <button type="submit" className="submit-btn full-width">
                                가입 완료
                            </button>
                        </div>
                    </div>
                )}
            </form>

            <div className="form-switch-container">
                <p className="switch-text">이미 계정이 있으신가요?</p>
                <button className="switch-btn" onClick={onSwitch}>로그인 하러가기</button>
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

const CustomDropdown = ({ name, placeholder, options, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="custom-dropdown-container">
            <div
                className="minimal-input dropdown-trigger"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={value ? "selected-value" : "placeholder"}>
                    {value || placeholder}
                </span>
                <ChevronDown size={16} className={`dropdown-arrow ${isOpen ? 'rotate' : ''}`} />
            </div>

            {isOpen && (
                <ul className="dropdown-options">
                    {options.map((opt) => (
                        <li
                            key={opt}
                            className="dropdown-option"
                            onClick={() => {
                                onChange(opt);
                                setIsOpen(false);
                            }}
                        >
                            {opt}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SignupForm;
