/**
 * SearchBar Component
 * 지도 상단 검색 바 - 주소/장소명 검색 및 자동완성
 */

import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';

export default function SearchBar({ center, onSearch }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef(null);
    const dropdownRef = useRef(null);

    // 검색 API 호출
    const handleSearch = async (searchQuery) => {
        if (!searchQuery.trim()) {
            setResults([]);
            setShowResults(false);
            return;
        }

        setIsSearching(true);
        try {
            const params = new URLSearchParams({
                query: searchQuery,
                x: center.lng.toString(),
                y: center.lat.toString(),
                size: '5',
                sort: 'distance'
            });

            const response = await fetch(
                `https://dapi.kakao.com/v2/local/search/keyword.json?${params}`,
                {
                    headers: {
                        Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}`
                    }
                }
            );

            const data = await response.json();
            setResults(data.documents || []);
            setShowResults(true);
            setSelectedIndex(-1);
        } catch (error) {
            console.error('❌ 검색 실패:', error);
            setResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    // 디바운스 검색
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query) {
                handleSearch(query);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    // 검색 결과 선택
    const handleSelectResult = (place) => {
        onSearch(place);
        setQuery(place.place_name);
        setShowResults(false);
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

            {/* 검색 결과 드롭다운 */}
            {showResults && results.length > 0 && (
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
            {showResults && !isSearching && query && results.length === 0 && (
                <div className="absolute top-full mt-2 w-full bg-white border border-[#E5E8EB] rounded-xl shadow-xl p-4 z-25">
                    <p className="text-[14px] text-gray-600 text-center">
                        검색 결과가 없습니다
                    </p>
                </div>
            )}
        </div>
    );
}
