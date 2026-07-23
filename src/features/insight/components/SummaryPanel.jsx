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
import { AlertTriangle, RefreshCw, Loader2 } from 'lucide-react';
import { formatDate, toArray } from '../../../utils/safeFormat';

export default function SummaryPanel({ data, onPlaceClick, onRefresh, actionsLoading = false, showHeader = true }) {
    // 리포트 자체가 비어 있어도 하위 카드가 각자 "집계 중"으로 표시된다.
    const report = data && typeof data === 'object' ? data : {};
    const warnings = toArray(report.warnings);
    const actions = toArray(report.actions);
    const generatedAtLabel = formatDate(report.generatedAt, { style: 'korean', fallback: '' });

    return (
        <div className="w-full h-full overflow-y-auto bg-[#F5F7FA] rounded-r-[24px] custom-scrollbar">
            {/* 패널 헤더 - 조건부 렌더링 */}
            {showHeader && (
                <div className="bg-[#F5F7FA] p-6 pb-4 border-b border-gray-200/50">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-[20px] font-bold text-[#002B7A]">상권 분석 리포트</h2>
                            {/* 생성 시각이 없거나 형식이 다르면 "Invalid Date" 대신 아무것도 표시하지 않는다 */}
                            {generatedAtLabel && (
                                <p className="text-[14px] text-gray-600 mt-1">{generatedAtLabel} 기준</p>
                            )}
                        </div>

                        {/* 새로고침 버튼 */}
                        {onRefresh && (
                            <button
                                type="button"
                                onClick={onRefresh}
                                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#E5E8EB] rounded-lg hover:bg-gray-50 hover:border-[#002B7A] transition-colors group
                                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                title="데이터 새로고침"
                                aria-label="상권 데이터 새로고침"
                            >
                                <RefreshCw size={14} className="text-gray-600 group-hover:text-[#002B7A] transition-colors" aria-hidden="true" />
                                <span className="text-[13px] font-medium text-gray-700 group-hover:text-[#002B7A]">새로고침</span>
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* 카드 리스트 - 개선된 간격 */}
            <div className="px-6 pb-6 space-y-5">
                {warnings.map((warning, index) => (
                    <div
                        key={`${warning.type}-${index}`}
                        className="bg-amber-50 border border-amber-200 rounded-xl p-4"
                    >
                        <div className="flex items-start gap-3">
                            <AlertTriangle size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-[14px] font-bold text-amber-900">{warning.title}</p>
                                <p className="text-[13px] text-amber-800 mt-1 leading-relaxed">
                                    {warning.message}
                                </p>
                                {warning.failedCategories?.length > 0 && (
                                    <p className="text-[12px] text-amber-700 mt-2">
                                        조회 실패: {warning.failedCategories.map(({ label }) => label).join(', ')}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {/* 상권 스냅샷 */}
                <SnapshotCard counts={report.counts} radius={report.radius} />

                {/* 경쟁 분석 */}
                <CompetitionCard competition={report.competition} onPlaceClick={onPlaceClick} />

                {/* 앵커 분석 */}
                <AnchorCard anchors={report.anchors} />

                {/* 구분선 + 액션 카드 - AI 응답 도착 시 표시 (백그라운드 로드) */}
                {actions.length > 0 && (
                    <>
                        <div className="border-t-2 border-gray-200 pt-5 mt-2">
                            <h3 className="text-[16px] font-bold text-[#191F28] mb-3 flex items-center gap-2">
                                <span className="text-[#FF5A36]">💡</span>
                                이번 주 실행 액션
                            </h3>
                        </div>
                        {actions.map((action, i) => (
                            <ActionCard key={i} action={action} index={i} />
                        ))}
                    </>
                )}

                {/* AI 액션 생성 중 안내 (리포트는 이미 표시됨) */}
                {actionsLoading && actions.length === 0 && (
                    <div className="border-t-2 border-gray-200 pt-5 mt-2">
                        <div className="flex items-center gap-2.5 rounded-xl bg-blue-50 border border-blue-100 p-4">
                            <Loader2 size={18} className="text-[#002B7A] animate-spin flex-shrink-0" />
                            <p className="text-[13px] text-gray-700 leading-relaxed">
                                AI가 이번 주 실행 액션을 만들고 있어요. 잠시만 기다려 주세요.
                            </p>
                        </div>
                    </div>
                )}

                {/* 하단 노트 */}
                {report.note && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                        <p className="text-[13px] text-gray-600 leading-relaxed">
                            ℹ️ {report.note}
                        </p>
                    </div>
                )}
            </div>
            {/* 스크롤바 스타일은 globals.css 의 .custom-scrollbar 를 사용한다.
                (styled-jsx 미설치 상태에서 <style jsx> 를 쓰면 비표준 속성 경고가 나고 전역으로 새어 나간다) */}
        </div >
    );
}
