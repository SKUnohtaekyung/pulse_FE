import React, { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardHome from '../../features/dashboard/DashboardHome';
import UnifiedInsightPage from '../../features/insight/UnifiedInsightPage';
import CommercialAnalysisPage from '../../features/insight/CommercialAnalysisPage';
import MyPage from '../../features/mypage/MyPage';
import PromotionPage from '../../features/promotion/PromotionPage';
import ReviewManagementPage from '../../features/reviewManagement/ReviewManagementPage';
import SubscriptionPage from '../../pages/SubscriptionPage';
import InfluencerMatchingPage from '../../features/influencer/InfluencerMatchingPage';
import { COLORS } from '../../constants';
import '../../styles/globals.css';

export default function DashboardLayout({ initialPage, content }) {
    const [activeMenu, setActiveMenu] = useState(initialPage || 'home');
    const [isExpanded, setIsExpanded] = useState(false);

    const [navParams, setNavParams] = useState(null);

    const handleNavigate = (menuId, params = null) => {
        setActiveMenu(menuId);
        if (params) {
            setNavParams(params);
        }
    };

    return (
        <div className="flex h-screen font-pretendard overflow-hidden" style={{ backgroundColor: COLORS.bgPage }}>
            <Sidebar
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
            />

            <main
                className={`flex-1 p-6 h-full flex flex-col main-content ${isExpanded ? 'ml-[276px]' : 'ml-[96px]'}`}
            >
                <div className="max-w-[1400px] h-full flex flex-col w-full mx-auto">
                    {activeMenu === 'home' ? (
                        // DASHBOARD VIEW
                        <>
                            <Header title="오늘도 힘차게 시작해볼까요?" />
                            <DashboardHome onNavigate={handleNavigate} />
                        </>
                    ) : activeMenu === 'commercial-analysis' ? (
                        // COMMERCIAL ANALYSIS VIEW
                        <>
                            <Header title="우리 가게 주변 상권을 심층 분석합니다." />
                            <CommercialAnalysisPage />
                        </>
                    ) : activeMenu === 'insight' ? (
                        // INSIGHT VIEW
                        <>
                            <Header title="단골 손님과 상권 트렌드를 분석해 드려요." />
                            <UnifiedInsightPage onNavigate={handleNavigate} />
                        </>
                    ) : activeMenu === 'mypage' ? (
                        // MYPAGE VIEW
                        <>
                            <Header title="가게 정보와 연동 상태를 관리하세요." />
                            <MyPage />
                        </>
                    ) : activeMenu === 'promotion' ? (
                        // PROMOTION VIEW
                        <>
                            <Header title="사장님의 사진으로 홍보 영상을 빠르게 제작해 드려요." />
                            <PromotionPage initialParams={navParams} onNavigate={handleNavigate} />
                        </>
                    ) : activeMenu === 'review' ? (
                        // REVIEW MANAGEMENT VIEW
                        <>
                            <Header title="리뷰를 관리하고 AI로 답변을 작성하세요." />
                            <ReviewManagementPage />
                        </>
                    ) : activeMenu === 'subscription' ? (
                        // SUBSCRIPTION VIEW
                        <SubscriptionPage />
                    ) : activeMenu === 'influencer-matching' ? (
                        // INFLUENCER MATCHING VIEW
                        // content prop이 있으면(RequestPage 등) 그것을 렌더링, 아니면 메인 페이지
                        content || (
                            <>
                                <Header title="우리 가게에 딱 맞는 인플루언서를 찾아보세요." />
                                <InfluencerMatchingPage initialParams={navParams} />
                            </>
                        )
                    ) : (
                        // Placeholder for other menus
                        <div className="flex items-center justify-center h-full text-gray-400 flex-col gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                <MoreHorizontal size={32} className="text-gray-400" />
                            </div>
                            <p>준비 중인 기능입니다.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
