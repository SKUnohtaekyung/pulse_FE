/**
 * CommercialAnalysisPage Component
 * 주변 상권 분석 페이지 - Kakao Map 기반 (독립 페이지)
 * Mock 데이터 사용
 */

import React, { useState, useEffect } from 'react';
import KakaoMapContainer from './components/KakaoMapContainer';
import SummaryPanel from './components/SummaryPanel';
import SearchBar from './components/SearchBar';
import { RefreshCw } from 'lucide-react';
import { MOCK_STORE, MOCK_MARKET_SUMMARY_BY_RADIUS, MOCK_CATEGORY_PLACES } from '../../data/marketMockData';

export default function CommercialAnalysisPage() {
    const [radius, setRadius] = useState(500);
    const [map, setMap] = useState(null);
    const [marketData, setMarketData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Mock 데이터 로드 (API 호출 대신)
    useEffect(() => {
        console.log('📊 Mock 데이터 로드 중...', { radius });

        // 약간의 로딩 시뮬레이션
        setIsLoading(true);
        setTimeout(() => {
            const data = MOCK_MARKET_SUMMARY_BY_RADIUS[radius];
            setMarketData(data);
            setIsLoading(false);
            console.log('✅ Mock 데이터 로드 완료:', data);
        }, 300);
    }, [radius]);

    // 반경 변경 핸들러
    const handleRadiusChange = (newRadius) => {
        console.log('🔄 반경 변경:', newRadius);
        setRadius(newRadius);
    };

    // 지도 준비 완료 핸들러
    const handleMapReady = (mapInstance) => {
        console.log('✅ 지도 준비 완료');
        setMap(mapInstance);
    };

    // 경쟁 업소 클릭 핸들러 (지도 중심 이동)
    const handlePlaceClick = (place) => {
        console.log('📍 경쟁 업소 클릭:', place.name);
        if (map && window.kakao) {
            const moveLatLon = new window.kakao.maps.LatLng(place.lat, place.lng);
            map.panTo(moveLatLon);
        }
    };

    // 카테고리 데이터 준비 (Mock 데이터 사용)
    const prepareCategoryData = () => {
        console.log('📊 Mock 카테고리 데이터 준비:', MOCK_CATEGORY_PLACES);
        return MOCK_CATEGORY_PLACES;
    };

    // 새로고침 핸들러
    const handleRefresh = () => {
        console.log('🔄 데이터 새로고침');
        setIsLoading(true);
        setTimeout(() => {
            const data = MOCK_MARKET_SUMMARY_BY_RADIUS[radius];
            setMarketData(data);
            setIsLoading(false);
            console.log('✅ 새로고침 완료');
        }, 500);
    };

    // 검색 핸들러
    const handleSearch = (place) => {
        if (map && window.kakao) {
            const newCenter = new window.kakao.maps.LatLng(
                parseFloat(place.y),
                parseFloat(place.x)
            );
            map.panTo(newCenter);
            console.log('🔍 검색 결과로 이동:', place.place_name);
        }
    };


    return (
        <div className="w-full h-full flex flex-col gap-0 bg-white rounded-[24px] overflow-hidden border border-[#E5E8EB] shadow-sm relative">
            {/* 로딩 상태 */}
            {isLoading && (
                <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-50 rounded-[24px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002B7A] mx-auto mb-4"></div>
                        <p className="text-[#002B7A] font-medium text-[16px]">상권 데이터 분석 중...</p>
                        <p className="text-gray-500 text-[14px] mt-2">반경 {radius}m 내 업소 정보 수집</p>
                    </div>
                </div>
            )}

            {/* 전체 영역: 지도 + 패널 */}
            <div className="flex-1 flex gap-0 min-h-0">
                {/* 좌측: 지도 (60%) - 전체 높이 */}
                <div className="w-[60%] h-full relative">
                    {/* 검색 바 (지도 위 오버레이) */}
                    <div className="absolute top-4 left-4 z-20 w-[400px]">
                        <SearchBar
                            center={{ lat: MOCK_STORE.lat, lng: MOCK_STORE.lng }}
                            onSearch={handleSearch}
                        />
                    </div>

                    <KakaoMapContainer
                        center={{ lat: MOCK_STORE.lat, lng: MOCK_STORE.lng }}
                        radius={radius}
                        onRadiusChange={handleRadiusChange}
                        storeName={MOCK_STORE.storeName}
                        onMapReady={handleMapReady}
                        categoryData={prepareCategoryData()}
                    />
                </div>

                {/* 우측: 요약 패널 (40%) - 헤더 포함 */}
                <div className="w-[40%] h-full flex flex-col">
                    {/* 리포트 헤더 */}
                    <div className="bg-[#F5F7FA] px-6 py-4 border-b border-[#E5E8EB] flex items-center justify-between flex-shrink-0">
                        <div>
                            <h2 className="text-[20px] font-bold text-[#002B7A]">상권 분석 리포트</h2>
                            <p className="text-[14px] text-gray-600 mt-1">
                                {marketData && new Date(marketData.generatedAt).toLocaleDateString('ko-KR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })} 기준
                            </p>
                        </div>

                        {/* 새로고침 버튼 */}
                        <button
                            onClick={handleRefresh}
                            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#E5E8EB] rounded-lg hover:bg-gray-50 hover:border-[#002B7A] transition-all group"
                            title="데이터 새로고침"
                        >
                            <RefreshCw size={14} className="text-gray-600 group-hover:text-[#002B7A] transition-colors" />
                            <span className="text-[13px] font-medium text-gray-700 group-hover:text-[#002B7A]">새로고침</span>
                        </button>
                    </div>

                    {/* 패널 콘텐츠 */}
                    <div className="flex-1 min-h-0">
                        {marketData && (
                            <SummaryPanel
                                data={marketData}
                                onPlaceClick={handlePlaceClick}
                                showHeader={false}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
