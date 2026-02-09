import React from 'react';

/**
 * FilterBar 컴포넌트
 * 카테고리 필터를 제공하는 가로 스크롤 가능한 필터 바
 */
export default function FilterBar({ categories, selected, onChange }) {
    return (
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
            {categories.map((category) => (
                <button
                    key={category}
                    onClick={() => onChange(category)}
                    className={`
                        px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-200
                        ${selected === category
                            ? 'bg-[#002B7A] text-white font-bold shadow-md'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                        }
                    `}
                >
                    {category}
                </button>
            ))}
        </div>
    );
}
