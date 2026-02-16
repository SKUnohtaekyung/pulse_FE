/**
 * ============================================================================
 * EXCEPTION CASE SETTINGS COMPONENT
 * ============================================================================
 * 특정 불만 사항에 대한 맞춤 대응 설정
 * ============================================================================
 */

import { useState } from 'react';
import { AlertTriangle, Utensils, Users, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type ExceptionCaseType = '위생' | '서비스' | '음식품질' | '가격/양';

export interface ExceptionCase {
  id: string;
  type: ExceptionCaseType;
  keywords: string[];
  empathy: string;
  apology: string;
  solution: string;
  enabled: boolean;
}

interface ExceptionCaseSettingsProps {
  cases: ExceptionCase[];
  onCasesChange: (cases: ExceptionCase[]) => void;
}

// ============================================================================
// DEFAULT CASES
// ============================================================================

const DEFAULT_CASES: ExceptionCase[] = [
  {
    id: 'hygiene',
    type: '위생',
    keywords: ['머리카락', '이물질', '깨끗하지', '청결', '벌레'],
    empathy: '불쾌하셨을 고객님의 마음을 충분히 이해합니다',
    apology: '위생 관리에 소홀했던 점 깊이 사과드립니다',
    solution: '즉시 새로운 음식으로 교체해드리겠으며, 위생 관리를 더욱 철저히 하겠습니다',
    enabled: true
  },
  {
    id: 'service',
    type: '서비스',
    keywords: ['불친절', '무시', '주문 누락', '오래 기다림', '태도'],
    empathy: '불편을 드려 정말 죄송합니다',
    apology: '직원 교육이 부족했던 점 사과드립니다',
    solution: '서비스 개선을 위해 직원 교육을 강화하고, 다음 방문 시 더 나은 경험을 제공하겠습니다',
    enabled: true
  },
  {
    id: 'food-quality',
    type: '음식품질',
    keywords: ['차갑게', '맛없', '짜', '싱거', '익지 않', '탔'],
    empathy: '기대에 미치지 못해 죄송합니다',
    apology: '품질 관리에 소홀했던 점 사과드립니다',
    solution: '즉시 새로 조리해드리겠으며, 맛과 품질 관리에 더욱 신경 쓰겠습니다',
    enabled: true
  },
  {
    id: 'price-portion',
    type: '가격/양',
    keywords: ['비싸', '양이 적', '가성비', '가격 대비'],
    empathy: '고객님의 소중한 의견 감사드립니다',
    apology: '기대에 못 미쳐 아쉽습니다',
    solution: '메뉴 구성과 가격 정책을 지속적으로 개선하도록 노력하겠습니다',
    enabled: true
  }
];

// ============================================================================
// CASE CARD COMPONENT
// ============================================================================

interface CaseCardProps {
  case: ExceptionCase;
  onUpdate: (updatedCase: ExceptionCase) => void;
}

function CaseCard({ case: exceptionCase, onUpdate }: CaseCardProps) {
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
    }
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${getColor()}`}>
            {getIcon()}
          </div>
          <div className="text-left">
            <h4 className="font-semibold text-neutral-900">{exceptionCase.type} 문제</h4>
            <p className="text-xs text-neutral-500 mt-0.5">
              키워드: {exceptionCase.keywords.slice(0, 3).join(', ')}
              {exceptionCase.keywords.length > 3 && '...'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="relative inline-flex items-center cursor-pointer" onClick={(e) => e.stopPropagation()}>
            <input
              type="checkbox"
              checked={exceptionCase.enabled}
              onChange={(e) => onUpdate({ ...exceptionCase, enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#002B7A]"></div>
          </label>
          {isExpanded ? <ChevronUp className="w-5 h-5 text-neutral-400" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 pt-0 space-y-4 border-t border-neutral-100">
          {/* Keywords */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-2">감지 키워드</label>
            <div className="flex flex-wrap gap-2">
              {exceptionCase.keywords.map((keyword, index) => (
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
export function ExceptionCaseSettings({ cases, onCasesChange }: ExceptionCaseSettingsProps) {
  const handleCaseUpdate = (updatedCase: ExceptionCase) => {
    const updatedCases = cases.map(c => c.id === updatedCase.id ? updatedCase : c);
    onCasesChange(updatedCases);
  };

  const handleResetToDefaults = () => {
    if (confirm('모든 예외 케이스 설정을 기본값으로 초기화하시겠습니까?')) {
      onCasesChange(DEFAULT_CASES);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-neutral-900">예외 케이스 설정</h3>
          <p className="text-xs text-neutral-500 mt-1">특정 불만 사항에 대한 맞춤 대응을 설정하세요</p>
        </div>
        <button
          onClick={handleResetToDefaults}
          className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          기본값으로 초기화
        </button>
      </div>

      <div className="space-y-3">
        {cases.map((exceptionCase) => (
          <CaseCard
            key={exceptionCase.id}
            case={exceptionCase}
            onUpdate={handleCaseUpdate}
          />
        ))}
      </div>
    </div>
  );
}

// Export default cases for initial state
export { DEFAULT_CASES };
