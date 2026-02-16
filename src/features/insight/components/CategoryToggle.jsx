/**
 * CategoryToggle Component
 * 카테고리별 마커 표시 토글 UI
 */

import React from 'react';
import { Store, Coffee, ShoppingBag, Heart, Pill } from 'lucide-react';

const CATEGORIES = [
    { code: 'FD6', label: '음식점', icon: Store, color: '#FF5A36' },
    { code: 'CE7', label: '카페', icon: Coffee, color: '#8B4513' },
    { code: 'CS2', label: '편의점', icon: ShoppingBag, color: '#00A86B' },
    { code: 'HP8', label: '병원', icon: Heart, color: '#FF1744' },
    { code: 'PM9', label: '약국', icon: Pill, color: '#00BCD4' }
];

export default function CategoryToggle({ selectedCategories, onToggle }) {
    return (
        <div className="absolute top-20 left-4 z-10 bg-white rounded-xl shadow-lg p-3 border border-[#E5E8EB]">
            <div className="flex flex-col gap-2">
                <p className="text-[13px] font-bold text-[#191F28] mb-1">카테고리 필터</p>
                {CATEGORIES.map(category => {
                    const Icon = category.icon;
                    const isSelected = selectedCategories.includes(category.code);

                    return (
                        <button
                            key={category.code}
                            onClick={() => onToggle(category.code)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${isSelected
                                ? 'bg-[#002B7A] text-white shadow-md'
                                : 'bg-[#F5F7FA] text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <Icon size={16} />
                            <span className="text-[14px] font-medium">{category.label}</span>
                            {isSelected && (
                                <span className="ml-auto text-[12px] opacity-80">ON</span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export { CATEGORIES };
