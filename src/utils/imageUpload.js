/**
 * 이미지 업로드 검증 유틸리티.
 *
 * 파일별로 통과/실패를 판정해, 잘못된 파일만 제외하고 정상 파일은 유지한다.
 * 실패 사유는 파일명과 함께 사용자에게 그대로 보여줄 수 있는 한국어 문구다.
 */

import {
    ALLOWED_IMAGE_EXTENSIONS,
    ALLOWED_IMAGE_MIME_TYPES,
    MAX_ASPECT_RATIO,
    MAX_FILE_NAME_LENGTH,
    MAX_IMAGE_COUNT,
    MAX_IMAGE_DIMENSION,
    MAX_IMAGE_SIZE_BYTES,
    MIN_IMAGE_DIMENSION,
// 확장자를 명시해 Vite 밖(노드 테스트 실행)에서도 그대로 불러올 수 있게 한다.
} from '../constants/upload.js';
import { formatFileSize } from './safeFormat.js';

const getExtension = (name) => {
    const match = /\.([a-zA-Z0-9]+)$/.exec(name || '');
    return match ? match[1].toLowerCase() : '';
};

/** 표시용으로 파일명을 줄인다. 매우 긴 파일명이 레이아웃을 깨지 않도록. */
export const shortenFileName = (name, max = 24) => {
    const safe = typeof name === 'string' && name.trim() ? name.trim() : '이미지';
    if (safe.length <= max) return safe;
    const ext = getExtension(safe);
    const head = safe.slice(0, max - ext.length - 4);
    return ext ? `${head}….${ext}` : `${head}…`;
};

/**
 * 동기 검증 — 타입·용량·파일명. (해상도는 이미지 디코딩이 필요해 비동기)
 * @returns {string|null} 실패 사유(사용자 문구) 또는 null
 */
const validateFileMeta = (file) => {
    if (!file || typeof file !== 'object') return '파일을 읽을 수 없어요.';

    if (typeof file.size !== 'number' || file.size === 0) {
        return '내용이 비어 있는 파일이에요. 다른 이미지를 선택해 주세요.';
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
        return `용량이 너무 커요. ${formatFileSize(MAX_IMAGE_SIZE_BYTES)} 이하 이미지를 올려 주세요. (현재 ${formatFileSize(file.size)})`;
    }

    if (typeof file.name === 'string' && file.name.length > MAX_FILE_NAME_LENGTH) {
        return '파일 이름이 너무 길어요. 이름을 줄인 후 다시 올려 주세요.';
    }

    const mime = (file.type || '').toLowerCase();
    const extension = getExtension(file.name);

    if (!mime || !ALLOWED_IMAGE_MIME_TYPES.includes(mime)) {
        return 'JPG · PNG · WEBP 이미지만 올릴 수 있어요.';
    }

    if (!extension || !ALLOWED_IMAGE_EXTENSIONS.includes(extension)) {
        return '지원하지 않는 확장자예요. JPG · PNG · WEBP 파일을 올려 주세요.';
    }

    // 확장자와 실제 형식이 어긋나는 파일 (예: exe 를 png 로 바꾼 경우 일부 탐지)
    const mimeMatchesExtension =
        (mime === 'image/jpeg' && (extension === 'jpg' || extension === 'jpeg')) ||
        (mime === 'image/png' && extension === 'png') ||
        (mime === 'image/webp' && extension === 'webp');

    if (!mimeMatchesExtension) {
        return '파일 형식과 확장자가 서로 달라요. 원본 이미지를 다시 올려 주세요.';
    }

    return null;
};

/**
 * 이미지를 실제로 디코딩해 손상 여부·해상도를 확인한다.
 * @returns {Promise<{ ok: true, width: number, height: number, previewUrl: string } | { ok: false, reason: string }>}
 */
