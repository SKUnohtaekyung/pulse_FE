import React from 'react';
import { ArrowLeft } from 'lucide-react';

/**
 * [GalleryPage] 스타일 갤러리 페이지 컴포넌트
 * 
 * @description
 * 사용자가 저장한 스타일이나 템플릿을 모아보는 갤러리 페이지입니다.
 * 현재는 '준비 중' 상태로 표시됩니다.
 * 
 * @param {Object} props
 * @param {Function} props.onBack - 뒤로 가기 버튼 클릭 시 실행되는 핸들러 (부모 컴포넌트에서 화면 전환 제어)
 */
export default function GalleryPage({ onBack }) {
    return (
        // 메인 컨테이너: 흰색 배경, 둥근 모서리, 그림자 적용
        <div className="flex-1 h-full bg-white rounded-[24px] border border-gray-200 shadow-sm p-6 flex flex-col">

            {/* 상단 헤더 영역: 뒤로가기 버튼 + 타이틀 */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="뒤로 가기"
                >
                    <ArrowLeft size={24} className="text-[#191F28]" />
                </button>
                <h2 className="text-[24px] font-bold text-[#191F28]">스타일 갤러리</h2>
            </div>

            {/* 본문 영역: 준비 중 메시지 표시 (중앙 정렬) */}
            <div className="flex-1 flex items-center justify-center text-gray-400">
                준비 중입니다.
            </div>
        </div>
    );
}
