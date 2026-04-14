import { useEffect, useMemo, useRef, useState } from 'react';
import { QuickSettings, SavedTemplatesTab, ReviewSummary, ReviewList, DEFAULT_CASES } from './components';
import {
  createReviewTemplate,
  deleteReviewTemplate,
  fetchReviewManagementContext,
  generateReviewReplies,
  saveReviewManagementSettings,
  updateReviewTemplate,
} from './api/reviewManagementApi';

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

const DEFAULT_SUMMARY = {
  averageRating: 0,
  totalReviews: 0,
  evaluationMetrics: [],
};

export default function ReviewManagementPage() {
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

  useEffect(() => {
    const loadContext = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchReviewManagementContext();
        const loadedReviews = data.reviews || [];

        setReviewData(data.summary || DEFAULT_SUMMARY);
        setReviews(loadedReviews);
        setSettings({
          ...DEFAULT_SETTINGS,
          ...(data.settings || {}),
          exceptionCases: data.settings?.exceptionCases?.length ? data.settings.exceptionCases : DEFAULT_CASES,
          brandPresets: data.settings?.brandPresets || [],
        });
        setSavedTemplates(data.templates || []);
        setSelectedReviewIds(loadedReviews[0]?.id ? [loadedReviews[0].id] : []);
        hasLoadedContextRef.current = true;
      } catch (fetchError) {
        setError(fetchError.message || '리뷰 관리 데이터를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadContext();

    return () => {
      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

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
        console.error('[ReviewManagementPage] settings save failed:', saveError);
      } finally {
        setIsSavingSettings(false);
      }
    }, 500);

    return () => {
      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [settings]);

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

  const handleCreateTemplate = async (template) => {
    const created = await createReviewTemplate(template);
    setSavedTemplates((prev) => [created, ...prev]);
    return created;
  };

  const handleUpdateTemplate = async (templateId, template) => {
    const updated = await updateReviewTemplate(templateId, template);
    setSavedTemplates((prev) => prev.map((item) => (item.id === templateId ? updated : item)));
    return updated;
  };

  const handleDeleteTemplate = async (templateId) => {
    await deleteReviewTemplate(templateId);
    setSavedTemplates((prev) => prev.filter((item) => item.id !== templateId));
  };

  const handleGenerateReplies = async (reviewsToGenerate, currentSettings) =>
    generateReviewReplies({
      reviews: reviewsToGenerate,
      settings: currentSettings,
    });

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-sm text-neutral-500">리뷰 관리 데이터를 불러오는 중입니다...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-200 text-center text-neutral-600">
          {error}
        </div>
      );
    }

    if (activeTab === 'review-management') {
      return (
        <div className="grid grid-cols-2 gap-6">
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
        <div className="flex border-b border-neutral-200">
          <button
            onClick={() => setActiveTab('review-management')}
            data-testid="review-tab-review-management"
            className={`flex-1 px-6 py-4 font-bold transition-colors relative ${activeTab === 'review-management' ? 'text-[#002B7A]' : 'text-neutral-500 hover:text-neutral-700'}`}
          >
            리뷰관리
            {activeTab === 'review-management' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#002B7A]" />}
          </button>
          <button
            onClick={() => setActiveTab('quick-settings')}
            data-testid="review-tab-quick-settings"
            className={`flex-1 px-6 py-4 font-bold transition-colors relative ${activeTab === 'quick-settings' ? 'text-[#002B7A]' : 'text-neutral-500 hover:text-neutral-700'}`}
          >
            빠른 설정
            {activeTab === 'quick-settings' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#002B7A]" />}
          </button>
          <button
            onClick={() => setActiveTab('saved-templates')}
            data-testid="review-tab-saved-templates"
            className={`flex-1 px-6 py-4 font-bold transition-colors relative ${activeTab === 'saved-templates' ? 'text-[#002B7A]' : 'text-neutral-500 hover:text-neutral-700'}`}
          >
            저장된 템플릿
            {activeTab === 'saved-templates' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#002B7A]" />}
          </button>
        </div>
        <div className="px-6 py-3 bg-neutral-50 text-sm text-neutral-600">{tabDescriptions[activeTab]}</div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pt-6 pb-10 custom-scrollbar">{renderContent()}</div>
    </div>
  );
}
