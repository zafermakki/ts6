import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { readStorage, writeStorage } from '../utils/storage';

const EngagementContext = createContext(null);

export function EngagementProvider({ children }) {
  const [likedIds, setLikedIds] = useState(() => readStorage('bluewave-liked-posts', []));

  const toggleLike = useCallback((postId) => {
    setLikedIds((current) => {
      const next = current.includes(postId)
        ? current.filter((id) => id !== postId)
        : [...current, postId];
      writeStorage('bluewave-liked-posts', next);
      return next;
    });
  }, []);

  const value = useMemo(() => ({
    likedIds,
    isLiked: (postId) => likedIds.includes(postId),
    toggleLike,
    likeCount: (post) => (post.reactions?.likes || 0) + (likedIds.includes(post.id) ? 1 : 0),
  }), [likedIds, toggleLike]);

  return <EngagementContext.Provider value={value}>{children}</EngagementContext.Provider>;
}

export function useEngagement() {
  const value = useContext(EngagementContext);
  if (!value) throw new Error('useEngagement must be used inside EngagementProvider');
  return value;
}
