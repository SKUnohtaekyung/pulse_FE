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

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import KakaoMapContainer from './components/KakaoMapContainer';
import SummaryPanel from './components/SummaryPanel';
import SearchBar from './components/SearchBar';
import { AlertCircle, Loader2, MapPinOff, RefreshCw, Search } from 'lucide-react';
import { MOCK_STORE } from '../../data/marketMockData'; // 가게 좌표는 유지 (추후 API로 교체)
import { fetchRealMarketData } from './kakaoPlacesService';
import { fetchMyStoreInfo, fetchAiMarketingActions } from './api/mapInsightApi';
import { fetchLatestAnalysisData } from './api/analysisApi';
import { getLocalStoreProfile } from '../influencer/influencerMatchingUtils';
import { loadKakaoMapSDK } from '../../utils/kakaoMapLoader';
import { isCanceledError } from '../../utils/apiError';

function normalizeMarketError(error) {
    return {
        code: error?.code || 'unknown',
        title: error?.title || '상권 데이터를 불러오지 못했습니다',
        message: error?.message || '잠시 후 다시 시도해 주세요.',
        actionLabel: error?.actionLabel || '다시 시도',
    };
}

function EmptyReportPanel({ emptyState, onRadiusChange }) {
    return (
        <div className="h-full bg-[#F5F7FA] px-6 py-6">
            <div className="h-full bg-white border border-[#E5E8EB] rounded-xl flex flex-col items-center justify-center text-center px-8">
                <div className="w-14 h-14 rounded-full bg-[#002B7A1A] flex items-center justify-center mb-4">
                    <Search size={24} className="text-[#002B7A]" />
                </div>
                <h3 className="text-[18px] font-bold text-[#191F28] mb-2">
                    {emptyState?.title || '조회된 상권 데이터가 없습니다'}
                </h3>
                <p className="text-[14px] text-gray-600 leading-relaxed max-w-sm">
                    {emptyState?.message || '반경을 넓히거나 다른 장소를 검색해 주세요.'}
                </p>
                {emptyState?.suggestedRadius && (
                    <button
                        onClick={() => onRadiusChange(emptyState.suggestedRadius)}
                        className="mt-5 px-4 py-2.5 bg-[#002B7A] text-white rounded-lg text-[14px] font-bold hover:bg-[#001F5C] transition-colors"
                    >
                        {emptyState.actionLabel || '반경 넓히기'}
                    </button>
                )}
            </div>
        </div>
    );
}

