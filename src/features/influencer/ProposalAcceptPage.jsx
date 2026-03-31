import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Store, Calendar, DollarSign, Gift, ArrowRight } from 'lucide-react';

/**
 * ProposalAcceptPage
 * 인플루언서가 이메일 링크를 타고 들어와서 제안을 수락하는 공용 랜딩 페이지
 * 50:50 스플릿 레이아웃 (인증 뷰와 유사)
 */
export default function ProposalAcceptPage() {
    // 실제 환경에서는 token이나 id를 파싱하여 백엔드에서 제안 상세 정보를 불러옴
    const { token } = useParams();
    const navigate = useNavigate();
    
    // Mock Data (원래는 API Fetch)
    const [proposal, setProposal] = useState(null);
    const [status, setStatus] = useState('pending'); // pending, accepting, accepted

    useEffect(() => {
        // Mock Fetching
        setTimeout(() => {
            setProposal({
                influencerName: '김푸디',
                storeName: '루프탑 다이닝 펄스레스토랑',
                type: '방문 리뷰',
                budget: 100000,
                provideFood: true,
                date: '2024-05-20',
                message: '저희 매장의 모던한 분위기와 김푸디님의 스타일이 잘 맞아 연락드렸습니다. 꼭 오셔서 맛있는 식사 하시고 멋진 리뷰 부탁드립니다!'
            });
        }, 800);
    }, [token]);

    const handleAccept = async () => {
        setStatus('accepting');
        // 백엔드 API (수락 처리)
        await new Promise(resolve => setTimeout(resolve, 1500));
        setStatus('accepted');
    };

    if (!proposal) {
        return (
            <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 rounded-full border-4 border-[#002B7A] border-t-transparent animate-spin"></div>
                    <p className="text-[#8B95A1] font-medium">제안 정보를 불러오는 중입니다...</p>
                </div>
            </div>
        );
    }

    if (status === 'accepted') {
        return (
            <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-2xl max-w-md w-full shadow-lg p-10 text-center flex flex-col items-center"
                >
                    <div className="w-20 h-20 bg-[#E8F3FF] rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 size={40} className="text-[#002B7A]" />
                    </div>
                    <h1 className="text-[28px] font-extrabold text-[#191F28] mb-2 tracking-tight">협업이 성사되었습니다!</h1>
                    <p className="text-[15px] text-[#4E5968] leading-relaxed mb-8">
                        제안을 수락해주셔서 감사합니다.<br/>
                        곧 사장님께서 세부 일정 조율을 위해<br/>
                        연락을 드릴 예정입니다.
                    </p>
                    <button 
                        onClick={() => window.close()}
                        className="w-full py-4 bg-[#002B7A] text-white rounded-xl font-bold hover:bg-[#002B7AE6] transition-colors"
                    >
                        창 닫기
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex animate-in fade-in duration-500">
            {/* Left: Brand Canvas */}
            <div className="hidden lg:flex w-1/2 bg-[#002B7A] p-12 flex-col justify-between relative overflow-hidden">
                <div className="relative z-10">
                    <img src="/PULSE_LOGO.png" alt="PULSE" className="w-8/12 filter brightness-0 invert mb-6" />
                    <h1 className="text-white text-[48px] font-extrabold leading-[1.2] tracking-tight text-white/95">
                        <span className="text-[#FF5A36]">가장 완벽한</span><br/>
                        협업의 시작을<br/>
                         위하여
                    </h1>
                </div>
                
                {/* Decorative background shapes */}
                <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl mix-blend-overlay"></div>
                <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-[#FF5A36]/20 rounded-full blur-3xl mix-blend-overlay"></div>
                
                <div className="relative z-10 text-white/70 font-medium text-[15px]">
                    Powered by PULSE Marketing Automation
                </div>
            </div>

            {/* Right: Proposal Details Form */}
            <div className="flex-1 bg-white p-8 lg:p-16 flex flex-col justify-center overflow-y-auto">
                <div className="max-w-[480px] w-full mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="mb-8">
                            <span className="px-3 py-1.5 bg-[#E8F3FF] text-[#002B7A] text-[13px] font-bold rounded-full mb-4 inline-block">
                                협업 제안서
                            </span>
                            <h2 className="text-[28px] font-bold text-[#191F28] mb-2 leading-tight">
                                {proposal.storeName}에서<br/>
                                {proposal.influencerName}님을 초대합니다
                            </h2>
                            <p className="text-[15px] text-[#8B95A1] font-medium">
                                사장님께서 보내신 소중한 제안을 확인해주세요.
                            </p>
                        </div>

                        {/* Proposal Card */}
                        <div className="bg-[#F9FAFB] rounded-2xl border border-[#F2F4F6] overflow-hidden mb-8">
                            <div className="p-6">
                                <p className="text-[15px] text-[#333D4B] leading-relaxed mb-6 whitespace-pre-line p-5 bg-white rounded-xl border border-[#F2F4F6] italic">
                                    "{proposal.message}"
                                </p>
                                
                                <h3 className="text-[15px] font-bold text-[#191F28] mb-4 pb-3 border-b border-[#F2F4F6]">
                                    제안 요약
                                </h3>
                                
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[#4E5968]">
                                            <Store size={18} />
                                            <span className="text-[14px]">협업 방식</span>
                                        </div>
                                        <span className="font-bold text-[#191F28] text-[15px]">{proposal.type}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[#4E5968]">
                                            <Calendar size={18} />
                                            <span className="text-[14px]">희망 일정</span>
                                        </div>
                                        <span className="font-bold text-[#191F28] text-[15px]">
                                            {proposal.date ? proposal.date : '협의'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[#4E5968]">
                                            <DollarSign size={18} />
                                            <span className="text-[14px]">제안 금액</span>
                                        </div>
                                        <span className="font-bold text-[#002B7A] text-[16px]">
                                            {proposal.budget.toLocaleString()}원
                                        </span>
                                    </div>
                                    {proposal.provideFood && (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-[#4E5968]">
                                                <Gift size={18} />
                                                <span className="text-[14px]">추가 혜택</span>
                                            </div>
                                            <span className="font-bold text-[#FF5A36] text-[15px] px-2 py-0.5 bg-[#FF5A361A] rounded-md">
                                                메뉴 전액 무상 제공
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleAccept}
                            disabled={status === 'accepting'}
                            className="w-full h-[60px] bg-[#191F28] text-white rounded-xl font-bold text-[18px] hover:bg-[#333D4B] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:-translate-y-0.5"
                        >
                            {status === 'accepting' ? (
                                <div className="w-6 h-6 rounded-full border-3 border-white border-t-transparent animate-spin"></div>
                            ) : (
                                <>
                                    협업 수락하기 <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                        <p className="text-center text-[#8B95A1] text-[12px] mt-4">
                            본 제안은 발송 후 72시간 동안 유효합니다.
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