const validateImageContent = (file) =>
    new Promise((resolve) => {
        let previewUrl;
        try {
            previewUrl = URL.createObjectURL(file);
        } catch {
            resolve({ ok: false, reason: '미리보기를 만들지 못했어요. 다른 이미지를 선택해 주세요.' });
            return;
        }

        const image = new Image();
        let settled = false;

        const finish = (result) => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            if (!result.ok) URL.revokeObjectURL(previewUrl);
            resolve(result);
        };

        // 디코딩이 끝나지 않는 파일 대비 — 무한 대기를 막는다.
        const timer = setTimeout(
            () => finish({ ok: false, reason: '이미지를 확인하는 데 실패했어요. 다른 이미지를 선택해 주세요.' }),
            10000,
        );

        image.onload = () => {
            const width = image.naturalWidth;
            const height = image.naturalHeight;

            if (!width || !height) {
                finish({ ok: false, reason: '손상된 이미지예요. 다른 이미지를 선택해 주세요.' });
                return;
            }
            if (width < MIN_IMAGE_DIMENSION || height < MIN_IMAGE_DIMENSION) {
                finish({
                    ok: false,
                    reason: `해상도가 너무 낮아요. 가로·세로 ${MIN_IMAGE_DIMENSION}px 이상 이미지를 올려 주세요.`,
                });
                return;
            }
            if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
                finish({ ok: false, reason: '해상도가 너무 커요. 크기를 줄인 후 다시 올려 주세요.' });
                return;
            }

            const ratio = Math.max(width, height) / Math.min(width, height);
            if (ratio > MAX_ASPECT_RATIO) {
                finish({ ok: false, reason: '가로세로 비율이 너무 길어요. 일반 비율의 사진을 올려 주세요.' });
                return;
            }

            finish({ ok: true, width, height, previewUrl });
        };

        image.onerror = () => finish({ ok: false, reason: '손상된 이미지예요. 다른 이미지를 선택해 주세요.' });
        image.src = previewUrl;
    });

/** 같은 파일인지 판별 (이름 + 크기 + 수정 시각) */
const makeFileKey = (file) => `${file.name}::${file.size}::${file.lastModified ?? 0}`;

/**
 * 새로 선택된 파일들을 검증해 수용 가능한 것만 골라낸다.
 *
 * @param {FileList|File[]} fileList
 * @param {Array<{ key: string }>} existingImages 이미 등록된 이미지
 * @returns {Promise<{ accepted: Array, rejected: Array<{ name: string, reason: string }> }>}
 */
export const validateImageFiles = async (fileList, existingImages = []) => {
    const files = Array.from(fileList || []);
    const accepted = [];
    const rejected = [];

    const existingKeys = new Set(existingImages.map((image) => image.key));
    let remainingSlots = Math.max(0, MAX_IMAGE_COUNT - existingImages.length);

    for (const file of files) {
        const displayName = shortenFileName(file?.name);

        if (remainingSlots <= 0) {
            rejected.push({ name: displayName, reason: `이미지는 최대 ${MAX_IMAGE_COUNT}장까지 등록할 수 있어요.` });
            continue;
        }

        const key = makeFileKey(file);
        if (existingKeys.has(key)) {
            rejected.push({ name: displayName, reason: '이미 등록한 이미지예요.' });
            continue;
        }

        const metaError = validateFileMeta(file);
        if (metaError) {
            rejected.push({ name: displayName, reason: metaError });
            continue;
        }

        // 장수 상한이 작아 순차 처리로 충분하고, 동시에 여러 장을 디코딩하지 않아 메모리도 안정적이다.
        const content = await validateImageContent(file);
        if (!content.ok) {
            rejected.push({ name: displayName, reason: content.reason });
            continue;
        }

        existingKeys.add(key);
        remainingSlots -= 1;
        accepted.push({
            key,
            file,
            name: file.name,
            displayName,
            size: file.size,
            width: content.width,
            height: content.height,
            previewUrl: content.previewUrl,
        });
    }

    return { accepted, rejected };
};

/** 미리보기 objectURL 해제 — 누수 방지 */
export const releasePreview = (image) => {
    if (image?.previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(image.previewUrl);
    }
};

export const releasePreviews = (images = []) => images.forEach(releasePreview);
