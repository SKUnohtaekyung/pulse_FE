/**
 * SnapshotCard Component
 * 상권 스냅샷 카드 - 총량 및 Top 카테고리 표시
 */

import React from 'react';
import { MapPin, TrendingUp } from 'lucide-react';
import { formatNumber, formatText, toFiniteNumber } from '../../../utils/safeFormat';

export default function SnapshotCard({ counts, radius }) {
    // counts 가 없거나 항목의 total 이 비어도 NaN 이 화면에 나오지 않게 한다.
    const safeCounts = counts && typeof counts === 'object' ? counts : {};
    const entries = Object.entries(safeCounts).filter(([, value]) => value && typeof value === 'object');

    // Top 3 카테고리 추출
    const topCategories = entries
        .slice()
        .sort((a, b) => (toFiniteNumber(b[1].total) ?? 0) - (toFiniteNumber(a[1].total) ?? 0))
        .slice(0, 3);

    // 전체 업소 수
    const totalPlaces = entries.reduce((sum, [, cat]) => sum + (toFiniteNumber(cat.total) ?? 0), 0);

    return (
        <div className="bg-white rounded-xl p-5 border border-[#E5E8EB] shadow-sm">
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-[17px] font-bold text-[#191F28]">주변 가게 현황</h3>
                <div className="flex items-center gap-1.5 text-[14px] text-[#002B7A] bg-[#002B7A1A] px-2.5 py-1 rounded-lg">
                    <MapPin size={14} />
                    <span className="font-medium">{formatNumber(radius, { suffix: 'm', fallback: '반경 미지정' })}</span>
                </div>
            </div>

            {/* 전체 업소 수 */}
            <div className="mb-4 pb-4 border-b border-gray-100">
                <p className="text-[14px] text-gray-600 mb-1">주변 가게 수</p>
                <p className="text-[32px] font-bold text-[#002B7A] leading-none">{formatNumber(totalPlaces, { fallback: '0' })}</p>
                <p className="text-[13px] text-gray-500 mt-1">개</p>
            </div>

            {/* Top 3 카테고리 */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={14} className="text-gray-600" />
                    <span className="text-[14px] font-medium text-gray-700">많은 업종</span>
                </div>
                {topCategories.length === 0 && (
                    <p className="text-[13px] text-gray-500">
                        아직 업종별 집계가 없어요. 반경을 넓히면 주변 업종을 확인할 수 있어요.
                    </p>
                )}
                {topCategories.map(([code, data], i) => (
                    <div key={code} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className={`w-6 h-6 flex items-center justify-center rounded-md text-[12px] font-bold ${i === 0 ? 'bg-[#002B7A] text-white' : 'bg-[#F5F7FA] text-gray-600'
                                }`}>
                                {i + 1}
                            </span>
                            <span className="text-[15px] font-medium text-[#191F28]">{formatText(data.label, code)}</span>
                        </div>
                        <span className="text-[17px] font-bold text-[#002B7A]">{formatNumber(data.total, { fallback: '0' })}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
