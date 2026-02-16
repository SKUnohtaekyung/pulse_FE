import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

/**
 * FaqSection Component (Clean Accordion)
 * Objection Handling for payment page
 */
const FaqSection = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            q: "언제든 해지할 수 있나요?",
            a: "네, 물론입니다. 약정 기간이나 위약금은 전혀 없습니다. Growth 플랜의 2주 무료 체험 기간 중 해지하시면 요금이 청구되지 않습니다."
        },
        {
            q: "무료 체험이 끝나면 어떻게 되나요?",
            a: "무료 체험 종료 3일 전에 알림톡을 보내드립니다. 계속 이용을 원하시면 등록된 카드로 자동 결제되며, 원치 않으시면 언제든 해지하실 수 있습니다."
        },
        {
            q: "인플루언서 매칭은 어떻게 진행되나요?",
            a: "Pro 플랜을 구독하시면 매칭 전담 매니저가 배정됩니다. 사장님의 가게 업종과 분위기에 가장 잘 맞는 지역 인플루언서를 리스트업하여 제안해 드립니다."
        },
        {
            q: "환불 규정이 궁금해요.",
            a: "결제 후 7일 이내, 서비스 사용 이력이 없다면 100% 전액 환불해 드립니다. 안심하고 시작해보세요."
        }
    ];

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="max-w-3xl mx-auto mt-20 mb-20 px-4">
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-1.5 mb-4">
                    <HelpCircle size={14} className="text-gray-500" />
                    <span className="text-[13px] font-medium text-gray-600">자주 묻는 질문</span>
                </div>
                <h3 className="text-[24px] font-bold text-[#191F28]">
                    궁금한 점이 있으신가요?
                </h3>
            </div>

            <div className="space-y-4">
                {faqs.map((faq, idx) => (
                    <div
                        key={idx}
                        className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden ${openIndex === idx ? 'border-[#002B7A] shadow-md' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                        <button
                            onClick={() => toggleFaq(idx)}
                            className="w-full flex items-center justify-between p-5 text-left"
                        >
                            <span className={`text-[16px] font-semibold ${openIndex === idx ? 'text-[#002B7A]' : 'text-[#333]'}`}>
                                {faq.q}
                            </span>
                            <ChevronDown
                                size={20}
                                className={`text-gray-400 transition-transform duration-300 ${openIndex === idx ? 'rotate-180 text-[#002B7A]' : ''}`}
                            />
                        </button>

                        <div
                            className={`transition-all duration-300 ease-in-out ${openIndex === idx ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                        >
                            <div className="px-5 pb-5 text-[15px] text-gray-600 leading-relaxed bg-gray-50/50 pt-2 border-t border-gray-50">
                                {faq.a}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FaqSection;
