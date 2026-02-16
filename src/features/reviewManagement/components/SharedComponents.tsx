/**
 * ============================================================================
 * SHARED COMPONENTS
 * ============================================================================
 * 이 파일은 여러 곳에서 공통으로 사용되는 유틸리티 컴포넌트들을 포함합니다.
 * 
 * 포함된 컴포넌트:
 * - Header: 페이지 상단 헤더 및 탭 네비게이션
 * - Toast: 알림 메시지 표시
 * - GenerateButton: AI 답변 생성 버튼
 * ============================================================================
 */

import { Check, X, Sparkles, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type TabType = 'ai-generate' | 'saved-templates';

interface HeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

interface ToastProps {
  message: string;
  onClose: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface GenerateButtonProps {
  onGenerate: (count: number) => void;
  isLoading?: boolean;
}

// ============================================================================
// HEADER COMPONENT
// ============================================================================
/**
 * 페이지 상단 헤더 컴포넌트
 * - 페이지 제목 표시
 * - AI Generate / Saved Templates 탭 전환 기능
 */
export function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="bg-white border-b border-neutral-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <h1 className="mb-4 sm:mb-6 text-neutral-900">Review AI Reply Assistant</h1>
        
        <div className="flex gap-1 bg-neutral-100 p-1 rounded-xl w-full sm:w-fit">
          <button
            onClick={() => onTabChange('ai-generate')}
            className={`flex-1 sm:flex-initial px-4 sm:px-6 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === 'ai-generate'
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            AI Generate
          </button>
          <button
            onClick={() => onTabChange('saved-templates')}
            className={`flex-1 sm:flex-initial px-4 sm:px-6 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === 'saved-templates'
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Saved Templates
          </button>
        </div>
      </div>
    </header>
  );
}

// ============================================================================
// TOAST COMPONENT
// ============================================================================
/**
 * 토스트 알림 컴포넌트
 * - 성공/알림 메시지 표시
 * - 5초 후 자동 닫힘
 * - 선택적 액션 버튼 지원
 */
export function Toast({ message, onClose, action }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className="bg-neutral-900 text-white rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-4 min-w-[320px]">
        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
          <Check className="w-5 h-5" />
        </div>
        <p className="flex-1 font-medium">{message}</p>
        {action && (
          <button
            onClick={action.onClick}
            className="text-[#002B7A] hover:text-[#002B7AE6] font-medium text-sm transition-colors"
          >
            {action.label}
          </button>
        )}
        <button
          onClick={onClose}
          className="p-1 hover:bg-neutral-800 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// GENERATE BUTTON COMPONENT
// ============================================================================
/**
 * AI 답변 생성 버튼 컴포넌트
 * - 생성할 답변 개수 선택 (1, 3, 5개)
 * - 로딩 상태 표시
 * - 드롭다운으로 개수 변경 가능
 */
export function GenerateButton({ onGenerate, isLoading }: GenerateButtonProps) {
  const [count, setCount] = useState(3);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
      <div className="flex items-center gap-3">
        <button
          onClick={() => onGenerate(count)}
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#FF5A36CC] hover:bg-[#FF5A36] disabled:bg-neutral-400 text-white rounded-xl font-semibold shadow-sm transition-colors"
        >
          <Sparkles className="w-5 h-5" />
          {isLoading ? 'Generating...' : `Generate ${count} ${count === 1 ? 'reply' : 'replies'}`}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="px-4 py-4 bg-[#FF5A36CC] hover:bg-[#FF5A36] text-white rounded-xl shadow-sm transition-colors"
          >
            <ChevronDown className="w-5 h-5" />
          </button>

          {showDropdown && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowDropdown(false)}
              />
              <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-20 min-w-[80px]">
                {[1, 3, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      setCount(num);
                      setShowDropdown(false);
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-neutral-50 transition-colors ${
                      count === num ? 'text-[#002B7A] font-semibold' : 'text-neutral-700'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <p className="mt-3 text-sm text-neutral-500 text-center">
        You can copy with one click.
      </p>
    </div>
  );
}
