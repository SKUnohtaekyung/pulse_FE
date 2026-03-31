import React, { useState } from 'react';
import InfluencerSidebar from './InfluencerSidebar';
import Header from './Header';
import InfluencerInbox from '../../features/influencer/InfluencerInbox';
import InfluencerProfile from '../../features/influencer/InfluencerProfile';
import { COLORS } from '../../constants';
import '../../styles/globals.css';

export default function InfluencerLayout({ initialPage }) {
    const [activeMenu, setActiveMenu] = useState(initialPage || 'inbox');
    const [isExpanded, setIsExpanded] = useState(false);
    
    // MVP Mock Profile for Influencer
    const userProfile = {
        ownerName: '테스트 인플루언서',
        profileImage: null
    };

    return (
        <div className="flex h-screen font-pretendard overflow-hidden" style={{ backgroundColor: COLORS.bgPage }}>
            <InfluencerSidebar
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
                profile={userProfile}
            />

            <main
                className={`flex-1 p-6 h-full flex flex-col main-content pt-20 md:pt-6 transition-all duration-300 ${isExpanded ? 'md:ml-[276px] ml-0' : 'md:ml-[96px] ml-0'}`}
            >
                <div className="max-w-[1400px] h-full flex flex-col w-full mx-auto">
                    {activeMenu === 'inbox' ? (
                        <div className="flex-1 flex flex-col min-h-0 fade-in">
                            <Header title="반가워요! 새로운 제안이 도착했어요." profile={userProfile} />
                            <InfluencerInbox />
                        </div>
                    ) : activeMenu === 'profile' ? (
                        <div className="flex-1 flex flex-col min-h-0 fade-in">
                            <Header title="나의 채널 정보와 활동 내역을 관리하세요." profile={userProfile} />
                            <InfluencerProfile />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 flex-col gap-4">
                            <p>준비 중인 기능입니다.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
