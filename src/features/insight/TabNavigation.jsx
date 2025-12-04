import React from 'react';

const TabNavigation = ({ activeTab, setActiveTab }) => (
    <div className="flex justify-start mb-4 shrink-0">
        <div className="bg-[#E8EEF5] p-1 rounded-full flex relative">
            <button
                onClick={() => setActiveTab('persona')}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 relative z-10 ${activeTab === 'persona' ? 'bg-white text-[#002B7A] shadow-sm' : 'text-gray-400 hover:text-gray-600'
                    }`}
            >
                단골 손님 유형 분석
            </button>
            <button
                onClick={() => setActiveTab('local')}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 relative z-10 ${activeTab === 'local' ? 'bg-white text-[#002B7A] shadow-sm' : 'text-gray-400 hover:text-gray-600'
                    }`}
            >
                우리 동네 상권 분석
            </button>
        </div>
    </div>
);

export default TabNavigation;
