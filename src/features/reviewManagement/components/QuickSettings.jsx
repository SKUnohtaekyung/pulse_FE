/**
 * ============================================================================
 * QUICK SETTINGS COMPONENT
 * ============================================================================
 */

import { useState } from 'react';
import { Wand2, Copy, Star, RefreshCw, Check } from 'lucide-react';
import { ExceptionCaseSettings, DEFAULT_CASES } from './ExceptionCaseSettings';
import { SaveTemplateModal } from './TemplateComponents';
import { ReviewList, ReviewCard } from './ReviewList';

// ============================================================================
// TOGGLE SWITCH COMPONENT
// ============================================================================
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
function ReplyCard({ reply, onSaveTemplate, onRegenerate }) {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(reply.content);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200 hover:shadow-md transition-shadow">
            {reply.isRecommended && (
                <div className="flex items-center gap-2 mb-3">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-yellow-600">추천 답변</span>
                </div>
            )}

            <p className="text-neutral-700 leading-relaxed mb-4">{reply.content}</p>

            <div className="flex gap-2">
                <button
                    onClick={() => onSaveTemplate(reply.content)}
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors text-sm font-medium"
                >
                    <Star className="w-4 h-4" />
                    즐겨찾기
                </button>
                <button
                    onClick={() => onRegenerate(reply.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors text-sm font-medium"
                >
                    <RefreshCw className="w-4 h-4" />
                    새로고침
                </button>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors text-sm font-medium"
                >
                    {isCopied ? (
                        <>
                            <Check className="w-4 h-4 text-green-600" />
                            <span className="text-green-600">복사됨</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-4 h-4" />
                            복사하기
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

// ============================================================================
// QUICK SETTINGS COMPONENT
// ============================================================================
export function QuickSettings({ settings, onSettingsChange, recentReviews = [], onAddTemplate }) {
    const [customPresets, setCustomPresets] = useState([]);
    const [showPresetInput, setShowPresetInput] = useState(false);
    const [newPresetName, setNewPresetName] = useState('');
    const [generatedReplies, setGeneratedReplies] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [replyCount, setReplyCount] = useState(1);
    const [showCountDropdown, setShowCountDropdown] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [contentToSave, setContentToSave] = useState('');

    const updateSetting = (key, value) => {
        onSettingsChange({ ...settings, [key]: value });
    };

    const handlePresetChange = (value) => {
        if (value === 'add-new') {
            setShowPresetInput(true);
        } else {
            updateSetting('brandPreset', value);
        }
    };

    const handleAddPreset = () => {
        if (newPresetName.trim()) {
            setCustomPresets([...customPresets, newPresetName.trim()]);
            updateSetting('brandPreset', newPresetName.trim());
            setNewPresetName('');
            setShowPresetInput(false);
        }
    };

    const handleGenerate = async () => {
        setIsGenerating(true);

        await new Promise(resolve => setTimeout(resolve, 1500));

        const mockReplies = [
            {
                id: '1',
                content: '소중한 리뷰 감사합니다! 😊 고객님의 만족스러운 경험을 들으니 정말 기쁩니다. 앞으로도 더 나은 서비스로 보답하겠습니다. 좋은 하루 되세요!',
                isRecommended: true
            },
            {
                id: '2',
                content: '리뷰 감사드립니다. 고객님께서 만족하셨다니 다행입니다. 다음 방문도 기대하겠습니다.',
                isRecommended: false
            },
            {
                id: '3',
                content: '따뜻한 리뷰 남겨주셔서 감사합니다! 항상 최선을 다하는 저희 매장이 되겠습니다. 또 뵙기를 바랍니다!',
                isRecommended: false
            },
            {
                id: '4',
                content: '정성스러운 리뷰 작성에 깊이 감사드립니다. 변치 않는 맛과 서비스로 보답할 수 있도록 노력하겠습니다.',
                isRecommended: false
            },
            {
                id: '5',
                content: '고객님의 칭찬에 힘이 납니다! 부족한 부분은 더욱 개선하여 다음에는 더 큰 만족을 드릴 수 있도록 하겠습니다.',
                isRecommended: false
            }
        ];

        setGeneratedReplies(mockReplies.slice(0, replyCount));
        setIsGenerating(false);
    };

    const handleSaveTemplate = (content) => {
        setContentToSave(content);
        setShowSaveModal(true);
    };

    const handleRegenerate = async (id) => {
        const newReply = {
            id,
            content: '새로 생성된 답변입니다. 고객님의 소중한 의견에 감사드리며, 더 나은 서비스를 제공하도록 노력하겠습니다.',
            isRecommended: false
        };

        setGeneratedReplies(generatedReplies.map(r => r.id === id ? newReply : r));
    };

    return (
        <>
            <div className="space-y-6">
                {/* Show generated replies OR settings */}
                {generatedReplies.length > 0 ? (
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-neutral-900">생성된 리뷰 답변</h2>
                                <p className="text-sm text-neutral-500 mt-1">최근 리뷰를 바탕으로 템플릿이 적용된 답변입니다.</p>
                            </div>
                            <button
                                onClick={() => setGeneratedReplies([])}
                                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-semibold transition-colors text-sm"
                            >
                                뒤로가기 / 다시 생성
                            </button>
                        </div>

                        <div className="space-y-6">
                            {generatedReplies.map((reply, index) => {
                                const matchingReview = recentReviews[index] || recentReviews[0] || { content: '리뷰 정보를 불러오는 중입니다.', date: '방금 전', rating: 5, hasPhoto: false };
                                return (
                                    <div key={reply.id} className="relative p-6 bg-neutral-50 rounded-2xl border border-neutral-200">
                                        <div className="flex gap-4">
                                            {/* 왼쪽: 리뷰 */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center text-xs text-neutral-500">
                                                        U
                                                    </div>
                                                    <span className="text-sm font-semibold text-neutral-700">고객 리뷰</span>
                                                </div>
                                                <ReviewCard review={matchingReview} />
                                            </div>

                                            {/* 중앙 연결선 아이콘 등 */}
                                            <div className="w-8 flex items-center justify-center pt-[72px]">
                                                <div className="w-full border-t-[2px] border-dashed border-neutral-300"></div>
                                                <div className="w-2 h-2 rounded-full bg-neutral-300 absolute"></div>
                                            </div>

                                            {/* 오른쪽: 답변 */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-3 px-1">
                                                    <div className="w-8 h-8 bg-[#002B7A] rounded-full flex items-center justify-center text-white text-lg">
                                                        🤖
                                                    </div>
                                                    <span className="text-sm font-semibold text-[#002B7A]">생성된 AI 답변</span>
                                                </div>
                                                <ReplyCard
                                                    reply={reply}
                                                    onSaveTemplate={handleSaveTemplate}
                                                    onRegenerate={handleRegenerate}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-6">
                        {/* 왼쪽: 빠른 설정 */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
                                <h3 className="font-semibold text-neutral-900 mb-5">빠른 설정</h3>

                                {/* Tone */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-neutral-700 mb-3">말투</label>
                                    <div className="grid grid-cols-2 gap-2">
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
                                <div className="mb-6">
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

                                {/* Generate Button */}
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={handleGenerate}
                                        disabled={isGenerating}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#FF5A36CC] hover:bg-[#FF5A36] disabled:bg-neutral-400 text-white rounded-xl font-semibold shadow-sm transition-colors"
                                    >
                                        <Wand2 className="w-5 h-5" />
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
                                                <div className="absolute right-0 bottom-full mb-2 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-20 min-w-fit whitespace-nowrap">
                                                    {[
                                                        { value: 1, label: '1개', isPro: false },
                                                        { value: 5, label: '5개', isPro: true },
                                                    ].map((option) => (
                                                        <button
                                                            key={option.value}
                                                            onClick={() => {
                                                                setReplyCount(option.value);
                                                                setShowCountDropdown(false);
                                                            }}
                                                            className={`w-full px-4 py-2 flex items-center gap-3 text-left hover:bg-neutral-50 transition-colors ${replyCount === option.value ? 'text-[#002B7A] font-semibold' : 'text-neutral-700'
                                                                }`}
                                                        >
                                                            <span>{option.label}</span>
                                                            {option.isPro ? (
                                                                <span className="text-[10px] bg-[#333D4B] text-white px-1.5 py-0.5 rounded font-bold tracking-wider">PRO</span>
                                                            ) : (
                                                                <span className="text-[10px] bg-neutral-200 text-neutral-600 px-1.5 py-0.5 rounded font-bold tracking-wider">무료</span>
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 오른쪽: 예외 케이스 설정 */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
                            <ExceptionCaseSettings
                                cases={settings.exceptionCases || DEFAULT_CASES}
                                onCasesChange={(cases) => updateSetting('exceptionCases', cases)}
                            />
                        </div>
                    </div>
                )}
            </div>

            {showSaveModal && (
                <SaveTemplateModal
                    onClose={() => setShowSaveModal(false)}
                    onSave={(template) => {
                        console.log('Template saved:', { ...template, content: contentToSave });
                        if (onAddTemplate) {
                            onAddTemplate({
                                id: Date.now().toString(),
                                ...template,
                                content: contentToSave,
                                tone: settings.tone,
                                length: settings.length,
                                date: new Date().toISOString().split('T')[0]
                            });
                        }
                        setShowSaveModal(false);
                    }}
                />
            )}
        </>
    );
}
