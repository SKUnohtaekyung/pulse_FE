/**
 * KakaoMapContainer Component
 * 지도 컨테이너 + 카테고리 토글 + 반경 선택 UI
 */

import React, { useEffect, useState } from 'react';
import { useKakaoMap } from '../hooks/useKakaoMap';
import CategoryToggle from './CategoryToggle';
import CurrentLocationButton from './CurrentLocationButton';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export default function KakaoMapContainer({
    center,
    radius,
    onRadiusChange,
    storeName,
    onMapReady,
    categoryData, // { FD6: [...places], CE7: [...places], ... }
    onCategoryToggle
}) {
    const {
        mapRef,
        map,
        isLoading,
        error,
        addStoreMarker,
        updateCategoryMarkers,
        removeCategoryMarkers,
        showInfoWindow
    } = useKakaoMap(center, radius);

    const [selectedCategories, setSelectedCategories] = useState([]);

    // 지도 준비 완료 시 가게 마커 추가
    useEffect(() => {
        if (map) {
            addStoreMarker(center, storeName);
            onMapReady && onMapReady(map);
        }
    }, [map, center, storeName]);

    // 현재 위치로 이동 핸들러
    const handleLocationFound = (lat, lng) => {
        if (map && window.kakao) {
            const newCenter = new window.kakao.maps.LatLng(lat, lng);
            map.panTo(newCenter);
            console.log('📍 현재 위치로 이동:', { lat, lng });

            // 임시 마커 표시 (3초 후 제거)
            const marker = new window.kakao.maps.Marker({
                position: newCenter,
                map: map
            });

            setTimeout(() => marker.setMap(null), 3000);
        }
    };

    // 카테고리 토글 핸들러
    const handleCategoryToggle = (categoryCode) => {
        setSelectedCategories(prev => {
            const isSelected = prev.includes(categoryCode);
            const newSelection = isSelected
                ? prev.filter(c => c !== categoryCode)
                : [...prev, categoryCode];

            // 부모 컴포넌트에 알림
            onCategoryToggle && onCategoryToggle(newSelection);

            return newSelection;
        });
    };

    // 선택된 카테고리 마커 업데이트
    useEffect(() => {
        if (!map || !categoryData) return;

        const CATEGORY_COLORS = {
            FD6: '#FF5A36',
            CE7: '#8B4513',
            CS2: '#00A86B',
            HP8: '#FF1744',
            PM9: '#00BCD4'
        };

        // 선택된 카테고리 마커 표시
        selectedCategories.forEach(categoryCode => {
            const places = categoryData[categoryCode] || [];
            const color = CATEGORY_COLORS[categoryCode];

            updateCategoryMarkers(
                categoryCode,
                places,
                color,
                (place, marker) => showInfoWindow(place, marker)
            );
        });

        // 선택 해제된 카테고리 마커 제거
        Object.keys(categoryData).forEach(categoryCode => {
            if (!selectedCategories.includes(categoryCode)) {
                removeCategoryMarkers(categoryCode);
            }
        });
    }, [map, selectedCategories, categoryData]);

    const handleRetry = () => {
        window.location.reload();
    };

    return (
        <div className="relative w-full h-full">
            {/* 지도 */}
            <div
                ref={mapRef}
                className="w-full h-full rounded-l-[24px] bg-[#F5F7FA]"
            />


            {/* 카테고리 토글 (지도 좌측 상단) */}
            {!isLoading && !error && (
                <CategoryToggle
                    selectedCategories={selectedCategories}
                    onToggle={handleCategoryToggle}
                />
            )}

            {/* 반경 선택 UI (지도 위 오버레이) */}
            {!isLoading && !error && (
                <div className="absolute top-4 right-4 bg-white rounded-xl shadow-lg p-2 flex gap-2 z-10">
                    {[300, 500, 1000].map(r => (
                        <button
                            key={r}
                            onClick={() => onRadiusChange(r)}
                            className={`px-4 py-2 rounded-lg text-[14px] font-bold transition-all ${radius === r
                                ? 'bg-[#002B7A] text-white shadow-md'
                                : 'bg-white text-gray-600 hover:bg-[#F5F7FA]'
                                }`}
                        >
                            {r}m
                        </button>
                    ))}
                </div>
            )}

            {/* 범례 (지도 좌측 하단) - 클릭 가능 */}
            {!isLoading && !error && (
                <button
                    onClick={() => {
                        if (map && window.kakao) {
                            const storeLatLng = new window.kakao.maps.LatLng(center.lat, center.lng);
                            map.panTo(storeLatLng);
                            console.log('🏪 내 가게 위치로 이동:', center);
                        }
                    }}
                    className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-3 z-10 hover:bg-white hover:shadow-xl transition-all cursor-pointer"
                    title="클릭하여 내 가게 위치로 이동"
                >
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-[#FF5A36] rounded-full flex items-center justify-center text-[12px]">
                            🏪
                        </div>
                        <span className="text-[13px] font-medium text-gray-700">내 가게</span>
                    </div>
                </button>
            )}

            {/* 현재 위치 버튼 (지도 우측 하단) */}
            {!isLoading && !error && (
                <div className="absolute bottom-6 right-6 z-10">
                    <CurrentLocationButton onLocationFound={handleLocationFound} />
                </div>
            )}

            {/* 로딩 오버레이 */}
            {isLoading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-l-[24px]">
                    <Loader2 size={48} className="text-[#002B7A] animate-spin mb-4" />
                    <p className="text-[16px] font-medium text-gray-700">지도를 불러오는 중...</p>
                    <p className="text-[14px] text-gray-500 mt-1">잠시만 기다려주세요</p>
                </div>
            )}

            {/* 에러 오버레이 */}
            {error && (
                <div className="absolute inset-0 bg-white flex flex-col items-center justify-center rounded-l-[24px] p-8">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle size={32} className="text-red-500" />
                    </div>
                    <h3 className="text-[18px] font-bold text-gray-800 mb-2">지도를 불러올 수 없습니다</h3>
                    <p className="text-[14px] text-gray-600 text-center mb-6 max-w-md">
                        {error}
                    </p>
                    <button
                        onClick={handleRetry}
                        className="flex items-center gap-2 px-6 py-3 bg-[#002B7A] text-white rounded-lg font-bold hover:bg-[#002B7AE6] transition-colors"
                    >
                        <RefreshCw size={16} />
                        <span>다시 시도</span>
                    </button>
                </div>
            )}
        </div>
    );
}
