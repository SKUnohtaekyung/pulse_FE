import React from 'react';
import { Play, Calendar, MoreVertical } from 'lucide-react';

/**
 * [BadgeStyles] 릴스 타입별 뱃지 스타일 정의
 * @description 타입에 따른 배경색, 텍스트 색상, 라벨을 매핑합니다.
 */
const BADGE_STYLES = {
    energetic: { className: 'bg-yellow-100 text-yellow-700', label: '활기찬' },
    luxury: { className: 'bg-purple-100 text-purple-700', label: '고급진' },
    emotional: { className: 'bg-orange-100 text-orange-700', label: '감성적' },
    default: { className: 'bg-gray-100 text-gray-700', label: '기본' }
};

/**
 * [ReelArchive] 완성된 릴스 목록 컴포넌트
 * 
 * @description
 * 사용자가 이전에 제작한 릴스 영상들의 목록을 보여주는 사이드바 형태의 컴포넌트입니다.
 * 최근 3개의 영상만 표시하며, '전체보기'를 통해 더 많은 영상을 볼 수 있습니다.
 * 
 * @param {Object} props
 * @param {Array} props.reels - 릴스 데이터 배열 (id, title, date, type, thumbnail 포함)
 * @param {Function} props.onSelectReel - 특정 릴스 클릭 시 실행되는 핸들러
 * @param {Function} props.onSeeMore - '전체보기' 버튼 클릭 시 실행되는 핸들러
 */
export default function ReelArchive({ reels, onSelectReel, onSeeMore }) {
    return (
        // 메인 컨테이너: 고정 너비(320px), 흰색 배경
        <div className="w-[320px] h-full bg-white rounded-[24px] shadow-sm border border-[#002B7A05] flex flex-col overflow-hidden shrink-0">

            {/* 1. 헤더 영역: 타이틀 및 총 개수 표시 */}
            <div className="p-6 border-b border-gray-50">
                <h2 className="text-[18px] font-bold text-[#191F28]">완성된 릴스</h2>
                <p className="text-[13px] text-gray-400 mt-1">지금까지 제작된 {reels.length}개의 영상</p>
            </div>

            {/* 2. 리스트 영역: 최근 3개 항목 표시 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                {reels.slice(0, 3).map((reel) => {
                    // 타입에 맞는 스타일 가져오기 (없으면 default)
                    const badgeStyle = BADGE_STYLES[reel.type] || BADGE_STYLES.default;

                    return (
                        <div
                            key={reel.id}
                            onClick={() => onSelectReel(reel)}
                            className="group relative flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all cursor-pointer border border-transparent hover:border-gray-100"
                        >
                            {/* 썸네일 영역: 호버 시 재생 아이콘 표시 */}
                            <div className="relative w-16 h-24 rounded-lg overflow-hidden shrink-0 bg-gray-200">
                                <img src={reel.thumbnail} alt={reel.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Play size={16} className="text-white fill-white" />
                                </div>
                            </div>

                            {/* 정보 영역: 제목, 날짜, 타입 뱃지 */}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-[15px] font-bold text-[#191F28] truncate mb-1">{reel.title}</h3>
                                <div className="flex items-center gap-2 text-[12px] text-gray-400">
                                    <Calendar size={12} />
                                    <span>{reel.date}</span>
                                </div>
                                <div className="mt-2 flex gap-1">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${badgeStyle.className}`}>
                                        {badgeStyle.label}
                                    </span>
                                </div>
                            </div>

                            {/* 더보기 버튼 (현재 기능 없음, UI용) */}
                            <button className="p-1 text-gray-300 hover:text-gray-600">
                                <MoreVertical size={16} />
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* 3. 푸터 영역: 전체보기 버튼 */}
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
