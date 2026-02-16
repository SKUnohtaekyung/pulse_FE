import React from 'react';
import {
    User,
    Settings,
    Share2,
    Instagram,
    MapPin,
    MessageSquare,
    ChevronRight,
    CreditCard,
    HelpCircle,
    MessageCircle,
    FileText,
    LogOut
} from 'lucide-react';

const MyPage = () => {
    return (
        <div className="flex flex-col h-full gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden">
            {/* Top: Status Summary (Fixed Height) */}
            <div className="bg-[#002B7A] rounded-2xl p-5 text-white flex items-center justify-between shadow-lg shrink-0">
                <div>
                    <h2 className="text-xl font-bold mb-0.5">박사장님, 안녕하세요!</h2>
                    <p className="text-white/70 text-xs">오늘도 성공적인 하루 보내세요.</p>
                </div>
                <div className="flex items-center gap-4 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10">
                    <div>
                        <p className="text-[10px] text-white/60 mb-0.5">마케팅 준비 완료율</p>
                        <div className="flex items-end gap-1.5">
                            <span className="text-xl font-bold text-yellow-300">85%</span>
                            <span className="text-[10px] text-white/80 mb-1">조금만 더 힘내세요!</span>
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-white/20 flex items-center justify-center text-sm font-bold relative">
                        85
                        <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#002B7A]"></div>
                    </div>
                </div>
            </div>

            {/* Bento Grid Layout: 3 Columns x 2 Rows */}
            <div className="grid grid-cols-3 grid-rows-2 gap-4 flex-1 min-h-0">

                {/* 1. Connection Hub (Left Column - Tall) */}
                <div className="col-span-1 row-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
                    <div className="flex items-center justify-between mb-6 shrink-0">
                        <h3 className="font-bold text-[#191F28] text-base flex items-center gap-2">
                            <Share2 size={18} className="text-[#002B7A]" />
                            플랫폼 연동 상태
                        </h3>
                    </div>

                    <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1 custom-scrollbar">
                        <div className="flex items-center justify-between p-4 bg-[#F5F7FA] rounded-xl border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                                    <Instagram size={20} className="text-pink-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-[#191F28]">Instagram</p>
                                    <p className="text-xs text-gray-500">@bumgye_rodeo</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                <span className="text-xs text-green-600 font-bold">연동됨</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-[#F5F7FA] rounded-xl border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                                    <MapPin size={20} className="text-green-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-[#191F28]">Naver Place</p>
                                    <p className="text-xs text-gray-500">범계 로데오점</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="text-xs text-green-600 font-bold">수집 중</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white border border-dashed border-gray-300 rounded-xl hover:border-[#002B7A] hover:bg-[#F0F5FF] transition-colors cursor-pointer group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-white">
                                    <MessageSquare size={20} className="text-gray-400 group-hover:text-[#002B7A]" />
                                </div>
                                <p className="font-bold text-sm text-gray-400 group-hover:text-[#002B7A]">카카오 채널 연동하기</p>
                            </div>
                            <ChevronRight size={20} className="text-gray-300 group-hover:text-[#002B7A]" />
                        </div>

                        {/* Extra space filler if needed or additional info */}
                        <div className="mt-auto p-4 bg-blue-50 rounded-xl border border-blue-100">
                            <p className="text-xs text-[#002B7A] font-bold mb-1">💡 연동 팁</p>
                            <p className="text-[11px] text-gray-600 leading-relaxed">
                                모든 플랫폼을 연동하면 AI가 더 정확한 분석 결과를 제공할 수 있습니다.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 2. Store Persona (Top Right - Wide) */}
                <div className="col-span-2 row-span-1 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
                    <div className="flex items-center justify-between mb-4 shrink-0">
                        <h3 className="font-bold text-[#191F28] text-base flex items-center gap-2">
                            <User size={18} className="text-[#002B7A]" />
                            내 가게 대표 손님
                        </h3>
                        <button className="text-gray-400 hover:text-[#002B7A] transition-colors">
                            <Settings size={16} />
                        </button>
                    </div>

                    <div className="flex-1 flex gap-6 items-center">
                        {/* Left Side: Basic Info */}
                        <div className="flex-1 space-y-4 border-r border-gray-100 pr-6">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">가게 이름 / 업종</p>
                                <p className="text-lg font-bold text-[#191F28]">범계 로데오점 <span className="text-gray-300">|</span> 이자카야</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1.5">브랜드 톤앤매너 (AI 설정)</p>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 bg-[#E8F3FF] text-[#002B7A] text-xs font-bold rounded-full">친근한</span>
                                    <span className="px-3 py-1 bg-[#E8F3FF] text-[#002B7A] text-xs font-bold rounded-full">감성적인</span>
                                    <span className="px-3 py-1 bg-[#E8F3FF] text-[#002B7A] text-xs font-bold rounded-full">트렌디한</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Keywords */}
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-2">주력 메뉴 키워드</p>
                            <div className="flex flex-wrap gap-2">
                                {['#하이볼맛집', '#숙성회', '#데이트코스', '#분위기깡패', '#안주가맛있는', '#사진맛집'].map((tag, i) => (
                                    <span key={i} className="text-sm text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg font-medium">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Membership & Credit (Bottom Right - Left) */}
                <div className="col-span-1 row-span-1 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
                    <div className="flex items-center justify-between mb-4 shrink-0">
                        <h3 className="font-bold text-[#191F28] text-base flex items-center gap-2">
                            <CreditCard size={18} className="text-[#002B7A]" />
                            멤버십 & 크레딧
                        </h3>
                        <span className="bg-[#002B7A] text-white text-[10px] px-1.5 py-0.5 rounded font-bold">Pro Plan</span>
                    </div>

                    <div className="space-y-3 flex-1 flex flex-col justify-center">
                        <div>
                            <div className="flex justify-between text-xs mb-1.5">
                                <span className="text-gray-600">이번 달 AI 생성 횟수</span>
                                <span className="font-bold text-[#002B7A]">12 / 30회</span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-[#002B7A] w-[40%] rounded-full"></div>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-gray-100">
                            <div className="flex justify-between items-center mb-1.5">
                                <span className="text-xs text-gray-600">다음 결제일</span>
                                <span className="text-xs font-bold">2025. 12. 01</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">결제 수단</span>
                                <span className="text-xs font-bold">현대카드 (1234)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Support & Guide (Bottom Right - Right) */}
                <div className="col-span-1 row-span-1 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
                    <div className="flex items-center justify-between mb-4 shrink-0">
                        <h3 className="font-bold text-[#191F28] text-base flex items-center gap-2">
                            <HelpCircle size={18} className="text-[#002B7A]" />
                            고객센터
                        </h3>
                    </div>

                    <div className="space-y-2.5 flex-1 flex flex-col">
                        <button className="w-full flex items-center justify-between p-3 bg-[#F5F7FA] rounded-xl hover:bg-[#E8F3FF] transition-colors text-left group">
                            <div className="flex items-center gap-2.5">
                                <MessageCircle size={18} className="text-gray-500 group-hover:text-[#002B7A]" />
                                <span className="font-bold text-xs text-[#191F28] group-hover:text-[#002B7A]">1:1 문의하기</span>
                            </div>
                            <ChevronRight size={16} className="text-gray-300 group-hover:text-[#002B7A]" />
                        </button>

                        <button className="w-full flex items-center justify-between p-3 bg-[#F5F7FA] rounded-xl hover:bg-[#E8F3FF] transition-colors text-left group">
                            <div className="flex items-center gap-2.5">
                                <FileText size={18} className="text-gray-500 group-hover:text-[#002B7A]" />
                                <span className="font-bold text-xs text-[#191F28] group-hover:text-[#002B7A]">서비스 이용 가이드</span>
                            </div>
                            <ChevronRight size={16} className="text-gray-300 group-hover:text-[#002B7A]" />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MyPage;
