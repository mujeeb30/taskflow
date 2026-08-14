import React from 'react';
import { Kanban, ShieldCheck } from 'lucide-react';

export default function Header() {
  return (
    <header className="app-header">
      <div className="brand-section">
        <div className="brand-icon">
          <Kanban size={20} />
        </div>
        <h1 className="brand-title">TaskFlow</h1>
        <span className="brand-badge">MVC Architecture</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
        <ShieldCheck size={16} style={{ color: 'var(--priority-low-text)' }} />
        <span>SQLite Database Connected</span>
      </div>
    </header>
  );
}
