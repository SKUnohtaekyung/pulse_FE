import React from 'react';

/**
 * 전역/구역 단위 렌더링 오류 경계.
 *
 * 이 컴포넌트의 fallback UI 는 의도적으로 단순하게 유지한다.
 * (framer-motion·react-router·API 등 외부 의존을 쓰지 않아,
 *  경계 안에서 또 오류가 나는 상황을 만들지 않는다)
 *
 * props
 * - variant: 'page' | 'section'  기본 'page'
 * - title / description: 문구 재정의
 * - onReset: 재시도 시 부모 상태도 함께 초기화하고 싶을 때
 * - resetKeys: 값이 바뀌면 오류 상태를 자동 해제 (라우트 이동 등)
 * - name: 개발 로그에 남길 위치 라벨
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, errorKey: 0 };
        this.handleRetry = this.handleRetry.bind(this);
        this.handleGoHome = this.handleGoHome.bind(this);
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        const label = this.props.name || 'ErrorBoundary';
        // 운영 환경에서도 개발자가 위치를 확인할 수 있도록 콘솔에는 남긴다.
        // 사용자 화면에는 이 정보를 절대 노출하지 않는다.
        console.error(`[PULSE] ${label} 렌더링 오류`, error, errorInfo?.componentStack);
    }

    componentDidUpdate(prevProps) {
        const { resetKeys } = this.props;
        if (!this.state.hasError || !resetKeys) return;

        const prevKeys = prevProps.resetKeys || [];
        const changed = resetKeys.length !== prevKeys.length || resetKeys.some((key, index) => key !== prevKeys[index]);
        if (changed) this.setState({ hasError: false });
    }

    handleRetry() {
        this.props.onReset?.();
        // key 를 바꿔 하위 트리를 완전히 새로 마운트한다.
        this.setState((prev) => ({ hasError: false, errorKey: prev.errorKey + 1 }));
    }

    handleGoHome() {
        const base = import.meta.env.BASE_URL || '/';
        window.location.assign(base);
    }

    render() {
        if (!this.state.hasError) {
            return <React.Fragment key={this.state.errorKey}>{this.props.children}</React.Fragment>;
        }

        if (this.props.fallback) return this.props.fallback;

        const isSection = this.props.variant === 'section';
        const title = this.props.title || '화면을 불러오는 중 문제가 발생했어요';
        const description = this.props.description || '잠시 후 다시 시도하거나 홈으로 이동해 주세요.';

        const retryButton = (
            <button
                type="button"
                onClick={this.handleRetry}
                className="inline-flex items-center justify-center h-10 px-6 rounded-xl bg-primary text-white text-btn-sub
                           transition-colors duration-200 hover:bg-primary-hover
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
                다시 시도
            </button>
        );

        if (isSection) {
            return (
                <div
                    role="alert"
                    className="w-full min-h-[120px] flex flex-col items-center justify-center gap-3 p-6 text-center
                               bg-bg-card border border-neutral-200 rounded-[16px]"
                >
                    <p className="text-body-6 text-text-main">{title}</p>
                    <p className="text-caption text-neutral-600 max-w-[280px] break-keep">{description}</p>
                    {retryButton}
                </div>
            );
        }

        return (
            <div
                role="alert"
                className="w-full min-h-[60dvh] flex flex-col items-center justify-center gap-4 px-6 py-10 text-center"
            >
                <div className="w-14 h-14 rounded-full bg-point-bg flex items-center justify-center" aria-hidden="true">
                    <span className="text-point text-head-5 font-bold">!</span>
                </div>
                <h1 className="text-head-5 text-text-main break-keep">{title}</h1>
                <p className="text-body-7 text-neutral-600 max-w-[320px] break-keep">{description}</p>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    {retryButton}
                    <button
                        type="button"
                        onClick={this.handleGoHome}
                        className="inline-flex items-center justify-center h-10 px-6 rounded-xl border border-primary-border text-primary text-btn-sub
                                   transition-colors duration-200 hover:bg-primary-tint
                                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                        홈으로 이동
                    </button>
                </div>
            </div>
        );
    }
}

export default ErrorBoundary;
