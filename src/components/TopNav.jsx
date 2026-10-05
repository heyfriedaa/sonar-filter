import { Bell, ChevronDown, Gem, HelpCircle, Plus, Search } from 'lucide-react';
import logoUrl from '../assets/SQ_Logo.svg';

export function TopNav() {
  return (
    <header className="top-nav">
      <div className="top-nav-left">
        <div className="top-nav-brand">
          <div className="logo-placeholder">
            <img className="logo-mark" src={logoUrl} height="30" alt="SonarQube Cloud" />
          </div>
        </div>
        <nav className="top-nav-links">
          <a href="#" className="top-nav-link active">Favorite Projects</a>
          <a href="#" className="top-nav-link">Assigned Issues</a>
          <a href="#" className="top-nav-link has-chevron">
            Portfolios
            <ChevronDown size={14} />
          </a>
          <a href="#" className="top-nav-link">Explore</a>
        </nav>
      </div>
      <div className="top-nav-right">
        <button className="btn-upgrade">
          <Gem size={14} />
          Upgrade
        </button>
        <button className="icon-btn" aria-label="Search">
          <Search size={18} />
        </button>
        <button className="icon-btn has-badge" aria-label="Notifications">
          <Bell size={18} />
          <span className="badge">2</span>
        </button>
        <button className="icon-btn" aria-label="Help">
          <HelpCircle size={18} />
        </button>
        <button className="icon-btn" aria-label="Create new">
          <Plus size={18} />
        </button>
        <div className="avatar">A</div>
      </div>
    </header>
  );
}
