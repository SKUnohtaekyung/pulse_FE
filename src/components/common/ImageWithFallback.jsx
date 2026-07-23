import React, { useEffect, useRef, useState } from 'react';
import { ImageOff } from 'lucide-react';

/**
 * 로딩 실패에 안전한 이미지.
 *
 * - onError 가 반복 발화하며 같은 URL 을 계속 재요청하는 무한 루프를 막는다.
 *   (실패한 src 를 ref 에 기록하고, 실패 후에는 src 를 비운다)
 * - 실패 시 이미지 자리를 유지하는 대체 UI 를 보여줘 layout shift 를 막는다.
 * - 장식용 이미지는 alt="" 를 그대로 전달하면 스크린리더가 건너뛴다.
 */
export default function ImageWithFallback({
    src,
    alt = '',
    className = '',
    wrapperClassName = '',
    fallbackLabel = '이미지를 불러오지 못했어요',
    showFallbackLabel = true,
    ...props
}) {
    const [status, setStatus] = useState(src ? 'loading' : 'error');
    const failedSrcRef = useRef(null);

    useEffect(() => {
        if (!src) {
            setStatus('error');
            return;
        }
        // 이미 실패한 적 있는 URL 이면 다시 시도하지 않는다.
        if (failedSrcRef.current === src) {
            setStatus('error');
            return;
        }
        setStatus('loading');
    }, [src]);

    const handleError = () => {
        failedSrcRef.current = src;
        setStatus('error');
    };

    if (status === 'error') {
        return (
            <div
                className={`flex flex-col items-center justify-center gap-1 bg-neutral-100 text-neutral-400 ${wrapperClassName || className}`}
                role={alt ? 'img' : undefined}
                aria-label={alt || undefined}
                aria-hidden={alt ? undefined : true}
            >
                <ImageOff size={20} aria-hidden="true" />
                {showFallbackLabel && <span className="text-caption px-2 text-center break-keep">{fallbackLabel}</span>}
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            onError={handleError}
            onLoad={() => setStatus('loaded')}
            className={className}
            {...props}
        />
    );
}
