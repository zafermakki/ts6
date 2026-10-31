import { MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import UserAvatar from '../../../components/common/UserAvatar';
import { timeAgo } from '../../../utils/format';

export default function PostHeader({ post, author }) {
  const displayName = author ? `${author.firstName} ${author.lastName}` : `Member ${post.userId}`;
  return (
    <div className="post-topline">
      <div className="post-author">
        <Link to={`/users/${post.userId}`} className="avatar-link"><UserAvatar user={author} size="lg" /></Link>
        <div className="author-copy">
          <Link to={`/users/${post.userId}`} className="author-name">{displayName}</Link>
          <span className="author-meta">@{author?.username || `member${post.userId}`} <i /> {post.createdAt ? timeAgo(post.createdAt) : 'Community post'}</span>
        </div>
      </div>
      <span className="post-menu-mark" aria-hidden="true"><MoreHorizontal size={20} /></span>
    </div>
  );
}
