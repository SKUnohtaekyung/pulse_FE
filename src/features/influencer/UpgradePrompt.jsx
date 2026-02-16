import React from 'react';
import { Crown, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * UpgradePrompt 컴포넌트
 * Pro 플랜이 아닌 사용자에게 업그레이드를 유도하는 화면
 */
export default function UpgradePrompt() {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-xl text-center">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#FF5A36] to-[#FF8A36] rounded-full mb-6">
                    <Crown size={40} className="text-white" />
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    Pro 플랜에서 이용 가능합니다
                </h2>

                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                    인플루언서 매칭 기능은 <span className="font-semibold text-[#002B7A]">PULSE Pro</span> 회원만 이용할 수 있어요.
                    <br />
                    지금 업그레이드하고 <span className="font-semibold text-[#FF5A36]">무료 매칭</span>을 받아보세요!
                </p>

                {/* Benefits */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                    <h3 className="font-semibold text-gray-900 mb-3">Pro 플랜 혜택</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">✓</span>
                            <span>인플루언서 매칭 (수수료 0%)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">✓</span>
                            <span>홍보 영상 무제한 제작 (4K 화질)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">✓</span>
                            <span>경쟁사 분석 리포트</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">✓</span>
                            <span>다점포 통합 관리</span>
                        </li>
                    </ul>
                </div>

                {/* CTA Button */}
                <button
                    onClick={() => navigate('/subscription')}
                    className="w-full py-3 bg-[#FF5A36CC] text-white rounded-lg hover:bg-opacity-90 transition-all font-bold shadow-md flex items-center justify-center gap-2 group"
                >
                    Pro로 업그레이드하기
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Secondary Action */}
                <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full mt-3 py-2 text-gray-600 hover:text-gray-900 transition-colors text-sm"
                >
                    나중에 하기
                </button>
            </div>
        </div>
    );
}
