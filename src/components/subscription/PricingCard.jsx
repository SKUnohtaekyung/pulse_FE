import React from 'react';
import { Check, Star, Lock } from 'lucide-react';
import { COLORS } from '../../constants';

/**
 * PricingCard Component (Clean Fintech Style)
 * 
 * @param {string} title - Plan Name (Basic / Growth / Pro)
 * @param {string} price - Monthly Price (e.g. "29,000")
 * @param {string} priceYearly - Yearly Price (Discounted)
 * @param {string} description - Plan subtitle for target user
 * @param {string[]} features - List of features
 * @param {boolean} isPopular - Highlights the Growth plan
 * @param {boolean} isYearly - Toggle state for yearly pricing
 * @param {function} onSelect - Click handler
 */
const PricingCard = ({
    title,
    price,
    priceYearly,
    description,
    features,
    isPopular,
    isYearly,
    onSelect
}) => {
    // Current price display based on toggle
    const currentPrice = isYearly ? priceYearly : price;

    // Style Variants based on plan type (Basic vs Growth vs Pro)
    // Growth Plan gets the "Hero" treatment (Blue Border + Shadow)
    const cardStyle = isPopular
        ? "border-2 border-[#002B7A] shadow-xl scale-105 z-10 relative bg-white"
        : "border border-gray-100 shadow-sm hover:shadow-md bg-white";

    const buttonStyle = isPopular
        ? "bg-[#FF5A36] text-white hover:bg-[#FF8E53] shadow-md hover:shadow-lg relative overflow-hidden group"
        : "bg-gray-100 text-[#191F28] hover:bg-gray-200";

    return (
        <div className={`rounded-[24px] p-8 flex flex-col transition-all duration-300 ${cardStyle}`}>

            {/* Social Proof Badge (Growth Only) */}
            {isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-[#FF5A36] text-white text-[13px] font-bold px-4 py-1.5 rounded-full shadow-md flex items-center gap-1">
                        <Star size={12} fill="white" />
                        가장 인기
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="text-center mb-6">
                <h3 className="text-[#002B7A] text-[18px] font-bold uppercase tracking-wider mb-2">
                    {title}
                </h3>
                <div className="flex items-end justify-center gap-1 mb-2">
                    <span className="text-[#191F28] text-[36px] font-bold leading-none tracking-tight">
                        ₩{parseInt(currentPrice.replace(/,/g, '')).toLocaleString()}
                    </span>
                    <span className="text-gray-500 text-[15px] font-medium mb-1">
                        / 월
                    </span>
                </div>
                <p className="text-gray-500 text-[14px] px-4 break-keep">
                    {description}
                </p>
                {/* Yearly Discount Tag */}
                {isYearly && (
                    <div className="mt-2 inline-block bg-blue-50 text-[#002B7A] text-[12px] font-bold px-2 py-0.5 rounded-md">
                        연간 결제 20% 할인 적용됨
                    </div>
                )}
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100 mb-6 w-full"></div>

            {/* Features List */}
            <ul className="flex-1 space-y-4 mb-8">
                {features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-[14px] text-[#333]">
                        <div className={`mt-0.5 p-0.5 rounded-full ${isPopular ? 'bg-blue-100 text-[#002B7A]' : 'bg-gray-100 text-gray-400'}`}>
                            <Check size={12} strokeWidth={3} />
                        </div>
                        <span className="leading-snug">{feature}</span>
                    </li>
                ))}
            </ul>

            {/* Action Button */}
            <button
                onClick={onSelect}
                className={`w-full h-[52px] rounded-xl text-[16px] font-bold transition-all duration-200 flex items-center justify-center gap-2 ${buttonStyle}`}
            >
                {isPopular ? "2주 무료 체험 시작" : (title === 'Pro' ? "전문가 매칭 시작" : "현재 이용 중")}

                {/* Shine Effect Animation (Micro-interaction) */}
                {isPopular && (
                    <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
                )}
            </button>

            {/* Risk Reversal (Small Text) */}
            <p className="text-center text-[12px] text-gray-400 mt-4 h-4">
                {isPopular ? "언제든 위약금 없이 해지 가능" : ""}
            </p>
        </div>
    );
};

export default PricingCard;
