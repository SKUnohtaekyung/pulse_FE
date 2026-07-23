import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { QuickSettings, SavedTemplatesTab, ReviewSummary, ReviewList, DEFAULT_CASES } from './components';
import {
  createReviewTemplate,
  deleteReviewTemplate,
  fetchReviewManagementContext,
  generateReviewReplies,
  saveReviewManagementSettings,
  updateReviewTemplate,
} from './api/reviewManagementApi';
import { PageError, PageSkeleton } from '../../components/common/StateViews';
import { useToast } from '../../components/common/ToastProvider';
import { isCanceledError } from '../../utils/apiError';
import { toArray } from '../../utils/safeFormat';

const DEFAULT_SETTINGS = {
  tone: '친근함',
  length: '보통',
  includeThanks: true,
  includeGreatDay: true,
  useEmojis: false,
  photoThanks: true,
  brandPreset: '',
  brandPresets: [],
  optionalInstruction: '',
  exceptionCases: DEFAULT_CASES,
};

const TABS = [
  { id: 'review-management', label: '리뷰관리' },
  { id: 'quick-settings', label: '빠른 설정' },
  { id: 'saved-templates', label: '저장된 템플릿' },
];

const DEFAULT_SUMMARY = {
  averageRating: 0,
  totalReviews: 0,
  evaluationMetrics: [],
};

