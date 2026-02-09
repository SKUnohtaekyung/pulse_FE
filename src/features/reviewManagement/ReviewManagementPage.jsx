import React, { useState } from 'react';
import { ReviewDashboard, ReviewSummary, AIAssistant, SavedTemplatesTab } from './components';

/**
 * 리뷰 관리 & 답변 페이지
 * - 리뷰 목록 표시
 * - AI 답변 생성
 * - 저장된 템플릿 관리
 */
export default function ReviewManagementPage() {
    const [activeTab, setActiveTab] = useState('reviews'); // 'reviews', 'templates'
    const [selectedReview, setSelectedReview] = useState(null);
    
    // Mock review summary data (나중에 실제 API로 대체)
    const reviewSummary = {
        averageRating: 3.75,
        totalReviews: 1297,
        evaluationMetrics: [
            {
                name: '서비스 만족도',
                percentage: 92,
                rating: 'great',
                reason: '직원분들이 매우 친절하고 응대가 빠릅니다. 고객의 요구사항을 잘 파악하고 신속하게 처리해주셔서 만족도가 높습니다.'
            },
            {
                name: '음식 만족도',
                percentage: 74,
                rating: 'good',
                reason: '음식의 맛과 품질이 전반적으로 좋습니다. 신선한 재료를 사용하고 있으며, 메뉴 구성이 다양합니다.'
            },
            {
                name: '분위기/청결 만족도',
                percentage: 55,
                rating: 'soso',
                reason: '매장 분위기는 괜찮으나 청결 상태가 개선이 필요합니다. 특히 화장실과 테이블 정리가 더 신경 쓰여야 할 것 같습니다.'
            },
            {
                name: '가격/편의 만족도',
                percentage: 34,
                rating: 'bad',
                reason: '가격 대비 양이 적다는 의견이 많습니다. 주차 공간이 부족하고 접근성이 다소 불편합니다.'
            }
        ]
    };
    
    // Mock templates data (나중에 실제 API로 대체)
    const [templates, setTemplates] = useState([
        {
            id: '1',
            name: '긍정적 리뷰 답변',
            content: '소중한 리뷰 감사합니다! 앞으로도 더 나은 서비스로 보답하겠습니다.',
            tone: '친근함',
            length: '짧게',
            category: ['감사'],
            tags: ['긍정', '서비스'],
            usageCount: 15
        },
        {
            id: '2',
            name: '부정적 리뷰 답변',
            content: '불편을 드려 죄송합니다. 고객님의 소중한 의견을 반영하여 개선하도록 노력하겠습니다.',
            tone: '격식',
            length: '보통',
            category: ['사과 & 고객지원'],
            tags: ['사과', '개선'],
            usageCount: 8
        }
    ]);

    const handleDeleteTemplate = (id) => {
        setTemplates(templates.filter(t => t.id !== id));
    };

    return (
        <div className="h-full flex flex-col gap-6 mb-10">
            {/* 탭 네비게이션 */}
            <div className="flex gap-2 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('reviews')}
                    className={`px-6 py-3 font-medium transition-all ${
                        activeTab === 'reviews'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    리뷰 관리
                </button>
                <button
                    onClick={() => setActiveTab('templates')}
                    className={`px-6 py-3 font-medium transition-all ${
                        activeTab === 'templates'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    저장된 템플릿
                </button>
            </div>

            {/* 탭 컨텐츠 */}
            <div className="flex-1 overflow-auto mb-10">
                {activeTab === 'reviews' && (
                    <div className="grid grid-cols-2 gap-6 h-full">
                        {/* 왼쪽: 리뷰 관리 */}
                        <div className="flex flex-col gap-6 overflow-auto pr-3">
                            <ReviewSummary 
                                averageRating={reviewSummary.averageRating}
                                totalReviews={reviewSummary.totalReviews}
                                evaluationMetrics={reviewSummary.evaluationMetrics}
                            />
                        </div>

                        {/* 오른쪽: AI 답변 생성 */}
                        <div className="overflow-auto pl-3 border-l border-gray-200">
                            <AIAssistant selectedReview={selectedReview} />
                        </div>
                    </div>
                )}
                {activeTab === 'templates' && (
                    <SavedTemplatesTab 
                        templates={templates}
                        onDelete={handleDeleteTemplate}
                    />
                )}
            </div>
        </div>
    );
}
