import React from 'react';

class V2ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("V2ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="p-4 border border-red-200 bg-red-50 rounded-[16px] text-sm text-red-600 flex flex-col items-center justify-center min-h-[80px]">
                    <p className="font-bold">위젯 렌더링 오류</p>
                    <p className="text-xs opacity-80 text-center mt-1 break-all">
                        {this.state.error?.message || '지원하지 않는 데이터 형식입니다.'}
                    </p>
                </div>
            );
        }

        return this.props.children;
    }
}

export default V2ErrorBoundary;
