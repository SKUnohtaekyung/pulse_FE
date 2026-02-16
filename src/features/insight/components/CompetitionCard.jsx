/**
 * CompetitionCard Component
 * 경쟁 분석 카드 - 동종 업소 수 및 가까운 경쟁 리스트
 */

import React from 'react';
import { AlertTriangle, ExternalLink } from 'lucide-react';

export default function CompetitionCard({ competition, onPlaceClick }) {
    return (
        <div className="bg-white rounded-xl p-5 border border-[#E5E8EB] shadow-sm">
            {/* 헤더 */}
            <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={18} className="text-[#FF5A36]" />
                <h3 className="text-[17px] font-bold text-[#191F28]">같은 업종 분석</h3>
            </div>

            {/* 동종 업소 수 */}
            <div className="mb-4 pb-4 border-b border-gray-100">
                <p className="text-[14px] text-gray-600 mb-1">{competition.label}</p>
                <div className="flex items-baseline gap-2">
                    <p className="text-[32px] font-bold text-[#FF5A36] leading-none">{competition.total}</p>
                    <span className="text-[14px] text-gray-600">개</span>
                </div>
                <p className="text-[13px] text-gray-500 mt-1">
                    1km²당 {competition.densityPerKm2.toFixed(1)}개
                </p>
            </div>

            {/* 가까운 경쟁 리스트 */}
            <div className="space-y-2">
                <p className="text-[14px] font-medium text-gray-700 mb-2">가까운 가게</p>
                {competition.nearest.map((place, i) => (
                    <div
                        key={place.id}
                        onClick={() => onPlaceClick && onPlaceClick(place)}
                        className="flex justify-between items-center p-3 hover:bg-[#F5F7FA] rounded-lg cursor-pointer transition-colors group"
                    >
                        <div className="flex-1">
                            <p className="text-[15px] font-medium text-[#191F28] group-hover:text-[#002B7A] transition-colors">
                                {place.name}
                            </p>
                            <p className="text-[13px] text-gray-500 mt-0.5">{place.distanceM}m</p>
                        </div>
                        <ExternalLink size={16} className="text-gray-400 group-hover:text-[#002B7A] transition-colors" />
                    </div>
                ))}
            </div>
        </div>
    );
}
