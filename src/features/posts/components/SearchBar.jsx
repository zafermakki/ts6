import { Search, X } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function SearchBar({ value, onChange }) {
  const inputRef = useRef(null);

  useEffect(() => {
    function handleShortcut(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
      }
      if (event.key === 'Escape' && document.activeElement === inputRef.current) {
        onChange('');
        inputRef.current?.blur();
      }
    }
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, [onChange]);

  return (
    <label className="search-box">
      <Search size={18} />
      <input ref={inputRef} value={value} onChange={(event) => onChange(event.target.value)} placeholder="Search posts, ideas, people…" aria-label="Search posts" />
      {value && <button type="button" className="icon-button clear-search" onClick={() => onChange('')} aria-label="Clear search"><X size={15} /></button>}
      <kbd>Ctrl K</kbd>
    </label>
  );
}