export default function CommercialAnalysisPage() {
    const [radius, setRadius] = useState(500);
    const [map, setMap] = useState(null);
    const [analysisTarget, setAnalysisTarget] = useState(null);
    const [marketData, setMarketData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isKakaoReady, setIsKakaoReady] = useState(false);
    const [mapUnavailable, setMapUnavailable] = useState(false);
    const [isTargetReady, setIsTargetReady] = useState(false);
    const [actionsLoading, setActionsLoading] = useState(false);
    // 가게 좌표를 못 받아 예시 위치로 분석 중인지 여부
    const [isUsingSampleLocation, setIsUsingSampleLocation] = useState(false);
    // 진행 중인 조회를 식별해, 반경/장소가 바뀌면 이전 비동기 결과가 덮어쓰지 않도록 가드한다.
    const loadIdRef = useRef(0);

    // 카카오 SDK 로드
    // 예전에는 200ms 간격 재귀 setTimeout 으로 무한 폴링해, 로드가 실패하면
    // 스피너가 영원히 돌고 언마운트 후에도 setState 가 호출됐다.
    useEffect(() => {
        let cancelled = false;

        loadKakaoMapSDK()
            .then(() => {
                if (!cancelled) setIsKakaoReady(true);
            })
            .catch(() => {
                if (cancelled) return;
                // 지도를 못 써도 페이지 전체가 멈추지 않도록, 로딩을 끝내고 안내를 띄운다.
                setMapUnavailable(true);
                setIsLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (!isKakaoReady) return;

        let cancelled = false;

        const loadStoreTarget = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const store = await fetchMyStoreInfo();
                if (cancelled) return;

                const lat = Number(store.lat);
                const lng = Number(store.lng);
                const hasRealCoordinates = Number.isFinite(lat) && Number.isFinite(lng);

                // 좌표를 못 받으면 예시 위치로 화면을 채우되, "예시 데이터"임을 화면에 명시한다.
                setIsUsingSampleLocation(!hasRealCoordinates);
                setAnalysisTarget({
                    storeId: store.storeId || store.id || 'current-store',
                    storeName: hasRealCoordinates ? store.storeName : MOCK_STORE.storeName,
                    address: hasRealCoordinates ? store.address : MOCK_STORE.address,
                    lat: hasRealCoordinates ? lat : MOCK_STORE.lat,
                    lng: hasRealCoordinates ? lng : MOCK_STORE.lng,
                    primaryCategoryGroupCode: store.primaryCategoryGroupCode || 'FD6',
                });
                setIsTargetReady(true);
            } catch (err) {
                if (cancelled || isCanceledError(err)) return;
                setIsUsingSampleLocation(true);
                setAnalysisTarget(MOCK_STORE);
                setIsTargetReady(true);
            }
        };

        loadStoreTarget();

        return () => {
            cancelled = true;
        };
    }, [isKakaoReady]);

    // AI 마케팅 액션을 별도로(비동기) 조회해 리포트에 채워 넣는다.
    // 리포트 응답에는 actions가 비어 있으며, LLM 응답(수십 초)이 도착하면 점진적으로 표시된다.
    const loadAiActions = useCallback(async (report, loadId) => {
        if (!report || report.reportState !== 'ready') return;
        if (Array.isArray(report.actions) && report.actions.length > 0) return;

        setActionsLoading(true);
        try {
            // 우리 가게 정보 + 손님 페르소나 컨텍스트를 함께 보내 AI 액션을 가게 맞춤으로 생성한다.
            const store = getLocalStoreProfile();
            let personas = [];
            try {
                const analysis = await fetchLatestAnalysisData();
                personas = (analysis?.personas || []).slice(0, 3).map((persona) => ({
                    nickname: persona.nickname,
                    summary: persona.summary,
                    tags: persona.tags || [],
                }));
            } catch {
                /* 손님분석 결과가 없으면 페르소나 없이 진행 */
            }

            const actions = await fetchAiMarketingActions({
                latitude: report.center?.lat ?? analysisTarget?.lat,
                longitude: report.center?.lng ?? analysisTarget?.lng,
                radius: report.radius ?? radius,
                category: report.competition?.categoryGroupCode || analysisTarget?.primaryCategoryGroupCode || 'FD6',
                marketSummary: {
                    competitionTotal: report.competition?.total ?? 0,
                    densityPerKm2: report.competition?.densityPerKm2 ?? 0,
                    anchorScore: report.anchors?.score ?? 0,
                    anchorType: report.anchors?.typeLabel ?? '',
                },
                storeName: store.storeName,
                storeCategory: store.category,
                storeAddress: store.location,
                personas,
            });

            // 응답이 도착하는 사이 반경/장소가 바뀌었다면 무시한다.
            if (loadIdRef.current !== loadId) return;
            setMarketData((prev) => (prev ? { ...prev, actions } : prev));
        } catch (actionError) {
            // AI 액션은 보조 정보다. 실패해도 리포트 본문은 그대로 유지한다.
            if (import.meta.env.DEV && !isCanceledError(actionError)) {
                console.warn('[CommercialAnalysis] AI 액션을 불러오지 못했습니다.', actionError);
            }
        } finally {
            if (loadIdRef.current === loadId) setActionsLoading(false);
        }
    }, [radius, analysisTarget]);

    // 실제 상권 데이터 조회
    const loadMarketData = useCallback(async () => {
        if (!isKakaoReady || !isTargetReady || !analysisTarget) return;

        const loadId = ++loadIdRef.current;
        setIsLoading(true);
        setActionsLoading(false);
        setError(null);

        try {
            console.log(`📊 카카오 Places API 조회 중... 반경 ${radius}m`);
            const data = await fetchRealMarketData(
                { lat: analysisTarget.lat, lng: analysisTarget.lng },
                radius,
                analysisTarget.primaryCategoryGroupCode
            );
            if (loadIdRef.current !== loadId) return;
            setMarketData(data);
            console.log('✅ 실제 상권 데이터 로드 완료:', data);
            // 리포트는 즉시 렌더하고, AI 액션은 백그라운드로 채운다.
            loadAiActions(data, loadId);
        } catch (err) {
            console.error('[CommercialAnalysis] 데이터 조회 실패:', err);
            if (loadIdRef.current !== loadId) return;
            setMarketData(null);
            setError(normalizeMarketError(err));
        } finally {
            if (loadIdRef.current === loadId) setIsLoading(false);
        }
    }, [radius, isKakaoReady, isTargetReady, analysisTarget, loadAiActions]);

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
        const lat = parseFloat(place?.y);
        const lng = parseFloat(place?.x);

        // 좌표를 못 읽으면 지도를 NaN 위치로 옮겨 뷰가 깨진다. 먼저 막는다.
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
            setError({
                code: 'invalid_coordinates',
                title: '선택한 장소의 위치를 확인하지 못했어요',
                message: '다른 장소를 검색해 주세요.',
                actionLabel: '다시 시도',
            });
            return;
        }

        const nextTarget = {
            storeId: place.id || `place-${place.y}-${place.x}`,
            storeName: place.place_name || '선택한 장소',
            address: place.road_address_name || place.address_name || '',
            lat,
            lng,
            primaryCategoryGroupCode: analysisTarget?.primaryCategoryGroupCode || 'FD6',
        };

        setError(null);
        setAnalysisTarget(nextTarget);

        if (map && window.kakao?.maps?.LatLng) {
            map.panTo(new window.kakao.maps.LatLng(lat, lng));
        }
    };

    // 새로고침
    const handleRefresh = () => {
        loadMarketData();
    };

    const handleErrorAction = () => {
        if (error?.code === 'invalid_radius') {
            setRadius(500);
            return;
        }

        loadMarketData();
    };

    // 매 렌더마다 새 객체를 만들면 지도 훅이 원(Circle)과 줌 레벨을 계속 초기화해,
    // 사용자가 확대·축소한 상태가 곧바로 되돌아간다.
    const center = useMemo(
        () => (analysisTarget
            ? { lat: analysisTarget.lat, lng: analysisTarget.lng }
            : { lat: MOCK_STORE.lat, lng: MOCK_STORE.lng }),
        [analysisTarget],
    );
    const isEmptyReport = marketData?.reportState === 'empty';

    // 지도를 아예 쓸 수 없는 경우 — 페이지 전체를 막지 않고 안내만 보여준다.
    if (mapUnavailable) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-white rounded-[24px] border border-[#E5E8EB] shadow-sm p-8 text-center" role="alert">
                <div className="w-14 h-14 rounded-full bg-[#F5F7FA] flex items-center justify-center">
                    <MapPinOff size={24} className="text-[#94A3B8]" aria-hidden="true" />
                </div>
                <h3 className="text-[18px] font-bold text-[#191F28] break-keep">지도를 불러오지 못했어요</h3>
                <p className="text-[14px] text-gray-600 max-w-sm break-keep">
                    잠시 후 다시 시도해 주세요. 문제가 계속되면 네트워크 상태를 확인해 주세요.
                </p>
                <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="mt-2 px-5 py-2.5 bg-[#002B7A] text-white rounded-lg text-[14px] font-bold hover:bg-[#001F5C] transition-colors
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                    다시 시도
                </button>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col gap-0 bg-white rounded-[24px] overflow-hidden border border-[#E5E8EB] shadow-sm relative">
            {/* 예시 위치로 분석 중임을 명시한다 — 다른 동네 리포트를 내 가게 분석으로 오인하지 않도록 */}
            {isUsingSampleLocation && !isLoading && (
                <div className="shrink-0 flex items-start gap-2 px-5 py-3 bg-point-bg border-b border-[#FFE5DF]" role="status">
                    <AlertCircle size={16} className="text-point shrink-0 mt-[2px]" aria-hidden="true" />
                    <p className="text-[13px] text-[#191F28] leading-snug break-keep">
                        가게 위치를 확인하지 못해 <b>예시 지역</b>으로 분석 중이에요. 상단 검색창에서 우리 가게를 찾아 주세요.
                    </p>
                </div>
            )}

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
                <div className="absolute top-0 right-0 bottom-0 w-[40%] bg-white flex flex-col items-center justify-center z-50 rounded-r-[24px] p-8 border-l border-[#E5E8EB]">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle size={32} className="text-red-500" />
                    </div>
                    <h3 className="text-[18px] font-bold text-[#191F28] mb-2 break-keep">{error.title}</h3>
                    <p className="text-[14px] text-gray-600 text-center max-w-md mb-5 leading-relaxed break-keep">
                        {error.message}
                    </p>
                    <button
                        type="button"
                        onClick={handleErrorAction}
                        className="px-4 py-2 bg-[#002B7A] text-white rounded-lg text-sm font-bold hover:bg-[#001F5C] transition-colors
                                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                        {error.actionLabel}
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
                            center={center}
                            onSearch={handleSearch}
                        />
                    </div>

                    <KakaoMapContainer
                        center={center}
                        radius={radius}
                        onRadiusChange={handleRadiusChange}
                        storeName={analysisTarget?.storeName || MOCK_STORE.storeName}
                        onMapReady={handleMapReady}
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
                            <p className="text-[12px] text-gray-500 mt-1">
                                {analysisTarget?.storeName || MOCK_STORE.storeName} 기준
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
                        {marketData && !isLoading && isEmptyReport && (
                            <EmptyReportPanel
                                emptyState={marketData.emptyState}
                                onRadiusChange={handleRadiusChange}
                            />
                        )}
                        {marketData && !isLoading && !isEmptyReport && (
                            <SummaryPanel
                                data={marketData}
                                onPlaceClick={handlePlaceClick}
                                actionsLoading={actionsLoading}
                                showHeader={false}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
