/**
 * CommercialAnalysisPage Component
 * 주변 상권 분석 페이지 - Kakao Places API 실제 데이터 사용
 *
 * 실시간으로 조회되는 데이터:
 *   - 반경 내 업종별 개수 (음식점, 카페, 편의점, 병원 등)
 *   - 경쟁 업소 목록 (거리 오름차순)
 *   - 앵커 타입 판별 (역세권, 학원가, 의료상권 등)
 *   - 카테고리별 지도 마커
 *
 * 백엔드 필요 데이터 (현재 미표시):
 *   - AI 액션 추천
 *   - 유동인구 분석
 */

import React, { useState, useEffect, useCallback } from 'react';
import KakaoMapContainer from './components/KakaoMapContainer';
import SummaryPanel from './components/SummaryPanel';
import SearchBar from './components/SearchBar';
import { RefreshCw, Loader2 } from 'lucide-react';
import { MOCK_STORE } from '../../data/marketMockData'; // 가게 좌표는 유지 (추후 API로 교체)
import { fetchRealMarketData } from './kakaoPlacesService';

export default function CommercialAnalysisPage() {
    const [radius, setRadius] = useState(500);
    const [map, setMap] = useState(null);
    const [marketData, setMarketData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isKakaoReady, setIsKakaoReady] = useState(false);

    // 카카오 SDK 로드 대기
    useEffect(() => {
        const checkKakao = () => {
            if (window.kakao?.maps?.services) {
                setIsKakaoReady(true);
            } else {
                setTimeout(checkKakao, 200);
            }
        };
        checkKakao();
    }, []);

    // 실제 상권 데이터 조회
    const loadMarketData = useCallback(async () => {
        if (!isKakaoReady) return;

        setIsLoading(true);
        setError(null);

        try {
            console.log(`📊 카카오 Places API 조회 중... 반경 ${radius}m`);
            const data = await fetchRealMarketData(
                { lat: MOCK_STORE.lat, lng: MOCK_STORE.lng },
                radius,
                MOCK_STORE.primaryCategoryGroupCode
            );
            setMarketData(data);
            console.log('✅ 실제 상권 데이터 로드 완료:', data);
        } catch (err) {
            console.error('[CommercialAnalysis] 데이터 조회 실패:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [radius, isKakaoReady]);

    // 반경 변경 또는 카카오 준비 완료 시 재조회
    useEffect(() => {
        loadMarketData();
    }, [loadMarketData]);

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

    // 경쟁 업소 클릭 시 지도 이동
    const handlePlaceClick = (place) => {
        if (map && window.kakao) {
            const moveLatLon = new window.kakao.maps.LatLng(place.lat, place.lng);
            map.panTo(moveLatLon);
        }
    };

    // 검색 이동
    const handleSearch = (place) => {
        if (map && window.kakao) {
            map.panTo(new window.kakao.maps.LatLng(parseFloat(place.y), parseFloat(place.x)));
        }
    };

    // 새로고침
    const handleRefresh = () => {
        loadMarketData();
    };

    // 카테고리 데이터 (지도 마커용)
    const categoryData = marketData?._categoryPlaces || {};

    return (
        <div className="w-full h-full flex flex-col gap-0 bg-white rounded-[24px] overflow-hidden border border-[#E5E8EB] shadow-sm relative">
            {/* 로딩 상태 */}
            {isLoading && (
                <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-50 rounded-[24px]">
                    <div className="text-center">
                        <Loader2 size={40} className="text-[#002B7A] animate-spin mx-auto mb-4" />
                        <p className="text-[#002B7A] font-medium text-[16px]">상권 데이터 분석 중...</p>
                        <p className="text-gray-500 text-[14px] mt-2">반경 {radius}m 내 업소 정보 수집</p>
                    </div>
                </div>
            )}

            {/* 오류 상태 */}
            {!isLoading && error && (
                <div className="absolute inset-0 bg-white flex flex-col items-center justify-center z-50 rounded-[24px] p-8">
                    <p className="text-red-500 font-bold mb-4">⚠️ {error}</p>
                    <button
                        onClick={handleRefresh}
                        className="px-4 py-2 bg-[#002B7A] text-white rounded-lg text-sm font-bold hover:bg-[#001F5C]"
                    >
                        다시 시도
                    </button>
                </div>
            )}

            {/* 전체 영역: 지도 + 패널 */}
            <div className="flex-1 flex gap-0 min-h-0">
                {/* 좌측: 지도 (60%) */}
                <div className="w-[60%] h-full relative">
                    {/* 검색 바 */}
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
                        categoryData={categoryData}
                    />
                </div>

                {/* 우측: 요약 패널 (40%) */}
                <div className="w-[40%] h-full flex flex-col">
                    {/* 리포트 헤더 */}
                    <div className="bg-[#F5F7FA] px-6 py-4 border-b border-[#E5E8EB] flex items-center justify-between flex-shrink-0">
                        <div>
                            <h2 className="text-[20px] font-bold text-[#002B7A]">상권 분석 리포트</h2>
                            <p className="text-[14px] text-gray-600 mt-1">
                                {marketData
                                    ? new Date(marketData.generatedAt).toLocaleDateString('ko-KR', {
                                        year: 'numeric', month: 'long', day: 'numeric'
                                    }) + ' 기준 (실시간)'
                                    : '조회 중...'}
                            </p>
                        </div>
                        <button
                            onClick={handleRefresh}
                            disabled={isLoading}
                            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#E5E8EB] rounded-lg hover:bg-gray-50 hover:border-[#002B7A] transition-all group disabled:opacity-50"
                            title="데이터 새로고침"
                        >
                            <RefreshCw size={14} className={`text-gray-600 group-hover:text-[#002B7A] transition-colors ${isLoading ? 'animate-spin' : ''}`} />
                            <span className="text-[13px] font-medium text-gray-700 group-hover:text-[#002B7A]">새로고침</span>
                        </button>
                    </div>

                    {/* 패널 콘텐츠 */}
                    <div className="flex-1 min-h-0">
                        {marketData && !isLoading && (
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
