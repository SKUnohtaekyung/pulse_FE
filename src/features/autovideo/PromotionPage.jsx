import React, { useState } from 'react';
import VideoCreator from './VideoCreator';
import GalleryPage from './GalleryPage';

/**
 * [PromotionPage] 홍보 영상 제작 메인 페이지 컴포넌트
 * 
 * @description
 * 사용자가 홍보 영상을 제작하는 전체 프로세스를 관리하는 컨테이너 컴포넌트입니다.
 * 화면 모드(분할 뷰 / 갤러리 뷰)를 전환하며, 영상 생성 상태를 관리합니다.
 * 
 * 주요 역할:
 * 1. 화면 모드 관리 (split: 제작 뷰, gallery: 갤러리 뷰)
 * 2. 영상 제작 단계 관리 (input → loading → result)
 * 3. 사용자 입력 데이터 관리 (이미지, 옵션)
 * 4. AI 생성 시뮬레이션 관리
 */
export default function PromotionPage() {
    // ============================================
    // 1. 화면 모드 관리
    // ============================================
    const [viewMode, setViewMode] = useState('split'); // 'split' | 'gallery'

    // ============================================
    // 2. 사용자 입력 데이터 관리
    // ============================================
    const [images, setImages] = useState([]); // 업로드된 이미지 배열
    const [options, setOptions] = useState({
        vibe: 'energetic', // 선택된 분위기 스타일 (energetic, luxury, emotional)
        title: '' // 영상 제목
    });

    // ============================================
    // 3. 영상 제작 상태 관리
    // ============================================
    const [step, setStep] = useState('input'); // 'input' | 'loading' | 'result'
    const [resultData, setResultData] = useState(null); // 생성된 영상 데이터

    // ============================================
    // 4. 이벤트 핸들러
    // ============================================

    /**
     * [handleGenerate] 영상 생성 시작 핸들러
     * 
     * @description
     * '영상 생성하기' 버튼 클릭 시 실행됩니다.
     * 로딩 화면으로 전환하고, 5.5초 후 결과 화면으로 이동합니다.
     * 
     * 로직:
     * - 5500ms 타임아웃은 VideoCreator의 LOADING_DURATION(8000ms)과 동기화되어
     *   진행률 바가 100%에 도달한 후 화면이 전환되도록 보정합니다.
     */
    const handleGenerate = () => {
        setStep('loading');

        // AI 영상 생성 시뮬레이션 (실제 구현 시 API 호출로 대체)
        setTimeout(() => {
            setResultData({
                videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-coffee-pouring-into-a-cup-in-slow-motion-4288-large.mp4',
                recommendedTitles: [
                    '☕️ 시그니처 라떼의 유혹',
                    '달콤한 오후의 휴식, 라떼 한 잔',
                    '오늘의 커피는 이걸로 정했다!',
                    '라떼 아트가 예술이네 ✨'
                ]
            });
            setStep('result');
        }, 5500); // VideoCreator의 로딩 애니메이션 완료 대기
    };

    /**
     * [handleReset] 초기화 핸들러
     * 
     * @description
     * '다시 만들기' 버튼 클릭 시 모든 상태를 초기화하고 입력 단계로 되돌립니다.
     */
    const handleReset = () => {
        setStep('input');
        setImages([]);
        setResultData(null);
    };

    // ============================================
    // 5. 렌더링 로직
    // ============================================

    // 갤러리 모드: GalleryPage 컴포넌트 렌더링
    if (viewMode === 'gallery') {
        return <GalleryPage onBack={() => setViewMode('split')} />;
    }

    // 분할 모드: VideoCreator 컴포넌트 렌더링
    return (
        <div className="flex h-full gap-4 animate-in fade-in duration-500 min-h-0">
            {/* VideoCreator: 영상 제작 메인 UI */}
            <VideoCreator
                step={step}
                resultData={resultData}
                onReset={handleReset}
                images={images}
                setImages={setImages}
                options={options}
                setOptions={setOptions}
                onGenerate={handleGenerate}
            />
        </div>
    );
}
