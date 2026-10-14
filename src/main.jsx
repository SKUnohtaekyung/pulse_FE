import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import ErrorBoundary from './components/common/ErrorBoundary.jsx'
import { DEMO_MODE, verifyEnv } from './config/env.js'
import './styles/globals.css'

// 개발 환경에서 필수 환경변수 누락을 콘솔에 명확히 알린다. (운영에서는 아무것도 하지 않음)
verifyEnv()

const renderApp = () => ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {/* 라우터보다 바깥에 두어, 라우터 자체가 실패해도 흰 화면이 되지 않게 한다 */}
        <ErrorBoundary name="AppRoot">
            <BrowserRouter basename={import.meta.env.BASE_URL}>
                <App />
            </BrowserRouter>
        </ErrorBoundary>
    </React.StrictMode>,
)

// dev / 전시 데모 모드: 백엔드 요청을 목 사장님 응답으로 돌려주는 fetch 인터셉터를 설치한다.
// 첫 화면의 요청부터 가로채야 하므로 설치가 끝난 뒤 렌더링한다.
// (일반 프로덕션 번들에서는 동적 import 로 제외)
if (import.meta.env.DEV || DEMO_MODE) {
    import('./dev/installDevApiMock')
        .then(({ installDevApiMock }) => installDevApiMock())
        .catch((error) => console.warn('[devMock] 인터셉터 설치 실패', error))
        .finally(renderApp)
} else {
    renderApp()
}
