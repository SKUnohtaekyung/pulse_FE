import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Calendar, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { cancelInfluencerProposal, fetchOwnerInfluencerProposals } from './influencerApi';
import ConfirmModal from '../../components/common/ConfirmModal';
import { SectionError } from '../../components/common/StateViews';
import { useToast } from '../../components/common/ToastProvider';
import { isCanceledError } from '../../utils/apiError';
import { toArray } from '../../utils/safeFormat';

const STATUS_LABEL = {
    PENDING: '대기중',
    ACCEPTED: '수락됨',
    REJECTED: '거절됨',
    CANCELED: '취소됨',
};

const STATUS_STYLE = {
    PENDING: 'bg-[#FFF4E6] text-[#FF5A36] border-[#FFE5DF]',
    ACCEPTED: 'bg-[#E8F3FF] text-[#002B7A] border-[#CFE5FF]',
    REJECTED: 'bg-[#F2F4F6] text-[#6B7684] border-[#E5E8EB]',
    CANCELED: 'bg-[#F2F4F6] text-[#6B7684] border-[#E5E8EB]',
};

const STATUS_ICON = {
    PENDING: <Clock size={14} />,
    ACCEPTED: <CheckCircle2 size={14} />,
    REJECTED: <XCircle size={14} />,
    CANCELED: <XCircle size={14} />,
};

export default function OwnerSentProposals() {
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);
    const [cancelTargetId, setCancelTargetId] = useState(null);
    const [isCanceling, setIsCanceling] = useState(false);
    const toast = useToast();
    const controllerRef = useRef(null);

    const loadProposals = useCallback(async () => {
        controllerRef.current?.abort();
        const controller = new AbortController();
        controllerRef.current = controller;

        setLoading(true);
        setLoadError(null);
        try {
            const data = await fetchOwnerInfluencerProposals(controller.signal);
            if (controller.signal.aborted) return;
            setProposals(toArray(data));
        } catch (error) {
            if (controller.signal.aborted || isCanceledError(error)) return;
            // 실패를 빈 목록으로 감추면 "보낸 제안이 없다"고 잘못 읽힌다.
            setProposals([]);
            setLoadError(error);
        } finally {
            if (!controller.signal.aborted) setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProposals();
        return () => controllerRef.current?.abort();
    }, [loadProposals]);

    const handleCancel = async () => {
        if (isCanceling || cancelTargetId === null) return;
        setIsCanceling(true);
        try {
            await cancelInfluencerProposal(cancelTargetId);
            setCancelTargetId(null);
            toast.success('제안을 취소했어요.');
            await loadProposals();
        } catch (error) {
            toast.fromError(error, '제안을 취소하지 못했어요. 잠시 후 다시 시도해 주세요.');
        } finally {
            setIsCanceling(false);
        }
    };

    const cancelConfirm = (
        <ConfirmModal
            isOpen={cancelTargetId !== null}
            onClose={() => setCancelTargetId(null)}
            onConfirm={handleCancel}
            isProcessing={isCanceling}
            title="보낸 제안을 취소할까요?"
            description="취소하면 되돌릴 수 없어요. 인플루언서에게 제안이 더 이상 보이지 않아요."
            confirmLabel="제안 취소"
        />
    );

    if (loading) {
        return (
            <div className="bg-white border border-[#E5E8EB] rounded-xl p-4 text-[14px] text-[#8B95A1]">
                보낸 제안을 불러오는 중이에요.
            </div>
        );
    }

    if (loadError) {
        return (
            <SectionError
                compact
                error={loadError}
                title="보낸 제안을 불러오지 못했어요"
                onRetry={loadProposals}
            />
        );
    }

    if (proposals.length === 0) {
        return (
            <div className="bg-white border border-[#E5E8EB] rounded-xl p-4 text-[14px] text-[#8B95A1] break-keep">
                아직 보낸 제안이 없어요. 마음에 드는 인플루언서에게 먼저 협업을 제안해 보세요.
            </div>
        );
    }

    return (
        <div className="bg-white border border-[#E5E8EB] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-[16px] font-bold text-[#191F28]">보낸 제안</h3>
                <button
                    type="button"
                    onClick={loadProposals}
                    className="text-[12px] font-bold text-[#002B7A]"
                >
                    새로고침
                </button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1">
                {proposals.slice(0, 6).map((proposal) => (
                    <div key={proposal.id} className="min-w-[260px] border border-[#F2F4F6] rounded-xl p-4 bg-[#FAFAFB]">
                        <div className="flex items-center justify-between gap-2 mb-2">
                            <strong className="text-[15px] text-[#191F28] truncate">{proposal.influencerName}</strong>
                            <span className={`shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full border text-[11px] font-bold ${STATUS_STYLE[proposal.status] || STATUS_STYLE.PENDING}`}>
                                {STATUS_ICON[proposal.status] || STATUS_ICON.PENDING}
                                {STATUS_LABEL[proposal.status] || proposal.status}
                            </span>
                        </div>
                        <p className="text-[13px] text-[#4E5968] line-clamp-2 mb-3">{proposal.message || '메시지 없음'}</p>
                        <div className="flex items-center gap-2 text-[12px] text-[#8B95A1] mb-3">
                            <Calendar size={13} />
                            <span>{proposal.desiredDate || '일정 협의'}</span>
                            <span>·</span>
                            <span>{Number(proposal.budget || 0).toLocaleString()}원</span>
                        </div>
                        {proposal.status === 'PENDING' && (
                            <button
                                type="button"
                                onClick={() => setCancelTargetId(proposal.id)}
                                disabled={isCanceling}
                                className="w-full h-9 rounded-lg border border-[#D1D6DB] bg-white text-[#4E5968] text-[13px] font-bold hover:bg-[#F2F4F6] transition-colors
                                           disabled:opacity-40 disabled:cursor-not-allowed
                                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            >
                                제안 취소
                            </button>
                        )}
                    </div>
                ))}
            </div>
            {cancelConfirm}
        </div>
    );
}
