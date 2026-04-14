import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Inbox, User, LogOut, ChevronUp, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InfluencerSidebar = ({ activeMenu, setActiveMenu, isExpanded, setIsExpanded, profile }) => {
    const navigate = useNavigate();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
    const influencerName = profile?.ownerName || '인플루언서';

    const menus = [
        { id: 'inbox', icon: <Inbox size={24} />, label: '받은 제안 화면' },
        { id: 'profile', icon: <User size={24} />, label: '마이 프로필' }
    ];

    const handleLogout = (event) => {
        event.stopPropagation();
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        navigate('/login');
    };

    return (
        <>
        <div
            className="hidden md:flex fixed top-4 bottom-4 left-4 z-50 flex flex-col gap-3"
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => {
                setIsExpanded(false);
                setShowProfileMenu(false);
            }}
        >
            <div
                className={`h-20 flex items-center pl-4 shrink-0 overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${isExpanded ? 'w-[260px]' : 'w-[68px]'} cursor-pointer`}
                onClick={() => setActiveMenu('inbox')}
            >
                <img
                    src={`${import.meta.env.BASE_URL}PULSE_LOGO.png`}
                    alt="PULSE"
                    className="h-12 w-auto max-w-none object-contain object-left"
                />
            </div>

            <div
                className={`flex-1 rounded-[30px] flex flex-col py-6 sidebar-container ${isExpanded ? 'w-[260px] sidebar-expanded' : 'w-[68px]'}`}
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
                                    <span className="px-2 py-0.5 bg-gradient-to-r from-gray-500 to-gray-400 text-white text-[10px] font-bold rounded-full">
                                        {menu.badge}
                                    </span>
                                )}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="mb-2 shrink-0 relative px-2">
                    <div
                        className={`relative flex items-center h-16 transition-all duration-200 rounded-2xl ${isExpanded ? 'bg-white/10 px-3 justify-between' : 'justify-center hover:bg-white/5'}`}
                    >
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center border border-white/10 shadow-inner">
                                <User size={18} className="text-white" />
                            </div>

                            <div
                                className={`flex flex-col justify-center transition-all duration-300 ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden'} cursor-pointer hover:opacity-80`}
                            >
                                <p className="text-white text-[15px] font-bold leading-tight mb-0.5 truncate max-w-[130px]">{influencerName}</p>
                                <div className="flex items-center gap-1">
                                    <p className="text-[#A2C4FF] text-[11px] font-medium leading-tight">파트너 계정</p>
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

        {/* --- Mobile View --- */}
        <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white shadow-sm z-40 flex items-center justify-between px-4 border-b border-gray-100">
            <img src={`${import.meta.env.BASE_URL}PULSE_LOGO.png`} alt="PULSE" className="h-5 w-auto object-contain cursor-pointer" onClick={() => setActiveMenu('inbox')} />
            <div className="flex items-center gap-3">
                <div onClick={() => setActiveMenu('profile')} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 cursor-pointer">
                    <User size={16} className="text-gray-600" />
                </div>
                <button onClick={() => setIsMobileDrawerOpen(true)} className="p-2 -mr-2 text-gray-800">
                    <Menu size={24} />
                </button>
            </div>
        </div>

        <AnimatePresence>
            {isMobileDrawerOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="md:hidden fixed inset-0 bg-black/50 z-[60]"
                        onClick={() => setIsMobileDrawerOpen(false)}
                    />
                    <motion.div
                        initial={{ x: '100%' }} 
                        animate={{ x: 0 }} 
                        exit={{ x: '100%' }} 
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="md:hidden fixed top-0 right-0 bottom-0 w-[70vw] max-w-[300px] bg-white z-[70] flex flex-col shadow-2xl"
                    >
                        <div className="h-14 flex items-center justify-end px-4 border-b border-gray-100 shrink-0">
                            <button onClick={() => setIsMobileDrawerOpen(false)} className="p-2 -mr-2 text-gray-800">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto py-4 px-6 flex flex-col">
                            {menus.map((menu) => (
                                <button 
                                    key={menu.id} 
                                    onClick={() => { setActiveMenu(menu.id); setIsMobileDrawerOpen(false); }}
                                    className={`text-left py-4 border-b border-gray-100 flex items-center justify-between ${activeMenu === menu.id ? 'text-[#002B7A] font-bold' : 'text-[#191F28] font-medium text-[17px]'}`}
                                >
                                    {menu.label}
                                    {menu.badge && (
                                        <span className="px-2 py-0.5 bg-gradient-to-r from-gray-500 to-gray-400 text-white text-[10px] font-bold rounded-full">
                                            {menu.badge}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                        <div className="p-6 shrink-0 border-t border-gray-100">
                            <button onClick={(e) => { handleLogout(e); setIsMobileDrawerOpen(false); }} className="flex items-center gap-2 text-gray-500 font-medium py-2">
                                <LogOut size={18} /> 로그아웃
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
        </>
    );
};

export default InfluencerSidebar;
