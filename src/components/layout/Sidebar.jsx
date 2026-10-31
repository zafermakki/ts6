import { Compass, House, MessageCircle, Moon, Sun, Users, Waves, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import UserAvatar from '../common/UserAvatar';

const profile = { id: 1, firstName: 'Emily', lastName: 'Johnson', username: 'emilys', image: 'https://dummyjson.com/icon/emilys/128' };

export default function Sidebar({ open = false, onClose }) {
  const { theme, toggleTheme } = useTheme();
  return <><div className={`sidebar-backdrop ${open ? 'show' : ''}`} onClick={onClose} /><aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
    <div className="brand-row"><div className="brand-mark"><Waves size={23} strokeWidth={2.6} /></div><span>bluewave<span className="brand-dot">.</span></span><button className="icon-button sidebar-close" onClick={onClose} aria-label="Close menu"><X size={19} /></button></div>
    <div className="workspace-pill"><span className="online-dot" /> COMMUNITY SPACE <span className="workspace-chevron">⌄</span></div>
    <span className="nav-label">MENU</span>
    <nav className="side-nav"><NavLink to="/" end onClick={onClose}><House size={19} /><span>Home feed</span><b className="nav-count">8</b></NavLink><a href="#discover" onClick={onClose}><Compass size={19} /><span>Discover</span></a><a href="#messages" onClick={onClose}><MessageCircle size={19} /><span>Messages</span><b className="unread-dot" /></a><a href="#community" onClick={onClose}><Users size={19} /><span>Community</span></a></nav>
    <span className="nav-label nav-label-spaced">YOUR SPACE</span>
    <NavLink className="profile-nav" to="/users/1" onClick={onClose}><UserAvatar user={profile} size="sm" /><span><strong>My profile</strong><small>@emilys</small></span></NavLink>
    <div className="sidebar-bottom"><div className="upgrade-card"><div className="upgrade-spark">✦</div><strong>A little more space<br />for big ideas.</strong><p>Make your community feel like home.</p><button type="button" onClick={() => alert('Thanks for exploring Bluewave!')}>Explore Bluewave <span>↗</span></button></div><button className="theme-toggle" onClick={toggleTheme}>{theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}<span>{theme === 'light' ? 'Dark appearance' : 'Light appearance'}</span><span className={`toggle-track ${theme === 'dark' ? 'active' : ''}`}><i /></span></button><div className="sidebar-foot">© 2026 Bluewave <span>•</span> Made for connection</div></div>
  </aside></>;
}
