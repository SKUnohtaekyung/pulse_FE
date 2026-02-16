import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Home,
    BarChart2,
    MessageCircle,
    PlayCircle,
    Users,
    User,
    LayoutDashboard,
    LogOut,
    ChevronUp,
    Map
} from 'lucide-react';

const Sidebar = ({ activeMenu, setActiveMenu, isExpanded, setIsExpanded }) => {
    const navigate = useNavigate();
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const menus = [
        { id: 'home', icon: <LayoutDashboard size={24} />, label: '가게 현황' },
        { id: 'commercial-analysis', icon: <Map size={24} />, label: '주변 상권 분석' },
        { id: 'insight', icon: <BarChart2 size={24} />, label: '손님 분석' },
        { id: 'promotion', icon: <PlayCircle size={24} />, label: '홍보 영상 만들기' },
        { id: 'review', icon: <MessageCircle size={24} />, label: '리뷰 관리 & 답변' },
        { id: 'influencer-matching', icon: <Users size={24} />, label: '인플루언서 매칭', badge: 'Pro' },
        { id: 'mypage', icon: <Home size={24} />, label: '마이페이지' },
    ];

    const handleLogout = (e) => {
        e.stopPropagation();
        // Clear any auth tokens if needed
        navigate('/login');
    };

    return (
        <div
            className="fixed top-4 bottom-4 left-4 z-50 flex flex-col gap-3"
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => {
                setIsExpanded(false);
                setShowProfileMenu(false);
            }}
        >
            <div
                className={`h-20 flex items-center pl-4 shrink-0 overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${isExpanded ? 'w-[260px]' : 'w-[68px]'} cursor-pointer`}
                onClick={() => setActiveMenu('home')}
            >
                <img
                    src={`${import.meta.env.BASE_URL}PULSE_LOGO.png`}
                    alt="PULSE"
                    className="h-12 w-auto max-w-none object-contain object-left"
                />
            </div>

            <div
                className={`flex-1 rounded-[30px] flex flex-col py-6 sidebar-container ${isExpanded ? 'w-[260px] sidebar-expanded' : 'w-[68px]'
                    }`}
            >
                <div className="flex-1 flex flex-col gap-2 overflow-y-auto scrollbar-hide py-8">
                    {menus.map((menu) => (
                        <button
                            key={menu.id}
                            onClick={() => setActiveMenu(menu.id)}
                            className={`menu-item w-full ${activeMenu === menu.id ? 'active' : ''}`}
                        >
                            <div className="menu-icon">
                                {menu.icon}
                            </div>
                            <span className="menu-label text-[17px] font-medium flex items-center gap-2">
                                {menu.label}
                                {menu.badge && (
                                    <span className="px-2 py-0.5 bg-gradient-to-r from-[#FF5A36] to-[#FF8A36] text-white text-[10px] font-bold rounded-full">
                                        {menu.badge}
                                    </span>
                                )}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="mb-2 shrink-0 relative px-2">
                    <div
                        className={`relative flex items-center h-16 transition-all duration-200 rounded-2xl ${isExpanded ? 'bg-white/10 px-3 justify-between' : 'justify-center hover:bg-white/5'
                            }`}
                    >
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center border border-white/10 shadow-inner">
                                <User size={18} className="text-white" />
                            </div>

                            <div
                                className={`flex flex-col justify-center transition-all duration-300 ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden'} cursor-pointer hover:opacity-80`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveMenu('subscription');
                                }}
                            >
                                <p className="text-white text-[15px] font-bold leading-tight mb-0.5">박사장님</p>
                                <div className="flex items-center gap-1">
                                    <p className="text-blue-200 text-[11px] font-medium leading-tight">Growth 플랜</p>
                                    <ChevronUp size={12} className="text-blue-200" />
                                </div>
                            </div>
                        </div>

                        {isExpanded && (
                            <button
                                onClick={handleLogout}
                                className="group flex items-center justify-center w-8 h-8 rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-all"
                            >
                                <LogOut size={15} strokeWidth={2} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
