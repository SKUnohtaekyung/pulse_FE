import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import SignupLoadingScreen from './SignupLoadingScreen';
import { useSignupProgress } from '../../../hooks/useSignupProgress';
import { InlineError } from '../../../components/common/StateViews';
import { writeJson } from '../../../utils/safeStorage';
import '../AuthPage.css';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^01[016-9]-?\d{3,4}-?\d{4}$/;

const MAX_LENGTH = {
    name: 30,
    phone: 20,
    email: 254,
    password: 64,
    storeName: 60,
    customCategory: 30,
    detailAddress: 100,
};

const SignupForm = ({ onSwitch }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    // Status: 'idle' | 'loading' | 'success' | 'error'
    const { progress, message, status, startPolling } = useSignupProgress();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const submittingRef = useRef(false);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        passwordConfirm: '',
        storeName: '',
        category: '',
        customCategory: '',
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

    // No auto-redirect useEffect - waiting for user action on Success screen

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

        // 수정한 필드의 오류만 즉시 해제해, 타이핑 중 다른 오류가 사라지지 않게 한다.
        setErrors(prev => (prev[name] ? { ...prev, [name]: undefined } : prev));

        if (name === 'password') {
            setPasswordValidation(validatePassword(value));
        }
    };

    /** 첫 번째 오류 필드로 포커스를 옮긴다. */
    const focusFirstError = (nextErrors, order) => {
        const firstKey = order.find((key) => nextErrors[key]);
        if (!firstKey) return;
        const el = document.querySelector(`[name="${firstKey}"]`);
        if (el && typeof el.focus === 'function') el.focus();
    };

    const validateStep1 = () => {
        const next = {};
        const name = formData.name.trim();
        const phone = formData.phone.trim();
        const email = formData.email.trim();

        if (!name) next.name = '이름을 입력해 주세요.';
        else if (name.length > MAX_LENGTH.name) next.name = `이름은 ${MAX_LENGTH.name}자 이내로 입력해 주세요.`;

        if (!phone) next.phone = '휴대폰 번호를 입력해 주세요.';
        else if (!PHONE_PATTERN.test(phone.replace(/\s/g, ''))) next.phone = '휴대폰 번호 형식을 확인해 주세요. (예: 010-1234-5678)';

        if (!email) next.email = '이메일을 입력해 주세요.';
        else if (email.length > MAX_LENGTH.email) next.email = '이메일이 너무 길어요.';
        else if (!EMAIL_PATTERN.test(email)) next.email = '이메일 형식을 확인해 주세요. (예: pulse@example.com)';

        const rules = validatePassword(formData.password);
        if (!formData.password) next.password = '비밀번호를 입력해 주세요.';
        else if (formData.password.length > MAX_LENGTH.password) next.password = '비밀번호가 너무 길어요.';
        else if (!rules.minLength || !rules.hasSpecialChar || !rules.hasLowerCase || !rules.hasNumber) {
            next.password = '8자 이상, 영어 소문자·숫자·특수문자를 모두 포함해 주세요.';
        }

        if (!formData.passwordConfirm) next.passwordConfirm = '비밀번호를 한 번 더 입력해 주세요.';
        else if (formData.password !== formData.passwordConfirm) next.passwordConfirm = '비밀번호가 서로 달라요. 다시 확인해 주세요.';

        return next;
    };

    const validateStep2 = () => {
        const next = {};
        const storeName = formData.storeName.trim();
        const detailAddress = formData.detailAddress.trim();

        if (!storeName) next.storeName = '가게 이름을 입력해 주세요.';
        else if (storeName.length > MAX_LENGTH.storeName) next.storeName = `가게 이름은 ${MAX_LENGTH.storeName}자 이내로 입력해 주세요.`;

        // 드롭다운은 div 기반이라 브라우저 required 가 걸리지 않는다. 직접 확인한다.
        if (!formData.category) next.category = '업종을 선택해 주세요.';
        else if (formData.category === '기타' && !formData.customCategory.trim()) next.customCategory = '업종을 직접 입력해 주세요.';

        if (!formData.address.trim()) next.address = '우편번호 찾기로 주소를 선택해 주세요.';
        if (!detailAddress) next.detailAddress = '상세주소를 입력해 주세요.';
        else if (detailAddress.length > MAX_LENGTH.detailAddress) next.detailAddress = '상세주소가 너무 길어요.';

        if (!formData.agreed) next.agreed = '개인정보 수집 및 이용에 동의해 주세요.';

        return next;
    };

    const execDaumPostcode = () => {
        new window.daum.Postcode({
            oncomplete: function (data) {
                let addr = '';
                let extraAddr = '';

                if (data.userSelectedType === 'R') {
                    addr = data.roadAddress;
                } else {
                    addr = data.jibunAddress;
                }

                if (data.userSelectedType === 'R') {
                    if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                        extraAddr += data.bname;
                    }
                    if (data.buildingName !== '' && data.apartment === 'Y') {
                        extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                    }
                    if (extraAddr !== '') {
                        extraAddr = ' (' + extraAddr + ')';
                    }
                    addr += extraAddr;
                }

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
        // 제출 중 Enter 연타로 요청이 중복되지 않도록 막는다.
        if (submittingRef.current) return;

        if (step === 1) {
            const next = validateStep1();
            setErrors(next);
            if (Object.keys(next).length > 0) {
                focusFirstError(next, ['name', 'phone', 'email', 'password', 'passwordConfirm']);
                return;
            }
            setStep(2);
            return;
        }

        const next = validateStep2();
        setErrors(next);
        if (Object.keys(next).length > 0) {
            focusFirstError(next, ['storeName', 'category', 'customCategory', 'address', 'detailAddress', 'agreed']);
            return;
        }
        handleSubmit();
    };

    const toCategoryEnum = (category, customCategory) => {
        const value = String(category || '').trim();
        const custom = String(customCategory || '').trim();
        const validEnums = ['KOREAN', 'JAPANESE', 'CHINESE', 'WESTERN', 'CAFE_DESSERT', 'BAR', 'ETC'];

        if (validEnums.includes(value)) return value;
        if (custom) return 'ETC';
        if (value.includes('중') || value.includes('中')) return 'CHINESE';
        if (value.includes('일')) return 'JAPANESE';
        if (value.includes('양') || value.toLowerCase().includes('western')) return 'WESTERN';
        if (value.includes('카페') || value.includes('디저트') || value.toLowerCase().includes('cafe')) return 'CAFE_DESSERT';
        if (value.includes('주점') || value.includes('술') || value.toLowerCase().includes('bar')) return 'BAR';
        if (value.includes('기타') || value.includes('其他')) return 'ETC';
        return 'KOREAN';
    };

    const handleSubmit = async () => {
        const categoryEnum = toCategoryEnum(formData.category, formData.customCategory);
        const customCategory = String(formData.customCategory || '').trim();
        const shopName = String(formData.storeName || '').trim() || `${String(formData.name || '').trim() || 'PULSE'} 가게`;
        const shopAddress = `${formData.address || ''} ${formData.detailAddress || ''}`.trim() || '주소 미입력';

        // Prepare payload for Spring Boot API
        // 서버로 보내기 전에 앞뒤 공백을 정리한다.
        const payload = {
            email: formData.email.trim(),
            password: formData.password,
            passwordConfirm: formData.passwordConfirm,
            name: formData.name.trim(),
            phone: formData.phone.trim(),
            isPrivacyAgreed: formData.agreed,
            shopInfo: {
                name: shopName,
                address: shopAddress,
                category: categoryEnum,
                customCategory: categoryEnum === 'ETC' ? customCategory || null : null,
            }
        };

        writeJson('pulseStoreProfileDraft', {
            storeName: shopName,
            category: formData.category === '기타' ? customCategory || '기타' : formData.category,
            address: `${formData.address} ${formData.detailAddress}`.trim(),
        });

        // Start Loading Process with real API call
        submittingRef.current = true;
        setIsLoading(true);
        startPolling(payload);
    };

    // Callback when user clicks "Start" on success screen
    const handleComplete = () => {
        submittingRef.current = false;
        setIsLoading(false);
        navigate('/dashboard');
    };

    // Callback when user clicks "Retry" on error screen
    const handleRetry = () => {
        startPolling();
    };

    return (
        <AnimatePresence mode="wait">
            {isLoading ? (
                <SignupLoadingScreen
                    key="loading"
                    progress={progress}
                    message={message}
                    status={status}
                    onComplete={handleComplete}
                    onRetry={handleRetry}
                />
            ) : (
                <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="form-wrapper"
                >
                    <div className="mb-6">
                        <h2 className="form-title">{step === 1 ? 'PULSE 시작하기' : '가게 등록'}</h2>
                        
                        <div className="flex items-center gap-2 mb-3 mt-3">
                            {[1, 2].map((num) => (
                                <div key={num} className="flex-1 h-1.5 rounded-full overflow-hidden bg-[#F2F4F6]">
                                    <div className={`h-full rounded-full transition-all duration-500 ${step >= num ? 'bg-[#002B7A]' : 'bg-transparent'}`}></div>
                                </div>
                            ))}
                        </div>
                        
                        <p className="form-subtitle" style={{ marginBottom: 0 }}>
                            {step === 1 
                                ? '마케팅 자동화의 첫 걸음, 계정을 생성해보세요.' 
                                : '사장님의 소중한 가게 정보를 알려주세요.'}
                        </p>
                    </div>

                    <form onSubmit={handleNext} noValidate>
                        {step === 1 ? (
                            <div className="fade-in">
                                <div className="input-row">
                                    <div style={{ flex: 1 }}>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="이름 (실명)"
                                            className="minimal-input"
                                            value={formData.name}
                                            onChange={handleChange}
                                            autoComplete="name"
                                            maxLength={MAX_LENGTH.name}
                                            aria-label="이름"
                                            aria-invalid={!!errors.name}
                                            aria-describedby={errors.name ? 'signup-name-error' : undefined}
                                        />
                                        <InlineError id="signup-name-error">{errors.name}</InlineError>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="휴대폰 번호"
                                            className="minimal-input"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            autoComplete="tel"
                                            maxLength={MAX_LENGTH.phone}
                                            aria-label="휴대폰 번호"
                                            aria-invalid={!!errors.phone}
                                            aria-describedby={errors.phone ? 'signup-phone-error' : undefined}
                                        />
                                        <InlineError id="signup-phone-error">{errors.phone}</InlineError>
                                    </div>
                                </div>

                                <div className="input-group">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="이메일 (아이디)"
                                        className="minimal-input"
                                        value={formData.email}
                                        onChange={handleChange}
                                        autoComplete="email"
                                        maxLength={MAX_LENGTH.email}
                                        aria-label="이메일"
                                        aria-invalid={!!errors.email}
                                        aria-describedby={errors.email ? 'signup-email-error' : undefined}
                                    />
                                    <InlineError id="signup-email-error">{errors.email}</InlineError>
                                </div>
                                <div className="input-group">
                                    <PasswordInput
                                        name="password"
                                        placeholder="비밀번호 (8자 이상)"
                                        value={formData.password}
                                        onChange={handleChange}
                                        validation={passwordValidation}
                                        autoComplete="new-password"
                                        ariaLabel="비밀번호"
                                        error={errors.password}
                                        errorId="signup-password-error"
                                    />
                                    <InlineError id="signup-password-error">{errors.password}</InlineError>
                                </div>
                                {/* 오타로 가입하면 다시 로그인할 방법이 없으므로 확인 입력을 받는다 */}
                                <div className="input-group">
                                    <PasswordInput
                                        name="passwordConfirm"
                                        placeholder="비밀번호 확인"
                                        value={formData.passwordConfirm}
                                        onChange={handleChange}
                                        autoComplete="new-password"
                                        ariaLabel="비밀번호 확인"
                                        error={errors.passwordConfirm}
                                        errorId="signup-password-confirm-error"
                                    />
                                    <InlineError id="signup-password-confirm-error">{errors.passwordConfirm}</InlineError>
                                </div>

                                <button type="submit" className="submit-btn">
                                    다음으로 &rarr;
                                </button>
                            </div>
                        ) : (
                            <div className="fade-in">
                                <div className="input-row">
                                    <div style={{ flex: 1 }}>
                                        <input
                                            type="text"
                                            name="storeName"
                                            placeholder="가게 이름"
                                            className="minimal-input"
                                            value={formData.storeName}
                                            onChange={handleChange}
                                            maxLength={MAX_LENGTH.storeName}
                                            aria-label="가게 이름"
                                            aria-invalid={!!errors.storeName}
                                            aria-describedby={errors.storeName ? 'signup-store-name-error' : undefined}
                                        />
                                        <InlineError id="signup-store-name-error">{errors.storeName}</InlineError>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <CustomDropdown
                                            name="category"
                                            placeholder="업종 선택"
                                            options={["한식", "중식", "일식", "양식", "카페/디저트", "주점", "기타"]}
                                            value={formData.category}
                                            error={errors.category || errors.customCategory}
                                            onChange={({ category, customCategory }) => {
                                                setErrors(prev => ({ ...prev, category: undefined, customCategory: undefined }));
                                                setFormData(prev => ({
                                                    ...prev,
                                                    category,
                                                    customCategory: customCategory ?? prev.customCategory
                                                }));
                                            }}
                                        />
                                        <InlineError id="signup-category-error">{errors.category || errors.customCategory}</InlineError>
                                    </div>
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
                                    <div className="input-row" style={{ gap: '8px', marginBottom: '0px' }}>
                                        <input
                                            type="text"
                                            name="address"
                                            placeholder="주소"
                                            className="minimal-input"
                                            value={formData.address}
                                            readOnly
                                            aria-label="주소"
                                            aria-invalid={!!errors.address}
                                            aria-describedby={errors.address ? 'signup-address-error' : undefined}
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
                                    <InlineError id="signup-address-error">{errors.address}</InlineError>
                                    <input
                                        type="text"
                                        name="detailAddress"
                                        placeholder="상세주소"
                                        className="minimal-input"
                                        value={formData.detailAddress}
                                        onChange={handleChange}
                                        maxLength={MAX_LENGTH.detailAddress}
                                        aria-label="상세주소"
                                        aria-invalid={!!errors.detailAddress}
                                        aria-describedby={errors.detailAddress ? 'signup-detail-address-error' : undefined}
                                    />
                                    <InlineError id="signup-detail-address-error">{errors.detailAddress}</InlineError>
                                </div>

                                <div className="checkbox-group" style={{ marginTop: '24px' }}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="agreed"
                                            checked={formData.agreed}
                                            onChange={handleChange}
                                            aria-invalid={!!errors.agreed}
                                            aria-describedby={errors.agreed ? 'signup-agreed-error' : undefined}
                                        />
                                        <span>[필수] 개인정보 수집 및 이용 동의</span>
                                    </label>
                                    <InlineError id="signup-agreed-error">{errors.agreed}</InlineError>
                                </div>


                                <div className="form-actions-row horizontal">
                                    <button type="button" className="back-btn" onClick={() => setStep(1)}>
                                        이전
                                    </button>
                                    <button type="submit" className="submit-btn full-width" disabled={isLoading}>
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
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const PasswordInput = ({ name, placeholder, value, onChange, validation, autoComplete, ariaLabel, error, errorId }) => {
    const [show, setShow] = useState(false);

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
                    autoComplete={autoComplete}
                    maxLength={MAX_LENGTH.password}
                    aria-label={ariaLabel || placeholder}
                    aria-invalid={!!error}
                    aria-describedby={error ? errorId : undefined}
                />
                <button
                    type="button"
                    className="toggle-icon"
                    onClick={() => setShow(!show)}
                    aria-label={show ? '비밀번호 숨기기' : '비밀번호 표시'}
                    aria-pressed={show}
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                >
                    {show ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                </button>
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
                        <span>영어 포함</span>
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

const CustomDropdown = ({ name, placeholder, options, value, onChange, error }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCustom, setIsCustom] = useState(false);
    const [customValue, setCustomValue] = useState('');
    const containerRef = useRef(null);

    // 바깥 클릭 / ESC 로 닫기 — 열린 채로 화면을 가리지 않게 한다.
    React.useEffect(() => {
        if (!isOpen) return undefined;
        const handlePointerDown = (event) => {
            if (!containerRef.current?.contains(event.target)) setIsOpen(false);
        };
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') setIsOpen(false);
        };
        document.addEventListener('mousedown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    const handleOptionClick = (opt) => {
        if (opt === '기타') {
            setIsCustom(true);
            setIsOpen(false);
            setCustomValue('');
            onChange({ category: '기타', customCategory: '' });
        } else {
            setIsCustom(false);
            onChange({ category: opt, customCategory: '' });
            setIsOpen(false);
        }
    };

    const handleCustomInputChange = (e) => {
        const val = e.target.value;
        setCustomValue(val);
        onChange({ category: '기타', customCategory: val });
    };

    return (
        <div className="custom-dropdown-container" ref={containerRef}>
            {isCustom ? (
                <div style={{ position: 'relative' }}>
                    <input
                        type="text"
                        name="customCategory"
                        className="minimal-input"
                        placeholder="업종을 직접 입력하세요"
                        value={customValue}
                        onChange={handleCustomInputChange}
                        maxLength={MAX_LENGTH.customCategory}
                        aria-label="업종 직접 입력"
                        aria-invalid={!!error}
                    />
                    <button
                        type="button"
                        onClick={() => {
                            setIsCustom(false);
                            setCustomValue('');
                            onChange({ category: '', customCategory: '' });
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
                    <button
                        type="button"
                        name={name}
                        className="minimal-input dropdown-trigger"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-haspopup="listbox"
                        aria-expanded={isOpen}
                        aria-label={value ? `업종: ${value}` : placeholder}
                        aria-invalid={!!error}
                        style={{ width: '100%', textAlign: 'left' }}
                    >
                        <span className={value ? "selected-value" : "placeholder"}>
                            {value || placeholder}
                        </span>
                        <ChevronDown size={16} className={`dropdown-arrow ${isOpen ? 'rotate' : ''}`} aria-hidden="true" />
                    </button>

                    {isOpen && (
                        <ul className="dropdown-options" role="listbox" aria-label="업종 목록">
                            {options.map((opt) => (
                                <li key={opt} role="option" aria-selected={value === opt}>
                                    <button
                                        type="button"
                                        className="dropdown-option"
                                        onClick={() => handleOptionClick(opt)}
                                        style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        {opt}
                                    </button>
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
