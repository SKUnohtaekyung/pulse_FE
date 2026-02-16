import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Send } from 'lucide-react';
import { INFLUENCER_DATA } from '../../data/mockInfluencers';

/**
 * InfluencerRequestPage
 * 인플루언서에게 협업 제안을 보내는 전용 페이지
 * "No Scroll" & "No Header" & "Match Bottom" Layout
 */
export default function InfluencerRequestPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const influencer = INFLUENCER_DATA.find(inf => inf.id === id);

    const [formData, setFormData] = useState({
        type: '제품 협찬',
        date: '',
        message: '',
        contact: ''
    });

    const [isAiGenerating, setIsAiGenerating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // AI 제안서 작성 핸들러
    const handleAiGenerate = async () => {
        setIsAiGenerating(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        const aiMessage = `안녕하세요, ${influencer.name}님! \n\n${influencer.location}에 위치한 저희 매장은 ${influencer.niche[0]} 전문점으로, ${influencer.name}님의 평소 리뷰 스타일이 저희 매장의 분위기와 너무 잘 어울려 연락드렸습니다.\n\n특히 최근 업로드하신 콘텐츠를 인상 깊게 보았는데요, 이번에 저희 신메뉴 출시에 맞춰 ${formData.type}을 제안드리고 싶습니다.\n\n편하신 시간에 방문해주시면 정성껏 대접해드리고 싶습니다. 긍정적인 검토 부탁드립니다!\n\n감사합니다.`;
        setFormData(prev => ({ ...prev, message: aiMessage }));
        setIsAiGenerating(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert(`✅ ${influencer.name}님에게 제안서가 전송되었습니다!`);
        navigate('/influencer-matching');
    };

    if (!influencer) return <div>인플루언서를 찾을 수 없습니다.</div>;

    return (
        <div className="flex bg-[#F5F7FA] h-full gap-4 p-4 font-sans overflow-hidden">

            {/* [Left] Request Form (Flex 0.65) - No Scroll, Full Height */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-[0.65] bg-white rounded-[24px] p-6 shadow-sm border border-[#E5E8EB] flex flex-col h-full relative"
            >
                {/* Minimal Back Button (No Header) */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
                >
                    <ArrowLeft size={20} className="text-[#8B95A1]" />
                </button>

                <form onSubmit={handleSubmit} className="flex flex-col h-full gap-5 pt-8">

                    {/* 1. Collaboration Type */}
                    <div>
                        <label className="block text-[14px] font-bold text-[#333D4B] mb-2">협업 방식</label>
                        <div className="flex gap-2">
                            {['제품 협찬', '방문 리뷰', '영상 제작', '공동 구매'].map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type })}
                                    className={`
                                        flex-1 py-2.5 rounded-xl border font-bold transition-all text-[14px]
                                        ${formData.type === type
                                            ? 'border-[#002B7A] bg-[#E8F3FF] text-[#002B7A]'
                                            : 'border-transparent bg-[#F9FAFB] text-[#8B95A1] hover:bg-[#F2F4F6]'
                                        }
                                    `}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 2. Schedule & Contact */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[14px] font-bold text-[#333D4B] mb-2">희망 일정</label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full px-4 py-3 bg-[#F9FAFB] border border-transparent rounded-xl focus:bg-white focus:border-[#002B7A] focus:outline-none transition-all text-[14px]"
                            />
                        </div>
                        <div>
                            <label className="block text-[14px] font-bold text-[#333D4B] mb-2">연락처</label>
                            <input
                                type="text"
                                placeholder="010-0000-0000"
                                value={formData.contact}
                                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                className="w-full px-4 py-3 bg-[#F9FAFB] border border-transparent rounded-xl focus:bg-white focus:border-[#002B7A] focus:outline-none transition-all text-[14px]"
                            />
                        </div>
                    </div>

                    {/* 3. Message (Auto Fill Remaining Height) */}
                    <div className="flex-grow flex flex-col min-h-0">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-[14px] font-bold text-[#333D4B]">제안 메세지</label>
                            <button
                                type="button"
                                onClick={handleAiGenerate}
                                disabled={isAiGenerating}
                                className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-[12px] font-bold rounded-lg shadow-sm hover:opacity-90 transition-all"
                            >
                                <Sparkles size={12} />
                                {isAiGenerating ? '작성 중...' : 'AI 자동 작성'}
                            </button>
                        </div>
                        <div className="relative flex-grow">
                            <textarea
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                placeholder="인플루언서에게 보낼 제안 내용을 작성해주세요."
                                maxLength={500}
                                className="w-full h-full p-4 bg-[#F9FAFB] border border-transparent rounded-xl text-[14px] leading-relaxed resize-none focus:bg-white focus:border-[#002B7A] focus:outline-none transition-all"
                            />
                            <div className="absolute bottom-3 right-3 text-[11px] text-[#8B95A1] bg-white/80 px-2 py-0.5 rounded-md backdrop-blur-sm shadow-sm">
                                {formData.message.length} / 500자
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting || !formData.message || !formData.contact}
                        className={`
                            py-3.5 rounded-xl font-bold text-[15px] text-white shadow-lg transition-all flex items-center justify-center gap-2
                            ${isSubmitting || !formData.message || !formData.contact
                                ? 'bg-[#E5E8EB] text-[#B0B8C1] cursor-not-allowed shadow-none'
                                : 'bg-[#FF5A36] hover:bg-[#E0492A] hover:shadow-orange-200 hover:-translate-y-0.5'
                            }
                        `}
                    >
                        {isSubmitting ? '전송 중...' : '제안서 보내기'}
                        <Send size={16} />
                    </button>
                </form>
            </motion.div>

            {/* [Right] Influencer Summary (Flex 0.35) - Full Height & Matched Bottom */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-[0.35] flex flex-col gap-4 h-full"
            >
                {/* Profile Summary */}
                <div className="bg-white rounded-[24px] p-6 shadow-sm border border-[#E5E8EB] flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-[24px] overflow-hidden mb-3 shadow-md">
                        <img src={influencer.profileImage} alt={influencer.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex items-center gap-2 mb-0.5">
                        <h2 className="text-[20px] font-bold text-[#191F28]">{influencer.name}</h2>
                        <span className="px-2 py-0.5 bg-[#FFF4E6] text-[#FF5A36] text-[11px] font-bold rounded-full">
                            {influencer.matchScore}% 일치
                        </span>
                    </div>
                    <p className="text-[#8B95A1] text-[13px] mb-4 line-clamp-2 max-w-[200px]">
                        {influencer.bio}
                    </p>

                    <div className="w-full bg-[#F9FAFB] rounded-xl p-3 flex justify-around">
                        <div>
                            <div className="text-[11px] text-[#8B95A1] mb-0.5">팔로워</div>
                            <div className="text-[14px] font-bold text-[#333D4B]">{(influencer.followers / 1000).toFixed(0)}K</div>
                        </div>
                        <div>
                            <div className="text-[11px] text-[#8B95A1] mb-0.5">평점</div>
                            <div className="text-[14px] font-bold text-[#333D4B]">{influencer.rating}</div>
                        </div>
                    </div>
                </div>

                {/* Process Guide (Fills remaining height) */}
                <div className="bg-white rounded-[24px] p-6 border border-[#E5E8EB] flex-grow flex flex-col justify-center">
                    <h3 className="text-[15px] font-bold text-[#191F28] mb-5 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#002B7A]"></span>
                        매칭 진행 절차
                    </h3>
                    <div className="flex flex-col gap-5 relative">
                        {/* Connecting Line */}
                        <div className="absolute left-[13px] top-3 bottom-3 w-[2px] bg-[#F2F4F6] -z-10"></div>

                        <div className="flex gap-3 items-start">
                            <div className="w-7 h-7 rounded-full bg-[#E8F3FF] text-[#002B7A] flex items-center justify-center font-bold text-[13px] shrink-0 border-2 border-white shadow-sm">1</div>
                            <div>
                                <strong className="block text-[13px] text-[#333D4B] mb-0.5">제안서 발송</strong>
                                <p className="text-[12px] text-[#8B95A1] leading-snug">제안 내용이<br />인플루언서에게 전달됩니다.</p>
                            </div>
                        </div>
                        <div className="flex gap-3 items-start">
                            <div className="w-7 h-7 rounded-full bg-[#FFF4E6] text-[#FF5A36] flex items-center justify-center font-bold text-[13px] shrink-0 border-2 border-white shadow-sm">2</div>
                            <div>
                                <strong className="block text-[13px] text-[#333D4B] mb-0.5">검토 및 수락</strong>
                                <p className="text-[12px] text-[#8B95A1] leading-snug">참여 의사를 확인하고<br />수락 여부를 결정합니다.</p>
                            </div>
                        </div>
                        <div className="flex gap-3 items-start">
                            <div className="w-7 h-7 rounded-full bg-[#F2F4F6] text-[#505967] flex items-center justify-center font-bold text-[13px] shrink-0 border-2 border-white shadow-sm">3</div>
                            <div>
                                <strong className="block text-[13px] text-[#333D4B] mb-0.5">1:1 채팅 시작</strong>
                                <p className="text-[12px] text-[#8B95A1] leading-snug">매칭 성사 시<br />세부 일정을 조율합니다.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
