/**
 * SnapshotCard Component
 * 상권 스냅샷 카드 - 총량 및 Top 카테고리 표시
 */

import React from 'react';
import { MapPin, TrendingUp } from 'lucide-react';

export default function SnapshotCard({ counts, radius }) {
    // Top 3 카테고리 추출
    const topCategories = Object.entries(counts)
        .sort((a, b) => b[1].total - a[1].total)
        .slice(0, 3);

    // 전체 업소 수
    const totalPlaces = Object.values(counts).reduce((sum, cat) => sum + cat.total, 0);

    return (
        <div className="bg-white rounded-xl p-5 border border-[#E5E8EB] shadow-sm">
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-[17px] font-bold text-[#191F28]">주변 가게 현황</h3>
                <div className="flex items-center gap-1.5 text-[14px] text-[#002B7A] bg-[#002B7A1A] px-2.5 py-1 rounded-lg">
                    <MapPin size={14} />
                    <span className="font-medium">{radius}m</span>
                </div>
            </div>

            {/* 전체 업소 수 */}
            <div className="mb-4 pb-4 border-b border-gray-100">
                <p className="text-[14px] text-gray-600 mb-1">주변 가게 수</p>
                <p className="text-[32px] font-bold text-[#002B7A] leading-none">{totalPlaces}</p>
                <p className="text-[13px] text-gray-500 mt-1">개</p>
            </div>

            {/* Top 3 카테고리 */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={14} className="text-gray-600" />
                    <span className="text-[14px] font-medium text-gray-700">많은 업종</span>
                </div>
                {topCategories.map(([code, data], i) => (
                    <div key={code} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className={`w-6 h-6 flex items-center justify-center rounded-md text-[12px] font-bold ${i === 0 ? 'bg-[#002B7A] text-white' : 'bg-[#F5F7FA] text-gray-600'
                                }`}>
                                {i + 1}
                            </span>
                            <span className="text-[15px] font-medium text-[#191F28]">{data.label}</span>
                        </div>
                        <span className="text-[17px] font-bold text-[#002B7A]">{data.total}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
