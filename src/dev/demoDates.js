/**
 * 전시 데모용 날짜 유틸 — 모든 목 데이터 날짜를 "오늘" 기준 상대값으로 만든다.
 * 전시 날짜가 바뀌어도 리뷰·제안·추이가 항상 최근 데이터처럼 보인다.
 */

const pad = (n) => String(n).padStart(2, '0');
const shiftDays = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};
/** 2026-10-14 형식 (API createdAt 용) */
export const isoDate = (days = 0) => {
  const d = shiftDays(days);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
/** 2026.10.14 형식 (화면 표기용) */
export const dotDate = (days = 0) => isoDate(days).replace(/-/g, '.');
/** 10.20 ~ 10.31 형식 기간 */
export const dateRange = (fromDays, toDays) => {
  const from = shiftDays(fromDays);
  const to = shiftDays(toDays);
  return `${from.getFullYear()}.${pad(from.getMonth() + 1)}.${pad(from.getDate())} ~ ${pad(to.getMonth() + 1)}.${pad(to.getDate())}`;
};
