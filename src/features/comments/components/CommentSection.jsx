import { MessageCircle, Sparkles } from 'lucide-react';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

export default function CommentSection({ comments, loading, error, onAddComment, onRetry }) {
  return (
    <section className="comments-panel card-surface">
      <div className="comments-heading">
        <div><span className="section-kicker">COMMUNITY VOICES</span><h2><MessageCircle size={19} /> Comments <span>{comments.length}</span></h2></div>
        <span className="comments-live"><i /> OPEN DISCUSSION</span>
      </div>
      <CommentForm onSubmit={onAddComment} />
      {loading ? <div className="comments-loading">Loading comments…</div> : error ? <div className="comments-error">{error} {onRetry && <button className="comment-retry" onClick={onRetry}>Try again</button>}</div> : <CommentList comments={comments} />}
      <div className="kindness-note"><Sparkles size={17} /> Keep it kind. Every perspective makes the conversation richer.</div>
    </section>
  );
}
