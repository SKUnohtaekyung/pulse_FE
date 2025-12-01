import React, { useState } from 'react';
import VideoCreator from './VideoCreator';
import GalleryPage from './GalleryPage';

export default function PromotionPage({ initialParams }) {
    const [viewMode, setViewMode] = useState('split'); // 'split' | 'gallery'
    const [images, setImages] = useState([]);
    const [options, setOptions] = useState({ vibe: 'energetic', title: '', prompt: '' });

    const [step, setStep] = useState('input'); // 'input' | 'loading' | 'result'
    const [resultData, setResultData] = useState(null);

    // Handle initial params from navigation
    React.useEffect(() => {
        if (initialParams) {
            setOptions(prev => ({
                ...prev,
                vibe: initialParams.vibe || 'energetic',
                title: initialParams.title || '', // Pre-fill result title
                prompt: initialParams.title || '' // Pre-fill prompt with the same context
            }));
        }
    }, [initialParams]);

    const handleGenerate = () => {
        setStep('loading');
        // Simulate AI Generation
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
        }, 5500);
    };

    const handleReset = () => {
        setStep('input');
        setImages([]);
        setResultData(null);
    };

    if (viewMode === 'gallery') {
        return <GalleryPage onBack={() => setViewMode('split')} />;
    }

    return (
        <div className="flex h-full gap-4 animate-in fade-in duration-500 min-h-0">
            {/* Main Creator Area (Full Width) */}
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
