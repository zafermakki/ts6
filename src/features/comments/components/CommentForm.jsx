import { useState } from 'react';
import { LoaderCircle, Send } from 'lucide-react';
import UserAvatar from '../../../components/common/UserAvatar';

const DEMO_USER = { firstName: 'Emily', lastName: 'Johnson', image: 'https://dummyjson.com/icon/emilys/128' };

export default function CommentForm({ onSubmit }) {
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    if (!body.trim()) return;
    setSubmitting(true);
    setError('');
    try { await onSubmit(body.trim()); setBody(''); }
    catch (err) { setError(err.message || 'Could not add comment.'); }
    finally { setSubmitting(false); }
  }

  return <form className="comment-form" onSubmit={handleSubmit}><UserAvatar user={DEMO_USER} /><div className="comment-input-group"><input value={body} onChange={(event) => setBody(event.target.value)} placeholder="Write a thoughtful comment…" maxLength={240} aria-label="Write a comment" /><button type="submit" className="send-comment" disabled={!body.trim() || submitting} aria-label="Send comment">{submitting ? <LoaderCircle className="spin" size={17} /> : <Send size={17} />}</button>{error && <small className="form-error">{error}</small>}</div></form>;
}
