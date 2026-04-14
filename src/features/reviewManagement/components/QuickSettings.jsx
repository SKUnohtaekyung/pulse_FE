import { useState } from 'react';
import { Wand2, Copy, Star, RefreshCw, Check, Loader2 } from 'lucide-react';
import { ExceptionCaseSettings, DEFAULT_CASES } from './ExceptionCaseSettings';
import { SaveTemplateModal } from './TemplateComponents';
import { ReviewCard } from './ReviewList';

function ToggleSwitch({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-neutral-50 transition-colors">
      <span className="text-sm text-neutral-700">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-[#002B7A]' : 'bg-neutral-300'}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`}
        />
      </button>
    </label>
  );
}

function ReplyCard({ reply, onSaveTemplate, onRegenerate, isRegenerating }) {
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

      <p className="text-neutral-700 leading-relaxed mb-4 whitespace-pre-line">{reply.content}</p>

      <div className="flex gap-2">
        <button
          onClick={() => onSaveTemplate(reply.content)}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors text-sm font-medium"
        >
          <Star className="w-4 h-4" />
          즐겨찾기
        </button>
        <button
          onClick={() => onRegenerate(reply.reviewId)}
          disabled={isRegenerating}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-400 text-neutral-700 rounded-lg transition-colors text-sm font-medium"
        >
          {isRegenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
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

export function QuickSettings({
  settings,
  onSettingsChange,
  recentReviews = [],
  selectedReviews = [],
  onAddTemplate,
  onGenerateReplies,
  onRegenerateReply,
  isSavingSettings = false,
  replyCount = 1,
  onReplyCountChange,
}) {
  const [showPresetInput, setShowPresetInput] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [generatedReplies, setGeneratedReplies] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCountDropdown, setShowCountDropdown] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [contentToSave, setContentToSave] = useState('');
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [regeneratingReviewId, setRegeneratingReviewId] = useState(null);

  const brandPresets = settings.brandPresets || [];

  const updateSetting = (key, value) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const handlePresetChange = (value) => {
    if (value === 'add-new') {
      setShowPresetInput(true);
      return;
    }

    updateSetting('brandPreset', value);
  };

  const handleAddPreset = () => {
    const trimmed = newPresetName.trim();
    if (!trimmed) {
      return;
    }

    const nextPresets = brandPresets.includes(trimmed) ? brandPresets : [...brandPresets, trimmed];
    onSettingsChange({
      ...settings,
      brandPreset: trimmed,
      brandPresets: nextPresets,
    });
    setNewPresetName('');
    setShowPresetInput(false);
  };

  const handleGenerate = async () => {
    if (selectedReviews.length === 0) {
      return;
    }

    setIsGenerating(true);
    try {
      const response = await onGenerateReplies(selectedReviews, settings);
      const reviewsById = new Map(selectedReviews.map((review) => [review.id, review]));
      const mappedReplies = (response.replies || []).map((reply) => ({
        ...reply,
        reviewId: reply.reviewId || reply.review_id,
        review: reviewsById.get(reply.reviewId || reply.review_id),
      }));
      setGeneratedReplies(mappedReplies);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveTemplate = (content) => {
    setContentToSave(content);
    setShowSaveModal(true);
  };

  const handleRegenerate = async (reviewId) => {
    const review = generatedReplies.find((item) => item.reviewId === reviewId)?.review;
    if (!review) {
      return;
    }

    setRegeneratingReviewId(reviewId);
    try {
      const response = await onRegenerateReply(review, settings);
      const regenerated = (response.replies || [])[0];
      if (!regenerated) {
        return;
      }

      setGeneratedReplies((prev) =>
        prev.map((item) =>
          item.reviewId === reviewId
            ? {
                ...item,
                id: regenerated.id,
                content: regenerated.content,
                isRecommended: regenerated.isRecommended ?? regenerated.is_recommended ?? item.isRecommended,
              }
            : item,
        ),
      );
    } finally {
      setRegeneratingReviewId(null);
    }
  };

  const selectionSummaryText =
    selectedReviews.length > 0
      ? `${selectedReviews.length}개 선택됨`
      : `리뷰관리 탭에서 리뷰를 클릭해 최대 ${replyCount}개까지 선택하세요`;

  return (
    <>
      <div className="space-y-6">
        {generatedReplies.length > 0 ? (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">생성된 리뷰 답변</h2>
                <p className="text-sm text-neutral-500 mt-1">선택한 리뷰를 기준으로 실제 AI 답변을 생성했습니다.</p>
              </div>
              <button
                onClick={() => setGeneratedReplies([])}
                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-semibold transition-colors text-sm"
              >
                돌아가기 / 다시 생성
              </button>
            </div>

            <div className="space-y-6">
              {generatedReplies.map((reply) => (
                <div key={reply.id} className="relative p-6 bg-neutral-50 rounded-2xl border border-neutral-200">
                  <div className="flex gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center text-xs text-neutral-500">
                          U
                        </div>
                        <span className="text-sm font-semibold text-neutral-700">고객 리뷰</span>
                      </div>
                      <ReviewCard review={reply.review || selectedReviews[0]} />
                    </div>

                    <div className="w-8 flex items-center justify-center pt-[72px]">
                      <div className="w-full border-t-[2px] border-dashed border-neutral-300" />
                      <div className="w-2 h-2 rounded-full bg-neutral-300 absolute" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-3 px-1">
                        <div className="w-8 h-8 bg-[#002B7A] rounded-full flex items-center justify-center text-white text-lg">
                          AI
                        </div>
                        <span className="text-sm font-semibold text-[#002B7A]">생성된 AI 답변</span>
                      </div>
                      <ReplyCard
                        reply={reply}
                        onSaveTemplate={handleSaveTemplate}
                        onRegenerate={handleRegenerate}
                        isRegenerating={regeneratingReviewId === reply.reviewId}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold text-neutral-900">빠른 설정</h3>
                  {isSavingSettings && (
                    <span className="text-xs text-neutral-400 inline-flex items-center gap-1">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      저장 중
                    </span>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-700 mb-3">말투</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['격식', '친근함', '밝음', '감성적'].map((tone) => (
                      <button
                        key={tone}
                        onClick={() => updateSetting('tone', tone)}
                        className={`px-3 py-2.5 rounded-xl font-medium transition-all text-sm ${
                          settings.tone === tone ? 'bg-[#002B7A] text-white shadow-sm' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                      >
                        {tone}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-700 mb-3">길이</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['짧게', '보통', '상세히'].map((length) => (
                      <button
                        key={length}
                        onClick={() => updateSetting('length', length)}
                        className={`px-4 py-2.5 rounded-xl font-medium transition-all ${
                          settings.length === length ? 'bg-[#002B7A] text-white shadow-sm' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                      >
                        {length}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-700 mb-3">필수 규칙</label>
                  <div className="space-y-3">
                    <ToggleSwitch label="감사 인사 포함" checked={settings.includeThanks} onChange={(value) => updateSetting('includeThanks', value)} />
                    <ToggleSwitch label="'좋은 하루 보내세요' 포함" checked={settings.includeGreatDay} onChange={(value) => updateSetting('includeGreatDay', value)} />
                    <ToggleSwitch label="이모지 사용" checked={settings.useEmojis} onChange={(value) => updateSetting('useEmojis', value)} />
                    <ToggleSwitch label="사진 리뷰 감사 포함" checked={settings.photoThanks} onChange={(value) => updateSetting('photoThanks', value)} />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-700 mb-3">브랜드 프리셋</label>
                  {showPresetInput ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newPresetName}
                        onChange={(event) => setNewPresetName(event.target.value)}
                        onKeyDown={(event) => event.key === 'Enter' && handleAddPreset()}
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
                      value={settings.brandPreset || ''}
                      onChange={(event) => handlePresetChange(event.target.value)}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#002B7A] focus:border-transparent"
                    >
                      {brandPresets.length === 0 && <option value="">프리셋을 추가해 주세요</option>}
                      {brandPresets.map((preset) => (
                        <option key={preset} value={preset}>
                          {preset}
                        </option>
                      ))}
                      <option value="add-new">+ 새 프리셋 추가</option>
                    </select>
                  )}
                  <p className="mt-2 text-xs text-neutral-500">매장명, 인사말 등 반복 문구를 저장해둘 수 있습니다.</p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-700 mb-3">AI에게 추가 요청 (선택)</label>
                  <input
                    type="text"
                    value={settings.optionalInstruction || ''}
                    onChange={(event) => updateSetting('optionalInstruction', event.target.value)}
                    placeholder="예: 추천 메뉴를 자연스럽게 언급"
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#002B7A] focus:border-transparent"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || selectedReviews.length === 0}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#FF5A36CC] hover:bg-[#FF5A36] disabled:bg-neutral-400 text-white rounded-xl font-semibold shadow-sm transition-colors"
                  >
                    {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                    {isGenerating ? '생성 중...' : `${selectedReviews.length || replyCount}개 답변 생성`}
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setShowCountDropdown((prev) => !prev)}
                      className="px-4 py-4 bg-[#FF5A36CC] hover:bg-[#FF5A36] text-white rounded-xl shadow-sm transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {showCountDropdown && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowCountDropdown(false)} />
                        <div className="absolute right-0 bottom-full mb-2 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-20 min-w-fit whitespace-nowrap">
                          {[
                            { value: 1, label: '1개', isPro: false },
                            { value: 5, label: '5개', isPro: true },
                          ].map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                onReplyCountChange(option.value);
                                setShowCountDropdown(false);
                              }}
                              className={`w-full px-4 py-2 flex items-center gap-3 text-left hover:bg-neutral-50 transition-colors ${
                                replyCount === option.value ? 'text-[#002B7A] font-semibold' : 'text-neutral-700'
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

                <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-900">선택된 리뷰</h4>
                      <p className="text-xs text-neutral-500 mt-1">리뷰관리 탭에서 클릭한 리뷰를 기준으로 답변을 생성합니다.</p>
                    </div>
                    <span className="text-xs font-semibold text-[#002B7A]">{selectionSummaryText}</span>
                  </div>

                  {selectedReviews.length > 0 ? (
                    <div className="space-y-3 max-h-[420px] overflow-y-auto custom-scrollbar pr-1">
                      {selectedReviews.map((review) => (
                        <ReviewCard key={review.id} review={review} isSelected />
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl bg-white border border-dashed border-neutral-200 px-4 py-6 text-sm text-neutral-500 text-center">
                      리뷰관리 탭으로 이동해 답변을 만들 리뷰를 선택해주세요.
                    </div>
                  )}
                </div>
              </div>
            </div>

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
          initialValue={{ content: contentToSave }}
          onClose={() => setShowSaveModal(false)}
          onSave={async (template) => {
            setSavingTemplate(true);
            try {
              await onAddTemplate({
                ...template,
                tone: settings.tone,
                length: settings.length,
                date: new Date().toISOString().split('T')[0],
              });
              setShowSaveModal(false);
            } finally {
              setSavingTemplate(false);
            }
          }}
          submitLabel={savingTemplate ? '저장 중...' : '저장'}
        />
      )}
    </>
  );
}
