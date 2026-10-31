import { ArrowLeft, Waves } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return <div className="not-found"><div className="not-found-mark"><Waves size={34} /></div><span className="section-kicker">LOST IN THE CURRENT?</span><h1>That page drifted away.</h1><p>The page you're looking for doesn't exist or may have moved.</p><Link to="/" className="button button-primary"><ArrowLeft size={16} /> Back to home</Link></div>;
}
