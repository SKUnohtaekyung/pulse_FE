import { X, Search, Copy, Edit3, Trash2, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const CATEGORIES = ['감사', '사진 감사', '재방문', '메뉴 추천', '사과 & 고객지원'];
const SUGGESTED_TAGS = ['긍정', '캐주얼', '이모지', '사진', '격식', '친근함'];
const FILTER_CATEGORIES = ['전체', ...CATEGORIES];

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

  useEffect(() => {
    setName(initialValue?.name || '감사 + 재방문 (친근함)');
    setContent(initialValue?.content || '');
    setSelectedCategories(initialValue?.category || ['감사']);
    setSelectedTags(initialValue?.tags || ['긍정', '이모지']);
  }, [initialValue]);

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
      <div className="fixed inset-0 bg-black/50 z-[9999] backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-20 pb-20">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
            <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
            <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-neutral-600" />
            </button>
          </div>

          <div className="p-6 pb-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">템플릿 이름</label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#002B7A] focus:border-transparent"
                placeholder="예: 감사 + 재방문 (친근함)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">템플릿 내용</label>
              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
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

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => onSave({ name, content, category: selectedCategories, tags: selectedTags })}
                className="flex-1 px-6 py-3 bg-[#FF5A36CC] hover:bg-[#FF5A36] text-white rounded-xl font-semibold shadow-sm transition-colors"
              >
                {submitLabel}
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl font-medium transition-colors"
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

  const filteredTemplates = templates.filter((template) => {
    const normalizedSearch = searchQuery.toLowerCase();
    const matchesSearch =
      template.name.toLowerCase().includes(normalizedSearch) ||
      template.content.toLowerCase().includes(normalizedSearch);
    const matchesCategory =
      selectedCategory === '전체' || (template.category || []).includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const handleCopy = async (content, id) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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
                onDelete={() => onDelete(template.id)}
                onEdit={() => setEditingTemplate(template)}
                copied={copiedId === template.id}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-neutral-200 text-center">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">템플릿을 찾을 수 없습니다</h3>
              <p className="text-neutral-600 text-sm">
                {searchQuery || selectedCategory !== '전체'
                  ? '검색어나 필터를 조정해보세요'
                  : 'AI 답변 생성에서 첫 템플릿을 저장해보세요'}
              </p>
            </div>
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
    </>
  );
}

function TemplateCard({ template, onCopy, onDelete, onEdit, copied }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-200 hover:shadow-md transition-shadow">
      <div className="mb-3">
        <h3 className="font-semibold text-neutral-900 mb-2">{template.name}</h3>
        <div className="flex items-center gap-3 text-sm text-neutral-600 mb-3">
          <span className="px-2 py-1 bg-[#002B7A1A] text-[#002B7A] rounded-md font-medium">
            {template.tone}
          </span>
          <span className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded-md">
            {template.length}
          </span>
        </div>
      </div>

      <p className="text-sm text-neutral-700 leading-relaxed mb-4 line-clamp-3">{template.content}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {(template.tags || []).slice(0, 3).map((tag) => (
          <span key={tag} className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded text-xs">
            {tag}
          </span>
        ))}
        {(template.tags || []).length > 3 && (
          <span className="px-2 py-0.5 text-neutral-500 text-xs">
            +{template.tags.length - 3}개 더보기
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onCopy}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#002B7A] hover:bg-[#002B7AE6] text-white rounded-lg font-medium transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              복사됨!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              복사
            </>
          )}
        </button>
        <button
          onClick={onEdit}
          className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors"
          title="수정"
        >
          <Edit3 className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
          title="삭제"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
