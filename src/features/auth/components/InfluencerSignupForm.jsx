import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, X, Instagram, Youtube, Sparkles, Eye, EyeOff } from 'lucide-react';
import { signupInfluencer } from '../api/authApi';
import { FormError, InlineError, LoadingSpinner } from '../../../components/common/StateViews';
import { getErrorMessage } from '../../../utils/apiError';

const CATEGORIES = ["맛집", "카페", "뷰티", "라이프스타일", "패션", "테크", "기타"];
const LOCATIONS = ["전국", "서울 강남구", "서울 성동구", "서울 서초구", "서울 마포구", "서울 송파구", "경기", "인천", "기타 지역"];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME_LENGTH = 30;
const MAX_EMAIL_LENGTH = 254;
const MAX_PASSWORD_LENGTH = 64;

export default function InfluencerSignupForm({ onSwitch }) {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: '', password: '', passwordConfirm: '', name: '',
        profileImage: null, bio: '', location: '', niche: '', tags: [],
        instagramUrl: '', youtubeUrl: '', agreedToTerms: false
    });

    const [tagInput, setTagInput] = useState('');
    const [pwVisible, setPwVisible] = useState(false);
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const submittingRef = useRef(false);
    const [pwValidation, setPwValidation] = useState({
        minLength: false, hasSpecialChar: false, hasLowerCase: false, hasNumber: false
    });

    const validatePassword = (pw) => ({
        minLength: pw.length >= 8,
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(pw),
        hasLowerCase: /[a-z]/.test(pw),
        hasNumber: /[0-9]/.test(pw)
    });

    const clearFieldError = (field) =>
        setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));

    const handlePasswordChange = (e) => {
        const val = e.target.value;
        setFormData({ ...formData, password: val });
        setPwValidation(validatePassword(val));
        clearFieldError('password');
    };

    const focusField = (name) => {
        const el = document.querySelector(`[name="${name}"]`);
        if (el && typeof el.focus === 'function') el.focus();
    };

    const validateStep1 = () => {
        const next = {};
        const email = formData.email.trim();
        const name = formData.name.trim();

        if (!email) next.email = '이메일을 입력해 주세요.';
        else if (email.length > MAX_EMAIL_LENGTH) next.email = '이메일이 너무 길어요.';
        else if (!EMAIL_PATTERN.test(email)) next.email = '이메일 형식을 확인해 주세요. (예: pulse@example.com)';

        if (!name) next.name = '활동명을 입력해 주세요.';
        else if (name.length > MAX_NAME_LENGTH) next.name = `활동명은 ${MAX_NAME_LENGTH}자 이내로 입력해 주세요.`;

        // 자동완성처럼 handlePasswordChange 를 우회하는 입력도 잡히도록 값을 직접 검증한다.
        const rules = validatePassword(formData.password);
        if (!formData.password) next.password = '비밀번호를 입력해 주세요.';
        else if (formData.password.length > MAX_PASSWORD_LENGTH) next.password = '비밀번호가 너무 길어요.';
        else if (!rules.minLength || !rules.hasSpecialChar || !rules.hasLowerCase || !rules.hasNumber) {
            next.password = '8자 이상, 영어 소문자·숫자·특수문자를 모두 포함해 주세요.';
        }

        if (!formData.passwordConfirm) next.passwordConfirm = '비밀번호를 한 번 더 입력해 주세요.';
        else if (formData.password !== formData.passwordConfirm) next.passwordConfirm = '비밀번호가 서로 달라요. 다시 확인해 주세요.';

        return next;
    };

    const handleNext = (e) => {
        e.preventDefault();
        if (step === 1) {
            const next = validateStep1();
            setErrors(next);
            const firstKey = ['email', 'name', 'password', 'passwordConfirm'].find((key) => next[key]);
            if (firstKey) {
                focusField(firstKey);
                return;
            }
        }
        setStep(Math.min(step + 1, 3));
    };

    const handlePrev = (e) => {
        e.preventDefault();
        setStep(Math.max(step - 1, 1));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Enter 연타·더블클릭으로 계정이 중복 생성되지 않도록 막는다.
        if (submittingRef.current) return;

        submittingRef.current = true;
        setIsSubmitting(true);
        setFormError(null);

        try {
            await signupInfluencer({
                ...formData,
                email: formData.email.trim(),
                name: formData.name.trim(),
            });
            navigate('/influencer/dashboard');
        } catch (error) {
            if (error?.fieldErrors) setErrors((prev) => ({ ...prev, ...error.fieldErrors }));
            setFormError(getErrorMessage(error, '가입을 완료하지 못했어요. 입력한 내용을 확인한 후 다시 시도해 주세요.'));
        } finally {
            submittingRef.current = false;
            setIsSubmitting(false);
        }
    };

    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const val = tagInput.trim().replace(/^#/, '');
            if (val && formData.tags.length < 3 && !formData.tags.includes(val)) {
                setFormData({ ...formData, tags: [...formData.tags, val] });
            }
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove) => {
        setFormData({ ...formData, tags: formData.tags.filter(t => t !== tagToRemove) });
    };

    // 프로필 사진: 256px로 리사이즈 후 Base64(data URL)로 저장해 DB에 그대로 보관한다.
    const handleImageChange = (e) => {
        const input = e.target;
        const file = input.files?.[0];
        // 같은 파일을 다시 고를 때도 onChange 가 발생하도록 값을 비운다.
        input.value = '';
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setErrors((prev) => ({ ...prev, profileImage: 'JPG · PNG · WEBP 같은 이미지 파일만 올릴 수 있어요.' }));
            return;
        }
        clearFieldError('profileImage');
        const reader = new FileReader();
        reader.onload = (ev) => {
            const img = new Image();
            img.onload = () => {
                const MAX = 256;
                const scale = Math.min(1, MAX / Math.max(img.width, img.height));
                const w = Math.round(img.width * scale);
                const h = Math.round(img.height * scale);
                const canvas = document.createElement('canvas');
                canvas.width = w;
                canvas.height = h;
                canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
                setFormData((prev) => ({ ...prev, profileImage: dataUrl, profileImageUrl: dataUrl }));
            };
            img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="form-wrapper fade-in w-full max-w-md mx-auto custom-scrollbar overflow-y-auto" style={{ maxHeight: '85vh', paddingRight: '10px' }}>
            
            <div className="mb-8">
                <h2 className="text-[24px] font-extrabold text-[#191F28] mb-2 font-pretendard tracking-tight">PULSE 파트너 합류</h2>
                <div className="flex items-center gap-2 mb-4">
                    {[1, 2, 3].map((num) => (
                        <div key={num} className="flex-1 h-1.5 rounded-full overflow-hidden bg-[#F2F4F6]">
                            <div className={`h-full rounded-full transition-all duration-500 ${step >= num ? 'bg-[#002B7A]' : 'bg-transparent'}`}></div>
                        </div>
                    ))}
                </div>
                <p className="text-[14px] text-[#4E5968] font-medium">
                    {step === 1 && "계정 정보 (1/3)"}
                    {step === 2 && "프로필 완성 (2/3)"}
                    {step === 3 && "채널 연동 (3/3)"}
                </p>
            </div>

            <form onSubmit={step === 3 ? handleSubmit : handleNext} className="flex flex-col gap-5">

                {/* STEP 1: ACCOUNT */}
                {step === 1 && (
                    <div className="flex flex-col gap-4 animate-fade-in-up">
                        <div className="input-group">
                            <label className="text-[13px] font-bold text-[#333D4B] mb-1.5 block">이메일 계정 <span className="text-[#FF5A36]">*</span></label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={(e) => { setFormData({...formData, email: e.target.value}); clearFieldError('email'); }}
                                placeholder="제안서를 받을 이메일을 입력하세요"
                                autoComplete="email"
                                maxLength={MAX_EMAIL_LENGTH}
                                aria-invalid={!!errors.email}
                                aria-describedby={errors.email ? 'influencer-email-error' : undefined}
                                className="w-full h-[48px] px-4 bg-white border border-[#E5E8EB] rounded-[12px] text-[15px] focus:border-[#002B7A] focus:ring-1 focus:ring-[#002B7A] outline-none transition-all"
                            />
                            <InlineError id="influencer-email-error">{errors.email}</InlineError>
                        </div>
                        <div className="input-group">
                            <label className="text-[13px] font-bold text-[#333D4B] mb-1.5 block">비밀번호 <span className="text-[#FF5A36]">*</span></label>
                            <div className="relative">
                                <input
                                    type={pwVisible ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handlePasswordChange}
                                    placeholder="8자 이상 영문, 숫자, 특수문자 조합"
                                    autoComplete="new-password"
                                    maxLength={MAX_PASSWORD_LENGTH}
                                    aria-invalid={!!errors.password}
                                    aria-describedby={errors.password ? 'influencer-password-error' : undefined}
                                    className="w-full h-[48px] px-4 pr-12 bg-white border border-[#E5E8EB] rounded-[12px] text-[15px] focus:border-[#002B7A] focus:ring-1 focus:ring-[#002B7A] outline-none transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setPwVisible(v => !v)}
                                    aria-label={pwVisible ? '비밀번호 숨기기' : '비밀번호 표시'}
                                    aria-pressed={pwVisible}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B95A1] hover:text-[#4E5968] transition-colors"
                                >
                                    {pwVisible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                                </button>
                            </div>
                            <InlineError id="influencer-password-error">{errors.password}</InlineError>
                            {/* 유효성 검사 인디케이터 — 사장님 폼과 동일 */}
                            {formData.password && (
                                <div style={{
                                    marginTop: '12px', padding: '12px',
                                    backgroundColor: 'rgba(0,0,0,0.02)',
                                    borderRadius: '8px', fontSize: '13px'
                                }}>
                                    {[
                                        { key: 'minLength',     label: '8자 이상' },
                                        { key: 'hasSpecialChar',label: '특수문자 포함' },
                                        { key: 'hasLowerCase',  label: '영어 포함' },
                                        { key: 'hasNumber',     label: '숫자 포함' },
                                    ].map(({ key, label }, i) => (
                                        <div key={key} style={{
                                            display: 'flex', alignItems: 'center', gap: '8px',
                                            marginBottom: i < 3 ? '6px' : '0',
                                            color: pwValidation[key] ? '#10b981' : '#6b7280'
                                        }}>
                                            <span>{pwValidation[key] ? '✓' : '○'}</span>
                                            <span>{label}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {/* 오타로 가입하면 다시 로그인할 방법이 없으므로 확인 입력을 받는다 */}
                        <div className="input-group">
                            <label className="text-[13px] font-bold text-[#333D4B] mb-1.5 block">비밀번호 확인 <span className="text-[#FF5A36]">*</span></label>
                            <input
                                type={pwVisible ? 'text' : 'password'}
                                name="passwordConfirm"
                                value={formData.passwordConfirm}
                                onChange={(e) => { setFormData({...formData, passwordConfirm: e.target.value}); clearFieldError('passwordConfirm'); }}
                                placeholder="비밀번호를 한 번 더 입력하세요"
                                autoComplete="new-password"
                                maxLength={MAX_PASSWORD_LENGTH}
                                aria-invalid={!!errors.passwordConfirm}
                                aria-describedby={errors.passwordConfirm ? 'influencer-password-confirm-error' : undefined}
                                className="w-full h-[48px] px-4 bg-white border border-[#E5E8EB] rounded-[12px] text-[15px] focus:border-[#002B7A] focus:ring-1 focus:ring-[#002B7A] outline-none transition-all"
                            />
                            <InlineError id="influencer-password-confirm-error">{errors.passwordConfirm}</InlineError>
                        </div>
                        <div className="input-group">
                            <label className="text-[13px] font-bold text-[#333D4B] mb-1.5 block">활동명 (닉네임) <span className="text-[#FF5A36]">*</span></label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={(e) => { setFormData({...formData, name: e.target.value}); clearFieldError('name'); }}
                                placeholder="매칭 화면에 굵게 노출됩니다"
                                maxLength={MAX_NAME_LENGTH}
                                aria-invalid={!!errors.name}
                                aria-describedby={errors.name ? 'influencer-name-error' : undefined}
                                className="w-full h-[48px] px-4 bg-white border border-[#E5E8EB] rounded-[12px] text-[15px] focus:border-[#002B7A] focus:ring-1 focus:ring-[#002B7A] outline-none transition-all"
                            />
                            <InlineError id="influencer-name-error">{errors.name}</InlineError>
                        </div>
                    </div>
                )}

                {/* STEP 2: PROFILE */}
                {step === 2 && (
                    <div className="flex flex-col gap-5 animate-fade-in-up">
                        {/* Profile Image UI */}
                        <div className="flex flex-col items-center">
                            <label className="w-[88px] h-[88px] rounded-full bg-[#F2F4F6] border-2 border-dashed border-[#D1D6DB] flex items-center justify-center text-[#8B95A1] cursor-pointer hover:border-[#002B7A] hover:bg-[#E8F3FF] transition-colors relative overflow-hidden">
                                {formData.profileImage ? (
                                    <img src={formData.profileImage} alt="프로필 미리보기" className="w-full h-full object-cover" />
                                ) : (
                                    <Camera size={24} />
                                )}
                                <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm border border-[#F2F4F6]">
                                    <div className="w-5 h-5 bg-[#002B7A] rounded-full flex items-center justify-center text-white font-bold text-xs">+</div>
                                </div>
                                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                            </label>
                            <span className="text-[12px] text-[#8B95A1] mt-2">프로필 사진 업로드 (선택)</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="input-group">
                                <label className="text-[13px] font-bold text-[#333D4B] mb-1.5 block">주력 분야 <span className="text-[#FF5A36]">*</span></label>
                                <select 
                                    required
                                    value={formData.niche}
                                    onChange={(e) => setFormData({...formData, niche: e.target.value})}
                                    className="w-full h-[48px] px-3 bg-white border border-[#E5E8EB] rounded-[12px] text-[14px] focus:border-[#002B7A] focus:ring-1 focus:ring-[#002B7A] outline-none transition-all"
                                >
                                    <option value="" disabled>분야 선택</option>
                                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div className="input-group">
                                <label className="text-[13px] font-bold text-[#333D4B] mb-1.5 block">주 활동 지역 <span className="text-[#FF5A36]">*</span></label>
                                <select 
                                    required
                                    value={formData.location}
                                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                                    className="w-full h-[48px] px-3 bg-white border border-[#E5E8EB] rounded-[12px] text-[14px] focus:border-[#002B7A] focus:ring-1 focus:ring-[#002B7A] outline-none transition-all"
                                >
                                    <option value="" disabled>지역 선택</option>
                                    {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="input-group relative">
                            <label className="text-[13px] font-bold text-[#333D4B] mb-1.5 block">한 줄 소개 <span className="text-[#FF5A36]">*</span></label>
                            <input 
                                type="text" 
                                required 
                                maxLength={50}
                                value={formData.bio}
                                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                placeholder="수십 개의 업체 대표님들을 사로잡을 한 문장"
                                className="w-full h-[48px] px-4 bg-white border border-[#E5E8EB] rounded-[12px] text-[14px] focus:border-[#002B7A] focus:ring-1 focus:ring-[#002B7A] outline-none transition-all pr-12"
                            />
                            <div className="absolute right-3 top-[34px] text-[11px] text-[#8B95A1]">{formData.bio.length}/50</div>
                        </div>

                        <div className="input-group">
                            <label className="text-[13px] font-bold text-[#333D4B] mb-1.5 flex justify-between">
                                <span>추구미 해시태그 (최대 3개)</span>
                                <span className="text-[#002B7A] font-bold font-mono">{formData.tags.length}/3</span>
                            </label>
                            <div className="min-h-[48px] p-1.5 bg-white border border-[#E5E8EB] rounded-[12px] focus-within:border-[#002B7A] focus-within:ring-1 focus-within:ring-[#002B7A] transition-all flex flex-wrap gap-1.5 items-center">
                                {formData.tags.map(tag => (
                                    <span key={tag} className="flex items-center gap-1 bg-[#F2F4F6] text-[#333D4B] text-[13px] font-medium px-2.5 py-1 rounded-md">
                                        #{tag}
                                        <button type="button" onClick={() => removeTag(tag)} className="text-[#8B95A1] hover:text-[#FF5A36]">
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                                {formData.tags.length < 3 && (
                                    <input 
                                        type="text" 
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={handleTagKeyDown}
                                        placeholder={formData.tags.length === 0 ? "스페이스바 입력 시 등록" : ""}
                                        className="flex-1 min-w-[100px] bg-transparent text-[14px] max-h-8 outline-none px-2 placeholder:text-[#B0B8C1]"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 3: CHANNELS & COMPLETE */}
                {step === 3 && (
                    <div className="flex flex-col gap-5 animate-fade-in-up">
                        
                        <div className="bg-[#E8F3FF] border border-[#CFE5FF] p-4 rounded-[16px] flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#002B7A] shrink-0">
                                <Sparkles size={20} />
                            </div>
                            <p className="text-[13px] text-[#002B7A] leading-snug font-medium">
                                채널 링크를 기재해주시면 <strong className="font-extrabold">PULSE AI 분석 엔진</strong>이 팔로워 및 시청 데이터를 자동으로 산출하여 사장님들과 매칭시켜 드립니다.
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 mt-2">
                            <div className="input-group">
                                <label className="text-[13px] font-bold text-[#333D4B] mb-1.5 flex items-center gap-1">
                                    <Instagram size={14} className="text-[#E1306C]" /> 인스타그램 링크 <span className="text-[#FF5A36]">*</span>
                                </label>
                                <input 
                                    type="url" 
                                    required
                                    value={formData.instagramUrl}
                                    onChange={(e) => setFormData({...formData, instagramUrl: e.target.value})}
                                    placeholder="https://instagram.com/your_id"
                                    className="w-full h-[48px] px-4 bg-white border border-[#E5E8EB] rounded-[12px] text-[14px] focus:border-[#E1306C] focus:ring-1 focus:ring-[#E1306C] outline-none transition-all placeholder:text-[#B0B8C1]"
                                />
                            </div>
                            
                            <div className="input-group">
                                <label className="text-[13px] font-bold text-[#333D4B] mb-1.5 flex items-center gap-1">
                                    <Youtube size={14} className="text-[#FF0000]" /> 유튜브 채널 링크 <span className="text-[12px] text-[#8B95A1] font-normal ml-1">(선택)</span>
                                </label>
                                <input 
                                    type="url" 
                                    value={formData.youtubeUrl}
                                    onChange={(e) => setFormData({...formData, youtubeUrl: e.target.value})}
                                    placeholder="https://youtube.com/@your_channel"
                                    className="w-full h-[48px] px-4 bg-white border border-[#E5E8EB] rounded-[12px] text-[14px] focus:border-[#FF0000] focus:ring-1 focus:ring-[#FF0000] outline-none transition-all placeholder:text-[#B0B8C1]"
                                />
                            </div>
                        </div>

                        <div className="mt-4 flex items-start gap-2 border-t border-[#F2F4F6] pt-5">
                            <input 
                                type="checkbox" 
                                id="terms"
                                required
                                checked={formData.agreedToTerms}
                                onChange={(e) => setFormData({...formData, agreedToTerms: e.target.checked})}
                                className="mt-0.5 w-4 h-4 rounded border-[#D1D6DB] text-[#002B7A] focus:ring-[#002B7A]"
                            />
                            <label htmlFor="terms" className="text-[13px] text-[#4E5968] leading-tight cursor-pointer">
                                위 기재된 채널의 실 소유자임을 확인하며, 펄스 파트너 매칭 서비스 이용 약관에 동의합니다. <span className="text-[#FF5A36]">*</span>
                            </label>
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="mt-6 flex items-center gap-3">
                    {step > 1 && (
                        <button 
                            type="button" 
                            onClick={handlePrev}
                            className="h-[52px] px-6 bg-white border border-[#E5E8EB] text-[#4E5968] font-bold rounded-[14px] hover:bg-[#F9FAFB] transition-all"
                        >
                            이전
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        aria-busy={isSubmitting}
                        className="h-[52px] flex-1 bg-[#002B7A] text-white font-bold text-[16px] rounded-[14px] hover:shadow-lg transition-colors outline-none
                                   disabled:opacity-40 disabled:cursor-not-allowed
                                   focus-visible:ring-2 focus-visible:ring-[#002B7A] focus-visible:ring-offset-2"
                    >
                        {isSubmitting ? (
                            <span className="inline-flex items-center gap-2">
                                <LoadingSpinner size="sm" label="가입 중" />
                                가입 중…
                            </span>
                        ) : (step === 3 ? "펄스 파트너 합류하기" : "다음으로 진행")}
                    </button>
                </div>
                {formError && (
                    <div className="mt-4">
                        <FormError>{formError}</FormError>
                    </div>
                )}
            </form>

            <div className="form-switch-container mt-6">
                <p className="switch-text">이미 펄스 파트너신가요?</p>
                <button className="switch-btn" onClick={onSwitch}>로그인 하러가기</button>
            </div>
            
        </div>
    );
}
