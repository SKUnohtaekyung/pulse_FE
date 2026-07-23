/**
 * 핵심 유틸리티 최소 테스트.
 *
 * 별도 테스트 프레임워크를 도입하지 않고 Node 내장 러너(node:test)만 사용한다.
 *   npm test
 *
 * 대상은 "화면이 죽거나 이상한 값이 노출되는" 것을 막는 순수 함수들이다.
 * (DOM·네트워크가 필요한 흐름은 scripts/playwright-*.mjs 스모크에서 다룬다)
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
    EMPTY_PLACEHOLDER,
    calcChangeRate,
    formatDate,
    formatFileSize,
    formatNumber,
    formatPercent,
    formatText,
    safeDivide,
    toArray,
    toFiniteNumber,
    toValidDate,
} from '../src/utils/safeFormat.js';

import {
    ERROR_TYPES,
    isApiError,
    isCanceledError,
    normalizeApiError,
    normalizeHttpError,
} from '../src/utils/apiError.js';

import { shortenFileName } from '../src/utils/imageUpload.js';
import { MAX_IMAGE_COUNT, UPLOAD_GUIDE_TEXT } from '../src/constants/upload.js';

/* ------------------------------------------------------------------ */
/* safeFormat — null / undefined / NaN / Infinity 가 화면에 나오지 않는다 */
/* ------------------------------------------------------------------ */

test('formatNumber: 값이 없거나 유한하지 않으면 placeholder 를 돌려준다', () => {
    for (const value of [null, undefined, NaN, Infinity, -Infinity, '', '   ', 'abc', {}, []]) {
        assert.equal(formatNumber(value), EMPTY_PLACEHOLDER, `실패한 입력: ${String(value)}`);
    }
});

test('formatNumber: 정상 값은 천 단위 구분과 접미사를 적용한다', () => {
    assert.equal(formatNumber(12345), '12,345');
    assert.equal(formatNumber('5210'), '5,210');
    assert.equal(formatNumber(0, { fallback: '0' }), '0');
    assert.equal(formatNumber(1234, { suffix: '회' }), '1,234회');
    assert.equal(formatNumber(12.345, { digits: 1 }), '12.3');
});

test('formatPercent: NaN 은 노출되지 않는다', () => {
    assert.equal(formatPercent(undefined), EMPTY_PLACEHOLDER);
    assert.equal(formatPercent(NaN), EMPTY_PLACEHOLDER);
    assert.equal(formatPercent(12.34, { digits: 1 }), '12.3%');
    assert.equal(formatPercent(5, { withSign: true }), '+5%');
});

test('safeDivide / calcChangeRate: 0 나눗셈이 Infinity 로 새지 않는다', () => {
    assert.equal(safeDivide(10, 0), null);
    assert.equal(safeDivide(10, null), null);
    assert.equal(safeDivide(10, 2), 5);
    assert.equal(calcChangeRate(120, 100), 20);
    assert.equal(calcChangeRate(120, 0), null);
    assert.equal(calcChangeRate(120, undefined), null);
});

test('formatDate: Invalid Date 가 화면에 노출되지 않는다', () => {
    assert.equal(formatDate('not-a-date'), EMPTY_PLACEHOLDER);
    assert.equal(formatDate(null), EMPTY_PLACEHOLDER);
    assert.equal(formatDate(''), EMPTY_PLACEHOLDER);
    assert.equal(formatDate(new Date('2026-03-05T00:00:00Z')).length, 10); // YYYY.MM.DD
    assert.equal(toValidDate('2026-13-45'), null);
});

test('formatText / toArray: 누락된 응답 필드가 그대로 렌더되지 않는다', () => {
    assert.equal(formatText(null, '이름 없음'), '이름 없음');
    assert.equal(formatText('   ', '이름 없음'), '이름 없음');
    assert.equal(formatText(' 든든국밥 '), '든든국밥');
    assert.deepEqual(toArray(null), []);
    assert.deepEqual(toArray('문자열'), []);
    assert.deepEqual(toArray([1, 2]), [1, 2]);
});

test('toFiniteNumber: 숫자로 볼 수 없는 값은 null', () => {
    assert.equal(toFiniteNumber('12'), 12);
    assert.equal(toFiniteNumber(''), null);
    assert.equal(toFiniteNumber('NaN'), null);
    assert.equal(toFiniteNumber(true), null);
    assert.equal(toFiniteNumber(Infinity), null);
});

test('formatFileSize: 사람이 읽을 수 있는 단위로 바꾼다', () => {
    assert.equal(formatFileSize(512), '512B');
    assert.equal(formatFileSize(1024 * 1024 * 10), '10.0MB');
    assert.equal(formatFileSize(undefined), EMPTY_PLACEHOLDER);
});

/* ------------------------------------------------------------------ */
/* apiError — 모든 실패가 사용자 문구로 정규화된다                      */
/* ------------------------------------------------------------------ */

