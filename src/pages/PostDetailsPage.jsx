import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import PostCard from '../features/posts/components/PostCard';
import CommentSection from '../features/comments/components/CommentSection';
import useComments from '../features/comments/hooks/useComments';
import { postsService } from '../features/posts/services/postsService';
import { usersService } from '../features/users/services/usersService';
import { readStorage } from '../utils/storage';
import { isCanceledRequest } from '../utils/isCanceledRequest';
import { ErrorState, LoadingState } from '../components/feedback/StateViews';

export default function PostDetailsPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const {
    comments,
    loading: commentsLoading,
    error: commentsError,
    addComment,
    retry: retryComments,
  } = useComments(postId);

  const loadPost = useCallback(async (isActive = () => true) => {
    setLoading(true);
    setError('');

    try {
      const localPosts = readStorage('bluewave-created-posts', []);
      const localPost = localPosts.find(
        (item) => String(item.id) === String(postId),
      );
      const postData = localPost || await postsService.getPostById(postId);
      if (!isActive()) return;

      // The post should remain visible even if the author's profile endpoint fails.
      let userData = null;
      try {
        userData = await usersService.getUserById(postData.userId);
      } catch (authorError) {
        if (isCanceledRequest(authorError)) throw authorError;
        console.warn('Could not load post author:', authorError);
      }

      if (!isActive()) return;
      setPost(postData);
      setAuthor(userData);
    } catch (err) {
      if (isActive() && !isCanceledRequest(err)) {
        setError(err.message || 'Post could not be loaded.');
      }
    } finally {
      if (isActive()) setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    let active = true;
    loadPost(() => active);
    return () => {
      active = false;
    };
  }, [loadPost]);

  if (loading) {
    return <div className="narrow-column"><LoadingState label="Opening conversation…" /></div>;
  }

  if (error || !post) {
    return (
      <div className="narrow-column">
        <ErrorState message={error || 'This post may no longer be available.'} onRetry={() => loadPost()} />
      </div>
    );
  }

  return (
    <div className="narrow-column details-page">
      <Link to="/" className="back-link"><ArrowLeft size={16} /> Back to feed</Link>
      <div className="page-heading-block">
        <span className="section-kicker">THE CONVERSATION</span>
        <h1>Let's talk about it<span className="title-spark">✦</span></h1>
        <p>Good things happen when we share perspectives.</p>
      </div>
      <PostCard post={post} author={author} />
      <CommentSection
        comments={comments}
        loading={commentsLoading}
        error={commentsError}
        onAddComment={addComment}
        onRetry={retryComments}
      />
    </div>
  );
}
