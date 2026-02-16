// ============================================================================
// IMPORTS
// ============================================================================
import { useState } from 'react';
import { Wand2, Copy, Star, RefreshCw, Check } from 'lucide-react';
import { ExceptionCaseSettings, DEFAULT_CASES } from './ExceptionCaseSettings';
import type { ExceptionCase } from './ExceptionCaseSettings';
import { SaveTemplateModal } from './TemplateComponents';
import type { GeneratedReply } from './AIComponents';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================
export interface Settings {
  tone: '격식' | '친근함' | '발랄함' | '감성적';
  length: '짧게' | '보통' | '상세히';
  includeThanks: boolean;
  includeGreatDay: boolean;
  useEmojis: boolean;
  photoThanks: boolean;
  brandPreset: string;
  optionalInstruction: string;
  exceptionCases: ExceptionCase[];
}

interface QuickSettingsProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

interface ReplyCardProps {
  reply: GeneratedReply;
  onSaveTemplate: (content: string) => void;
  onRegenerate: (id: string) => void;
}

// ============================================================================
// TOGGLE SWITCH COMPONENT
// ============================================================================
function ToggleSwitch({ label, checked, onChange }: ToggleSwitchProps) {
  return (
    <label className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-neutral-50 transition-colors">
      <span className="text-sm text-neutral-700">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-[#002B7A]' : 'bg-neutral-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </label>
  );
}

// ============================================================================
// REPLY CARD COMPONENT
// ============================================================================
function ReplyCard({ reply, onSaveTemplate, onRegenerate }: ReplyCardProps) {
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
export function QuickSettings({ settings, onSettingsChange }: QuickSettingsProps) {
  const [customPresets, setCustomPresets] = useState<string[]>([]);
  const [showPresetInput, setShowPresetInput] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [generatedReplies, setGeneratedReplies] = useState<GeneratedReply[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [replyCount, setReplyCount] = useState(3);
  const [showCountDropdown, setShowCountDropdown] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [contentToSave, setContentToSave] = useState('');

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const handlePresetChange = (value: string) => {
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

    const mockReplies: GeneratedReply[] = [
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
      }
    ];

    setGeneratedReplies(mockReplies.slice(0, replyCount));
    setIsGenerating(false);
  };

  const handleSaveTemplate = (content: string) => {
    setContentToSave(content);
    setShowSaveModal(true);
  };

  const handleRegenerate = async (id: string) => {
    // Regenerate specific reply
    const newReply: GeneratedReply = {
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
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Generated Replies */}
              {generatedReplies.map((reply) => (
                <ReplyCard
                  key={reply.id}
                  reply={reply}
                  onSaveTemplate={handleSaveTemplate}
                  onRegenerate={handleRegenerate}
                />
              ))}

              {/* Back to Settings Button */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
                <button
                  onClick={() => setGeneratedReplies([])}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl font-semibold transition-colors"
                >
                  빠른 설정으로 돌아가기
                </button>
              </div>
            </div>
            {/* 오른쪽 빈 공간 */}
            <div></div>
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
                    {(['격식', '친근함', '발랄함', '감성적'] as const).map((tone) => (
                      <button
                        key={tone}
                        onClick={() => updateSetting('tone', tone)}
                        className={`px-3 py-2.5 rounded-xl font-medium transition-all text-sm ${
                          settings.tone === tone
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
                    {(['짧게', '보통', '상세히'] as const).map((length) => (
                      <button
                        key={length}
                        onClick={() => updateSetting('length', length)}
                        className={`px-4 py-2.5 rounded-xl font-medium transition-all ${
                          settings.length === length
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
                        <div className="absolute right-0 bottom-full mb-2 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-20 min-w-[80px]">
                          {[1, 3, 5].map((num) => (
                            <button
                              key={num}
                              onClick={() => {
                                setReplyCount(num);
                                setShowCountDropdown(false);
                              }}
                              className={`w-full px-4 py-2 text-left hover:bg-neutral-50 transition-colors ${
                                replyCount === num ? 'text-[#002B7A] font-semibold' : 'text-neutral-700'
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
            console.log('Template saved:', template);
            setShowSaveModal(false);
          }}
        />
      )}
    </>
  );
}