test('normalizeHttpError: 상태 코드별로 사용자 문구와 재시도 여부를 정한다', () => {
    const unauthorized = normalizeHttpError(401, {});
    assert.equal(unauthorized.type, ERROR_TYPES.UNAUTHORIZED);
    assert.equal(unauthorized.retryable, false);

    const serverError = normalizeHttpError(500, {});
    assert.equal(serverError.type, ERROR_TYPES.SERVER_ERROR);
    assert.equal(serverError.retryable, true);

    const tooLarge = normalizeHttpError(413, {});
    assert.equal(tooLarge.type, ERROR_TYPES.PAYLOAD_TOO_LARGE);

    const rateLimited = normalizeHttpError(429, {});
    assert.equal(rateLimited.type, ERROR_TYPES.RATE_LIMITED);
    assert.equal(rateLimited.retryable, true);
});

test('normalizeHttpError: 필드 오류가 있으면 검증 오류로 승격한다', () => {
    const result = normalizeHttpError(400, { errors: { email: '이미 사용 중인 이메일입니다.' } });
    assert.equal(result.type, ERROR_TYPES.VALIDATION_ERROR);
    assert.deepEqual(result.fieldErrors, { email: '이미 사용 중인 이메일입니다.' });
});

test('normalizeHttpError: FastAPI detail 배열도 필드 오류로 읽는다', () => {
    const result = normalizeHttpError(422, { detail: [{ loc: ['body', 'password'], msg: '비밀번호가 너무 짧습니다.' }] });
    assert.equal(result.type, ERROR_TYPES.VALIDATION_ERROR);
    assert.deepEqual(result.fieldErrors, { password: '비밀번호가 너무 짧습니다.' });
});

test('normalizeHttpError: 기술 정보가 섞인 서버 메시지는 사용자에게 노출하지 않는다', () => {
    const leaky = normalizeHttpError(500, { message: 'NullPointerException at com.pulse.Service.load' });
    assert.ok(!leaky.message.includes('Exception'));
    assert.ok(!leaky.message.includes('com.pulse'));

    const urlLeak = normalizeHttpError(500, { message: 'http://localhost:8080/api 에서 오류' });
    assert.ok(!urlLeak.message.includes('http://'));

    const safe = normalizeHttpError(409, { message: '이미 등록된 가게예요.' });
    assert.equal(safe.message, '이미 등록된 가게예요.');
});

test('normalizeApiError: fetch 네트워크 실패를 네트워크 오류로 바꾼다', () => {
    const result = normalizeApiError(new TypeError('Failed to fetch'));
    assert.equal(result.type, ERROR_TYPES.NETWORK_ERROR);
    assert.equal(result.retryable, true);
    assert.ok(result.message.includes('인터넷'));
});

test('normalizeApiError: 취소는 오류로 취급하지 않는다', () => {
    const aborted = { name: 'AbortError' };
    const result = normalizeApiError(aborted);
    assert.equal(result.type, ERROR_TYPES.CANCELED);
    assert.ok(isCanceledError(result));
    assert.ok(isCanceledError(aborted));
});

test('normalizeApiError: JSON 파싱 실패도 사용자 문구로 바꾼다', () => {
    const result = normalizeApiError(new SyntaxError('Unexpected token <'));
    assert.equal(result.type, ERROR_TYPES.PARSE_ERROR);
    assert.ok(!result.message.includes('Unexpected token'));
});

test('normalizeApiError: 이미 정규화된 오류는 그대로 통과시킨다', () => {
    const normalized = normalizeHttpError(404, {});
    assert.equal(normalizeApiError(normalized), normalized);
    assert.ok(isApiError(normalized));
    assert.equal(isApiError(new Error('x')), false);
});

test('정규화된 오류는 항상 한국어 사용자 문구를 가진다', () => {
    const samples = [
        normalizeHttpError(400, {}),
        normalizeHttpError(401, {}),
        normalizeHttpError(403, {}),
        normalizeHttpError(404, {}),
        normalizeHttpError(409, {}),
        normalizeHttpError(413, {}),
        normalizeHttpError(422, {}),
        normalizeHttpError(429, {}),
        normalizeHttpError(500, {}),
        normalizeApiError(new TypeError('Failed to fetch')),
        normalizeApiError(null),
    ];

    for (const error of samples) {
        assert.ok(/[가-힣]/.test(error.message), `한국어 문구가 아님: ${error.message}`);
        assert.ok(!/\b(Error|Exception|undefined|null|NaN)\b/.test(error.message), `기술 용어 노출: ${error.message}`);
    }
});

/* ------------------------------------------------------------------ */
/* 업로드 제약 — 안내 문구와 상수가 한 곳에서 관리된다                   */
/* ------------------------------------------------------------------ */

test('업로드 안내 문구가 최대 장수 상수와 일치한다', () => {
    assert.equal(MAX_IMAGE_COUNT, 3);
    assert.ok(UPLOAD_GUIDE_TEXT.includes(`최대 ${MAX_IMAGE_COUNT}장`));
});

test('shortenFileName: 매우 긴 파일명이 레이아웃을 밀지 않도록 줄인다', () => {
    const long = `${'가'.repeat(120)}.png`;
    const shortened = shortenFileName(long);
    assert.ok(shortened.length <= 24);
    assert.ok(shortened.endsWith('png'));
    assert.equal(shortenFileName(''), '이미지');
    assert.equal(shortenFileName(undefined), '이미지');
    assert.equal(shortenFileName('메뉴.jpg'), '메뉴.jpg');
});
