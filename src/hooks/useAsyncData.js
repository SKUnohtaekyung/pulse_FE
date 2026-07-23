import { useCallback, useEffect, useRef, useState } from 'react';
import { isCanceledError, normalizeApiError } from '../utils/apiError';

/**
 * 비동기 데이터 로딩 공통 훅.
 *
 * 프로젝트 곳곳에 흩어져 있던 아래 문제를 한 번에 막는다.
 * - 언마운트 후 setState
 * - 오래된 응답이 최신 응답을 덮어쓰는 race condition (요청 순번으로 판별)
 * - StrictMode 이중 실행으로 인한 중복 요청 (이전 요청 abort)
 * - 성공 후에도 이전 오류가 남아 있는 문제
 * - 로딩이 끝나지 않는 문제 (finally 보장)
 *
 * @param {(signal: AbortSignal) => Promise<any>} fetcher
 * @param {object} [options]
 * @param {any[]} [options.deps=[]]        값이 바뀌면 재요청
 * @param {boolean} [options.enabled=true] false 면 요청하지 않는다
 * @param {any} [options.initialData=null]
 */
export function useAsyncData(fetcher, options = {}) {
    const { deps = [], enabled = true, initialData = null } = options;

    const [data, setData] = useState(initialData);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(enabled);

    const fetcherRef = useRef(fetcher);
    const requestIdRef = useRef(0);
    const controllerRef = useRef(null);
    const mountedRef = useRef(true);

    useEffect(() => {
        fetcherRef.current = fetcher;
    });

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
            controllerRef.current?.abort();
        };
    }, []);

    const run = useCallback(async () => {
        // 이전 요청은 취소한다 — 응답 뒤집힘과 낭비를 함께 막는다.
        controllerRef.current?.abort();
        const controller = new AbortController();
        controllerRef.current = controller;

        requestIdRef.current += 1;
        const requestId = requestIdRef.current;

        const isStale = () => !mountedRef.current || requestId !== requestIdRef.current;

        setIsLoading(true);
        setError(null);

        try {
            const result = await fetcherRef.current(controller.signal);
            if (isStale()) return;
            setData(result);
        } catch (caught) {
            if (isStale() || isCanceledError(caught)) return;
            setError(normalizeApiError(caught));
        } finally {
            if (!isStale()) setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!enabled) {
            setIsLoading(false);
            return undefined;
        }
        run();
        return () => controllerRef.current?.abort();
        // deps 는 호출부가 넘긴 값이라 정적 분석 대상이 아니다. (의도된 동적 의존성)
    }, [enabled, run, ...deps]);

    return { data, error, isLoading, refetch: run, setData };
}

/**
 * 사용자 액션(제출·생성 등)용 훅.
 * 중복 클릭·중복 제출을 in-flight 가드로 차단하고, 오류를 정규화해 돌려준다.
 *
 * @param {(...args: any[]) => Promise<any>} action
 */
export function useAsyncAction(action) {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(null);
    const pendingRef = useRef(false);
    const mountedRef = useRef(true);
    const actionRef = useRef(action);

    useEffect(() => {
        actionRef.current = action;
    });

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    const execute = useCallback(async (...args) => {
        // 연속 클릭 / Enter 중복 제출 차단. state 가 아닌 ref 로 막아야 같은 tick 도 잡힌다.
        if (pendingRef.current) return { ok: false, skipped: true };

        pendingRef.current = true;
        setIsPending(true);
        setError(null);

        try {
            const result = await actionRef.current(...args);
            return { ok: true, data: result };
        } catch (caught) {
            const normalized = normalizeApiError(caught);
            if (mountedRef.current && !isCanceledError(normalized)) setError(normalized);
            return { ok: false, error: normalized };
        } finally {
            pendingRef.current = false;
            if (mountedRef.current) setIsPending(false);
        }
    }, []);

    const reset = useCallback(() => setError(null), []);

    return { execute, isPending, error, reset };
}
