/**
 * CurrentLocationButton Component
 * 현재 위치로 지도 이동 버튼
 */

import React, { useEffect, useRef, useState } from 'react';
import { Navigation, Loader2 } from 'lucide-react';
import { useToast } from '../../../components/common/ToastProvider';

export default function CurrentLocationButton({ onLocationFound }) {
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    const handleClick = () => {
        if (isLoading) return;

        if (!navigator.geolocation) {
            toast.error('이 브라우저에서는 현재 위치를 사용할 수 없어요. 지도를 직접 옮겨 주세요.');
            return;
        }

        setIsLoading(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                if (!mountedRef.current) return;
                const { latitude, longitude } = position.coords;
                setIsLoading(false);
                onLocationFound(latitude, longitude);
            },
            (error) => {
                if (!mountedRef.current) return;
                setIsLoading(false);

                // 사용자가 다음에 무엇을 할지 알 수 있는 문구로 바꾼다.
                let message = '현재 위치를 확인하지 못했어요. 지도를 직접 옮기거나 장소를 검색해 주세요.';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        message = '위치 권한이 꺼져 있어요. 브라우저 주소창의 위치 아이콘에서 권한을 허용해 주세요.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        message = '지금은 위치 정보를 가져올 수 없어요. 장소를 직접 검색해 주세요.';
                        break;
                    case error.TIMEOUT:
                        message = '위치 확인이 오래 걸리고 있어요. 잠시 후 다시 시도해 주세요.';
                        break;
                    default:
                        break;
                }

                toast.error(message);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={isLoading}
            aria-busy={isLoading}
            className="w-12 h-12 bg-white border border-[#E5E8EB] rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center group
                       disabled:opacity-50 disabled:cursor-not-allowed
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            title="현재 위치로 이동"
            aria-label={isLoading ? '현재 위치를 확인하는 중' : '현재 위치로 이동'}
        >
            {isLoading ? (
                <Loader2 size={20} className="text-[#002B7A] animate-spin" aria-hidden="true" />
            ) : (
                <Navigation
                    size={20}
                    className="text-gray-600 group-hover:text-[#002B7A] transition-colors"
                    aria-hidden="true"
                />
            )}
        </button>
    );
}
