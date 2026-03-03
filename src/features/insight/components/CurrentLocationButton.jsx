/**
 * CurrentLocationButton Component
 * 현재 위치로 지도 이동 버튼
 */

import React, { useState } from 'react';
import { Navigation, Loader2 } from 'lucide-react';

export default function CurrentLocationButton({ onLocationFound }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleClick = () => {
        if (!navigator.geolocation) {
            alert('이 브라우저는 위치 서비스를 지원하지 않습니다.');
            return;
        }

        setIsLoading(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                console.log('📍 현재 위치:', { latitude, longitude });
                onLocationFound(latitude, longitude);
                setIsLoading(false);
            },
            (error) => {
                console.error('❌ 위치 가져오기 실패:', error);
                setIsLoading(false);

                let errorMessage = '위치를 가져올 수 없습니다.';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = '위치 권한이 거부되었습니다.\n브라우저 설정에서 위치 권한을 허용해주세요.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = '위치 정보를 사용할 수 없습니다.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = '위치 요청 시간이 초과되었습니다.';
                        break;
                }

                setError(errorMessage);
                alert(errorMessage);
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
            onClick={handleClick}
            disabled={isLoading}
            className="w-12 h-12 bg-white border border-[#E5E8EB] rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
            title="현재 위치로 이동"
            aria-label="현재 위치로 이동"
        >
            {isLoading ? (
                <Loader2 size={20} className="text-[#002B7A] animate-spin" />
            ) : (
                <Navigation
                    size={20}
                    className="text-gray-600 group-hover:text-[#002B7A] transition-colors"
                />
            )}
        </button>
    );
}
