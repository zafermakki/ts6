import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, BriefcaseBusiness, CalendarDays, Globe2, MapPin, MessageCircle, UserRound } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import UserAvatar from '../components/common/UserAvatar';
import PostCard from '../features/posts/components/PostCard';
import { postsService } from '../features/posts/services/postsService';
import { usersService } from '../features/users/services/usersService';
import { ErrorState, LoadingState } from '../components/feedback/StateViews';
import { readStorage } from '../utils/storage';
import { isCanceledRequest } from '../utils/isCanceledRequest';

export default function UserProfilePage() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [postsError, setPostsError] = useState('');

  const loadProfile = useCallback(async (isActive = () => true) => {
    setLoading(true);
    setError('');
    setPostsError('');

    try {
      // Do not abort on effect cleanup. Ignore stale results instead.
      // This keeps StrictMode/navigation cancellations out of the visible UI.
      const [userResult, postsResult] = await Promise.allSettled([
        usersService.getUserById(userId),
        postsService.getPostsByUser(userId),
      ]);

      if (!isActive()) return;
      if (userResult.status === 'rejected') throw userResult.reason;

      const userData = userResult.value;
      const localPosts = readStorage('bluewave-created-posts', []).filter(
        (post) => String(post.userId) === String(userId),
      );

      setUser(userData);
      if (postsResult.status === 'fulfilled') {
        setPosts([...localPosts, ...(postsResult.value.posts || [])]);
      } else {
        console.warn('Could not load this user posts:', postsResult.reason);
        setPosts(localPosts);
        setPostsError('We could not load this member’s posts. The profile is still available.');
      }
    } catch (err) {
      if (isActive() && !isCanceledRequest(err)) {
        setError(err.message || 'Profile could not be loaded.');
      }
    } finally {
      if (isActive()) setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    let active = true;
    loadProfile(() => active);
    return () => {
      active = false;
    };
  }, [loadProfile]);

  if (loading) {
    return <div className="narrow-column"><LoadingState label="Loading member profile…" /></div>;
  }

  if (error || !user) {
    return (
      <div className="narrow-column">
        <ErrorState message={error || 'Member not found.'} onRetry={() => loadProfile()} />
      </div>
    );
  }

  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <div className="narrow-column profile-page">
      <Link to="/" className="back-link"><ArrowLeft size={16} /> Back to feed</Link>
      <section className="profile-hero card-surface">
        <div className="profile-cover">
          <div className="cover-orb cover-orb-a" />
          <div className="cover-orb cover-orb-b" />
          <span className="cover-word">good energy only</span>
        </div>
        <div className="profile-intro">
          <UserAvatar user={user} size="2xl" />
          <div className="profile-actions">
            <a className="button button-primary" href={`mailto:${user.email}`}>
              <MessageCircle size={15} /> Say hello
            </a>
          </div>
          <h1>{fullName}</h1>
          <p className="profile-handle">@{user.username}</p>
          <p className="profile-bio">Curious mind. Kind heart. Always learning something new and sharing the journey along the way.</p>
          <div className="profile-facts">
            {user.company?.title && <span><BriefcaseBusiness size={14} /> {user.company.title}</span>}
            {user.address?.city && <span><MapPin size={14} /> {user.address.city}</span>}
            <span><Globe2 size={14} /> Bluewave community</span>
            <span><CalendarDays size={14} /> Member profile</span>
          </div>
          <div className="profile-stats">
            <div><strong>{posts.length}</strong><span>Posts</span></div>
            <div><strong>{user.age || '—'}</strong><span>Years young</span></div>
            <div><strong>{user.company?.department || 'Community'}</strong><span>Interest</span></div>
          </div>
        </div>
      </section>
      <div className="profile-post-heading">
        <div><span className="section-kicker">SHARED BY {user.firstName.toUpperCase()}</span><h2>Posts & thoughts</h2></div>
        <span className="profile-post-count">{posts.length} posts</span>
      </div>
      {postsError && <p className="load-error">{postsError}</p>}
      {posts.length ? (
        <div className="post-list">{posts.map((post) => <PostCard key={post.id} post={post} author={user} />)}</div>
      ) : (
        <div className="card-surface profile-empty">
          <UserRound size={26} /><strong>No posts just yet</strong>
          <span>When {user.firstName} shares something, it will show up here.</span>
        </div>
      )}
    </div>
  );
}
