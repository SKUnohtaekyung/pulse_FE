import React, { useEffect, useState } from 'react';
import { X, Send } from 'lucide-react';

export default function SentRequestsModal({ onClose }) {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        try {
            const stored = JSON.parse(localStorage.getItem('sentInfluencerRequests') || '[]');
            setRequests(stored);
        } catch (error) {
            console.error('Failed to load sent requests', error);
        }
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[24px] max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col relative">

                {/* Header */}
                <div className="p-6 border-b border-[#F2F4F6] flex justify-between items-center bg-white sticky top-0 z-10">
                    <h2 className="text-[20px] font-bold text-[#191F28] flex items-center gap-2">
                        <Send size={20} className="text-[#002B7A]" />
                        제안 메시지 보관함
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-[#F2F4F6] rounded-full transition-colors text-[#8B95A1] hover:text-[#191F28]"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto bg-[#F9FAFB] flex-1">
                    {requests.length === 0 ? (
                        <div className="py-20 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-[#E8F3FF] text-[#002B7A] rounded-full flex items-center justify-center mb-4 shadow-sm border-2 border-white">
                                <Send size={24} />
                            </div>
                            <h3 className="text-[16px] font-bold text-[#333D4B] mb-2">아직 보낸 제안이 없습니다</h3>
                            <p className="text-[14px] text-[#8B95A1] leading-relaxed">
                                마음에 드는 인플루언서에게 먼저 제안을 보내보세요.<br />
                                먼저 다가갈수록 매칭 확률이 높아집니다.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {requests.map((req) => (
                                <div key={req.id} className="bg-white rounded-[16px] p-5 border border-[#E5E8EB] shadow-sm flex flex-col gap-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full overflow-hidden border border-[#F2F4F6] shadow-sm">
                                                <img src={req.influencerImage} alt={req.influencerName} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span className="font-bold text-[#191F28] text-[15px]">{req.influencerName}</span>
                                                    <span className="px-2 py-0.5 bg-[#F2F4F6] text-[#505967] text-[11px] font-bold rounded-md">
                                                        {req.type}
                                                    </span>
                                                </div>
                                                <div className="text-[12px] text-[#8B95A1]">연락처: {req.contact}</div>
                                            </div>
                                        </div>
                                        <div className="text-[13px] text-[#8B95A1] font-medium bg-[#F9FAFB] px-2.5 py-1 rounded-lg">
                                            {formatDate(req.sentAt)}
                                        </div>
                                    </div>

                                    <div className="bg-[#F9FAFB] p-4 rounded-xl text-[13px] text-[#4B5563] leading-relaxed border border-[#F2F4F6] whitespace-pre-line overflow-hidden w-full relative">
                                        <div className="line-clamp-2">
                                            {req.message}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
