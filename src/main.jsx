import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles/globals.css'

// dev 모드 전용: 사장님 자동 로그인 시 통합 목 사장님 응답을 돌려주는
// fetch 인터셉터를 설치한다. (프로덕션 번들에서는 동적 import 로 제외)
if (import.meta.env.DEV) {
    import('./dev/installDevApiMock').then(({ installDevApiMock }) => installDevApiMock())
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
            <App />
        </BrowserRouter>
    </React.StrictMode>,
)
