import { initials } from '../../utils/format';

export default function UserAvatar({ user, size = 'md', className = '' }) {
  const name = user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.fullName;
  return (
    <span className={`avatar avatar-${size} ${className}`} title={name || 'Bluewave member'}>
      {user?.image ? <img src={user.image} alt={name || 'User avatar'} loading="lazy" /> : initials(user)}
    </span>
  );
}
