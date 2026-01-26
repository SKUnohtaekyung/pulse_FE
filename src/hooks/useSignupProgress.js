import { useState, useEffect, useRef } from 'react';

/**
 * Hook to manage signup progress state.
 * Returns status: 'idle' | 'loading' | 'success' | 'error'
 */
export const useSignupProgress = () => {
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("초기화 중...");
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const pollingRef = useRef(null);

    const startPolling = (simulateError = false) => {
        setProgress(0);
        setStatus('loading');
        setMessage("사장님의 가게 정보를 안전하게 암호화하고 있어요... 🔒");

        let currentProgress = 0;
        
        if (pollingRef.current) clearInterval(pollingRef.current);

        pollingRef.current = setInterval(() => {
            currentProgress += Math.random() * 8; 

            // Error Simulation
            if (simulateError && currentProgress > 50 && Math.random() > 0.8) {
                clearInterval(pollingRef.current);
                setStatus('error');
                setMessage("데이터를 불러오는 중 문제가 발생했습니다.");
                return;
            }

            if (currentProgress > 30 && currentProgress < 60) {
                setMessage("AI가 지역 상권 데이터를 분석 중입니다... 📊");
            } else if (currentProgress >= 60 && currentProgress < 90) {
                setMessage("사장님을 위한 맞춤 공간이 준비되었습니다! ✨");
            }

            if (currentProgress >= 100) {
                currentProgress = 100;
                clearInterval(pollingRef.current);
                setStatus('success'); // Completed
                setMessage("모든 준비가 완료되었습니다!");
            }

            setProgress(Math.min(currentProgress, 100));
        }, 200); 
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