export default function ReviewManagementPage() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('review-management');
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [reviewData, setReviewData] = useState(DEFAULT_SUMMARY);
  const [reviews, setReviews] = useState([]);
  const [selectedReviewIds, setSelectedReviewIds] = useState([]);
  const [replyCount, setReplyCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const hasLoadedContextRef = useRef(false);
  const saveTimeoutRef = useRef(null);
  const contextControllerRef = useRef(null);

  const loadContext = useCallback(async () => {
    // 이전 요청을 취소해 오래된 응답이 최신 데이터를 덮어쓰지 않게 한다.
    contextControllerRef.current?.abort();
    const controller = new AbortController();
    contextControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchReviewManagementContext(controller.signal);
      if (controller.signal.aborted) return;

      // 응답 필드가 일부 빠져도 나머지는 그대로 보여준다.
      const source = data && typeof data === 'object' ? data : {};
      const loadedReviews = toArray(source.reviews);

      setReviewData({ ...DEFAULT_SUMMARY, ...(source.summary || {}) });
      setReviews(loadedReviews);
      setSettings({
        ...DEFAULT_SETTINGS,
        ...(source.settings || {}),
        exceptionCases: toArray(source.settings?.exceptionCases).length ? source.settings.exceptionCases : DEFAULT_CASES,
        brandPresets: toArray(source.settings?.brandPresets),
      });
      setSavedTemplates(toArray(source.templates));
      setSelectedReviewIds(loadedReviews[0]?.id ? [loadedReviews[0].id] : []);
      hasLoadedContextRef.current = true;
    } catch (fetchError) {
      if (controller.signal.aborted || isCanceledError(fetchError)) return;
      setError(fetchError);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContext();

    return () => {
      contextControllerRef.current?.abort();
      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [loadContext]);

  useEffect(() => {
    setSelectedReviewIds((prev) => {
      const validIds = prev.filter((id) => reviews.some((review) => review.id === id));
      if (replyCount === 1) {
        if (validIds[0]) {
          return [validIds[0]];
        }
        return reviews[0]?.id ? [reviews[0].id] : [];
      }
      return validIds.slice(0, replyCount);
    });
  }, [reviews, replyCount]);

  useEffect(() => {
    if (!hasLoadedContextRef.current) {
      return;
    }

    if (saveTimeoutRef.current) {
      window.clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = window.setTimeout(async () => {
      try {
        setIsSavingSettings(true);
        await saveReviewManagementSettings(settings);
      } catch (saveError) {
        // 저장 실패를 조용히 넘기면 사용자는 설정이 반영된 줄 안다.
        if (!isCanceledError(saveError)) {
          toast.fromError(saveError, '설정을 저장하지 못했어요. 잠시 후 다시 시도해 주세요.');
        }
      } finally {
        setIsSavingSettings(false);
      }
    }, 500);

    return () => {
      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [settings, toast]);

  const selectedReviews = useMemo(() => {
    const selectedIdSet = new Set(selectedReviewIds);
    return reviews.filter((review) => selectedIdSet.has(review.id));
  }, [reviews, selectedReviewIds]);

  const tabDescriptions = useMemo(
    () => ({
      'review-management': '실제 수집된 네이버/카카오 리뷰를 확인하고 답변 대상을 선택하세요.',
      'quick-settings': '선택한 리뷰를 기준으로 답변 톤과 예외 케이스를 조정하세요.',
      'saved-templates': '저장한 답변 템플릿을 관리하고 재사용하세요.',
    }),
    [],
  );

  const handleReviewClick = (reviewId) => {
    setSelectedReviewIds((prev) => {
      if (replyCount === 1) {
        return [reviewId];
      }

      if (prev.includes(reviewId)) {
        return prev.filter((id) => id !== reviewId);
      }

      const next = [...prev, reviewId];
      return next.slice(-replyCount);
    });
  };

  // 템플릿 CRUD 는 실패해도 화면이 멈추지 않도록 오류를 잡아 사용자에게 알리고,
  // 호출부가 성공 여부를 알 수 있도록 다시 던진다.
  const handleCreateTemplate = async (template) => {
    try {
      const created = await createReviewTemplate(template);
      setSavedTemplates((prev) => [created, ...prev]);
      toast.success('템플릿을 저장했어요.');
      return created;
    } catch (actionError) {
      toast.fromError(actionError, '템플릿을 저장하지 못했어요. 잠시 후 다시 시도해 주세요.');
      throw actionError;
    }
  };

  const handleUpdateTemplate = async (templateId, template) => {
    try {
      const updated = await updateReviewTemplate(templateId, template);
      setSavedTemplates((prev) => prev.map((item) => (item.id === templateId ? updated : item)));
      toast.success('템플릿을 수정했어요.');
      return updated;
    } catch (actionError) {
      toast.fromError(actionError, '템플릿을 수정하지 못했어요. 잠시 후 다시 시도해 주세요.');
      throw actionError;
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    try {
      await deleteReviewTemplate(templateId);
      setSavedTemplates((prev) => prev.filter((item) => item.id !== templateId));
      toast.success('템플릿을 삭제했어요.');
    } catch (actionError) {
      toast.fromError(actionError, '템플릿을 삭제하지 못했어요. 잠시 후 다시 시도해 주세요.');
      throw actionError;
    }
  };

  const handleGenerateReplies = async (reviewsToGenerate, currentSettings) => {
    try {
      return await generateReviewReplies({
        reviews: reviewsToGenerate,
        settings: currentSettings,
      });
    } catch (actionError) {
      toast.fromError(actionError, 'AI 답변을 만들지 못했어요. 잠시 후 다시 시도해 주세요.');
      throw actionError;
    }
  };

  const renderContent = () => {
    if (loading) {
      return <PageSkeleton cards={2} />;
    }

    if (error) {
      return (
        <PageError
          error={error}
          title="리뷰 정보를 불러오지 못했어요"
          onRetry={loadContext}
        />
      );
    }

    if (activeTab === 'review-management') {
      return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div>
            <ReviewSummary
              averageRating={reviewData.averageRating}
              totalReviews={reviewData.totalReviews}
              evaluationMetrics={reviewData.evaluationMetrics}
            />
          </div>
          <div>
            <ReviewList
              reviews={reviews}
              selectedReviewIds={selectedReviewIds}
              onReviewClick={handleReviewClick}
            />
          </div>
        </div>
      );
    }

    if (activeTab === 'quick-settings') {
      return (
        <QuickSettings
          settings={settings}
          onSettingsChange={setSettings}
          recentReviews={reviews}
          selectedReviews={selectedReviews}
          selectedReviewIds={selectedReviewIds}
          onAddTemplate={handleCreateTemplate}
          onGenerateReplies={handleGenerateReplies}
          onRegenerateReply={(review, currentSettings) => handleGenerateReplies([review], currentSettings)}
          isSavingSettings={isSavingSettings}
          replyCount={replyCount}
          onReplyCountChange={setReplyCount}
        />
      );
    }

    return (
      <SavedTemplatesTab
        templates={savedTemplates}
        onDelete={handleDeleteTemplate}
        onUpdate={handleUpdateTemplate}
      />
    );
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 gap-0" data-testid="review-management-page">
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 shrink-0">
        <div className="flex border-b border-neutral-200" role="tablist" aria-label="리뷰 관리 메뉴">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              data-testid={`review-tab-${tab.id}`}
              className={`flex-1 px-4 sm:px-6 py-4 font-bold transition-colors relative
                          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:-ring-offset-1
                          ${activeTab === tab.id ? 'text-[#002B7A]' : 'text-neutral-500 hover:text-neutral-700'}`}
            >
              {tab.label}
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#002B7A]" />}
            </button>
          ))}
        </div>
        <div className="px-6 py-3 bg-neutral-50 text-sm text-neutral-600">{tabDescriptions[activeTab]}</div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pt-6 pb-10 custom-scrollbar">{renderContent()}</div>
    </div>
  );
}
