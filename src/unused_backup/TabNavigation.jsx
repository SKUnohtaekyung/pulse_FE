import React from 'react';
import { motion } from 'framer-motion';

const TabNavigation = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: 'briefing', label: '매장 브리핑' },
        { id: 'analysis', label: '상세 분석' }
    ];

    return (
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-6">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`relative px-6 py-2.5 rounded-lg text-sm font-bold transition-colors z-10 ${activeTab === tab.id ? 'text-[#002B7A]' : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    {activeTab === tab.id && (
                        <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 bg-white rounded-lg shadow-sm"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                </button>
            ))}
        </div>
    );
};

export default TabNavigation;
