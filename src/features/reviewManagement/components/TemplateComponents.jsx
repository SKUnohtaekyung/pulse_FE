import { X, Search, Copy, Edit3, Trash2, Check } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import ConfirmModal from '../../../components/common/ConfirmModal';
import { EmptyState, InlineError } from '../../../components/common/StateViews';
import { useToast } from '../../../components/common/ToastProvider';
import { useFocusTrap } from '../../../hooks/useFocusTrap';
import { formatText, toArray } from '../../../utils/safeFormat';

const CATEGORIES = ['감사', '사진 감사', '재방문', '메뉴 추천', '사과 & 고객지원'];
const SUGGESTED_TAGS = ['긍정', '캐주얼', '이모지', '사진', '격식', '친근함'];
const FILTER_CATEGORIES = ['전체', ...CATEGORIES];
const MAX_TEMPLATE_NAME_LENGTH = 40;
const MAX_TEMPLATE_CONTENT_LENGTH = 1000;

export function SaveTemplateModal({
  onClose,
  onSave,
  initialValue,
  submitLabel = '저장',
  title = '템플릿으로 저장',
}) {
  const [name, setName] = useState(initialValue?.name || '감사 + 재방문 (친근함)');
  const [content, setContent] = useState(initialValue?.content || '');
  const [selectedCategories, setSelectedCategories] = useState(initialValue?.category || ['감사']);
  const [selectedTags, setSelectedTags] = useState(initialValue?.tags || ['긍정', '이모지']);
  const [saveError, setSaveError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const savingRef = useRef(false);
  // ESC 닫기 · Tab 포커스 가둠 · 이전 포커스 복귀
  const panelRef = useFocusTrap(true, onClose);

  useEffect(() => {
    setName(initialValue?.name || '감사 + 재방문 (친근함)');
    setContent(initialValue?.content || '');
    setSelectedCategories(initialValue?.category || ['감사']);
    setSelectedTags(initialValue?.tags || ['긍정', '이모지']);
  }, [initialValue]);

  // 모달이 열린 동안 배경 스크롤을 막는다.
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleSave = async () => {
    // 연속 클릭으로 템플릿이 여러 개 만들어지지 않도록 막는다.
    if (savingRef.current) return;

    const trimmedName = name.trim();
    const trimmedContent = content.trim();
    if (!trimmedName) {
      setSaveError('템플릿 이름을 입력해 주세요.');
      return;
    }
    if (!trimmedContent) {
      setSaveError('템플릿 내용을 입력해 주세요.');
      return;
    }

    savingRef.current = true;
    setIsSaving(true);
    setSaveError(null);
    try {
      await onSave({ name: trimmedName, content: trimmedContent, category: selectedCategories, tags: selectedTags });
    } catch {
      setSaveError('저장하지 못했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
  };

  const toggleCategory = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((item) => item !== category);
      }
      if (prev.length >= 2) {
        return prev;
      }
      return [...prev, category];
    });
  };

  const toggleTag = (tag) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((item) => item !== tag);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, tag];
    });
  };

  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/50 z-[9999] backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-10 lg:p-20">
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="template-modal-title"
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
            <h2 id="template-modal-title" className="text-lg font-semibold text-neutral-900">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <X className="w-5 h-5 text-neutral-600" aria-hidden="true" />
            </button>
          </div>

          <div className="p-6 pb-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">템플릿 이름</label>
              <input
                type="text"
                value={name}
                onChange={(event) => { setName(event.target.value); setSaveError(null); }}
                maxLength={MAX_TEMPLATE_NAME_LENGTH}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#002B7A] focus:border-transparent"
                placeholder="예: 감사 + 재방문 (친근함)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">템플릿 내용</label>
              <textarea
                value={content}
                onChange={(event) => { setContent(event.target.value); setSaveError(null); }}
                maxLength={MAX_TEMPLATE_CONTENT_LENGTH}
                rows={5}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#002B7A] focus:border-transparent resize-none"
                placeholder="답변 내용을 확인하고 필요한 경우 수정하세요."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                카테고리 <span className="text-xs text-neutral-500">(최대 2개)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    type="button"
                    aria-pressed={selectedCategories.includes(category)}
                    onClick={() => toggleCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedCategories.includes(category)
                      ? 'bg-[#002B7A] text-white shadow-sm'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                추천 태그 <span className="text-xs text-neutral-500">(최대 3개)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    aria-pressed={selectedTags.includes(tag)}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedTags.includes(tag)
                      ? 'bg-[#002B7A] text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {saveError && <InlineError>{saveError}</InlineError>}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                aria-busy={isSaving}
                className="flex-1 px-6 py-3 bg-[#FF5A36CC] hover:bg-[#FF5A36] text-white rounded-xl font-semibold shadow-sm transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {isSaving ? '저장 중…' : submitLabel}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl font-medium transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}

export function SavedTemplatesTab({ templates, onDelete, onUpdate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [copiedId, setCopiedId] = useState(null);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const copyTimerRef = useRef(null);
  const toast = useToast();

  useEffect(() => () => clearTimeout(copyTimerRef.current), []);

  // name/content 가 null 인 템플릿 하나 때문에 탭 전체가 죽지 않도록 방어한다.
  const filteredTemplates = toArray(templates).filter((template) => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    const name = formatText(template?.name, '').toLowerCase();
    const content = formatText(template?.content, '').toLowerCase();
    const matchesSearch = !normalizedSearch || name.includes(normalizedSearch) || content.includes(normalizedSearch);
    const matchesCategory =
      selectedCategory === '전체' || toArray(template?.category).includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const handleCopy = async (content, id) => {
    try {
      await navigator.clipboard.writeText(content || '');
      setCopiedId(id);
      clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error('복사하지 못했어요. 내용을 직접 선택해 복사해 주세요.');
    }
  };

  const handleConfirmDelete = async () => {
    if (isDeleting || deleteTargetId === null) return;
    setIsDeleting(true);
    try {
      await onDelete(deleteTargetId);
      setDeleteTargetId(null);
    } catch {
      /* 오류 안내는 상위(ReviewManagementPage)에서 토스트로 처리한다 */
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="max-w-5xl">
        <div className="mb-6 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="템플릿 검색..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-xl text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#002B7A] focus:border-transparent shadow-sm"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {FILTER_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${selectedCategory === category
                  ? 'bg-[#002B7A] text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onCopy={() => handleCopy(template.content, template.id)}
                onDelete={() => setDeleteTargetId(template.id)}
                onEdit={() => setEditingTemplate(template)}
                copied={copiedId === template.id}
                isDeleting={isDeleting && deleteTargetId === template.id}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-neutral-200">
            <EmptyState
              icon={Search}
              title={searchQuery || selectedCategory !== '전체' ? '조건에 맞는 템플릿이 없어요' : '아직 저장한 템플릿이 없어요'}
              description={
                searchQuery || selectedCategory !== '전체'
                  ? '검색어를 지우거나 다른 카테고리를 선택해 보세요.'
                  : '빠른 설정에서 AI 답변을 만든 뒤 즐겨찾기하면 여기에 쌓여요.'
              }
            />
          </div>
        )}
      </div>

      {editingTemplate && (
        <SaveTemplateModal
          title="템플릿 수정"
          submitLabel="수정"
          initialValue={editingTemplate}
          onClose={() => setEditingTemplate(null)}
          onSave={async (templateMeta) => {
            await onUpdate(editingTemplate.id, {
              ...editingTemplate,
              ...templateMeta,
            });
            setEditingTemplate(null);
          }}
        />
      )}

      {/* 삭제는 되돌릴 수 없으므로 확인을 받는다 */}
      <ConfirmModal
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        isProcessing={isDeleting}
        title="이 템플릿을 삭제할까요?"
        description="삭제한 템플릿은 되돌릴 수 없어요."
        confirmLabel="삭제"
      />
    </>
  );
}

function TemplateCard({ template, onCopy, onDelete, onEdit, copied, isDeleting = false }) {
  const templateName = formatText(template?.name, '이름 없는 템플릿');
  const tags = toArray(template?.tags);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-200 hover:shadow-md transition-shadow">
      <div className="mb-3">
        <h3 className="font-semibold text-neutral-900 mb-2 break-keep">{templateName}</h3>
        <div className="flex items-center gap-3 text-sm text-neutral-600 mb-3 flex-wrap">
          {template?.tone && (
            <span className="px-2 py-1 bg-[#002B7A1A] text-[#002B7A] rounded-md font-medium">
              {template.tone}
            </span>
          )}
          {template?.length && (
            <span className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded-md">
              {template.length}
            </span>
          )}
        </div>
      </div>

      <p className="text-sm text-neutral-700 leading-relaxed mb-4 line-clamp-3">
        {formatText(template?.content, '내용이 비어 있어요.')}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {tags.slice(0, 3).map((tag) => (
          <span key={tag} className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded text-xs">
            {tag}
          </span>
        ))}
        {tags.length > 3 && (
          <span className="px-2 py-0.5 text-neutral-500 text-xs">
            +{tags.length - 3}개 더보기
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onCopy}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#002B7A] hover:bg-[#002B7AE6] text-white rounded-lg font-medium transition-colors
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" aria-hidden="true" />
              복사됨!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" aria-hidden="true" />
              복사
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          title="수정"
          aria-label={`${templateName} 템플릿 수정`}
        >
          <Edit3 className="w-4 h-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
          className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          title="삭제"
          aria-label={`${templateName} 템플릿 삭제`}
        >
          <Trash2 className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
