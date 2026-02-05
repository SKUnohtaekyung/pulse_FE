import { useState, useEffect, useRef } from 'react';
import { signup } from '../features/auth/api/authApi';

/**
 * Hook to manage signup progress state with real API integration.
 * Returns status: 'idle' | 'loading' | 'success' | 'error'
 */
export const useSignupProgress = () => {
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("초기화 중...");
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const pollingRef = useRef(null);

    const startPolling = async (signupData) => {
        setProgress(0);
        setStatus('loading');
        setMessage("사장님의 가게 정보를 안전하게 암호화하고 있어요... 🔒");

        try {
            // Step 1: Call signup API (0-30%)
            setProgress(10);
            const response = await signup(signupData);

            setProgress(30);
            setMessage("AI가 네이버와 카카오맵에서 리뷰를 수집하고 있어요... 🔍");

            // Step 2: Simulate analysis progress (30-90%)
            // In real implementation, this would poll a status endpoint
            let currentProgress = 30;

            if (pollingRef.current) clearInterval(pollingRef.current);

            pollingRef.current = setInterval(() => {
                currentProgress += Math.random() * 5;

                if (currentProgress > 50 && currentProgress < 70) {
                    setMessage("AI가 손님 리뷰를 분석하여 페르소나를 생성 중입니다... 🤖");
                } else if (currentProgress >= 70 && currentProgress < 90) {
                    setMessage("고객 여정 지도를 그리고 있어요... 🗺️");
                }

                if (currentProgress >= 90) {
                    currentProgress = 100;
                    clearInterval(pollingRef.current);
                    setStatus('success');
                    setMessage("모든 준비가 완료되었습니다!");
                }

                setProgress(Math.min(currentProgress, 100));
            }, 300);

        } catch (error) {
            if (pollingRef.current) clearInterval(pollingRef.current);
            setStatus('error');
            setProgress(0);
            setMessage(error.message || "회원가입 중 문제가 발생했습니다.");
        }
    };

    const stopPolling = () => {
        if (pollingRef.current) {
            clearInterval(pollingRef.current);
        }
    };

    const reset = () => {
        stopPolling();
        setStatus('idle');
        setProgress(0);
        setMessage("");
    };

    useEffect(() => {
        return () => stopPolling();
    }, []);

    return { progress, message, status, startPolling, reset };
};
