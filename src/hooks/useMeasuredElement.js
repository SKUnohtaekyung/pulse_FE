import { useEffect, useRef, useState } from 'react';

const EMPTY_SIZE = { width: 0, height: 0 };

const getElementSize = (element) => {
    if (!element) {
        return EMPTY_SIZE;
    }

    const rect = element.getBoundingClientRect();
    return {
        width: Math.round(rect.width),
        height: Math.round(rect.height)
    };
};

export default function useMeasuredElement() {
    const ref = useRef(null);
    const [size, setSize] = useState(EMPTY_SIZE);

    useEffect(() => {
        const element = ref.current;
        if (!element) {
            return undefined;
        }

        let frameId = null;

        const updateSize = () => {
            const nextSize = getElementSize(element);
            setSize((currentSize) => {
                if (
                    currentSize.width === nextSize.width &&
                    currentSize.height === nextSize.height
                ) {
                    return currentSize;
                }

                return nextSize;
            });
        };

        const scheduleUpdate = () => {
            if (frameId !== null) {
                cancelAnimationFrame(frameId);
            }
            frameId = requestAnimationFrame(updateSize);
        };

        scheduleUpdate();

        if (typeof ResizeObserver === 'undefined') {
            window.addEventListener('resize', scheduleUpdate);
            return () => {
                if (frameId !== null) {
                    cancelAnimationFrame(frameId);
                }
                window.removeEventListener('resize', scheduleUpdate);
            };
        }

        const observer = new ResizeObserver(scheduleUpdate);
        observer.observe(element);

        return () => {
            if (frameId !== null) {
                cancelAnimationFrame(frameId);
            }
            observer.disconnect();
        };
    }, []);

    return {
        ref,
        width: size.width,
        height: size.height,
        isReady: size.width > 0 && size.height > 0,
    };
}
