import { ArrowDownWideNarrow, Flame, Sparkles } from 'lucide-react';

const filters = [
  { id: 'for-you', label: 'For you', icon: Sparkles },
  { id: 'popular', label: 'Popular', icon: Flame },
  { id: 'latest', label: 'Latest', icon: ArrowDownWideNarrow },
];

export default function FeedFilters({ value, onChange }) {
  return <div className="feed-filter-row"><div><span className="section-kicker">YOUR DAILY DOSE</span><h1>Community feed<span className="title-spark">✦</span></h1><p>Fresh thoughts, kind people, and ideas worth sharing.</p></div><div className="feed-tabs" role="tablist" aria-label="Feed view">{filters.map(({ id, label, icon: Icon }) => <button key={id} role="tab" aria-selected={value === id} className={value === id ? 'active' : ''} onClick={() => onChange(id)}><Icon size={15} />{label}</button>)}</div></div>;
}
