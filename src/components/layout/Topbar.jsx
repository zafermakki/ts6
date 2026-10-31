import { Bell, Menu, Plus, Waves } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../features/posts/components/SearchBar';
import UserAvatar from '../common/UserAvatar';

const profile = { firstName: 'Emily', lastName: 'Johnson', username: 'emilys', image: 'https://dummyjson.com/icon/emilys/128' };

export default function Topbar({ searchValue, onSearchChange, onMenuClick, onCreateClick }) {
  const navigate = useNavigate();
  return <header className="topbar"><button className="icon-button mobile-menu" onClick={onMenuClick} aria-label="Open menu"><Menu size={21} /></button><div className="mobile-brand"><Waves size={20} /> bluewave<span>.</span></div><div className="topbar-search"><SearchBar value={searchValue} onChange={onSearchChange} /></div><div className="topbar-actions"><button className="button button-primary top-create" onClick={onCreateClick}><Plus size={17} /> Create post</button><button className="icon-button notification-button" aria-label="Notifications"><Bell size={19} /><i /></button><button className="top-profile" onClick={() => navigate('/users/1')}><UserAvatar user={profile} size="sm" /><span>Emily</span></button></div></header>;
}
