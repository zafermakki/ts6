import { ArrowUpRight, Flame, Hash, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import UserAvatar from '../common/UserAvatar';

export default function RightPanel({ posts, users = [], onTagClick }) {
  const tags = [...new Set(posts.flatMap((post) => post.tags || []))].slice(0, 5);
  const people = users.filter((user) => user.id !== 1).slice(0, 3);
  return <aside className="right-panel">
    <section className="side-widget trend-widget"><div className="widget-heading"><div><span className="widget-eyebrow">THE PULSE</span><h3>Trending topics</h3></div><Flame size={19} /></div>{(tags.length ? tags : ['creativity', 'mindfulness', 'community', 'technology']).map((tag, index) => <button className="trend-item" key={tag} onClick={() => onTagClick(tag)}><span className="trend-number">0{index + 1}</span><span className="trend-name">#{tag}</span><ArrowUpRight size={14} /></button>)}<p className="widget-foot">Topics people are talking about</p></section>
    <section className="side-widget people-widget"><div className="widget-heading"><div><span className="widget-eyebrow">FIND YOUR PEOPLE</span><h3>People to know</h3></div><Sparkles size={18} /></div>{people.map((person) => <div className="suggested-person" key={person.id}><Link to={`/users/${person.id}`}><UserAvatar user={person} size="sm" /></Link><div className="suggested-copy"><Link to={`/users/${person.id}`}>{person.firstName} {person.lastName}</Link><span>{person.company?.title || `@${person.username}`}</span></div><Link className="follow-link" to={`/users/${person.id}`} aria-label={`View ${person.firstName} ${person.lastName}`}><ArrowUpRight size={15} /></Link></div>)}{!people.length && <p className="widget-foot">Meet interesting people from the community.</p>}<div className="people-note"><Hash size={14} /> Good conversations start with a hello.</div></section>
    <div className="right-footer"><a href="#about">About</a><a href="#guidelines">Guidelines</a><a href="#privacy">Privacy</a><span>© 2026 Bluewave</span></div>
  </aside>;
}
