import { useState } from 'react';
import { AIAssistant, QuickSettings, SavedTemplatesTab, ReviewSummary, ReviewList, DEFAULT_CASES } from './components';

export default function ReviewManagementPage() {
  const [activeTab, setActiveTab] = useState('review-management');
  const [settings, setSettings] = useState({
    tone: '친근함',
    length: '보통',
    includeThanks: true,
    includeGreatDay: true,
    useEmojis: false,
    photoThanks: true,
    brandPreset: '',
    optionalInstruction: '',
    exceptionCases: DEFAULT_CASES
  });
  
  const [savedTemplates, setSavedTemplates] = useState([]);

  const mockReviewData = {
    averageRating: 4.5,
    totalReviews: 1234,
    evaluationMetrics: [
      { name: '음식', rating: 'great', percentage: 92, reason: '음식의 맛과 품질이 매우 훌륭합니다.' },
      { name: '서비스', rating: 'good', percentage: 85, reason: '친절하고 빠른 서비스를 제공합니다.' },
      { name: '분위기', rating: 'good', percentage: 88, reason: '쾌적하고 아늑한 분위기입니다.' }
    ]
  };

  const mockReviews = [
    { id: '1', author: '김철수', rating: 5, date: '2024-02-15', content: '음식이 정말 맛있었어요!', hasPhoto: true },
    { id: '2', author: '이영희', rating: 4, date: '2024-02-14', content: '분위기도 좋고 서비스도 친절했습니다.', hasPhoto: false },
    { id: '3', author: '박민수', rating: 5, date: '2024-02-13', content: '가족과 함께 방문했는데 모두 만족했어요.', hasPhoto: true }
  ];

  const tabDescriptions = {
    'review-management': '리뷰를 선택하고 AI가 생성한 답변을 확인하세요.',
    'quick-settings': '답변 생성에 사용할 설정을 빠르게 조정하세요.',
    'saved-templates': '저장된 템플릿을 관리하고 재사용하세요.'
  };

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200">
        <div className="flex border-b border-neutral-200">
          <button onClick={() => setActiveTab('review-management')} className={`flex-1 px-6 py-4 font-bold transition-colors relative ${activeTab === 'review-management' ? 'text-[#002B7A]' : 'text-neutral-500 hover:text-neutral-700'}`}>
            리뷰관리
            {activeTab === 'review-management' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#002B7A]" />}
          </button>
          <button onClick={() => setActiveTab('quick-settings')} className={`flex-1 px-6 py-4 font-bold transition-colors relative ${activeTab === 'quick-settings' ? 'text-[#002B7A]' : 'text-neutral-500 hover:text-neutral-700'}`}>
            빠른 설정
            {activeTab === 'quick-settings' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#002B7A]" />}
          </button>
          <button onClick={() => setActiveTab('saved-templates')} className={`flex-1 px-6 py-4 font-bold transition-colors relative ${activeTab === 'saved-templates' ? 'text-[#002B7A]' : 'text-neutral-500 hover:text-neutral-700'}`}>
            저장된 템플릿
            {activeTab === 'saved-templates' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#002B7A]" />}
          </button>
        </div>
        <div className="px-6 py-3 bg-neutral-50 text-sm text-neutral-600">{tabDescriptions[activeTab]}</div>
      </div>

      {activeTab === 'review-management' && (
        <div className="grid grid-cols-2 gap-6">
          <div>
            <ReviewSummary averageRating={mockReviewData.averageRating} totalReviews={mockReviewData.totalReviews} evaluationMetrics={mockReviewData.evaluationMetrics} />
          </div>
          <div>
            <ReviewList reviews={mockReviews} />
          </div>
        </div>
      )}

      {activeTab === 'quick-settings' && (
        <QuickSettings 
          settings={settings}
          onSettingsChange={setSettings}
        />
      )}

      {activeTab === 'saved-templates' && <SavedTemplatesTab templates={savedTemplates} onDelete={(id) => setSavedTemplates(prev => prev.filter(t => t.id !== id))} />}
    </div>
  );
}
