/**
 * ============================================================================
 * AI COMPONENTS
 * ============================================================================
 * 이 파일은 AI 어시스턴트 관련 컴포넌트들을 포함합니다.
 *
 * 포함된 컴포넌트:
 * - AIAssistant: 메인 AI 어시스턴트 컨테이너 (설정 + 답변 생성)
 * - ReplyCard: 생성된 AI 답변 카드
 * - ToggleSwitch: 설정 토글 스위치 (내부 컴포넌트)
 * ============================================================================
 */

import { useState } from 'react';
import { Sparkles, Copy, Star, Edit3, RefreshCw, Check } from 'lucide-react';
import { SaveTemplateModal } from './TemplateComponents';

// ============================================================================
// AI ASSISTANT COMPONENT
// ============================================================================
/**
 * AI 어시스턴트 메인 컴포넌트
 * - 빠른 설정 탭: 말투, 길이, 필수 규칙, 브랜드 프리셋 설정
 * - 생성된 답변 탭: AI가 생성한 답변 목록 표시
 * - 답변 생성 버튼: 설정에 따라 1~5개 답변 생성
 */
export function AIAssistant({ selectedReview: _selectedReview }) {
    const [settings, setSettings] = useState({
        tone: '친근함',
        length: '보통',
        includeThanks: true,
        includeGreatDay: true,
        useEmojis: true,
        photoThanks: false,
        brandPreset: '',
        optionalInstruction: ''
    });

    const [generatedReplies, setGeneratedReplies] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [replyCount, setReplyCount] = useState(3);
    const [showCountDropdown, setShowCountDropdown] = useState(false);
    const [activeTab, setActiveTab] = useState('settings');
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [contentToSave, setContentToSave] = useState('');
    const [customPresets, setCustomPresets] = useState([]);
    const [showPresetInput, setShowPresetInput] = useState(false);
    const [newPresetName, setNewPresetName] = useState('');

    const updateSetting = (key, value) => {
        setSettings({ ...settings, [key]: value });
    };

    const handleGenerate = async () => {
        setIsGenerating(true);

        // Mock API call - 실제 사용 시 AI API로 대체
        await new Promise(resolve => setTimeout(resolve, 1500));

        const mockReplies = [
            {
                id: '1',
                content: `소중한 리뷰 남겨주셔서 정말 감사합니다! 😊 저희 서비스에 만족하셨다니 정말 기쁩니다. 앞으로도 더 나은 서비스로 보답하겠습니다. 좋은 하루 보내세요!`,
                isRecommended: true
            },
            {
                id: '2',
                content: `고객님의 소중한 의견 감사드립니다! 💙 저희 서비스를 이용해 주셔서 감사하며, 더욱 발전하는 모습 보여드리겠습니다. 다음에도 좋은 경험 제공해 드릴 수 있도록 최선을 다하겠습니다!`
            },
            {
                id: '3',
                content: `리뷰 정말 감사합니다! 🌟 고객님의 만족스러운 경험이 저희에게는 큰 힘이 됩니다. 앞으로도 변함없는 서비스로 찾아뵙겠습니다. 좋은 하루 되세요!`
            }
        ].slice(0, replyCount);

        setGeneratedReplies(mockReplies);
        setIsGenerating(false);
        setActiveTab('replies'); // 답변 생성 후 자동으로 답변 탭으로 전환
    };

    const handleRegenerate = async (id) => {
        const newContent = `새로운 표현으로 다시 생성된 답변입니다! 소중한 리뷰 감사드립니다. 더 나은 서비스로 보답하겠습니다! 😊`;

        setGeneratedReplies(replies =>
            replies.map(reply =>
                reply.id === id ? { ...reply, content: newContent } : reply
            )
        );
    };

    const handleSaveTemplate = (content) => {
        setContentToSave(content);
        setShowSaveModal(true);
    };

    const handleSaveModalConfirm = (data) => {
        console.log('Template saved:', { ...data, content: contentToSave });
        // TODO: 실제 API 호출로 템플릿 저장
        setShowSaveModal(false);
    };

    const handleAddPreset = () => {
        if (newPresetName.trim()) {
            setCustomPresets([...customPresets, newPresetName.trim()]);
            updateSetting('brandPreset', newPresetName.trim());
            setNewPresetName('');
            setShowPresetInput(false);
        }
    };

    const handlePresetChange = (value) => {
        if (value === 'add-new') {
            setShowPresetInput(true);
        } else {
            updateSetting('brandPreset', value);
        }
    };

    return (
        <div className="space-y-6">
            {/* Tab Navigation */}
            {generatedReplies.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-neutral-200">
                    <div className="flex border-b border-neutral-200">
                        <button
                            onClick={() => setActiveTab('replies')}
                            className={`flex-1 px-6 py-4 font-semibold transition-colors relative ${activeTab === 'replies'
                                    ? 'text-[#002B7A]'
                                    : 'text-neutral-500 hover:text-neutral-700'
                                }`}
                        >
                            생성된 답변 ({generatedReplies.length})
                            {activeTab === 'replies' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#002B7A]" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`flex-1 px-6 py-4 font-semibold transition-colors relative ${activeTab === 'settings'
                                    ? 'text-[#002B7A]'
                                    : 'text-neutral-500 hover:text-neutral-700'
                                }`}
                        >
                            빠른 설정
                            {activeTab === 'settings' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#002B7A]" />
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Tab Content */}
            {activeTab === 'settings' || generatedReplies.length === 0 ? (
                <>
                    {/* Quick Settings */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
                        <h3 className="font-semibold text-neutral-900 mb-5">빠른 설정</h3>

                        {/* Tone */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-neutral-700 mb-3">말투</label>
                            <div className="grid grid-cols-4 gap-2">
                                {['격식', '친근함', '발랄함', '감성적'].map((tone) => (
                                    <button
                                        key={tone}
                                        onClick={() => updateSetting('tone', tone)}
                                        className={`px-3 py-2.5 rounded-xl font-medium transition-all text-sm ${settings.tone === tone
                                                ? 'bg-[#002B7A] text-white shadow-sm'
                                                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                                            }`}
                                    >
                                        {tone}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Length */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-neutral-700 mb-3">길이</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['짧게', '보통', '상세히'].map((length) => (
                                    <button
                                        key={length}
                                        onClick={() => updateSetting('length', length)}
                                        className={`px-4 py-2.5 rounded-xl font-medium transition-all ${settings.length === length
                                                ? 'bg-[#002B7A] text-white shadow-sm'
                                                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                                            }`}
                                    >
                                        {length}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Required Rules */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-neutral-700 mb-3">필수 규칙</label>
                            <div className="space-y-3">
                                <ToggleSwitch
                                    label="감사 인사 포함"
                                    checked={settings.includeThanks}
                                    onChange={(checked) => updateSetting('includeThanks', checked)}
                                />
                                <ToggleSwitch
                                    label="'좋은 하루 되세요' 포함"
                                    checked={settings.includeGreatDay}
                                    onChange={(checked) => updateSetting('includeGreatDay', checked)}
                                />
                                <ToggleSwitch
                                    label="이모지 적절히 사용"
                                    checked={settings.useEmojis}
                                    onChange={(checked) => updateSetting('useEmojis', checked)}
                                />
                            </div>
                        </div>

                        {/* Brand Preset */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-neutral-700 mb-3">브랜드 프리셋</label>
                            {showPresetInput ? (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newPresetName}
                                        onChange={(e) => setNewPresetName(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddPreset()}
                                        placeholder="프리셋 이름 입력"
                                        className="flex-1 px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#002B7A] focus:border-transparent"
                                        autoFocus
                                    />
                                    <button
                                        onClick={handleAddPreset}
                                        className="px-4 py-2.5 bg-[#FF5A36CC] hover:bg-[#FF5A36] text-white rounded-xl font-medium transition-colors"
                                    >
                                        추가
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowPresetInput(false);
                                            setNewPresetName('');
                                        }}
                                        className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl font-medium transition-colors"
                                    >
                                        취소
                                    </button>
                                </div>
                            ) : (
                                <select
                                    value={settings.brandPreset}
                                    onChange={(e) => handlePresetChange(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#002B7A] focus:border-transparent"
                                >
                                    {customPresets.length === 0 && (
                                        <option value="" disabled>프리셋을 추가해주세요</option>
                                    )}
                                    {customPresets.map((preset) => (
                                        <option key={preset} value={preset}>{preset}</option>
                                    ))}
                                    <option value="add-new">+ 새 프리셋 추가</option>
                                </select>
                            )}
                            <p className="mt-2 text-xs text-neutral-500">
                                매장명 + 인사 스타일 포함
                            </p>
                        </div>

                        {/* Optional Instruction */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-3">
                                AI에게 추가 요청 (선택)
                            </label>
                            <input
                                type="text"
                                value={settings.optionalInstruction}
                                onChange={(e) => updateSetting('optionalInstruction', e.target.value)}
                                placeholder='예: "추천 메뉴 언급"'
                                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#002B7A] focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Generate Button */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#FF5A36CC] hover:bg-[#FF5A36] disabled:bg-neutral-400 text-white rounded-xl font-semibold shadow-sm transition-colors"
                            >
                                <Sparkles className="w-5 h-5" />
                                {isGenerating ? '생성 중...' : `${replyCount}개 답변 생성`}
                            </button>

                            <div className="relative">
                                <button
                                    onClick={() => setShowCountDropdown(!showCountDropdown)}
                                    className="px-4 py-4 bg-[#FF5A36CC] hover:bg-[#FF5A36] text-white rounded-xl shadow-sm transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {showCountDropdown && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setShowCountDropdown(false)}
                                        />
                                        <div className="absolute right-0 bottom-full mb-2 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-20 min-w-[80px]">
                                            {[1, 3, 5].map((num) => (
                                                <button
                                                    key={num}
                                                    onClick={() => {
                                                        setReplyCount(num);
                                                        setShowCountDropdown(false);
                                                    }}
                                                    className={`w-full px-4 py-2 text-left hover:bg-neutral-50 transition-colors ${replyCount === num ? 'text-[#002B7A] font-semibold' : 'text-neutral-700'
                                                        }`}
                                                >
                                                    {num}개
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <p className="mt-3 text-sm text-neutral-500 text-center">
                            원클릭으로 복사할 수 있습니다.
                        </p>
                    </div>
                </>
            ) : (
                <>
                    {/* Generated Replies */}
                    <div className="space-y-4">
                        {generatedReplies.map((reply) => (
                            <ReplyCard
                                key={reply.id}
                                reply={reply}
                                onSaveTemplate={handleSaveTemplate}
                                onRegenerate={handleRegenerate}
                            />
                        ))}
                    </div>

                    {/* Regenerate All Button */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#FF5A36CC] hover:bg-[#FF5A36] disabled:bg-neutral-400 text-white rounded-xl font-semibold shadow-sm transition-colors"
                        >
                            <RefreshCw className="w-5 h-5" />
                            {isGenerating ? '재생성 중...' : '모두 재생성'}
                        </button>
                    </div>
                </>
            )}

            {/* Save Template Modal */}
            {showSaveModal && (
                <SaveTemplateModal
                    onClose={() => setShowSaveModal(false)}
                    onSave={handleSaveModalConfirm}
                />
            )}
        </div>
    );
}

// ============================================================================
// TOGGLE SWITCH COMPONENT (Internal)
// ============================================================================
/**
 * 토글 스위치 컴포넌트
 * - 설정 옵션 on/off 전환
 */
function ToggleSwitch({ label, checked, onChange }) {
    return (
        <label className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-neutral-50 transition-colors">
            <span className="text-sm text-neutral-700">{label}</span>
            <button
                type="button"
                onClick={() => onChange(!checked)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-[#002B7A]' : 'bg-neutral-300'
                    }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'
                        }`}
                />
            </button>
        </label>
    );
}

