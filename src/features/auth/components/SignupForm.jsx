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
        postcode: '',
        address: '',
        detailAddress: '',

        agreed: false
    });
    const [passwordValidation, setPasswordValidation] = useState({
        minLength: false,
        hasSpecialChar: false,
        hasLowerCase: false,
        hasNumber: false
    });

    const validatePassword = (password) => {
        return {
            minLength: password.length >= 8,
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            hasLowerCase: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password)
        };
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // 비밀번호 입력 시 실시간 검증
        if (name === 'password') {
            setPasswordValidation(validatePassword(value));
        }
    };

    // Daum 우편번호 API 호출
    const execDaumPostcode = () => {
        new window.daum.Postcode({
            oncomplete: function(data) {
                let addr = ''; // 주소 변수
                let extraAddr = ''; // 참고항목 변수

                // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
                if (data.userSelectedType === 'R') { // 도로명 주소
                    addr = data.roadAddress;
                } else { // 지번 주소
                    addr = data.jibunAddress;
                }

                // 도로명 주소일 때 참고항목을 조합
                if(data.userSelectedType === 'R'){
                    if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                        extraAddr += data.bname;
                    }
                    if(data.buildingName !== '' && data.apartment === 'Y'){
                        extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                    }
                    if(extraAddr !== ''){
                        extraAddr = ' (' + extraAddr + ')';
                    }
                    addr += extraAddr;
                }

                // 우편번호와 주소 정보를 state에 설정
                setFormData(prev => ({
                    ...prev,
                    postcode: data.zonecode,
                    address: addr
                }));
            }
        }).open();
    };

    const handleNext = (e) => {
        e.preventDefault();
        if (step === 1) {
            if (!formData.name || !formData.phone || !formData.email || !formData.password ) {
                alert("모든 필수 항목을 입력해주세요.");
                return;
            }
            
            // 비밀번호 유효성 검사
            const validation = validatePassword(formData.password);
            if (!validation.minLength || !validation.hasSpecialChar || !validation.hasLowerCase || !validation.hasNumber) {
                alert("비밀번호는 8자 이상, 특수문자, 영어 소문자, 숫자를 포함해야 합니다.");
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
                                validation={passwordValidation}
                            />
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
                                name="postcode"
                                placeholder="우편번호"
                                className="minimal-input"
                                value={formData.postcode}
                                readOnly
                            />
                            <div className="input-row" style={{ gap: '8px' , marginBottom: '0px'}}>
                                <input
                                    type="text"
                                    name="address"
                                    placeholder="주소"
                                    className="minimal-input"
                                    value={formData.address}
                                    readOnly
                                    required
                                    style={{ flex: '1' }}
                                />
                                <button
                                    type="button"
                                    onClick={execDaumPostcode}
                                    className="submit-btn"
                                    style={{ 
                                        flex: '0 0 auto',
                                        width: '120px',
                                        padding: '0 15px',
                                        fontSize: '14px',
                                        whiteSpace: 'nowrap',
                                        margin: '7px'
                                    }}
                                >
                                    우편번호 찾기
                                </button>
                            </div>
                            <input
                                type="text"
                                name="detailAddress"
                                placeholder="상세주소"
                                className="minimal-input"
                                value={formData.detailAddress}
                                onChange={handleChange}
                                required
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

const PasswordInput = ({ name, placeholder, value, onChange, validation }) => {
    const [show, setShow] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    
    return (
        <div>
            <div className="password-wrapper-minimal">
                <input
                    type={show ? "text" : "password"}
                    name={name}
                    placeholder={placeholder}
                    className="minimal-input"
                    value={value}
                    onChange={onChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    required
                />
                <div className="toggle-icon" onClick={() => setShow(!show)}>
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
            </div>
            
            {/* 비밀번호 유효성 검사 피드백 */}
            {validation && value && (
                <div className="password-requirements" style={{
                    marginTop: '12px',
                    padding: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '8px',
                    fontSize: '13px'
                }}>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        marginBottom: '6px',
                        color: validation.minLength ? '#10b981' : '#6b7280'
                    }}>
                        <span>{validation.minLength ? '✓' : '○'}</span>
                        <span>8자 이상</span>
                    </div>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        marginBottom: '6px',
                        color: validation.hasSpecialChar ? '#10b981' : '#6b7280'
                    }}>
                        <span>{validation.hasSpecialChar ? '✓' : '○'}</span>
                        <span>특수문자 포함</span>
                    </div>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        marginBottom: '6px',
                        color: validation.hasLowerCase ? '#10b981' : '#6b7280'
                    }}>
                        <span>{validation.hasLowerCase ? '✓' : '○'}</span>
                        <span>영어 소문자 포함</span>
                    </div>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        color: validation.hasNumber ? '#10b981' : '#6b7280'
                    }}>
                        <span>{validation.hasNumber ? '✓' : '○'}</span>
                        <span>숫자 포함</span>
                    </div>
                </div>
            )}
        </div>
    );
};

const CustomDropdown = ({ name, placeholder, options, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCustom, setIsCustom] = useState(false);
    const [customValue, setCustomValue] = useState('');

    const handleOptionClick = (opt) => {
        if (opt === '기타') {
            setIsCustom(true);
            setIsOpen(false);
            setCustomValue('');
        } else {
            setIsCustom(false);
            onChange(opt);
            setIsOpen(false);
        }
    };

    const handleCustomInputChange = (e) => {
        const val = e.target.value;
        setCustomValue(val);
        onChange(val);
    };

    return (
        <div className="custom-dropdown-container">
            {isCustom ? (
                <div style={{ position: 'relative' }}>
                    <input
                        type="text"
                        className="minimal-input"
                        placeholder="업종을 직접 입력하세요"
                        value={customValue}
                        onChange={handleCustomInputChange}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => {
                            setIsCustom(false);
                            setCustomValue('');
                            onChange('');
                        }}
                        style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            color: '#6b7280',
                            cursor: 'pointer',
                            fontSize: '12px'
                        }}
                    >
                        취소
                    </button>
                </div>
            ) : (
                <>
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
                                    onClick={() => handleOptionClick(opt)}
                                >
                                    {opt}
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
};

export default SignupForm;
