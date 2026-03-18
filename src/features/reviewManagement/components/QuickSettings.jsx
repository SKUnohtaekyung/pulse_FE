/**
 * ============================================================================
 * QUICK SETTINGS COMPONENT
 * ============================================================================
 * 빠른 설정 탭 — 설정 패널 + 리뷰별 AI 답변 생성
 */

import { useState } from 'react';
import { Wand2, Copy, Star, RefreshCw, Check, Calendar, Camera, ChevronDown } from 'lucide-react';
import { ExceptionCaseSettings, DEFAULT_CASES } from './ExceptionCaseSettings';
import { SaveTemplateModal } from './TemplateComponents';

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
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-[#002B7A]' : 'bg-neutral-300'}`}
            >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
        </label>
    );
}

// ============================================================================
// REVIEW WITH REPLY CARD COMPONENT
// ============================================================================
function ReviewReplyCard({ review, reply, onSaveTemplate, onRegenerate }) {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(reply);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
            {/* 원본 리뷰 */}
            <div className="p-4 bg-neutral-50 border-b border-neutral-100">
                <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{review.date}</span>
                </div>
                <p className="text-sm text-neutral-700 leading-relaxed">{review.content}</p>
            </div>

            {/* AI 답변 */}
            <div className="p-4">
                <div className="flex items-center gap-1.5 mb-2">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-semibold text-[#002B7A]">AI 추천 답변</span>
                </div>
                <p className="text-sm text-neutral-700 leading-relaxed mb-3">{reply}</p>
                <div className="flex gap-2">
                    <button
                        onClick={() => onSaveTemplate(reply)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors text-xs font-medium"
                    >
                        <Star className="w-3.5 h-3.5" />
                        즐겨찾기
                    </button>
                    <button
                        onClick={() => onRegenerate(review.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors text-xs font-medium"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        재생성
                    </button>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors text-xs font-medium"
                    >
                        {isCopied ? (
                            <>
                                <Check className="w-3.5 h-3.5 text-green-600" />
                                <span className="text-green-600">복사됨</span>
                            </>
                        ) : (
                            <>
                                <Copy className="w-3.5 h-3.5" />
                                복사하기
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// MOCK AI REPLY GENERATOR
// ============================================================================
function generateMockReply(review, settings) {
    const brand = settings.brandPreset || '저희 가게';
    const emoji = settings.useEmojis;
    const thanks = settings.includeThanks;
    const goodDay = settings.includeGreatDay;

    // 리뷰 내용 기반으로 답변 톤 분기
    const isPositive = ['맛있', '최고', '최애', '단골', '좋아', '칼칼', '중독'].some(k => review.content.includes(k));
    const isCritical = ['불만족', '매워', '질감', '아쉽'].some(k => review.content.includes(k));

    let reply = '';

    if (isCritical) {
        reply += thanks ? `${emoji ? '🙏 ' : ''}소중한 리뷰 감사드립니다! ` : '';
        reply += `고객님의 솔직한 의견 덕분에 저희가 더 발전할 수 있습니다. `;
        reply += `수제비 식감은 저희도 지속적으로 개선 중이며, 특히 두께 일관성에 더욱 신경 쓰겠습니다. ${emoji ? '🍲 ' : ''}`;
        reply += `다음 방문 때는 더 만족스러운 경험을 드릴 수 있도록 최선을 다하겠습니다. `;
        reply += goodDay ? `${emoji ? '😊 ' : ''}좋은 하루 되세요!` : '';
    } else if (isPositive) {
        reply += thanks ? `${emoji ? '🎉 ' : ''}와! 너무 감사한 리뷰예요! ` : '';
        reply += `고객님처럼 ${brand}의 얼큰함을 사랑해 주시는 분들 덕분에 저희도 힘을 얻습니다. ${emoji ? '🔥 ' : ''}`;
        reply += `다음에도 꼭 오셔서 칼칼한 국물로 스트레스 날려 가세요! `;
        reply += goodDay ? `${emoji ? '😄 ' : ''}항상 좋은 하루 보내세요!` : '';
    } else {
        reply += thanks ? `${emoji ? '😊 ' : ''}리뷰 남겨주셔서 진심으로 감사합니다! ` : '';
        reply += `${brand}를 찾아주신 고객님, 만족스러운 경험을 드리기 위해 항상 노력하겠습니다. ${emoji ? '🍜 ' : ''}`;
        reply += goodDay ? `또 들러주세요! ${emoji ? '💙 ' : ''}좋은 하루 되세요!` : '또 방문해 주세요!';
    }

    return reply;
}

// ============================================================================
// QUICK SETTINGS COMPONENT
// ============================================================================
export function QuickSettings({ settings, onSettingsChange, reviews = [], onSaveTemplate }) {
    const [customPresets, setCustomPresets] = useState([]);
    const [showPresetInput, setShowPresetInput] = useState(false);
    const [newPresetName, setNewPresetName] = useState('');
    // reviewId → reply 텍스트 map
    const [generatedMap, setGeneratedMap] = useState({});
    const [isGenerating, setIsGenerating] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [contentToSave, setContentToSave] = useState('');
    const [showCountDropdown, setShowCountDropdown] = useState(false);

    const hasGenerated = Object.keys(generatedMap).length > 0;

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
        await new Promise(resolve => setTimeout(resolve, 1200));

        const map = {};
        reviews.forEach(review => {
            map[review.id] = generateMockReply(review, settings);
        });
        setGeneratedMap(map);
        setIsGenerating(false);
    };

    const handleRegenerate = async (reviewId) => {
        const review = reviews.find(r => r.id === reviewId);
        if (!review) return;
        const newReply = generateMockReply(review, settings) + ' (재생성)';
        setGeneratedMap(prev => ({ ...prev, [reviewId]: newReply }));
    };

    const handleSaveTemplate = (content) => {
        setContentToSave(content);
        setShowSaveModal(true);
    };

    const handleModalSave = (template) => {
        // 부모 컴포넌트(ReviewManagementPage)로 저장 데이터 전달
        if (onSaveTemplateProp) {
            onSaveTemplateProp({ ...template, content: contentToSave });
        }
        setShowSaveModal(false);
    };

    return (
        <>
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    {/* 왼쪽: 빠른 설정 패널 */}
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
                                        <button onClick={handleAddPreset} className="px-4 py-2.5 bg-[#FF5A36CC] hover:bg-[#FF5A36] text-white rounded-xl font-medium transition-colors">추가</button>
                                        <button onClick={() => { setShowPresetInput(false); setNewPresetName(''); }} className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl font-medium transition-colors">취소</button>
                                    </div>
                                ) : (
                                    <select
                                        value={settings.brandPreset}
                                        onChange={(e) => handlePresetChange(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#002B7A] focus:border-transparent"
                                    >
                                        {settings.brandPreset && (
                                            <option value={settings.brandPreset}>{settings.brandPreset}</option>
                                        )}
                                        {customPresets.filter(p => p !== settings.brandPreset).map((preset) => (
                                            <option key={preset} value={preset}>{preset}</option>
                                        ))}
                                        <option value="add-new">+ 새 프리셋 추가</option>
                                    </select>
                                )}
                                <p className="mt-2 text-xs text-neutral-500">매장명 + 인사 스타일 포함</p>
                            </div>

                            {/* Optional Instruction */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-neutral-700 mb-3">AI에게 추가 요청 (선택)</label>
                                <input
                                    type="text"
                                    value={settings.optionalInstruction}
                                    onChange={(e) => updateSetting('optionalInstruction', e.target.value)}
                                    placeholder='예: "추천 메뉴 언급"'
                                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#002B7A] focus:border-transparent"
                                />
                            </div>

                            {/* Generate Button */}
                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating}
                                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#FF5A36CC] hover:bg-[#FF5A36] disabled:bg-neutral-400 text-white rounded-xl font-semibold shadow-sm transition-colors"
                            >
                                <Wand2 className="w-5 h-5" />
                                {isGenerating ? '생성 중...' : `최신 리뷰 ${reviews.length}개 답변 생성`}
                            </button>
                        </div>

                        {/* 예외 케이스 설정 */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
                            <ExceptionCaseSettings
                                cases={settings.exceptionCases || DEFAULT_CASES}
                                onCasesChange={(cases) => updateSetting('exceptionCases', cases)}
                            />
                        </div>
                    </div>

                    {/* 오른쪽: 리뷰 + AI 답변 결과 */}
                    <div className="space-y-4">
                        {!hasGenerated ? (
                            <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-200 flex flex-col items-center justify-center text-center h-64">
                                <Wand2 className="w-10 h-10 text-neutral-300 mb-3" />
                                <p className="text-neutral-500 font-medium">설정 후 "답변 생성" 버튼을 눌러주세요</p>
                                <p className="text-sm text-neutral-400 mt-1">최신 리뷰 {reviews.length}건에 대한 AI 답변이 생성됩니다</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-neutral-900">AI 생성 답변 ({reviews.length}건)</h3>
                                    <button
                                        onClick={() => setGeneratedMap({})}
                                        className="text-xs text-neutral-500 hover:text-neutral-700 underline"
                                    >
                                        초기화
                                    </button>
                                </div>
                                {reviews.map((review) => (
                                    <ReviewReplyCard
                                        key={review.id}
                                        review={review}
                                        reply={generatedMap[review.id] || ''}
                                        onSaveTemplate={handleSaveTemplate}
                                        onRegenerate={handleRegenerate}
                                    />
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {showSaveModal && (
                <SaveTemplateModal
                    onClose={() => setShowSaveModal(false)}
                    onSave={(template) => {
                        if (onSaveTemplate) {
                            onSaveTemplate({ 
                                ...template, 
                                content: contentToSave,
                                tone: settings.tone,
                                length: settings.length
                            });
                        }
                        setShowSaveModal(false);
                    }}
                />
            )}
        </>
    );
}
