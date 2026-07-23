import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import ErrorBoundary from './components/common/ErrorBoundary.jsx'
import { verifyEnv } from './config/env.js'
import './styles/globals.css'

// 개발 환경에서 필수 환경변수 누락을 콘솔에 명확히 알린다. (운영에서는 아무것도 하지 않음)
verifyEnv()

// dev 모드 전용: 사장님 자동 로그인 시 통합 목 사장님 응답을 돌려주는
// fetch 인터셉터를 설치한다. (프로덕션 번들에서는 동적 import 로 제외)
if (import.meta.env.DEV) {
    import('./dev/installDevApiMock').then(({ installDevApiMock }) => installDevApiMock())
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {/* 라우터보다 바깥에 두어, 라우터 자체가 실패해도 흰 화면이 되지 않게 한다 */}
        <ErrorBoundary name="AppRoot">
            <BrowserRouter basename={import.meta.env.BASE_URL}>
                <App />
            </BrowserRouter>
        </ErrorBoundary>
    </React.StrictMode>,
)
