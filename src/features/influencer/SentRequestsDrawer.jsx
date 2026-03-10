import React, { useEffect, useState } from 'react';
import { X, Send } from 'lucide-react';

export default function SentRequestsDrawer({ isOpen, onClose }) {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        if (isOpen) {
            try {
                const stored = JSON.parse(localStorage.getItem('sentInfluencerRequests') || '[]');
                setRequests(stored);
            } catch (error) {
                console.error('Failed to load sent requests', error);
            }
        }
    }, [isOpen]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onClick={onClose}
            />

            {/* Right Drawer Slide */}
            <div className={`fixed top-0 right-0 h-full w-full max-w-[380px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* Header */}
                <div className="p-5 border-b border-[#F2F4F6] flex justify-between items-center bg-white shrink-0">
                    <h2 className="text-[18px] font-bold text-[#191F28] flex items-center gap-2">
                        <Send size={18} className="text-[#002B7A]" />
                        제안 보관함
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 hover:bg-[#F2F4F6] rounded-full transition-colors text-[#8B95A1] hover:text-[#191F28]"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5 overflow-y-auto bg-[#F9FAFB] flex-1 custom-scrollbar">
                    {requests.length === 0 ? (
                        <div className="py-20 flex flex-col items-center justify-center text-center h-full">
                            <div className="w-14 h-14 bg-[#E8F3FF] text-[#002B7A] rounded-full flex items-center justify-center mb-4 shadow-sm border-2 border-white">
                                <Send size={20} />
                            </div>
                            <h3 className="text-[15px] font-bold text-[#333D4B] mb-1.5">보낸 제안이 없습니다</h3>
                            <p className="text-[13px] text-[#8B95A1] leading-relaxed">
                                마음에 드는 인플루언서에게<br />먼저 다가가 보세요.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {requests.map((req) => (
                                <div key={req.id} className="bg-white rounded-[16px] p-4 border border-[#E5E8EB] shadow-sm flex flex-col gap-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-9 h-9 rounded-full overflow-hidden border border-[#F2F4F6] shadow-sm shrink-0">
                                                <img src={req.influencerImage} alt={req.influencerName} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-1.5 mb-0.5">
                                                    <span className="font-bold text-[#191F28] text-[14px] truncate">{req.influencerName}</span>
                                                    <span className="px-1.5 py-0.5 bg-[#F2F4F6] text-[#505967] text-[10px] font-bold rounded">
                                                        {req.type}
                                                    </span>
                                                </div>
                                                <div className="text-[11px] text-[#8B95A1]">연락처: {req.contact}</div>
                                            </div>
                                        </div>
                                        <div className="text-[11px] text-[#8B95A1] font-bold bg-[#F9FAFB] px-2 py-0.5 rounded-md mt-0.5">
                                            {formatDate(req.sentAt)}
                                        </div>
                                    </div>

                                    <div className="bg-[#F9FAFB] p-3 rounded-xl text-[12px] text-[#4B5563] leading-relaxed border border-[#F2F4F6] whitespace-pre-line">
                                        <div className="line-clamp-3">
                                            {req.message}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
