/**
 * Kakao Map SDK Dynamic Loader
 * 환경변수에서 API 키를 가져와 SDK를 동적으로 로드합니다.
 */

let isLoading = false;
let isLoaded = false;
let loadPromise = null;

export const loadKakaoMapSDK = () => {
    // 이미 로드됨
    if (window.kakao?.maps) {
        return Promise.resolve(window.kakao);
    }

    // 로딩 중이면 기존 Promise 반환
    if (isLoading && loadPromise) {
        return loadPromise;
    }

    // 새로 로드
    isLoading = true;
    loadPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        const apiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY;

        // 상세 디버깅
        console.log('🔑 환경변수 확인:', {
            apiKey,
            apiKeyType: typeof apiKey,
            apiKeyLength: apiKey?.length,
            allEnvKeys: Object.keys(import.meta.env),
            VITE_KAKAO_MAP_API_KEY: import.meta.env.VITE_KAKAO_MAP_API_KEY
        });

        if (!apiKey) {
            reject(new Error('Kakao Map API 키가 설정되지 않았습니다. .env 파일을 확인해주세요.'));
            isLoading = false;
            return;
        }

        const scriptUrl = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services&autoload=false`;
        console.log('📡 SDK 로드 시도:', scriptUrl);

        script.src = scriptUrl;
        script.async = true;

        script.onload = () => {
            console.log('✅ SDK 스크립트 다운로드 성공');
            if (window.kakao?.maps) {
                window.kakao.maps.load(() => {
                    isLoaded = true;
                    isLoading = false;
                    console.log('✅ Kakao Map SDK 로드 성공');
                    resolve(window.kakao);
                });
            } else {
                isLoading = false;
                console.error('❌ window.kakao.maps가 없음');
                reject(new Error('Kakao Map SDK 로드 실패'));
            }
        };

        script.onerror = (error) => {
            isLoading = false;
            console.error('❌ SDK 스크립트 로드 실패:', error);
            console.error('📡 실패한 URL:', scriptUrl);

            const errorMsg = `Kakao Map SDK 스크립트 로드 실패.
            
가능한 원인:
1. Kakao Developers에서 Web 플랫폼이 등록되지 않았습니다.
2. 사이트 도메인(http://localhost:5173)이 등록되지 않았습니다.
3. 네트워크 연결을 확인해주세요.
4. API 키가 유효하지 않을 수 있습니다.

해결 방법:
- https://developers.kakao.com 접속
- 내 애플리케이션 > 앱 설정 > 플랫폼
- Web 플랫폼 추가 후 http://localhost:5173 등록
- F12 > Network 탭에서 sdk.js 요청 상태 확인`;

            reject(new Error(errorMsg));
        };

        document.head.appendChild(script);
    });

    return loadPromise;
};
