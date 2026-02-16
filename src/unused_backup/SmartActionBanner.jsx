import React from 'react';
import { ArrowUpRight, PlayCircle, Sparkles, Video } from 'lucide-react';

export default function SmartActionBanner({ selectedPersona, onAction }) {
    return (
        <div className="bg-[#191F28] rounded-[32px] p-8 lg:p-10 text-white flex flex-col items-center text-center shadow-2xl relative overflow-hidden group cursor-pointer border border-white/5"
            onClick={onAction}
        >
            {/* Ambient Background Effects */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF5A36] rounded-full blur-[120px] opacity-20 group-hover:opacity-30 transition-opacity duration-700" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#002B7A] rounded-full blur-[100px] opacity-30 group-hover:opacity-40 transition-opacity duration-700" />

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />

            {/* Content Container */}
            <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto">
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold text-[#FF5A36] mb-6 shadow-lg">
                    <Sparkles size={12} fill="currentColor" />
                    <span>AI Action Proposal</span>
                </div>

                {/* Dynamic Title */}
                <h3 className="text-3xl lg:text-4xl font-extrabold mb-4 leading-tight tracking-tight">
                    {selectedPersona ? (
                        <>
                            <span className="text-[#FF5A36]">{selectedPersona.nickname}님</span>을 위한<br />
                            <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">취향 저격 영상</span>을 만들까요?
                        </>
                    ) : (
                        <>
                            <span className="text-[#FF5A36]">우리 가게 손님</span>을 사로잡을<br />
                            <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">맞춤형 홍보 영상</span>을 만들까요?
                        </>
                    )}
                </h3>

                {/* Subtitle */}
                <p className="text-white/60 text-base lg:text-lg mb-8 leading-relaxed">
                    분석된 <strong>{selectedPersona ? '방문 여정 데이터' : '상권 및 손님 데이터'}</strong>를 바탕으로<br className="lg:hidden" />
                    AI가 대본부터 영상 편집까지 <strong>1분 만에 완성</strong>해 드립니다.
                </p>

                {/* Action Button */}
                <button
                    className="group/btn relative px-8 py-4 bg-[#FF5A36] hover:bg-[#FF4520] text-white rounded-full font-bold text-lg shadow-xl shadow-[#FF5A36]/30 hover:shadow-[#FF5A36]/50 hover:-translate-y-1 transition-all overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
                    <div className="relative flex items-center gap-2.5">
                        <PlayCircle size={24} fill="currentColor" className="text-white" />
                        <span>지금 바로 생성하기</span>
                        <ArrowUpRight size={20} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    </div>
                </button>

                {/* Footer Note */}
                <div className="mt-6 flex items-center gap-2 text-xs text-white/30 font-medium">
                    <Video size={12} />
                    <span>Generate Unlimited FHD Videos</span>
                </div>
            </div>
        </div>
    );
}
