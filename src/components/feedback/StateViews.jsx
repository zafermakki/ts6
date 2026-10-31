import { AlertCircle, Inbox, LoaderCircle, RefreshCw } from 'lucide-react';

export function LoadingState({ label = 'Loading your feed...' }) {
  return <div className="state-view"><LoaderCircle className="spin state-icon" size={30} /><strong>{label}</strong><span>Just a moment while we bring everything together.</span></div>;
}

export function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return <div className="state-view state-error"><AlertCircle className="state-icon" size={30} /><strong>We hit a little bump</strong><span>{message}</span>{onRetry && <button className="button button-soft" onClick={onRetry}><RefreshCw size={15} /> Try again</button>}</div>;
}

export function EmptyState({ title = 'Nothing here yet', message = 'Try changing your search or check back later.' }) {
  return <div className="state-view"><Inbox className="state-icon" size={32} /><strong>{title}</strong><span>{message}</span></div>;
}

export function InlineLoader() {
  return <div className="inline-loader"><LoaderCircle className="spin" size={18} /> Loading more posts…</div>;
}
