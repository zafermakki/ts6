import { useCallback, useEffect, useState } from 'react';
import { commentsService } from '../services/commentsService';
import { readStorage, writeStorage } from '../../../utils/storage';
import { isCanceledRequest } from '../../../utils/isCanceledRequest';

export default function useComments(postId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadComments = useCallback(async (isActive = () => true) => {
    if (!postId) {
      setComments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // We intentionally do not abort this request on effect cleanup.
      // The active guard below prevents stale state updates after navigation,
      // while avoiding canceled-request errors in React StrictMode.
      const serverComments = await commentsService.getCommentsByPost(postId);
      if (!isActive()) return;

      const saved = readStorage('bluewave-local-comments', []);
      const localComments = saved.filter(
        (comment) => String(comment.postId) === String(postId),
      );
      setComments([...localComments, ...serverComments]);
    } catch (err) {
      if (isActive() && !isCanceledRequest(err)) {
        setError(err.message || 'Unable to load comments.');
      }
    } finally {
      if (isActive()) setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    let active = true;
    loadComments(() => active);
    return () => {
      active = false;
    };
  }, [loadComments]);

  const addComment = useCallback(async (body) => {
    const created = await commentsService.addComment({
      body,
      postId: Number(postId),
      userId: 1,
    });
    const saved = readStorage('bluewave-local-comments', []);
    writeStorage('bluewave-local-comments', [created, ...saved]);
    setComments((current) => [created, ...current]);
    return created;
  }, [postId]);

  const retry = useCallback(() => loadComments(), [loadComments]);

  return { comments, loading, error, addComment, retry };
}
