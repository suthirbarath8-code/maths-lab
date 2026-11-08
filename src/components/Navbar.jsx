import React from 'react';
import { 
  Hash, 
  TrendingUp, 
  BarChart2, 
  GitCommit, 
  Trophy, 
  BookOpen 
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  openCheatSheet 
}) {
  const tabs = [
    { id: 'numbers', label: 'Number Lab', icon: Hash, sub: 'Primes & Factors' },
    { id: 'functions', label: 'Function Studio', icon: TrendingUp, sub: 'f(x) Grapher' },
    { id: 'probability', label: 'Probability', icon: BarChart2, sub: 'Dice & Monte Carlo' },
    { id: 'sequences', label: 'Sequences', icon: GitCommit, sub: '3n+1 & Progressions' },
    { id: 'gym', label: 'Math Gym', icon: Trophy, sub: 'Quiz Challenge' }
  ];

  return (
    <header className="app-navbar">
      {/* Brand Identity - Logo removed per requirement */}
      <div className="brand-group">
        <div className="brand-titles">
          <div className="brand-name">
            MathLab <span className="brand-badge-pill">Studio</span>
          </div>
          <div className="brand-tagline">
            Experimental Mathematics &bull; Interactive Function Platform
          </div>
        </div>
      </div>

      {/* Primary Lab Navigation Tabs */}
      <nav className="navbar-tabs" aria-label="Math Labs Navigation">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`nav-tab-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} className="tab-icon" />
              <div className="tab-text-wrap">
                <span className="tab-title">{tab.label}</span>
                <span className="tab-sub">{tab.sub}</span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Auxiliary Tool Controls - Sound & Theme removed */}
      <div className="navbar-controls">
        <button
          type="button"
          className="aux-ctrl-btn reference-btn"
          onClick={openCheatSheet}
          title="Student Math Reference Sheet"
        >
          <BookOpen size={16} />
          <span>Formula Sheet</span>
        </button>
      </div>
    </header>
  );
}
