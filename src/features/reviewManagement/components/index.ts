/**
 * ============================================================================
 * COMPONENTS INDEX
 * ============================================================================
 * 모든 컴포넌트의 중앙 export 파일
 * 이 파일을 통해 깔끔한 import 경로를 제공합니다.
 * 
 * 사용 예시:
 * import { ReviewCard, AIAssistant, SaveTemplateModal } from './components';
 * ============================================================================
 */

// Shared Components
export { Header, Toast, GenerateButton } from './SharedComponents';
export type { TabType } from './SharedComponents';

// Review Components
export { ReviewCard, ReviewDashboard } from './ReviewComponents';
export { ReviewSummary } from './ReviewSummary';
export type { Review } from './ReviewComponents';

// AI Components
export { AIAssistant } from './AIComponents';
export type { Tone, Length, Settings, GeneratedReply } from './AIComponents';

// Template Components
export { SaveTemplateModal, SavedTemplatesTab } from './TemplateComponents';
export type { SavedTemplate } from './TemplateComponents';
