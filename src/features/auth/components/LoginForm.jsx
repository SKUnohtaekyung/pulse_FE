import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Store, User } from 'lucide-react';
import { login } from '../api/authApi';
import { DEMO_MODE } from '../../../config/env';
import { FormError, InlineError, LoadingSpinner } from '../../../components/common/StateViews';
import { getErrorMessage } from '../../../utils/apiError';
import { consumeSessionExpiredNotice } from '../../../utils/session';
import '../AuthPage.css';

const DEV_MODE = import.meta.env.DEV;

// 전시 데모 계정 (fetch 인터셉터가 응답한다. 실제 계정·비밀번호가 아님)
const DEMO_ACCOUNTS = {
    owner: { email: 'owner@pulse.dev', password: 'pulse-demo' },
    influencer: { email: 'creator@pulse.dev', password: 'pulse-demo' },
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;
const MAX_PASSWORD_LENGTH = 64;

/** 제출 시점에 전체를 검증한다. 반환값이 비어 있으면 통과. */
const validate = ({ email, password }) => {
    const errors = {};

    const trimmedEmail = email.trim();
    if (!trimmedEmail) errors.email = '이메일을 입력해 주세요.';
    else if (trimmedEmail.length > MAX_EMAIL_LENGTH) errors.email = '이메일이 너무 길어요.';
    else if (!EMAIL_PATTERN.test(trimmedEmail)) errors.email = '이메일 형식을 확인해 주세요. (예: pulse@example.com)';

    if (!password) errors.password = '비밀번호를 입력해 주세요.';
    else if (password.length > MAX_PASSWORD_LENGTH) errors.password = '비밀번호가 너무 길어요.';

    return errors;
};

const LoginForm = ({ onSwitch }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState(() => (DEMO_MODE ? { ...DEMO_ACCOUNTS.owner } : { email: '', password: '' }));
    const [fieldErrors, setFieldErrors] = useState({});
    const [formError, setFormError] = useState(null);
    const [sessionNotice, setSessionNotice] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ref 로 막아야 같은 tick 의 연속 제출(Enter 연타)까지 차단된다.
    const submittingRef = useRef(false);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    useEffect(() => {
        // 인증 만료로 밀려난 경우 "작업 중이었다"는 사실을 알려 준다.
        setSessionNotice(consumeSessionExpiredNotice());
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // 입력을 고치면 해당 필드 오류만 즉시 해제한다.
        setFieldErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
    };

    const focusFirstError = (errors) => {
        if (errors.email) emailRef.current?.focus();
        else if (errors.password) passwordRef.current?.focus();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submittingRef.current) return;

        setFormError(null);
        setSessionNotice(false);

        const errors = validate(formData);
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            focusFirstError(errors);
            return;
        }
        setFieldErrors({});

        await submitLogin({ email: formData.email.trim(), password: formData.password });
    };

    const submitLogin = async (credentials) => {
        if (submittingRef.current) return;
        submittingRef.current = true;
        setIsSubmitting(true);
        setFormError(null);

        try {
            const data = await login(credentials);
            const role = data?.user?.role;
            const redirectTo = location.state?.from;
            if (redirectTo && typeof redirectTo === 'string' && redirectTo.startsWith('/')) {
                navigate(redirectTo, { replace: true });
            } else {
                navigate(String(role || '').toUpperCase() === 'INFLUENCER' ? '/influencer/dashboard' : '/dashboard');
            }
        } catch (error) {
            // 로그인 실패로 기존 세션까지 지우지 않는다. 입력값도 그대로 유지한다.
            if (error?.fieldErrors) setFieldErrors(error.fieldErrors);
            setFormError(getErrorMessage(error, '이메일 또는 비밀번호를 다시 확인해 주세요.'));
            passwordRef.current?.focus();
        } finally {
            submittingRef.current = false;
            setIsSubmitting(false);
        }
    };

    // 개발자 빠른 진입: mock 유저로 즉시 로그인
    const handleDevBypassLogin = async (role = 'owner') => {
        // 전시 데모: 실제 로그인 흐름 그대로 데모 계정으로 로그인한다 (인터셉터가 응답).
        if (DEMO_MODE) {
            setFormData({ ...DEMO_ACCOUNTS[role] });
            await submitLogin({ ...DEMO_ACCOUNTS[role] });
            return;
        }
        if (role === 'owner') {
            // 통합 가상 사장님(범계 든든국밥/김든든)을 localStorage 에 시딩.
            // 동적 import 로 dev 목 모듈을 프로덕션 번들에서 격리한다.
            const { seedDevOwner } = await import('../../../dev/seedDevOwner');
            seedDevOwner();
            navigate('/dashboard');
        } else {
            const mockInfluencer = {
                id: 'influencer_999',
                role: 'INFLUENCER',
                name: '테스트 인플루언서'
            };
            localStorage.setItem('user', JSON.stringify(mockInfluencer));
            localStorage.setItem('accessToken', 'dev-bypass-token');
            navigate('/influencer/dashboard');
        }
    };

    return (
        <div className="form-wrapper fade-in">
            <h2 className="form-title">환영합니다!</h2>
            <p className="form-subtitle">
                복잡한 마케팅은 펄스에게 맡기고<br />
                오늘도 맛있는 요리에만 집중하세요.
            </p>

            <form onSubmit={handleSubmit} noValidate>
                {(DEV_MODE || DEMO_MODE) && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                        <button
                            type="button"
                            onClick={() => handleDevBypassLogin('owner')}
                            disabled={isSubmitting}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '48px', background: '#002B7A', color: '#FFFFFF', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 700, fontSize: '15px' }}
                        >
                            <Store size={18} aria-hidden="true" />
                            데모 사장님으로 체험하기
                        </button>
                        <button
                            type="button"
                            onClick={() => handleDevBypassLogin('influencer')}
                            disabled={isSubmitting}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '48px', background: '#FFFFFF', color: '#002B7A', border: '1px solid #CBD5E1', borderRadius: '12px', cursor: 'pointer', fontWeight: 700, fontSize: '15px' }}
                        >
                            <User size={18} aria-hidden="true" />
                            데모 인플루언서로 체험하기
                        </button>
                        <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#475569', textAlign: 'center' }}>
                            {DEMO_MODE ? '범계 든든국밥 데모 계정으로 바로 둘러볼 수 있어요.' : '개발용 빠른 로그인'}
                        </p>
                    </div>
                )}

                {sessionNotice && (
                    <div style={{ marginBottom: '16px' }}>
                        <FormError>로그인 시간이 만료되어 작업이 중단됐어요. 다시 로그인하면 이어서 진행할 수 있어요.</FormError>
                    </div>
                )}

                {formError && (
                    <div style={{ marginBottom: '16px' }}>
                        <FormError>{formError}</FormError>
                    </div>
                )}

                <div className="input-group">
                    <input
                        ref={emailRef}
                        type="email"
                        name="email"
                        data-testid="login-email"
                        placeholder="이메일"
                        className="minimal-input"
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="email"
                        maxLength={MAX_EMAIL_LENGTH}
                        aria-label="이메일"
                        aria-invalid={!!fieldErrors.email}
                        aria-describedby={fieldErrors.email ? 'login-email-error' : undefined}
                        disabled={isSubmitting}
                    />
                    <InlineError id="login-email-error">{fieldErrors.email}</InlineError>
                </div>
                <div className="input-group">
                    <PasswordInput
                        inputRef={passwordRef}
                        name="password"
                        testId="login-password"
                        placeholder="비밀번호"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        error={fieldErrors.password}
                        errorId="login-password-error"
                    />
                    <InlineError id="login-password-error">{fieldErrors.password}</InlineError>
                </div>

                <button
                    type="submit"
                    className="submit-btn"
                    data-testid="login-submit"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                >
                    {isSubmitting ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            <LoadingSpinner size="sm" label="로그인 중" />
                            로그인 중…
                        </span>
                    ) : '로그인'}
                </button>
            </form>

            <div className="form-switch-container">
                <p className="switch-text">아직 PULSE 계정이 없으신가요?</p>
                <button type="button" className="switch-btn" onClick={onSwitch}>회원가입 하러가기</button>
            </div>

        </div>
    );
};


const PasswordInput = ({ name, placeholder, value, onChange, testId, inputRef, disabled, error, errorId }) => {
    const [show, setShow] = useState(false);
    return (
        <div className="password-wrapper-minimal">
            <input
                ref={inputRef}
                type={show ? "text" : "password"}
                name={name}
                data-testid={testId}
                placeholder={placeholder}
                className="minimal-input"
                value={value}
                onChange={onChange}
                autoComplete="current-password"
                maxLength={MAX_PASSWORD_LENGTH}
                aria-label="비밀번호"
                aria-invalid={!!error}
                aria-describedby={error ? errorId : undefined}
                disabled={disabled}
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
    );
};

export default LoginForm;
