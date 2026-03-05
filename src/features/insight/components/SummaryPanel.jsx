/**
 * SummaryPanel Component
 * 우측 요약 패널 컨테이너 (스크롤 가능)
 * UX 최적화: 심플 스크롤바, 새로고침 버튼, 개선된 여백
 */

import React from 'react';
import SnapshotCard from './SnapshotCard';
import CompetitionCard from './CompetitionCard';
import AnchorCard from './AnchorCard';
import ActionCard from './ActionCard';
import { RefreshCw } from 'lucide-react';

export default function SummaryPanel({ data, onPlaceClick, onRefresh, showHeader = true }) {
    return (
        <div className="w-full h-full overflow-y-auto bg-[#F5F7FA] rounded-r-[24px] custom-scrollbar">
            {/* 패널 헤더 - 조건부 렌더링 */}
            {showHeader && (
                <div className="bg-[#F5F7FA] p-6 pb-4 border-b border-gray-200/50">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-[20px] font-bold text-[#002B7A]">상권 분석 리포트</h2>
                            <p className="text-[14px] text-gray-600 mt-1">
                                {new Date(data.generatedAt).toLocaleDateString('ko-KR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })} 기준
                            </p>
                        </div>

                        {/* 새로고침 버튼 */}
                        {onRefresh && (
                            <button
                                onClick={onRefresh}
                                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#E5E8EB] rounded-lg hover:bg-gray-50 hover:border-[#002B7A] transition-all group"
                                title="데이터 새로고침"
                            >
                                <RefreshCw size={14} className="text-gray-600 group-hover:text-[#002B7A] transition-colors" />
                                <span className="text-[13px] font-medium text-gray-700 group-hover:text-[#002B7A]">새로고침</span>
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* 카드 리스트 - 개선된 간격 */}
            <div className="px-6 pb-6 space-y-5">
                {/* 상권 스냅샷 */}
                <SnapshotCard counts={data.counts} radius={data.radius} />

                {/* 경쟁 분석 */}
                <CompetitionCard competition={data.competition} onPlaceClick={onPlaceClick} />

                {/* 앵커 분석 */}
                <AnchorCard anchors={data.anchors} />

                {/* 구분선 + 액션 카드 - 백엔드 연결 시 표시 */}
                {data.actions && data.actions.length > 0 && (
                    <>
                        <div className="border-t-2 border-gray-200 pt-5 mt-2">
                            <h3 className="text-[16px] font-bold text-[#191F28] mb-3 flex items-center gap-2">
                                <span className="text-[#FF5A36]">💡</span>
                                이번 주 실행 액션
                            </h3>
                        </div>
                        {data.actions.map((action, i) => (
                            <ActionCard key={i} action={action} index={i} />
                        ))}
                    </>
                )}

                {/* 하단 노트 */}
                {data.note && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                        <p className="text-[13px] text-gray-600 leading-relaxed">
                            ℹ️ {data.note}
                        </p>
                    </div>
                )}
            </div>

            {/* 커스텀 스크롤바 스타일 */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #CBD5E1;
                    border-radius: 3px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94A3B8;
                }
            `}</style>
        </div >
    );
}
