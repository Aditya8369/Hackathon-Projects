import React from 'react';
import { 
  Sparkles, 
  LayoutDashboard, 
  Mic, 
  Volume2, 
  BookOpen, 
  Settings as SettingsIcon, 
  Flame 
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, streak = 0, level = 'A2' }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'conversation', label: 'Tutor Chat', icon: Mic },
    { id: 'pronunciation', label: 'Pronounce Lab', icon: Volume2 },
    { id: 'vocabulary', label: 'Vocab Builder', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar-nav">
        <div className="logo-section">
          <div className="logo-icon-wrapper">
            <Sparkles className="logo-spark" />
          </div>
          <span className="logo-text">Learna<span className="logo-dot">.ai</span></span>
        </div>

        <div className="user-badge-container">
          <div className="streak-badge">
            <Flame className="streak-icon animate-pulse" />
            <span>{streak} Day Streak</span>
          </div>
          <div className="level-badge">
            <span>Level {level}</span>
          </div>
        </div>

        <nav className="nav-links">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon className="nav-icon" />
                <span className="nav-label">{item.label}</span>
                {isActive && <div className="active-indicator" />}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <span className="footer-credits">Learna Clone v1.0</span>
        </div>
      </aside>

      {/* Mobile Bottom Bar Navigation */}
      <nav className="mobile-nav-bar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`mobile-nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon className="mobile-nav-icon" />
              <span className="mobile-nav-label">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
