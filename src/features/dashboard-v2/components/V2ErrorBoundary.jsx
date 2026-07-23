import React from 'react';
import ErrorBoundary from '../../../components/common/ErrorBoundary';

/**
 * 대시보드 위젯용 오류 경계.
 *
 * 공통 ErrorBoundary 의 section 변형을 그대로 쓴다.
 * (예전에는 error.message 원문을 사용자에게 그대로 보여주고 재시도 경로도 없었다)
 */
const V2ErrorBoundary = ({ children, name = 'DashboardWidget', title, description }) => (
    <ErrorBoundary
        variant="section"
        name={name}
        title={title || '이 위젯을 표시하지 못했어요'}
        description={description || '다른 정보는 그대로 확인할 수 있어요. 잠시 후 다시 시도해 주세요.'}
    >
        {children}
    </ErrorBoundary>
);

export default V2ErrorBoundary;
