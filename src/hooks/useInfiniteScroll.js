import { useEffect, useRef } from 'react';

export default function useInfiniteScroll({ onLoadMore, enabled }) {
  const sentinelRef = useRef(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !enabled) return undefined;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) onLoadMore();
    }, { rootMargin: '280px 0px' });

    observer.observe(node);
    return () => observer.disconnect();
  }, [onLoadMore, enabled]);

  return sentinelRef;
}
