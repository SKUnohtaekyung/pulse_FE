/**
 * ActionCard Component
 * 실행 액션 카드 - CTA 버튼 포함
 */

import React from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';
import { formatText, toArray } from '../../../utils/safeFormat';

export default function ActionCard({ action, index, onAction }) {
    // LLM 응답에 todo/cta 가 빠져도 카드가 터지지 않도록 방어한다.
    const data = action && typeof action === 'object' ? action : {};
    const todos = toArray(data.todo);
    const ctaLabel = typeof data.cta?.label === 'string' && data.cta.label.trim() ? data.cta.label.trim() : null;

    const handleCTAClick = () => {
        onAction?.(data.cta);
    };

    return (
        <div data-testid="map-insight-action-card" className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
            {/* 헤더 */}
            <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 bg-[#002B7A] rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-[14px]">{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-[16px] font-bold text-[#191F28] mb-1 break-keep">{formatText(data.title, '추천 액션')}</h4>
                    {data.why && <p className="text-[14px] text-gray-600 leading-relaxed break-keep">{data.why}</p>}
                </div>
            </div>

            {/* TODO 리스트 */}
            {todos.length > 0 && (
                <div className="mb-4 pl-11">
                    <ul className="space-y-1.5">
                        {todos.map((item, i) => (
                            <li key={i} className="text-[14px] text-[#191F28] flex items-start gap-2 leading-relaxed">
                                <span className="text-[#002B7A] font-bold shrink-0" aria-hidden="true">•</span>
                                <span className="break-keep">{formatText(item, '')}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* CTA 버튼 — 동작이 연결된 경우에만 노출한다 (누를 수 있는데 아무 일도 없는 버튼 방지) */}
            {ctaLabel && typeof onAction === 'function' && (
                <button
                    type="button"
                    onClick={handleCTAClick}
                    className="w-full bg-[#FF5A36CC] hover:bg-[#FF5A36] text-white py-3 rounded-lg font-bold text-[15px] transition-colors flex items-center justify-center gap-2 group shadow-sm
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                    <Sparkles size={16} className="group-hover:rotate-12 transition-transform" aria-hidden="true" />
                    <span>{ctaLabel}</span>
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </button>
            )}
        </div>
    );
}
