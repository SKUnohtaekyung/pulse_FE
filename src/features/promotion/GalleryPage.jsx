import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function GalleryPage({ onBack }) {
    return (
        <div className="flex-1 h-full bg-white rounded-[24px] border border-gray-200 shadow-sm p-6 flex flex-col">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} className="text-[#191F28]" />
                </button>
                <h2 className="text-[24px] font-bold text-[#191F28]">스타일 갤러리</h2>
            </div>
            <div className="flex-1 flex items-center justify-center text-gray-400">
                준비 중입니다.
            </div>
        </div>
    );
}
