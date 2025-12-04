import React, { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardHome from '../../features/dashboard/DashboardHome';
import TabNavigation from '../../features/insight/TabNavigation';
import CustomerAnalysis from '../../features/insight/CustomerAnalysis';
import LocalAnalysisSection from '../../features/insight/LocalAnalysisSection';
import MyPage from '../../features/mypage/MyPage';
import PromotionPage from '../../features/promotion/PromotionPage';
import { COLORS } from '../../constants';
import '../../styles/globals.css';

export default function DashboardLayout() {
    const [activeMenu, setActiveMenu] = useState('home');
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState('persona');
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
                    ) : activeMenu === 'insight' ? (
                        // INSIGHT VIEW
                        <>
                            <Header title="오늘도 힘차게 시작해볼까요?" />
                            <div className="mt-4">
                                <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
                            </div>
                            {activeTab === 'persona' ? <CustomerAnalysis onNavigate={handleNavigate} /> : <LocalAnalysisSection onNavigate={handleNavigate} />}
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
                            <PromotionPage initialParams={navParams} />
                        </>
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
