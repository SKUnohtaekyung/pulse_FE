import { useState, useEffect, useRef, useCallback } from 'react';
import { signup } from '../features/auth/api/authApi';
import { FASTAPI_BASE_URL } from '../config/env';
import { apiGet } from '../utils/httpClient';
import { getErrorMessage, isCanceledError } from '../utils/apiError';

const POLL_INTERVAL_MS = 1500;
/** 폴링 전체 상한 — 분석이 끝나지 않아도 화면이 영원히 도는 일은 없게 한다. */
const POLL_DEADLINE_MS = 5 * 60 * 1000;
/** 일시적 네트워크 오류를 몇 번까지 넘길지 */
const MAX_TRANSIENT_FAILURES = 3;

/**
 * 회원가입 + 최초 분석 진행 상태 관리 훅.
 * status: 'idle' | 'loading' | 'success' | 'error'
 */
export const useSignupProgress = () => {
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('초기화 중...');
    const [status, setStatus] = useState('idle');

    const pollingRef = useRef(null);
    const taskIdRef = useRef(null);
    const signupDataRef = useRef(null);
    const inFlightRef = useRef(false);
    const mountedRef = useRef(true);
    const controllerRef = useRef(null);

    const stopPolling = useCallback(() => {
        if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
        }
        controllerRef.current?.abort();
        controllerRef.current = null;
    }, []);

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
            stopPolling();
        };
    }, [stopPolling]);

    const startPolling = useCallback(
        async (signupData) => {
            // 재시도 버튼 연타로 회원가입 요청이 중복되지 않도록 막는다.
            if (inFlightRef.current) return;
            inFlightRef.current = true;

            stopPolling();
            const controller = new AbortController();
            controllerRef.current = controller;

            setProgress(0);
            setStatus('loading');
            setMessage('사장님의 가게 정보를 안전하게 암호화하고 있어요... 🔒');

            try {
                let taskId = taskIdRef.current;
                const payload = signupData || (!taskId ? signupDataRef.current : null);

                if (signupData) signupDataRef.current = signupData;

                if (!taskId) {
                    if (!payload) {
                        throw new Error('다시 시도할 회원가입 정보가 없습니다.');
                    }

                    setProgress(10);
                    const response = await signup(payload);
                    taskId = response?.analysisTaskId;
                    taskIdRef.current = taskId;

                    if (!taskId) {
                        // 가입 자체는 됐지만 분석을 추적할 수 없는 상태다.
                        setProgress(100);
                        setStatus('success');
                        setMessage('가입이 완료됐어요. 분석 결과는 준비되는 대로 대시보드에 표시돼요.');
                        return;
                    }
                }

                setProgress(30);
                setMessage('AI 분석을 시작하고 있어요... 🔍');

                const startedAt = Date.now();
                let transientFailures = 0;

                pollingRef.current = setInterval(async () => {
                    if (!mountedRef.current) {
                        stopPolling();
                        return;
                    }

                    if (Date.now() - startedAt > POLL_DEADLINE_MS) {
                        stopPolling();
                        setStatus('error');
                        setMessage('분석이 예상보다 오래 걸리고 있어요. 잠시 후 대시보드에서 다시 확인해 주세요.');
                        return;
                    }

                    try {
                        const data = await apiGet(`${FASTAPI_BASE_URL}/analysis/status/${encodeURIComponent(taskId)}`, {
                            signal: controller.signal,
                            context: 'signup/analysis-status',
                        });
                        transientFailures = 0;

                        const nextProgress = Number(data?.progress);
                        setProgress(Math.max(30, Number.isFinite(nextProgress) ? nextProgress : 30));
                        setMessage(data?.message || 'AI가 분석 중입니다...');

                        if (data?.status === 'completed') {
                            stopPolling();
                            setProgress(100);
                            setStatus('success');
                            setMessage('고객 분석이 완료되었습니다!');
                            return;
                        }

                        // 분석 실패를 "완료"로 처리하면 사용자가 잘못된 결과를 기다리게 된다.
                        if (data?.status === 'failed') {
                            stopPolling();
                            setProgress(0);
                            setStatus('error');
                            setMessage('리뷰 분석에 실패했어요. 가입은 완료됐으니 대시보드에서 다시 시도할 수 있어요.');
                        }
                    } catch (error) {
                        if (isCanceledError(error)) return;
                        transientFailures += 1;
                        if (transientFailures <= MAX_TRANSIENT_FAILURES) return;

                        stopPolling();
                        setStatus('error');
                        setMessage(getErrorMessage(error, '분석 상태를 확인하지 못했어요. 잠시 후 다시 시도해 주세요.'));
                    }
                }, POLL_INTERVAL_MS);
            } catch (error) {
                stopPolling();
                if (!mountedRef.current || isCanceledError(error)) return;
                setStatus('error');
                setProgress(0);
                setMessage(
                    error?.message && !error.type
                        ? error.message
                        : getErrorMessage(error, '회원가입을 완료하지 못했어요. 입력한 내용을 확인한 후 다시 시도해 주세요.'),
                );
            } finally {
                inFlightRef.current = false;
            }
        },
        [stopPolling],
    );

    const reset = useCallback(() => {
        stopPolling();
        inFlightRef.current = false;
        setStatus('idle');
        setProgress(0);
        setMessage('');
        taskIdRef.current = null;
        signupDataRef.current = null;
    }, [stopPolling]);

    return { progress, message, status, startPolling, reset };
};
