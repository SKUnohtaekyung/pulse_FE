import React from 'react';
import { AlertCircle, Inbox, RefreshCw } from 'lucide-react';
import { getErrorMessage, isApiError } from '../../utils/apiError';

/**
 * 로딩 / 오류 / 빈 상태 공통 뷰.
 *
 * 페이지마다 반복되던 상태 UI 를 한 곳으로 모은다.
 * 모든 문구는 한국어이며, 기술 정보(상태 코드·스택·URL)를 노출하지 않는다.
 */

/* ------------------------------------------------------------------ */
/* 로딩                                                                */
/* ------------------------------------------------------------------ */

const SPINNER_SIZE = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-9 h-9 border-[3px]',
};

/** 접근 가능한 스피너. label 은 스크린리더로만 읽힌다. */
export function LoadingSpinner({ size = 'md', label = '불러오는 중', className = '' }) {
    return (
        <span role="status" aria-live="polite" className={`inline-flex items-center justify-center ${className}`}>
            <span
                className={`${SPINNER_SIZE[size] || SPINNER_SIZE.md} border-current border-t-transparent rounded-full animate-spin opacity-60`}
                aria-hidden="true"
            />
            <span className="sr-only">{label}</span>
        </span>
    );
}

/** 페이지·섹션 중앙 로딩. 맥락 문구를 함께 노출한다. */
export function LoadingState({ message = '불러오는 중이에요', description, className = '', minHeight = 'min-h-[200px]' }) {
    return (
        <div className={`w-full ${minHeight} flex flex-col items-center justify-center gap-3 p-6 text-center ${className}`}>
            <LoadingSpinner size="lg" label={message} className="text-primary" />
            <p className="text-body-7 text-neutral-600 break-keep">{message}</p>
            {description && <p className="text-caption text-neutral-400 max-w-[280px] break-keep">{description}</p>}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* 스켈레톤                                                            */
/* ------------------------------------------------------------------ */

/** 단일 스켈레톤 블록. 실제 콘텐츠와 높이를 맞춰 layout shift 를 줄인다. */
export function Skeleton({ className = '', rounded = 'rounded-lg' }) {
    return <div className={`bg-neutral-200/70 animate-pulse ${rounded} ${className}`} aria-hidden="true" />;
}

/** 카드 한 장 분량의 스켈레톤 */
export function CardSkeleton({ lines = 3, className = '' }) {
    return (
        <div
            className={`bg-bg-card border border-neutral-200 rounded-[16px] p-5 flex flex-col gap-3 ${className}`}
            role="status"
            aria-live="polite"
            aria-busy="true"
        >
            <span className="sr-only">데이터를 불러오는 중이에요</span>
            <Skeleton className="h-4 w-1/3" />
            {Array.from({ length: lines }).map((_, index) => (
                <Skeleton key={index} className={`h-3 ${index === lines - 1 ? 'w-2/3' : 'w-full'}`} />
            ))}
        </div>
    );
}

/** 페이지 진입 스켈레톤 */
export function PageSkeleton({ cards = 3, className = '' }) {
    return (
        <div className={`w-full flex flex-col gap-4 ${className}`} role="status" aria-live="polite" aria-busy="true">
            <span className="sr-only">화면을 불러오는 중이에요</span>
            <Skeleton className="h-7 w-1/2 max-w-[320px]" />
            <Skeleton className="h-4 w-1/3 max-w-[220px]" />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pt-2">
                {Array.from({ length: cards }).map((_, index) => (
                    <CardSkeleton key={index} />
                ))}
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* 오류                                                                */
/* ------------------------------------------------------------------ */

const resolveMessage = (error, fallback) => {
    if (typeof error === 'string' && error.trim()) return error;
    if (isApiError(error)) return getErrorMessage(error);
    return fallback;
};

const canRetry = (error) => (isApiError(error) ? error.retryable !== false : true);

/**
 * 페이지 핵심 데이터를 전혀 불러오지 못했을 때 쓰는 전체 화면 오류.
 */
export function PageError({
    error,
    title = '정보를 불러오지 못했어요',
    description,
    onRetry,
    retryLabel = '다시 시도',
    secondaryAction,
    className = '',
}) {
    const message = description || resolveMessage(error, '잠시 후 다시 시도해 주세요.');
    const showRetry = typeof onRetry === 'function' && canRetry(error);

    return (
        <div
            role="alert"
            className={`w-full min-h-[280px] flex flex-col items-center justify-center gap-3 px-6 py-10 text-center ${className}`}
        >
            <div className="w-12 h-12 rounded-full bg-point-bg flex items-center justify-center" aria-hidden="true">
                <AlertCircle size={24} className="text-point" />
            </div>
            <h2 className="text-head-5 text-text-main break-keep">{title}</h2>
            <p className="text-body-7 text-neutral-600 max-w-[340px] break-keep">{message}</p>
            {(showRetry || secondaryAction) && (
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    {showRetry && (
                        <button
                            type="button"
                            onClick={onRetry}
                            className="inline-flex items-center gap-2 h-10 px-6 rounded-xl bg-primary text-white text-btn-sub
                                       transition-colors duration-200 hover:bg-primary-hover
                                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        >
                            <RefreshCw size={16} aria-hidden="true" />
                            {retryLabel}
                        </button>
                    )}
                    {secondaryAction}
                </div>
            )}
        </div>
    );
}

/**
 * 카드·섹션 단위 오류. 나머지 화면은 그대로 두고 이 영역만 대체한다.
 */
export function SectionError({ error, title = '이 정보를 불러오지 못했어요', onRetry, className = '', compact = false }) {
    const message = resolveMessage(error, '잠시 후 다시 시도해 주세요.');
    const showRetry = typeof onRetry === 'function' && canRetry(error);

    return (
        <div
            role="alert"
            className={`w-full flex flex-col items-center justify-center gap-2 text-center
                        bg-bg-card border border-neutral-200 rounded-[16px]
                        ${compact ? 'p-4 min-h-[100px]' : 'p-6 min-h-[140px]'} ${className}`}
        >
            <AlertCircle size={20} className="text-point shrink-0" aria-hidden="true" />
            <p className="text-body-6 text-text-main break-keep">{title}</p>
            <p className="text-caption text-neutral-600 max-w-[260px] break-keep">{message}</p>
            {showRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="mt-1 inline-flex items-center gap-1.5 h-8 px-4 rounded-lg border border-primary-border text-primary text-caption font-semibold
                               transition-colors duration-200 hover:bg-primary-tint
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                    <RefreshCw size={14} aria-hidden="true" />
                    다시 시도
                </button>
            )}
        </div>
    );
}

/** 폼 필드 아래 인라인 오류. aria-describedby 로 필드와 연결해 쓴다. */
export function InlineError({ id, children, className = '' }) {
    if (!children) return null;
    return (
        <p id={id} role="alert" className={`flex items-start gap-1 text-error text-error ${className}`}>
            <AlertCircle size={13} className="shrink-0 mt-[2px]" aria-hidden="true" />
            <span className="break-keep">{children}</span>
        </p>
    );
}

/** 폼 전체(서버 오류 등) 상단 요약 오류 */
export function FormError({ children, className = '' }) {
    if (!children) return null;
    return (
        <div
            role="alert"
            className={`flex items-start gap-2 px-3 py-2.5 rounded-xl bg-point-bg border border-point/30 ${className}`}
        >
            <AlertCircle size={16} className="text-point shrink-0 mt-[1px]" aria-hidden="true" />
            <p className="text-body-7 text-text-main break-keep">{children}</p>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* 빈 상태                                                             */
/* ------------------------------------------------------------------ */

/**
 * 데이터가 없을 때. "없습니다"로 끝내지 않고 다음 행동을 제안한다.
 *
 * @param {object} props
 * @param {React.ComponentType} [props.icon]  lucide 아이콘 컴포넌트
 * @param {string} props.title
 * @param {string} [props.description]        다음 행동 안내
 * @param {React.ReactNode} [props.action]    CTA 버튼
 */
export function EmptyState({ icon: Icon = Inbox, title, description, action, className = '', compact = false }) {
    return (
        <div
            className={`w-full flex flex-col items-center justify-center gap-2 text-center
                        ${compact ? 'p-4 min-h-[120px]' : 'p-8 min-h-[200px]'} ${className}`}
        >
            <div className="w-11 h-11 rounded-full bg-primary-tint flex items-center justify-center shrink-0" aria-hidden="true">
                <Icon size={20} className="text-primary-inactive" />
            </div>
            <p className="text-body-6 text-text-main break-keep">{title}</p>
            {description && <p className="text-caption text-neutral-600 max-w-[300px] break-keep">{description}</p>}
            {action && <div className="pt-2">{action}</div>}
        </div>
    );
}
