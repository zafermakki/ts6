import { Heart } from 'lucide-react';
import UserAvatar from '../../../components/common/UserAvatar';

export default function CommentList({ comments }) {
  if (!comments.length) return <div className="comments-empty">No comments yet. Start the conversation ✨</div>;
  return <div className="comment-list">{comments.map((comment) => {
    const user = comment.user || {};
    const name = user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'Community member';
    return <article className="comment-item" key={comment.id}><UserAvatar user={{ ...user, firstName: user.firstName || name.split(' ')[0], lastName: user.lastName || name.split(' ').slice(1).join(' ') }} /><div className="comment-content"><div className="comment-bubble"><strong>{name}</strong><p>{comment.body}</p></div><div className="comment-meta"><span>{comment.isLocal ? 'Just now' : 'Community comment'}</span><span className="comment-like-count"><Heart size={12} /> {comment.likes || 0}</span></div></div></article>;
  })}</div>;
}
