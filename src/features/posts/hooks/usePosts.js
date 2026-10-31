import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { postsService } from '../services/postsService';
import { readStorage, writeStorage } from '../../../utils/storage';
import { isCanceledRequest } from '../../../utils/isCanceledRequest';

const PAGE_SIZE = 10;
const CURRENT_USER_ID = 1;

export default function usePosts(searchTerm = '', sortBy = 'for-you') {
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const requestId = useRef(0);

  const fetchFirstPage = useCallback(async (signal) => {
    const currentRequest = ++requestId.current;
    setLoading(true);
    setError('');
    setSkip(0);
    try {
      const result = await postsService.getPosts({ limit: PAGE_SIZE, skip: 0, search: searchTerm.trim(), signal });
      if (currentRequest !== requestId.current) return;
      const localPosts = readStorage('bluewave-created-posts', []);
      const matchingLocal = searchTerm.trim()
        ? localPosts.filter((post) => `${post.title} ${post.body}`.toLowerCase().includes(searchTerm.trim().toLowerCase()))
        : localPosts;
      setPosts([...matchingLocal, ...(result.posts || [])]);
      setTotal((result.total || 0) + matchingLocal.length);
      setSkip(result.skip + (result.posts || []).length);
    } catch (err) {
      if (!signal?.aborted && !isCanceledRequest(err)) setError(err.message || 'Unable to load posts.');
    } finally {
      if (currentRequest === requestId.current) setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const controller = new AbortController();
    fetchFirstPage(controller.signal);
    return () => controller.abort();
  }, [fetchFirstPage]);

  const loadMore = useCallback(async () => {
    if (loading || loadingMore || posts.length >= total) return;
    setLoadingMore(true);
    setError('');
    try {
      const result = await postsService.getPosts({ limit: PAGE_SIZE, skip, search: searchTerm.trim() });
      setPosts((current) => {
        const existing = new Set(current.map((post) => post.id));
        return [...current, ...(result.posts || []).filter((post) => !existing.has(post.id))];
      });
      setSkip((current) => current + (result.posts || []).length);
      setTotal((current) => Math.max(current, result.total || current));
    } catch (err) {
      setError(err.message || 'Could not load more posts.');
    } finally {
      setLoadingMore(false);
    }
  }, [loading, loadingMore, posts.length, total, searchTerm, skip]);

  const createPost = useCallback(async (body) => {
    const created = await postsService.addPost({ body, userId: CURRENT_USER_ID });
    const localPosts = readStorage('bluewave-created-posts', []);
    const nextLocal = [created, ...localPosts];
    writeStorage('bluewave-created-posts', nextLocal);
    const matchesCurrentSearch = !searchTerm.trim() || `${created.title} ${created.body}`.toLowerCase().includes(searchTerm.trim().toLowerCase());
    if (matchesCurrentSearch) {
      setPosts((current) => [created, ...current]);
      setTotal((current) => current + 1);
    }
    return created;
  }, [searchTerm]);

  const visiblePosts = useMemo(() => {
    const result = [...posts];
    if (sortBy === 'popular') return result.sort((a, b) => (b.reactions?.likes || 0) - (a.reactions?.likes || 0));
    if (sortBy === 'latest') return result.sort((a, b) => b.id - a.id);
    return result;
  }, [posts, sortBy]);

  return { posts: visiblePosts, loading, loadingMore, error, hasMore: posts.length < total, loadMore, createPost, retry: () => fetchFirstPage() };
}
