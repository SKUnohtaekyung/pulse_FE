/**
 * useKakaoMap Hook
 * Kakao Map 초기화 및 마커 관리 로직
 */

import { useEffect, useRef, useState } from 'react';
import { loadKakaoMapSDK } from '../../../utils/kakaoMapLoader';

export const useKakaoMap = (center, radius) => {
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const categoryMarkersRef = useRef({}); // { FD6: [marker1, marker2, ...], CE7: [...], ... }
    const circleRef = useRef(null);
    const storeMarkerRef = useRef(null);
    const infoWindowRef = useRef(null);

    // 지도 초기화
    useEffect(() => {
        if (!mapRef.current) return;

        setIsLoading(true);
        loadKakaoMapSDK()
            .then((kakao) => {
                const container = mapRef.current;
                const options = {
                    center: new kakao.maps.LatLng(center.lat, center.lng),
                    level: 5
                };
                const mapInstance = new kakao.maps.Map(container, options);
                setMap(mapInstance);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error('Kakao Map 로드 실패:', err);
                setError(err.message);
                setIsLoading(false);
            });
    }, []);

    // 반경 Circle 업데이트
    useEffect(() => {
        if (!map || !window.kakao) return;

        // 기존 Circle 제거
        if (circleRef.current) {
            circleRef.current.setMap(null);
        }

        // 새 Circle 생성
        const circle = new window.kakao.maps.Circle({
            center: new window.kakao.maps.LatLng(center.lat, center.lng),
            radius: radius,
            strokeWeight: 2,
            strokeColor: '#002B7A',
            strokeOpacity: 0.8,
            strokeStyle: 'solid',
            fillColor: '#002B7A',
            fillOpacity: 0.08
        });

        circle.setMap(map);
        circleRef.current = circle;

        // 지도 레벨 조정 (반경에 따라)
        const level = radius === 300 ? 4 : radius === 500 ? 5 : 6;
        map.setLevel(level);
    }, [map, radius, center]);

    // 가게 마커 추가
    const addStoreMarker = (position, storeName) => {
        if (!map || !window.kakao) return;

        // 기존 마커 제거
        if (storeMarkerRef.current) {
            storeMarkerRef.current.setMap(null);
        }

        const markerPosition = new window.kakao.maps.LatLng(position.lat, position.lng);

        // 커스텀 마커 이미지 (가게)
        const svgContent = `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="20" fill="#FF5A36" stroke="white" stroke-width="4"/>
        <text x="24" y="30" font-size="20" text-anchor="middle" fill="white">🏪</text>
      </svg>`;
        const imageSrc = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgContent);
        const imageSize = new window.kakao.maps.Size(48, 48);
        const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize);

        const marker = new window.kakao.maps.Marker({
            position: markerPosition,
            image: markerImage,
            title: storeName
        });

        marker.setMap(map);
        storeMarkerRef.current = marker;
    };

    // 카테고리 마커 추가/업데이트
    const updateCategoryMarkers = (categoryCode, places, color, onMarkerClick) => {
        if (!map || !window.kakao) return;

        // 기존 해당 카테고리 마커 제거
        if (categoryMarkersRef.current[categoryCode]) {
            categoryMarkersRef.current[categoryCode].forEach(marker => marker.setMap(null));
        }

        // 새 마커 생성
        const markers = places.map((place) => {
            const markerPosition = new window.kakao.maps.LatLng(place.lat, place.lng);

            // 카테고리별 색상 마커
            const svgContent = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="12" fill="${color}" stroke="white" stroke-width="2"/>
        </svg>`;
            const imageSrc = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgContent);
            const imageSize = new window.kakao.maps.Size(32, 32);
            const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize);

            const marker = new window.kakao.maps.Marker({
                position: markerPosition,
                image: markerImage,
                title: place.name
            });

            // 마커 클릭 이벤트
            if (onMarkerClick) {
                window.kakao.maps.event.addListener(marker, 'click', () => {
                    onMarkerClick(place, marker);
                });
            }

            marker.setMap(map);
            return marker;
        });

        categoryMarkersRef.current[categoryCode] = markers;
    };

    // 특정 카테고리 마커 제거
    const removeCategoryMarkers = (categoryCode) => {
        if (categoryMarkersRef.current[categoryCode]) {
            categoryMarkersRef.current[categoryCode].forEach(marker => marker.setMap(null));
            delete categoryMarkersRef.current[categoryCode];
        }
    };

    // 모든 카테고리 마커 제거
    const clearAllCategoryMarkers = () => {
        Object.keys(categoryMarkersRef.current).forEach(categoryCode => {
            removeCategoryMarkers(categoryCode);
        });
    };

    // InfoWindow 표시
    const showInfoWindow = (place, marker) => {
        if (!map || !window.kakao) return;

        // 기존 InfoWindow 닫기
        if (infoWindowRef.current) {
            infoWindowRef.current.close();
        }

        const content = `
            <div style="padding: 12px 16px; min-width: 200px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
                <div style="font-size: 15px; font-weight: 600; color: #191F28; margin-bottom: 6px;">${place.name}</div>
                <div style="font-size: 13px; color: #6B7280; margin-bottom: 4px;">📍 ${place.distanceM || 0}m</div>
                <div style="font-size: 12px; color: #9CA3AF; margin-bottom: 8px;">${place.address || ''}</div>
                ${place.url ? `<a href="${place.url}" target="_blank" style="display: inline-block; padding: 6px 12px; background: #002B7A; color: white; text-decoration: none; border-radius: 6px; font-size: 12px; font-weight: 500;">카카오맵에서 보기</a>` : ''}
            </div>
        `;

        const infoWindow = new window.kakao.maps.InfoWindow({
            content: content,
            removable: true
        });

        infoWindow.open(map, marker);
        infoWindowRef.current = infoWindow;
    };

    // 지도 중심 이동
    const panTo = (lat, lng) => {
        if (!map || !window.kakao) return;
        const moveLatLon = new window.kakao.maps.LatLng(lat, lng);
        map.panTo(moveLatLon);
    };

    return {
        mapRef,
        map,
        isLoading,
        error,
        addStoreMarker,
        updateCategoryMarkers,
        removeCategoryMarkers,
        clearAllCategoryMarkers,
        showInfoWindow,
        panTo
    };
};
