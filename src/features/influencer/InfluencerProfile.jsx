import React, { useState } from 'react';
import { User, Instagram, Youtube, Hash, Edit3, CheckCircle2, Camera } from 'lucide-react';

const MOCK_INFLUENCER_DATA = {
    name: '테스트 인플루언서',
    email: 'influencer@pulse.com',
    bio: '성수동 기반 로컬 푸드 크리에이터 🍜 | 맛있는 곳이라면 어디든!',
    joinDate: '2025.03.15',
    instagram: '@test_influencer',
    youtube: '',
    tags: ['#한식', '#카페', '#브런치', '#음식리뷰'],
    stats: {
        accepted: 3,
        totalEarned: 100000,
        pending: 2,
    }
};

export default function InfluencerProfile() {
    const [data, setData] = useState(MOCK_INFLUENCER_DATA);
    const [editingTag, setEditingTag] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleAddTag = (e) => {
        if (e.key === 'Enter' && editingTag.trim()) {
            const tag = editingTag.startsWith('#') ? editingTag.trim() : `#${editingTag.trim()}`;
            if (!data.tags.includes(tag)) {
                setData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
            }
            setEditingTag('');
        }
    };

    const handleRemoveTag = (tag) => {
        setData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
    };

    const handleSave = () => {
        setSaved(true);
        setIsEditMode(false);
        setTimeout(() => setSaved(false), 2500);
    };

    return (
        <div className="flex-1 flex flex-col gap-5 mt-3 overflow-y-auto custom-scrollbar pb-6">

            {/* Profile Card */}
            <div className="bg-white rounded-[24px] border border-[#E5E8EB] p-8 flex items-start gap-6">
                {/* Avatar */}
                <div className="relative shrink-0">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#002B7A] to-[#4A7FD4] flex items-center justify-center shadow-md">
                        <User size={36} className="text-white" />
                    </div>
                    {isEditMode && (
                        <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border border-[#E5E8EB] rounded-full flex items-center justify-center shadow-sm hover:bg-[#F2F4F6] transition-colors">
                            <Camera size={14} className="text-[#4E5968]" />
                        </button>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    {isEditMode ? (
                        <div className="flex flex-col gap-3">
                            <input
                                value={data.name}
                                onChange={e => setData(p => ({ ...p, name: e.target.value }))}
                                className="text-[22px] font-bold text-[#191F28] border-b-2 border-[#002B7A] outline-none bg-transparent w-full"
                            />
                            <textarea
                                value={data.bio}
                                onChange={e => setData(p => ({ ...p, bio: e.target.value }))}
                                rows={2}
                                className="text-[15px] text-[#4E5968] border border-[#E5E8EB] rounded-[10px] p-2 outline-none resize-none bg-[#F9FAFB] focus:border-[#002B7A] transition-colors"
                            />
                        </div>
                    ) : (
                        <>
                            <h2 className="text-[22px] font-bold text-[#191F28]">{data.name}</h2>
                            <p className="text-[14px] text-[#8B95A1] mt-0.5">{data.email}</p>
                            <p className="text-[15px] text-[#4E5968] mt-2 leading-relaxed">{data.bio}</p>
                            <p className="text-[12px] text-[#8B95A1] mt-2">가입일: {data.joinDate}</p>
                        </>
                    )}
                </div>

                {/* Edit Button */}
                <div className="shrink-0 flex items-center gap-2">
                    {isEditMode ? (
                        <>
                            <button onClick={() => setIsEditMode(false)} className="px-4 py-2 text-[14px] text-[#4E5968] font-bold border border-[#D1D6DB] rounded-[10px] hover:bg-[#F9FAFB] transition-colors">취소</button>
                            <button onClick={handleSave} className="px-4 py-2 text-[14px] text-white font-bold bg-[#002B7A] rounded-[10px] hover:bg-[#001F5C] transition-colors">저장</button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditMode(true)} className="flex items-center gap-1.5 px-4 py-2 text-[14px] text-[#002B7A] font-bold border border-[#CFE5FF] bg-[#E8F3FF] rounded-[10px] hover:bg-[#D8ECFF] transition-colors">
                            <Edit3 size={14} /> 편집
                        </button>
                    )}
                    {saved && (
                        <div className="flex items-center gap-1 text-[14px] text-[#002B7A] font-bold">
                            <CheckCircle2 size={16} /> 저장됨
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Strip */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: '수락한 제안', value: data.stats.accepted, unit: '건', color: 'text-[#002B7A]' },
                    { label: '대기중인 제안', value: data.stats.pending, unit: '건', color: 'text-[#FF5A36]' },
                    { label: '누적 원고료', value: data.stats.totalEarned.toLocaleString(), unit: '원', color: 'text-[#191F28]' },
                ].map(stat => (
                    <div key={stat.label} className="bg-white rounded-[20px] border border-[#E5E8EB] p-6 flex flex-col gap-1">
                        <p className="text-[13px] text-[#8B95A1] font-medium">{stat.label}</p>
                        <p className={`text-[28px] font-bold ${stat.color}`}>
                            {stat.value}<span className="text-[16px] font-medium text-[#8B95A1] ml-1">{stat.unit}</span>
                        </p>
                    </div>
                ))}
            </div>

            {/* Channel Info */}
            <div className="bg-white rounded-[24px] border border-[#E5E8EB] p-6 flex flex-col gap-5">
                <h3 className="text-[18px] font-bold text-[#191F28]">채널 정보</h3>

                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-[10px] bg-gradient-to-br from-[#E1306C] to-[#FCAF45] flex items-center justify-center shrink-0">
                            <Instagram size={20} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] text-[#8B95A1] font-medium">Instagram</p>
                            {isEditMode ? (
                                <input
                                    value={data.instagram}
                                    onChange={e => setData(p => ({ ...p, instagram: e.target.value }))}
                                    placeholder="@your_handle"
                                    className="text-[15px] text-[#191F28] font-medium border-b border-[#E5E8EB] outline-none w-full bg-transparent focus:border-[#002B7A] transition-colors"
                                />
                            ) : (
                                <p className="text-[15px] text-[#191F28] font-medium">{data.instagram || '—'}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-[10px] bg-[#FF0000] flex items-center justify-center shrink-0">
                            <Youtube size={20} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] text-[#8B95A1] font-medium">YouTube</p>
                            {isEditMode ? (
                                <input
                                    value={data.youtube}
                                    onChange={e => setData(p => ({ ...p, youtube: e.target.value }))}
                                    placeholder="채널 URL을 입력하세요"
                                    className="text-[15px] text-[#191F28] font-medium border-b border-[#E5E8EB] outline-none w-full bg-transparent focus:border-[#002B7A] transition-colors"
                                />
                            ) : (
                                <p className="text-[15px] text-[#8B95A1]">{data.youtube || '아직 연결된 채널이 없습니다.'}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Activity Tags */}
            <div className="bg-white rounded-[24px] border border-[#E5E8EB] p-6 flex flex-col gap-4">
                <h3 className="text-[18px] font-bold text-[#191F28] flex items-center gap-2"><Hash size={18} /> 활동 분야</h3>
                <div className="flex flex-wrap gap-2">
                    {data.tags.map(tag => (
                        <span key={tag} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F0F5FF] text-[#002B7A] font-bold text-[14px] rounded-full border border-[#CFE5FF]">
                            {tag}
                            {isEditMode && (
                                <button onClick={() => handleRemoveTag(tag)} className="text-[#8B95A1] hover:text-[#4E5968]">✕</button>
                            )}
                        </span>
                    ))}
                    {isEditMode && (
                        <input
                            value={editingTag}
                            onChange={e => setEditingTag(e.target.value)}
                            onKeyDown={handleAddTag}
                            placeholder="+ 태그 추가 (Enter)"
                            className="px-3 py-1.5 border border-dashed border-[#CFE5FF] rounded-full text-[14px] text-[#8B95A1] outline-none bg-transparent focus:border-[#002B7A] transition-colors min-w-[120px]"
                        />
                    )}
                </div>
            </div>

        </div>
    );
}
