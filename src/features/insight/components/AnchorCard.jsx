/**
 * AnchorCard Component
 * 앵커 점수 카드 - 유입 요인 분석
 */

import React from 'react';
import { Anchor, Award } from 'lucide-react';

export default function AnchorCard({ anchors }) {
    // 점수에 따른 색상
    const getScoreColor = (score) => {
        if (score >= 10) return 'text-[#002B7A]';
        if (score >= 5) return 'text-blue-600';
        return 'text-gray-600';
    };

    const getScoreBg = (score) => {
        if (score >= 10) return 'bg-[#002B7A1A]';
        if (score >= 5) return 'bg-blue-50';
        return 'bg-gray-50';
    };

    return (
        <div className="bg-white rounded-xl p-5 border border-[#E5E8EB] shadow-sm">
            {/* 헤더 */}
            <div className="flex items-center gap-2 mb-4">
                <Anchor size={18} className="text-[#002B7A]" />
                <h3 className="text-[17px] font-bold text-[#191F28]">손님 유입 분석</h3>
            </div>

            {/* 앵커 점수 - 개선된 여백 */}
            <div className={`mb-4 pb-4 border-b border-gray-100 ${getScoreBg(anchors.score)} px-4 py-4 rounded-lg`}>
                <div className="flex items-center gap-3">
                    <div className={`text-[48px] font-bold ${getScoreColor(anchors.score)} leading-none`}>
                        {anchors.score}
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5 mb-1">
                            <Award size={16} className={getScoreColor(anchors.score)} />
                            <p className="text-[16px] font-bold text-[#191F28]">{anchors.typeLabel}</p>
                        </div>
                        <p className="text-[13px] text-gray-600">손님 모이는 정도</p>
                    </div>
                </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-2.5">
                <p className="text-[14px] font-medium text-gray-700 mb-2">점수 구성</p>
                {anchors.breakdown.map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-2.5 bg-[#F5F7FA] rounded-lg">
                        <span className="text-[14px] font-medium text-[#191F28]">{item.label}</span>
                        <div className="flex items-center gap-2">
                            <span className="text-[13px] text-gray-600">
                                {item.count}개 × {item.weight}
                            </span>
                            <span className="text-[15px] font-bold text-[#002B7A] min-w-[24px] text-right">
                                {item.count * item.weight}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
