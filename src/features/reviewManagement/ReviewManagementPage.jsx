import { useState } from 'react';
import { AIAssistant, QuickSettings, SavedTemplatesTab, ReviewSummary, ReviewList, DEFAULT_CASES } from './components';

export default function ReviewManagementPage() {
  const [activeTab, setActiveTab] = useState('review-management');
  const [settings, setSettings] = useState({
    tone: '친근함',
    length: '보통',
    includeThanks: true,
    includeGreatDay: true,
    useEmojis: true,
    photoThanks: true,
    brandPreset: '바람난 얼큰 수제비',
    optionalInstruction: '',
    exceptionCases: DEFAULT_CASES
  });
  
  const [savedTemplates, setSavedTemplates] = useState([]);

  const mockReviewData = {
    averageRating: 4.3,
    totalReviews: 312,
    evaluationMetrics: [
      { name: '국물맛', rating: 'great', percentage: 94, reason: '칼칼하고 얼큰한 국물이 강한 인상을 남깁니다. 고소하면서도 깊은 풍미라는 언급이 반복됩니다.' },
      { name: '수제비 식감', rating: 'good', percentage: 76, reason: '쫄깃한 면발에 대한 호평이 많지만, 일부는 두께가 고르지 않다는 의견도 있습니다.' },
      { name: '양/가성비', rating: 'great', percentage: 91, reason: '양이 넉넉하고 가격 대비 만족도가 높다는 평가가 지배적입니다.' },
      { name: '응대/서비스', rating: 'good', percentage: 82, reason: '친절하다는 평이 많고, 웨이팅 안내도 잘 이뤄진다는 긍정 반응이 있습니다.' }
    ]
  };


  const mockReviews = [
    { id: '1', author: '김철수', date: '2026-02-11', content: '순한맛(하), 약간 매운맛(중) 두가지 시켰어요. 매운거 잘 먹는 편인데 매워서 콧물이 자꾸 나더라구요 ㅋ 남편은 순한맛도 매워했구요. 수제비면이 제가 집에서 반죽한 것 같은 질감이라 약간 불만족이여요 ㅋㅋ', hasPhoto: true },
    { id: '2', author: '이영희', date: '2026-01-13', content: '스트레스를 확 날릴 수 있는 얼큰 수제비. 역시 깔끔하고 맛있어요. 김치도 맛있고 . 오늘 친구와 갔는데 이친구 단골 되겠어요. 너무너무 맛있대요. 또 와야죠', hasPhoto: true },
    { id: '3', author: '박민수', date: '2026-01-08', content: '수제비 최애 하는곳~ 칼칼한맛에 중독압니다.', hasPhoto: true }
  ];

  const tabDescriptions = {
    'review-management': '리뷰를 선택하고 AI가 생성한 답변을 확인하세요.',
    'quick-settings': '답변 생성에 사용할 설정을 빠르게 조정하세요.',
    'saved-templates': '저장된 템플릿을 관리하고 재사용하세요.'
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 gap-0">
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 shrink-0">
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

      <div className="flex-1 min-h-0 overflow-y-auto pt-6 pb-10 custom-scrollbar">

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
            reviews={mockReviews}
            onSaveTemplate={(template) => {
              setSavedTemplates(prev => [{ ...template, id: Date.now().toString() }, ...prev]);
            }}
          />
        )}

        {activeTab === 'saved-templates' && <SavedTemplatesTab templates={savedTemplates} onDelete={(id) => setSavedTemplates(prev => prev.filter(t => t.id !== id))} />}
      </div>
    </div>
  );
}
