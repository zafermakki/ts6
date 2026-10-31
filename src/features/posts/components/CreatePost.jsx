import { LoaderCircle, Send, Smile } from 'lucide-react';
import { useState } from 'react';
import UserAvatar from '../../../components/common/UserAvatar';

const DEMO_USER = { id: 1, firstName: 'Emily', lastName: 'Johnson', username: 'emilys', image: 'https://dummyjson.com/icon/emilys/128' };

export default function CreatePost({ onCreate }) {
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    const content = body.trim();
    if (!content) return setError('Write something before publishing your post.');
    setSubmitting(true);
    setError('');
    try {
      await onCreate(content);
      setBody('');
    } catch (err) {
      setError(err.message || 'Your post could not be published. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="composer card-surface" onSubmit={handleSubmit}>
      <div className="composer-top"><UserAvatar user={DEMO_USER} size="lg" /><div className="composer-input-wrap"><textarea value={body} onChange={(event) => { setBody(event.target.value); if (error) setError(''); }} placeholder="Share something with your community…" rows={2} maxLength={500} aria-label="Write a post" /></div></div>
      {error && <p className="form-error">{error}</p>}
      <div className="composer-footer"><div className="composer-tools"><span className="composer-hint"><Smile size={16} /> Make someone's day</span><span className="char-count">{body.length}/500</span></div><button className="button button-primary publish-button" disabled={submitting || !body.trim()} type="submit">{submitting ? <LoaderCircle className="spin" size={16} /> : <Send size={15} />} Publish</button></div>
    </form>
  );
}
