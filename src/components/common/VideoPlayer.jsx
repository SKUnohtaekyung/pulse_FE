import React, { useEffect, useRef, useState } from 'react';
import { RefreshCw, VideoOff } from 'lucide-react';

/**
 * 재생 실패에 안전한 영상 플레이어.
 *
 * - URL 이 아예 없는 경우와 재생에 실패한 경우를 구분해 안내한다.
 * - "다시 불러오기" / "새 탭에서 열기" / "다시 만들기" 복구 경로를 제공한다.
 * - 실패한 URL 을 무한 재요청하지 않도록 재시도는 사용자가 누를 때만 일어난다.
 */
export default function VideoPlayer({
    src,
    poster,
    className = '',
    onRegenerate,
    regenerateLabel = '영상 다시 만들기',
    missingTitle = '영상 주소를 받지 못했어요',
    missingDescription = '영상은 만들어졌지만 주소를 확인하지 못했어요. 다시 만들어 주세요.',
    errorTitle = '영상을 재생할 수 없어요',
    errorDescription = '네트워크 상태를 확인한 후 다시 불러와 주세요.',
    ...videoProps
}) {
    const [status, setStatus] = useState(src ? 'playing' : 'missing');
    const [reloadKey, setReloadKey] = useState(0);
    const videoRef = useRef(null);

    useEffect(() => {
        setStatus(src ? 'playing' : 'missing');
    }, [src]);

    const handleReload = () => {
        setStatus('playing');
        setReloadKey((key) => key + 1);
        // load() 는 다음 렌더의 새 <video> 에서 자동 수행된다.
        requestAnimationFrame(() => videoRef.current?.load?.());
    };

    if (status !== 'playing') {
        const isMissing = status === 'missing';
        return (
            <div
                role="alert"
                className={`flex flex-col items-center justify-center gap-3 p-6 text-center bg-neutral-100 rounded-[16px] ${className}`}
            >
                <VideoOff size={28} className="text-neutral-400" aria-hidden="true" />
                <div className="flex flex-col gap-1">
                    <p className="text-body-6 text-text-main break-keep">{isMissing ? missingTitle : errorTitle}</p>
                    <p className="text-caption text-neutral-600 max-w-[280px] break-keep">
                        {isMissing ? missingDescription : errorDescription}
                    </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                    {!isMissing && (
                        <button
                            type="button"
                            onClick={handleReload}
                            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-primary text-white text-caption font-semibold
                                       transition-colors duration-200 hover:bg-primary-hover
                                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        >
                            <RefreshCw size={14} aria-hidden="true" />
                            다시 불러오기
                        </button>
                    )}
                    {!isMissing && src && (
                        <a
                            href={src}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center h-9 px-4 rounded-lg border border-primary-border text-primary text-caption font-semibold
                                       transition-colors duration-200 hover:bg-primary-tint
                                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        >
                            새 탭에서 열기
                        </a>
                    )}
                    {onRegenerate && (
                        <button
                            type="button"
                            onClick={onRegenerate}
                            className="inline-flex items-center h-9 px-4 rounded-lg border border-primary-border text-primary text-caption font-semibold
                                       transition-colors duration-200 hover:bg-primary-tint
                                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        >
                            {regenerateLabel}
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <video
            key={`${src}-${reloadKey}`}
            ref={videoRef}
            src={src}
            poster={poster}
            className={className}
            onError={() => setStatus('error')}
            {...videoProps}
        >
            <p className="text-caption text-neutral-600">이 브라우저에서는 영상을 재생할 수 없어요.</p>
        </video>
    );
}
