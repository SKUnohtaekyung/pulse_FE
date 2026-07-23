/**
 * SearchBar Component
 * 지도 상단 검색 바 - 주소/장소명 검색 및 자동완성
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AlertCircle, Search, X, Loader2 } from 'lucide-react';
import { searchPlacesByKeyword } from '../api/kakaoLocal';
import { getErrorMessage, isCanceledError } from '../../../utils/apiError';
import { toArray } from '../../../utils/safeFormat';

export default function SearchBar({ center, onSearch }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [searchError, setSearchError] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef(null);
    const dropdownRef = useRef(null);
    // 응답 순서가 뒤바뀌어 오래된 결과가 최신 검색을 덮어쓰지 않도록 순번을 둔다.
    const requestIdRef = useRef(0);
    // 결과를 골라 query 를 채운 경우, 디바운스 effect 가 드롭다운을 다시 열지 않게 한다.
    const skipNextSearchRef = useRef(false);

    // 검색 API 호출
    const handleSearch = useCallback(async (searchQuery) => {
        if (!searchQuery.trim()) {
            setResults([]);
            setShowResults(false);
            setSearchError(null);
            return;
        }

        requestIdRef.current += 1;
        const requestId = requestIdRef.current;
        const isStale = () => requestId !== requestIdRef.current;

        setIsSearching(true);
        setSearchError(null);
        try {
            const data = await searchPlacesByKeyword(center.lat, center.lng, 20000, searchQuery);
            if (isStale()) return;
            setResults(toArray(data?.documents));
            setShowResults(true);
            setSelectedIndex(-1);
        } catch (error) {
            if (isStale() || isCanceledError(error)) return;
            // 실패와 "결과 없음"을 구분한다. (예전에는 오류도 "검색 결과가 없습니다"로 보였다)
            setResults([]);
            setShowResults(true);
            setSearchError(getErrorMessage(error, '검색에 실패했어요. 잠시 후 다시 시도해 주세요.'));
        } finally {
            if (!isStale()) setIsSearching(false);
        }
    }, [center.lat, center.lng]);

    // 디바운스 검색
    useEffect(() => {
        if (skipNextSearchRef.current) {
            skipNextSearchRef.current = false;
            return undefined;
        }

        const timer = setTimeout(() => {
            if (query) {
                handleSearch(query);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query, handleSearch]);

    // 검색 결과 선택
    const handleSelectResult = (place) => {
        skipNextSearchRef.current = true;
        onSearch(place);
        setQuery(place.place_name || '');
        setShowResults(false);
        setSearchError(null);
        inputRef.current?.blur();
    };

    // 키보드 네비게이션
    const handleKeyDown = (e) => {
        if (!showResults || results.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev < results.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && results[selectedIndex]) {
                    handleSelectResult(results[selectedIndex]);
                } else if (results.length > 0) {
                    handleSelectResult(results[0]);
                }
                break;
            case 'Escape':
                setShowResults(false);
                inputRef.current?.blur();
                break;
        }
    };

    // 외부 클릭 감지
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} className="relative w-[400px]">
            {/* 검색 입력 */}
            <div className="relative">
                <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => query && setShowResults(true)}
                    placeholder="주소 또는 장소명 검색"
                    className="w-full h-12 pl-11 pr-11 bg-white border border-[#E5E8EB] rounded-xl text-[14px] font-medium text-[#191F28] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#002B7A] focus:border-transparent shadow-lg transition-all"
                    aria-label="장소 검색"
                />

                {/* 로딩 또는 클리어 버튼 */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {isSearching ? (
                        <Loader2 size={18} className="text-[#002B7A] animate-spin" />
                    ) : query ? (
                        <button
                            onClick={() => {
                                setQuery('');
                                setResults([]);
                                setShowResults(false);
                                inputRef.current?.focus();
                            }}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="검색어 지우기"
                        >
                            <X size={18} />
                        </button>
                    ) : null}
                </div>
            </div>

            {/* 검색 실패 — 결과 없음과 구분해서 재시도 경로를 제공한다 */}
            {showResults && searchError && (
                <div className="absolute top-full mt-2 w-full bg-white border border-[#E5E8EB] rounded-xl shadow-xl p-4 z-25" role="alert">
                    <div className="flex items-start gap-2">
                        <AlertCircle size={16} className="text-point shrink-0 mt-[2px]" aria-hidden="true" />
                        <div className="flex-1">
                            <p className="text-[14px] text-[#191F28] break-keep">{searchError}</p>
                            <button
                                type="button"
                                onClick={() => handleSearch(query)}
                                className="mt-2 text-[13px] font-bold text-[#002B7A] underline underline-offset-2 rounded
                                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            >
                                다시 검색
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 검색 결과 드롭다운 */}
            {showResults && !searchError && results.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white border border-[#E5E8EB] rounded-xl shadow-xl overflow-hidden z-25 max-h-[300px] overflow-y-auto">
                    {results.map((place, index) => (
                        <button
                            key={place.id}
                            onClick={() => handleSelectResult(place)}
                            className={`w-full px-4 py-3 text-left hover:bg-[#F5F7FA] transition-colors border-b border-gray-100 last:border-b-0 ${index === selectedIndex ? 'bg-[#F5F7FA]' : ''
                                }`}
                            role="option"
                            aria-selected={index === selectedIndex}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <p className="text-[14px] font-medium text-[#191F28] truncate">
                                        {place.place_name}
                                    </p>
                                    <p className="text-[13px] text-gray-600 truncate mt-0.5">
                                        {place.road_address_name || place.address_name}
                                    </p>
                                </div>
                                {place.distance && (
                                    <span className="text-[12px] text-[#002B7A] font-medium whitespace-nowrap">
                                        {parseInt(place.distance) >= 1000
                                            ? `${(parseInt(place.distance) / 1000).toFixed(1)}km`
                                            : `${place.distance}m`
                                        }
                                    </span>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* 검색 결과 없음 */}
            {showResults && !isSearching && !searchError && query && results.length === 0 && (
                <div className="absolute top-full mt-2 w-full bg-white border border-[#E5E8EB] rounded-xl shadow-xl p-4 z-25">
                    <p className="text-[14px] text-gray-600 text-center break-keep">
                        검색 결과가 없어요. 지역명이나 가게 이름을 다르게 입력해 보세요.
                    </p>
                </div>
            )}
        </div>
    );
}
