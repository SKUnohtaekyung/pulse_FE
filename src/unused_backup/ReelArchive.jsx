import React from 'react';
import { Play, Calendar, MoreVertical } from 'lucide-react';

export default function ReelArchive({ reels, onSelectReel, onSeeMore }) {
    return (
        <div className="w-[320px] h-full bg-white rounded-[24px] shadow-sm border border-[#002B7A05] flex flex-col overflow-hidden shrink-0">
            {/* Header */}
            <div className="p-6 border-b border-gray-50">
                <h2 className="text-[18px] font-bold text-[#191F28]">완성된 릴스</h2>
                <p className="text-[13px] text-gray-400 mt-1">지금까지 제작된 {reels.length}개의 영상</p>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                {reels.slice(0, 3).map((reel) => (
                    <div
                        key={reel.id}
                        onClick={() => onSelectReel(reel)}
                        className="group relative flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all cursor-pointer border border-transparent hover:border-gray-100"
                    >
                        {/* Thumbnail */}
                        <div className="relative w-16 h-24 rounded-lg overflow-hidden shrink-0 bg-gray-200">
                            <img src={reel.thumbnail} alt={reel.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Play size={16} className="text-white fill-white" />
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-[15px] font-bold text-[#191F28] truncate mb-1">{reel.title}</h3>
                            <div className="flex items-center gap-2 text-[12px] text-gray-400">
                                <Calendar size={12} />
                                <span>{reel.date}</span>
                            </div>
                            <div className="mt-2 flex gap-1">
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${reel.type === 'energetic' ? 'bg-yellow-100 text-yellow-700' :
                                    reel.type === 'luxury' ? 'bg-purple-100 text-purple-700' :
                                        'bg-orange-100 text-orange-700'
                                    }`}>
                                    {reel.type === 'energetic' ? '활기찬' : reel.type === 'luxury' ? '고급진' : '감성적'}
                                </span>
                            </div>
                        </div>

                        {/* More Option */}
                        <button className="p-1 text-gray-300 hover:text-gray-600">
                            <MoreVertical size={16} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-50">
                <button
                    onClick={onSeeMore}
                    className="w-full py-3 text-[14px] font-bold text-gray-500 hover:text-[#002B7A] hover:bg-blue-50 rounded-xl transition-colors"
                >
                    전체보기
                </button>
            </div>
        </div>
    );
}
