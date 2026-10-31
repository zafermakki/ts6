import { useMemo, useState } from 'react';
import { ArrowDown, CircleHelp, Sparkles } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import CreatePost from '../features/posts/components/CreatePost';
import FeedFilters from '../features/posts/components/FeedFilters';
import PostCard from '../features/posts/components/PostCard';
import usePosts from '../features/posts/hooks/usePosts';
import useUsers from '../features/users/hooks/useUsers';
import useDebounce from '../hooks/useDebounce';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import RightPanel from '../components/layout/RightPanel';
import { EmptyState, ErrorState, InlineLoader, LoadingState } from '../components/feedback/StateViews';

export default function FeedPage() {
  const { searchValue, onSearchChange } = useOutletContext();
  const [sortBy, setSortBy] = useState('for-you');
  const debouncedSearch = useDebounce(searchValue, 450);
  const { posts, loading, loadingMore, error, hasMore, loadMore, createPost, retry } = usePosts(debouncedSearch, sortBy);
  const { users } = useUsers();
  const userMap = useMemo(() => new Map(users.map((user) => [user.id, user])), [users]);
  const sentinelRef = useInfiniteScroll({ onLoadMore: loadMore, enabled: hasMore && !loading && !loadingMore && !error });

  function focusComposer() {
    document.getElementById('create-post-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    document.querySelector('#create-post-form textarea')?.focus({ preventScroll: true });
  }

  return <div className="page-grid"><main className="feed-column">
    <section className="welcome-banner"><div className="welcome-glow" /><div className="welcome-copy"><span className="welcome-label"><Sparkles size={13} /> A GOOD DAY TO CONNECT</span><h2>Your corner of<br /><em>the internet.</em></h2><p>Share a thought. Find your people. Leave a little light wherever you go.</p><button className="welcome-button" onClick={focusComposer}>Start a conversation <ArrowDown size={15} /></button></div><div className="welcome-art" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="art-core"><Sparkles size={42} /></div><span className="float-dot dot-one" /><span className="float-dot dot-two" /><span className="float-dot dot-three" /><span className="art-word">be<br />heard.</span></div><div className="banner-index">01 <span>/</span> 03</div></section>
    <FeedFilters value={sortBy} onChange={setSortBy} />
    {searchValue.trim() && <div className="search-result-label">Showing results for <strong>“{searchValue.trim()}”</strong></div>}
    <div id="create-post-form"><CreatePost onCreate={createPost} /></div>
    {loading ? <LoadingState label="Gathering the good stuff…" /> : error && posts.length === 0 ? <ErrorState message={error} onRetry={retry} /> : posts.length === 0 ? <EmptyState title="No posts found" message="Try another search term or be the first to share something." /> : <div className="post-list">{posts.map((post) => <PostCard key={`${post.id}-${post.isLocal ? 'local' : 'remote'}`} post={post} author={userMap.get(post.userId)} />)}</div>}
    {error && posts.length > 0 && <div className="load-error"><CircleHelp size={15} /> {error} <button onClick={hasMore ? loadMore : retry}>Retry</button></div>}
    <div ref={sentinelRef} className="feed-sentinel" />
    {loadingMore && <InlineLoader />}
    {!hasMore && posts.length > 0 && !loading && <div className="end-of-feed"><span /> You've reached the end of your feed <span /></div>}
  </main><RightPanel posts={posts} users={users} onTagClick={onSearchChange} /></div>;
}
