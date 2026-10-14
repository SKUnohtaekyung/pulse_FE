/**
 * 전시 데모용 범계 든든국밥 주변 상권 스냅샷 (반경 m → 상권 리포트).
 *
 * 카카오 사용량 한도·전시장 네트워크 문제로 실시간 조회가 실패하고,
 * 브라우저에 저장된 최근 결과(localStorage 'pulseDemoMarketSnapshot')도 없을 때 쓰는 최후 대체본.
 * 실제 카카오 조회 결과를 그대로 저장해 채운다 (데모 모드에서 상권 분석을 한 번 성공시킨 뒤
 * localStorage 'pulseDemoMarketSnapshot' 값을 옮겨 담는다).
 */
export const MARKET_SNAPSHOT = {};
