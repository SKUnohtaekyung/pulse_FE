import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass } from 'lucide-react';

/**
 * 404 — 존재하지 않는 주소.
 * 홈 이동 / 이전 페이지 이동 두 가지 복구 경로를 제공한다.
 */
export default function NotFoundPage() {
    const navigate = useNavigate();

    const handleGoBack = () => {
        // 히스토리가 없으면(직접 URL 진입) 되돌아갈 곳이 없으므로 홈으로 보낸다.
        if (window.history.length > 1) navigate(-1);
        else navigate('/', { replace: true });
    };

    return (
        <main className="min-h-dvh flex flex-col items-center justify-center gap-4 px-6 py-12 text-center bg-bg-page">
            <div className="w-14 h-14 rounded-full bg-primary-tint flex items-center justify-center" aria-hidden="true">
                <Compass size={26} className="text-primary" />
            </div>
            <h1 className="text-head-4 text-text-main break-keep">페이지를 찾을 수 없어요</h1>
            <p className="text-body-7 text-neutral-600 max-w-[340px] break-keep">
                주소가 바뀌었거나 삭제된 페이지예요. 홈에서 다시 시작해 주세요.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <Link
                    to="/"
                    className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-primary text-white text-btn-sub
                               transition-colors duration-200 hover:bg-primary-hover
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                    홈으로 이동
                </Link>
                <button
                    type="button"
                    onClick={handleGoBack}
                    className="inline-flex items-center justify-center h-11 px-6 rounded-xl border border-primary-border text-primary text-btn-sub
                               transition-colors duration-200 hover:bg-primary-tint
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                    이전 페이지로
                </button>
            </div>
        </main>
    );
}
