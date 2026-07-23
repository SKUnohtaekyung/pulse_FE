/**
 * CompetitionCard Component
 * 경쟁 분석 카드 - 동종 업소 수 및 가까운 경쟁 리스트
 */

import React from 'react';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { formatNumber, formatText, toArray } from '../../../utils/safeFormat';

export default function CompetitionCard({ competition, onPlaceClick }) {
    // 백엔드 리포트에 필드가 빠져도 카드만 "집계 중"으로 표시되고 페이지는 유지된다.
    const data = competition && typeof competition === 'object' ? competition : {};
    const nearest = toArray(data.nearest);

    return (
        <div className="bg-white rounded-xl p-5 border border-[#E5E8EB] shadow-sm">
            {/* 헤더 */}
            <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={18} className="text-[#FF5A36]" />
                <h3 className="text-[17px] font-bold text-[#191F28]">같은 업종 분석</h3>
            </div>

            {/* 동종 업소 수 */}
            <div className="mb-4 pb-4 border-b border-gray-100">
                <p className="text-[14px] text-gray-600 mb-1">{formatText(data.label, '같은 업종')}</p>
                <div className="flex items-baseline gap-2">
                    <p className="text-[32px] font-bold text-[#FF5A36] leading-none">{formatNumber(data.total)}</p>
                    <span className="text-[14px] text-gray-600">개</span>
                </div>
                <p className="text-[13px] text-gray-500 mt-1">
                    1km²당 {formatNumber(data.densityPerKm2, { digits: 1, suffix: '개' })}
                </p>
            </div>

            {/* 가까운 경쟁 리스트 */}
            <div className="space-y-2">
                <p className="text-[14px] font-medium text-gray-700 mb-2">가까운 가게</p>
                {nearest.length === 0 ? (
                    <div className="p-4 bg-[#F5F7FA] rounded-lg text-center">
                        <p className="text-[13px] text-gray-600">
                            반경 내 같은 업종이 조회되지 않았습니다.
                        </p>
                    </div>
                ) : (
                    nearest.map((place, index) => (
                        <button
                            key={place?.id ?? index}
                            type="button"
                            onClick={() => onPlaceClick && onPlaceClick(place)}
                            className="w-full text-left flex justify-between items-center p-3 hover:bg-[#F5F7FA] rounded-lg transition-colors group
                                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                            <div className="flex-1 min-w-0">
                                <p className="text-[15px] font-medium text-[#191F28] group-hover:text-[#002B7A] transition-colors truncate">
                                    {formatText(place?.name, '이름 미상')}
                                </p>
                                <p className="text-[13px] text-gray-500 mt-0.5">{formatNumber(place?.distanceM, { suffix: 'm' })}</p>
                            </div>
                            <ExternalLink size={16} className="text-gray-400 group-hover:text-[#002B7A] transition-colors shrink-0" aria-hidden="true" />
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}
