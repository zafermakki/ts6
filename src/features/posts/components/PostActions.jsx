import { useState } from 'react';
import { Bookmark, Heart, MessageCircle, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEngagement } from '../../../context/EngagementContext';

export default function PostActions({ post }) {
  const { isLiked, toggleLike } = useEngagement();
  const [saved, setSaved] = useState(false);
  const liked = isLiked(post.id);

  async function sharePost() {
    const url = `${window.location.origin}/posts/${post.id}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt('Copy this post link:', url);
    }
  }

  return (
    <div className="post-actions">
      <button className={`post-action ${liked ? 'is-liked' : ''}`} onClick={() => toggleLike(post.id)} aria-pressed={liked}>
        <Heart size={18} fill={liked ? 'currentColor' : 'none'} /> <span>{liked ? 'Liked' : 'Like'}</span>
      </button>
      <Link className="post-action" to={`/posts/${post.id}`}><MessageCircle size={18} /><span>Comment</span></Link>
      <button className={`post-action ${saved ? 'is-saved' : ''}`} onClick={() => setSaved((value) => !value)} aria-pressed={saved}>
        <Bookmark size={17} fill={saved ? 'currentColor' : 'none'} /><span>{saved ? 'Saved' : 'Save'}</span>
      </button>
      <button className="post-action share-action" onClick={sharePost}><Share2 size={17} /><span>Share</span></button>
    </div>
  );
}
