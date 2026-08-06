import React from 'react';
import { GraduationCap, Moon, Sun, LogOut, ShieldCheck } from 'lucide-react';

export default function Navbar({ user, onLogout, theme, toggleTheme }) {
  return (
    <header className="glass-panel" style={{ borderRadius: '0', borderLeft: 'none', borderRight: 'none', borderTop: 'none', position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary-crimson) 0%, var(--accent-gold) 100%)',
            padding: '0.6rem',
            borderRadius: '12px',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(155, 27, 48, 0.4)'
          }}>
            <GraduationCap size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              KLU <span style={{ color: 'var(--accent-gold)' }}>CAMPUS</span>
            </h1>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <ShieldCheck size={12} color="var(--accent-emerald)" /> Student Authentication System
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={toggleTheme}
            className="btn-secondary"
            style={{ padding: '0.5rem', borderRadius: '50%' }}
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#475569" />}
          </button>

          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <img
                  src={user.profileImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.registrationNumber}`}
                  alt="Profile"
                  style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid var(--primary-crimson)', background: '#fff' }}
                />
                <span style={{ fontSize: '0.875rem', fontWeight: 600, display: 'none', minWidth: '100px' }}>
                  {user.username}
                </span>
              </div>
              <button onClick={onLogout} className="btn-danger">
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
