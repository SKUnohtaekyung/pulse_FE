/**
 * 이미지 업로드 제약 조건 단일 관리 지점.
 *
 * ⚠️ 백엔드와 맞춰야 하는 값 ⚠️
 * 현재 레포에는 서버가 실제로 허용하는 용량·해상도 제한이 정의된 곳이 없어,
 * 일반적인 이미지 업로드 기준으로 잡아 두었다.
 * 백엔드(FastAPI /info/generate)의 실제 제한이 확정되면 이 파일의 값만 바꾸면
 * 검증 로직과 안내 문구가 함께 갱신된다.
 */

/** 홍보 영상 1건에 사용할 수 있는 이미지 최대 장수 */
export const MAX_IMAGE_COUNT = 3;

/** 파일 1장당 최대 용량 (바이트) */
export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

/** 허용 MIME 타입 */
export const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/** 허용 확장자 (MIME 과 교차 검증에 사용) */
export const ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

/** input accept 속성값 */
export const IMAGE_ACCEPT_ATTR = ALLOWED_IMAGE_MIME_TYPES.join(',');

/** 해상도 하한 — 이보다 작으면 영상 품질이 급격히 나빠진다 */
export const MIN_IMAGE_DIMENSION = 200;

/** 해상도 상한 — 브라우저 메모리 보호 */
export const MAX_IMAGE_DIMENSION = 8000;

/** 허용 가로세로 비율 범위 (긴 변 / 짧은 변) */
export const MAX_ASPECT_RATIO = 4;

/** 파일명 길이 상한 (서버 저장 경로 보호) */
export const MAX_FILE_NAME_LENGTH = 200;

/** 업로드 전에 사용자에게 보여줄 안내 문구 (단일 출처) */
export const UPLOAD_GUIDE_TEXT = `JPG · PNG · WEBP / 최대 ${MAX_IMAGE_COUNT}장 / 1장당 ${Math.round(
    MAX_IMAGE_SIZE_BYTES / (1024 * 1024),
)}MB 이하`;

/** 업로드 순서가 영상 장면 순서와 연결된다는 안내 */
export const UPLOAD_ORDER_NOTICE = '등록한 순서대로 영상 장면에 사용돼요.';
