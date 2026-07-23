/**
 * ============================================================================
 * EXCEPTION CASE SETTINGS COMPONENT
 * ============================================================================
 * 특정 불만 사항에 대한 맞춤 대응 설정
 * ============================================================================
 */

import { useState } from 'react';
import { AlertTriangle, Utensils, Users, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import ConfirmModal from '../../../components/common/ConfirmModal';
import { toArray } from '../../../utils/safeFormat';

// ============================================================================
// DEFAULT CASES
// ============================================================================

export const DEFAULT_CASES = [
    {
        id: 'hygiene',
        type: '위생',
        keywords: ['머리카락', '이물질', '깨끗하지', '청결', '벌레'],
        empathy: '불쾌하셨을 고객님의 마음을 충분히 이해합니다',
        apology: '위생 관리에 소홀했던 점 깊이 사과드립니다',
        solution: '즉시 새로운 음식으로 교체해드리겠으며, 위생 관리를 더욱 철저히 하겠습니다',
        enabled: false
    },
    {
        id: 'service',
        type: '서비스',
        keywords: ['불친절', '무시', '주문 누락', '오래 기다림', '태도'],
        empathy: '불편을 드려 정말 죄송합니다',
        apology: '직원 교육이 부족했던 점 사과드립니다',
        solution: '서비스 개선을 위해 직원 교육을 강화하고, 다음 방문 시 더 나은 경험을 제공하겠습니다',
        enabled: false
    },
    {
        id: 'food-quality',
        type: '음식품질',
        keywords: ['차갑게', '맛없', '짜', '싱거', '익지 않', '탔'],
        empathy: '기대에 미치지 못해 죄송합니다',
        apology: '품질 관리에 소홀했던 점 사과드립니다',
        solution: '즉시 새로 조리해드리겠으며, 맛과 품질 관리에 더욱 신경 쓰겠습니다',
        enabled: false
    },
    {
        id: 'price-portion',
        type: '가격/양',
        keywords: ['비싸', '양이 적', '가성비', '가격 대비'],
        empathy: '고객님의 소중한 의견 감사드립니다',
        apology: '기대에 못 미쳐 아쉽습니다',
        solution: '메뉴 구성과 가격 정책을 지속적으로 개선하도록 노력하겠습니다',
        enabled: false
    }
];

// ============================================================================
// CASE CARD COMPONENT
// ============================================================================

function CaseCard({ case: exceptionCase, onUpdate }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const getIcon = () => {
        switch (exceptionCase.type) {
            case '위생':
                return <AlertTriangle className="w-5 h-5" />;
            case '서비스':
                return <Users className="w-5 h-5" />;
            case '음식품질':
                return <Utensils className="w-5 h-5" />;
            case '가격/양':
                return <DollarSign className="w-5 h-5" />;
            default:
                return null;
        }
    };

    const getColor = () => {
        switch (exceptionCase.type) {
            case '위생':
                return 'text-red-600 bg-red-50';
            case '서비스':
                return 'text-blue-600 bg-blue-50';
            case '음식품질':
                return 'text-orange-600 bg-orange-50';
            case '가격/양':
                return 'text-green-600 bg-green-50';
            default:
                return '';
        }
    };

    // keywords 가 누락된 응답에서도 카드가 터지지 않게 한다.
    const keywords = toArray(exceptionCase?.keywords);

    return (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            {/* Header
                버튼 안에 체크박스를 중첩하면 유효하지 않은 HTML 이 되고 키보드·스크린리더 동작이 깨진다.
                토글과 펼치기 버튼을 형제 요소로 분리한다. */}
            <div className="w-full flex items-center justify-between p-4 gap-2 hover:bg-neutral-50 transition-colors">
                <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    aria-expanded={isExpanded}
                    className="flex items-center gap-3 flex-1 min-w-0 text-left rounded
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                    <div className={`p-2 rounded-lg ${getColor()}`}>
                        {getIcon()}
                    </div>
                    <div className="text-left min-w-0">
                        <h4 className="font-semibold text-neutral-900">{exceptionCase.type} 문제</h4>
                        <p className="text-xs text-neutral-500 mt-0.5 truncate">
                            키워드: {keywords.slice(0, 3).join(', ') || '등록된 키워드 없음'}
                            {keywords.length > 3 && '...'}
                        </p>
                    </div>
                </button>
                <div className="flex items-center gap-2 shrink-0">
                    <label className="relative inline-flex items-center cursor-pointer">
                        <span className="sr-only">{exceptionCase.type} 문제 자동 응대 사용</span>
                        <input
                            type="checkbox"
                            role="switch"
                            checked={!!exceptionCase.enabled}
                            onChange={(e) => onUpdate({ ...exceptionCase, enabled: e.target.checked })}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-neutral-300 peer-focus-visible:ring-2 peer-focus-visible:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-transform peer-checked:bg-[#002B7A]"></div>
                    </label>
                    <button
                        type="button"
                        onClick={() => setIsExpanded(!isExpanded)}
                        aria-label={isExpanded ? '상세 설정 접기' : '상세 설정 펼치기'}
                        aria-expanded={isExpanded}
                        className="p-1 rounded text-neutral-400 transition-colors hover:text-neutral-700
                                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                        {isExpanded ? <ChevronUp className="w-5 h-5" aria-hidden="true" /> : <ChevronDown className="w-5 h-5" aria-hidden="true" />}
                    </button>
                </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="p-4 pt-0 space-y-4 border-t border-neutral-100">
                    {/* Keywords */}
                    <div>
                        <label className="block text-xs font-medium text-neutral-700 mb-2">감지 키워드</label>
                        <div className="flex flex-wrap gap-2">
                            {keywords.map((keyword, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded-md text-xs"
                                >
                                    {keyword}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Empathy */}
                    <div>
                        <label className="block text-xs font-medium text-neutral-700 mb-2">공감 표현</label>
                        <textarea
                            value={exceptionCase.empathy}
                            onChange={(e) => onUpdate({ ...exceptionCase, empathy: e.target.value })}
                            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#002B7A] focus:border-transparent resize-none"
                            rows={2}
                        />
                    </div>

                    {/* Apology */}
                    <div>
                        <label className="block text-xs font-medium text-neutral-700 mb-2">사과 방식</label>
                        <textarea
                            value={exceptionCase.apology}
                            onChange={(e) => onUpdate({ ...exceptionCase, apology: e.target.value })}
                            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#002B7A] focus:border-transparent resize-none"
                            rows={2}
                        />
                    </div>

                    {/* Solution */}
                    <div>
                        <label className="block text-xs font-medium text-neutral-700 mb-2">해결책 제안</label>
                        <textarea
                            value={exceptionCase.solution}
                            onChange={(e) => onUpdate({ ...exceptionCase, solution: e.target.value })}
                            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#002B7A] focus:border-transparent resize-none"
                            rows={2}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

// ============================================================================
// EXCEPTION CASE SETTINGS COMPONENT
// ============================================================================

/**
 * 예외 케이스 설정 컴포넌트
 * - 특정 불만 사항에 대한 맞춤 대응 설정
 * - 공감, 사과, 해결책 템플릿 관리
 */
export function ExceptionCaseSettings({ cases, onCasesChange }) {
    const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
    const caseList = toArray(cases);

    const handleCaseUpdate = (updatedCase) => {
        onCasesChange(caseList.map(c => c.id === updatedCase.id ? updatedCase : c));
    };

    // 초기화는 되돌릴 수 없으므로 확인 모달을 거친다.
    const handleResetToDefaults = () => setIsResetConfirmOpen(true);

    const confirmReset = () => {
        onCasesChange(DEFAULT_CASES);
        setIsResetConfirmOpen(false);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-neutral-900">예외 케이스 설정</h3>
                    <p className="text-xs text-neutral-500 mt-1">특정 불만 사항에 대한 맞춤 대응을 설정하세요</p>
                </div>
                <button
                    type="button"
                    onClick={handleResetToDefaults}
                    className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                    기본값으로 초기화
                </button>
            </div>

            <div className="space-y-3">
                {caseList.map((exceptionCase) => (
                    <CaseCard
                        key={exceptionCase.id}
                        case={exceptionCase}
                        onUpdate={handleCaseUpdate}
                    />
                ))}
            </div>

            <ConfirmModal
                isOpen={isResetConfirmOpen}
                onClose={() => setIsResetConfirmOpen(false)}
                onConfirm={confirmReset}
                title="설정을 기본값으로 되돌릴까요?"
                description="지금까지 수정한 예외 케이스 문구가 모두 사라져요. 이 작업은 되돌릴 수 없어요."
                confirmLabel="초기화"
            />
        </div>
    );
}
