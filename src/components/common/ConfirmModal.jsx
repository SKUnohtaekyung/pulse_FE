import React from 'react';
import { Modal } from '../ui/Modal';

/**
 * 되돌리기 어려운 동작(삭제·초기화·작업 취소·입력 유실) 확인 모달.
 *
 * 모든 버튼에 붙이지 말고, 데이터 손실 가능성이 있는 동작에만 사용한다.
 * Modal 이 focus trap / ESC 닫기 / 배경 클릭 닫기를 이미 제공한다.
 */
export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmLabel = '확인',
    cancelLabel = '취소',
    tone = 'danger', // 'danger' | 'primary'
    isProcessing = false,
}) {
    const titleId = 'confirm-modal-title';
    const descriptionId = description ? 'confirm-modal-description' : undefined;

    const confirmClass =
        tone === 'danger'
            ? 'bg-error text-white hover:opacity-90'
            : 'bg-primary text-white hover:bg-primary-hover';

    const handleConfirm = () => {
        if (isProcessing) return;
        onConfirm?.();
    };

    return (
        <Modal isOpen={isOpen} onClose={isProcessing ? () => {} : onClose} ariaLabelledBy={titleId} panelClassName="w-[400px]">
            <div className="p-6 flex flex-col gap-2" aria-describedby={descriptionId}>
                <h2 id={titleId} className="text-head-5 text-text-main break-keep">
                    {title}
                </h2>
                {description && (
                    <p id={descriptionId} className="text-body-7 text-neutral-600 break-keep">
                        {description}
                    </p>
                )}
                <div className="flex gap-2 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isProcessing}
                        className="flex-1 h-11 rounded-xl border border-primary-border text-primary text-btn-sub
                                   transition-colors duration-200 hover:bg-primary-tint
                                   disabled:opacity-40 disabled:cursor-not-allowed
                                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={isProcessing}
                        className={`flex-1 h-11 rounded-xl text-btn-sub transition-colors duration-200
                                    disabled:opacity-40 disabled:cursor-not-allowed
                                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                                    ${confirmClass}`}
                    >
                        {isProcessing ? '처리 중…' : confirmLabel}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
