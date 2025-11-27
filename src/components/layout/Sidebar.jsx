import React from 'react';
import {
    Home,
    BarChart2,
    MessageCircle,
    PlayCircle,
    Users,
    User,
    LayoutDashboard
} from 'lucide-react';

const Sidebar = ({ activeMenu, setActiveMenu, isExpanded, setIsExpanded }) => {
    const menus = [
        { id: 'home', icon: <LayoutDashboard size={24} />, label: '우리 가게 현황' },
        { id: 'insight', icon: <BarChart2 size={24} />, label: '손님 마음 읽기' },
        { id: 'review', icon: <MessageCircle size={24} />, label: '리뷰 관리 & 답변' },
        { id: 'promotion', icon: <PlayCircle size={24} />, label: '홍보 영상 만들기' },
        { id: 'expert', icon: <Users size={24} />, label: '전문가 매칭' },
        { id: 'mypage', icon: <Home size={24} />, label: '마이페이지' },
    ];

    return (
        <div
            className="fixed top-4 bottom-4 left-4 z-50 flex flex-col gap-3"
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            {/* Logo Section - Transparent Background */}
            {/* Logo Section - Transparent Background */}
            {/* Logo Section - Transparent Background */}
            <div className={`h-20 flex items-center pl-4 shrink-0 overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${isExpanded ? 'w-[260px]' : 'w-[68px]'}`}>
                <img
                    src="/PULSE_LOGO.png"
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
                            <span className="menu-label text-[17px] font-medium">
                                {menu.label}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Profile Section */}
                <div className="mb-2 shrink-0">
                    <div
                        className={`relative flex items-center h-14 transition-all duration-200 cursor-pointer ${isExpanded ? 'pl-[28px] justify-start' : 'justify-center'
                            }`}
                        onClick={() => setActiveMenu('mypage')}
                    >
                        {/* Profile Icon */}
                        <div className="menu-icon">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center border border-white/10">
                                <User size={16} className="text-white" />
                            </div>
                        </div>

                        {/* Text Container */}
                        <div className={`flex flex-col justify-center overflow-hidden transition-all duration-300 ${isExpanded ? 'opacity-100 max-w-[150px] ml-4' : 'opacity-0 max-w-0 ml-0'
                            }`}>
                            <p className="text-white text-sm font-medium leading-none mb-1">박사장님</p>
                            <p className="text-white/50 text-xs leading-none">Premium</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
