import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { getErrorMessage, isApiError, isCanceledError } from '../../utils/apiError';

/**
 * 전역 토스트.
 *
 * - 같은 문구가 연속으로 쌓이지 않도록 중복을 막는다.
 *   (이미 떠 있는 동일 메시지는 새로 쌓지 않고 타이머만 연장)
 * - 최대 3개까지만 유지해 화면을 가리지 않는다.
 * - 오류 토스트는 색상만이 아니라 아이콘·텍스트로도 구분된다.
 * - 사용자 취소(AbortError)는 토스트를 띄우지 않는다.
 */

const ToastContext = createContext(null);

const DEFAULT_DURATION = { success: 3000, info: 3000, error: 5000 };
const MAX_TOASTS = 3;

const TONE_STYLE = {
    success: { Icon: CheckCircle2, className: 'border-success/40', iconClass: 'text-success' },
    error: { Icon: AlertCircle, className: 'border-point/40', iconClass: 'text-point' },
    info: { Icon: Info, className: 'border-primary-border', iconClass: 'text-primary' },
};

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const timersRef = useRef(new Map());
    const idRef = useRef(0);
    const shouldReduceMotion = useReducedMotion();

    const dismiss = useCallback((id) => {
        const timer = timersRef.current.get(id);
        if (timer) {
            clearTimeout(timer);
            timersRef.current.delete(id);
        }
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const scheduleDismiss = useCallback(
        (id, duration) => {
            const existing = timersRef.current.get(id);
            if (existing) clearTimeout(existing);
            if (duration > 0) timersRef.current.set(id, setTimeout(() => dismiss(id), duration));
        },
        [dismiss],
    );

    const show = useCallback(
        (message, options = {}) => {
            const text = typeof message === 'string' ? message.trim() : '';
            if (!text) return null;

            const tone = options.tone || 'info';
            const duration = options.duration ?? DEFAULT_DURATION[tone] ?? DEFAULT_DURATION.info;

            let resultId = null;
            setToasts((prev) => {
                // 같은 문구가 이미 떠 있으면 새로 쌓지 않고 그것을 유지한다.
                const duplicate = prev.find((toast) => toast.message === text && toast.tone === tone);
                if (duplicate) {
                    resultId = duplicate.id;
                    return prev;
                }

                idRef.current += 1;
                resultId = idRef.current;
                const next = [...prev, { id: resultId, message: text, tone }];
                // 오래된 것부터 밀어낸다.
                return next.length > MAX_TOASTS ? next.slice(next.length - MAX_TOASTS) : next;
            });

            if (resultId !== null) scheduleDismiss(resultId, duration);
            return resultId;
        },
        [scheduleDismiss],
    );

    useEffect(() => {
        const timers = timersRef.current;
        return () => {
            timers.forEach(clearTimeout);
            timers.clear();
        };
    }, []);

    const api = useMemo(
        () => ({
            show,
            dismiss,
            success: (message, options) => show(message, { ...options, tone: 'success' }),
            info: (message, options) => show(message, { ...options, tone: 'info' }),
            error: (message, options) => show(message, { ...options, tone: 'error' }),
            /** 정규화된 API 오류를 그대로 넘기면 사용자 문구만 뽑아 띄운다. */
            fromError: (error, fallback) => {
                if (isCanceledError(error)) return null;
                const message = isApiError(error) ? getErrorMessage(error) : fallback;
                return message ? show(message, { tone: 'error' }) : null;
            },
        }),
        [show, dismiss],
    );

    return (
        <ToastContext.Provider value={api}>
            {children}
            <div
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[95] flex flex-col items-center gap-2 w-full max-w-[calc(100vw-32px)] sm:max-w-[420px] px-2 pointer-events-none"
                role="region"
                aria-label="알림"
            >
                <AnimatePresence initial={false}>
                    {toasts.map((toast) => {
                        const { Icon, className, iconClass } = TONE_STYLE[toast.tone] || TONE_STYLE.info;
                        return (
                            <motion.div
                                key={toast.id}
                                layout={!shouldReduceMotion}
                                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
                                animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
                                transition={{ type: 'tween', duration: 0.2 }}
                                role={toast.tone === 'error' ? 'alert' : 'status'}
                                aria-live={toast.tone === 'error' ? 'assertive' : 'polite'}
                                className={`pointer-events-auto w-full flex items-start gap-2 px-4 py-3
                                            bg-bg-card border ${className} rounded-xl shadow-soft`}
                            >
                                <Icon size={18} className={`${iconClass} shrink-0 mt-[1px]`} aria-hidden="true" />
                                <p className="flex-1 text-body-7 text-text-main break-keep">{toast.message}</p>
                                <button
                                    type="button"
                                    onClick={() => dismiss(toast.id)}
                                    aria-label="알림 닫기"
                                    className="shrink-0 -mr-1 p-1 rounded-lg text-neutral-400
                                               transition-colors duration-200 hover:text-text-main
                                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                >
                                    <X size={14} aria-hidden="true" />
                                </button>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

/**
 * Provider 밖에서 호출돼도 앱이 죽지 않도록 no-op 객체를 돌려준다.
 * (랜딩 페이지 등 Provider 바깥 트리에서 실수로 호출되는 경우 대비)
 */
const NOOP_TOAST = {
    show: () => null,
    dismiss: () => {},
    success: () => null,
    info: () => null,
    error: () => null,
    fromError: () => null,
};

export function useToast() {
    return useContext(ToastContext) || NOOP_TOAST;
}