// ============================================================================
// REPLY CARD COMPONENT
// ============================================================================
/**
 * 생성된 답변 카드 컴포넌트
 * - 추천 배지 표시 (첫 번째 답변)
 * - 답변 내용 표시 및 편집 기능
 * - 복사, 템플릿 저장, 수정, 재생성 버튼
 */
function ReplyCard({ reply, onSaveTemplate, onRegenerate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(reply.content);
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        const contentToCopy = isEditing ? editedContent : reply.content;
        await navigator.clipboard.writeText(contentToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200 hover:shadow-md transition-shadow">
            {reply.isRecommended && (
                <div className="mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-semibold">
                        <Star className="w-4 h-4 fill-emerald-700" />
                        추천
                    </span>
                </div>
            )}

            {isEditing ? (
                <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full min-h-[120px] p-4 mb-4 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#002B7A] focus:border-transparent resize-none"
                    autoFocus
                />
            ) : (
                <p className="text-neutral-700 leading-relaxed mb-6 whitespace-pre-wrap">
                    {reply.content}
                </p>
            )}

            <div className="flex items-center gap-2">
                {isEditing ? (
                    <>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#002B7A] hover:bg-[#002B7AE6] text-white rounded-xl font-medium transition-colors"
                        >
                            <Check className="w-4 h-4" />
                            저장
                        </button>
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setEditedContent(reply.content);
                            }}
                            className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl font-medium transition-colors"
                        >
                            취소
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={handleCopy}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#002B7A] hover:bg-[#002B7AE6] text-white rounded-xl font-semibold shadow-sm transition-colors"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-4 h-4" />
                                    복사됨!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4" />
                                    복사
                                </>
                            )}
                        </button>
                        <button
                            onClick={() => onSaveTemplate(reply.content)}
                            className="px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl font-medium transition-colors"
                            title="템플릿으로 저장"
                        >
                            <Star className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl font-medium transition-colors"
                            title="수정"
                        >
                            <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onRegenerate(reply.id)}
                            className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl font-medium transition-colors"
                            title="재생성"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
