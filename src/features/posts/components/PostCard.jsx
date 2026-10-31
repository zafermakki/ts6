import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEngagement } from '../../../context/EngagementContext';
import { compactNumber } from '../../../utils/format';
import PostHeader from './PostHeader';
import PostActions from './PostActions';

export default function PostCard({ post, author, compact = false }) {
  const { likeCount } = useEngagement();

  return (
    <article className={`post-card card-surface ${compact ? 'post-card-compact' : ''}`}>
      <PostHeader post={post} author={author} />
      <Link to={`/posts/${post.id}`} className="post-main-link">
        {post.title && !post.isLocal && <h2 className="post-title">{post.title}</h2>}
        <p className="post-body">{post.body}</p>
      </Link>
      {post.tags?.length > 0 && <div className="tag-row">{post.tags.slice(0, 3).map((tag) => <span className="post-tag" key={tag}># {tag}</span>)}</div>}
      <div className="post-stats"><span>{compactNumber(likeCount(post))} likes</span><span>{compactNumber(post.views || 0)} views</span><Link to={`/posts/${post.id}`}>{post.isLocal ? 'Be the first to comment' : 'View conversation'}</Link></div>
      <PostActions post={post} />
      {post.isLocal && <div className="local-post-note"><Sparkles size={13} /> Published locally for this demo</div>}
    </article>
  );
}
