import React from 'react';
import { Gift } from 'lucide-react';

const SeasonAlert = () => {
    // Mock Date Logic
    const alert = {
        type: 'holiday',
        title: "크리스마스 D-3 🎄",
        message: "연말 예약이 몰릴 수 있습니다. 재료 재고를 확인하세요.",
        dday: "D-3"
    };

    return (
        <div className="bg-white rounded-[24px] p-4 shadow-sm border border-gray-100 flex flex-col justify-center gap-2 relative overflow-hidden group h-full">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-red-50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:opacity-100 transition-opacity"></div>

            <div className="flex items-center gap-2 z-10">
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0 text-red-500">
                    <Gift size={16} />
                </div>
                <span className="bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {alert.dday}
                </span>
            </div>

            <div className="z-10">
                <h3 className="text-sm font-bold text-[#191F28] mb-0.5">{alert.title}</h3>
                <p className="text-[11px] text-gray-500 leading-tight break-keep">
                    {alert.message}
                </p>
            </div>
        </div>
    );
};

export default SeasonAlert;
