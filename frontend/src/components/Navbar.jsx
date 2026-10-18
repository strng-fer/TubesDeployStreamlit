import React, { useState } from 'react';
import { 
  Cpu, 
  Activity, 
  Sun, 
  Moon, 
  Settings, 
  BarChart2, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { getBaseUrl, setCustomBaseUrl } from '../services/api';

export default function Navbar({ 
  health, 
  onRefreshHealth, 
  isDark, 
  onToggleTheme, 
  onOpenAnalytics 
}) {
  const [showSettings, setShowSettings] = useState(false);
  const [customUrl, setCustomUrl] = useState(getBaseUrl() || '');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSaveUrl = (e) => {
    e.preventDefault();
    setCustomBaseUrl(customUrl);
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      setShowSettings(false);
      onRefreshHealth();
    }, 1000);
  };

  const handleResetUrl = () => {
    setCustomUrl('');
    setCustomBaseUrl('');
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      setShowSettings(false);
      onRefreshHealth();
    }, 1000);
  };

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        backgroundColor: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-subtle)',
        transition: 'all 0.25s ease'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '70px',
          padding: '0 1.5rem'
        }}>
          {/* Logo Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--grad-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow)',
              color: '#fff'
            }}>
              <Cpu size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ 
                  fontFamily: 'var(--font-display)', 
                  fontWeight: 800, 
                  fontSize: '1.25rem',
                  letterSpacing: '-0.02em' 
                }}>
                  Comp<span className="text-gradient">Similarity</span>
                </span>
                <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                  FastAPI + LSTM
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Vector Similarity Engine v2.0
              </p>
            </div>
          </div>

          {/* Right Action Menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Backend Health Pill */}
            <div 
              onClick={onRefreshHealth}
              title="Klik untuk ping status API"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              <span className={`status-dot ${health?.ok ? 'online pulsing' : 'offline'}`} />
              <span style={{ fontWeight: 600 }}>
                {health?.ok ? 'FastAPI Connected' : 'Backend Disconnected'}
              </span>
              {health?.latency && (
                <span style={{ 
                  color: 'var(--accent-emerald)', 
                  fontFamily: 'var(--font-mono)', 
                  fontSize: '0.75rem' 
                }}>
                  {health.latency}ms
                </span>
              )}
            </div>

            {/* Analytics Modal Button */}
            <button
              id="analytics-toggle-btn"
              className="btn btn-secondary btn-icon"
              onClick={onOpenAnalytics}
              title="Lihat Statistik & Arsitektur Model"
            >
              <BarChart2 size={18} />
            </button>

            {/* Settings Button */}
            <button
              id="settings-toggle-btn"
              className="btn btn-secondary btn-icon"
              onClick={() => setShowSettings(true)}
              title="Konfigurasi URL API Backend (Vercel / Local)"
            >
              <Settings size={18} />
            </button>

            {/* Dark / Light Toggle */}
            <button
              id="theme-toggle-btn"
              className="btn btn-secondary btn-icon"
              onClick={onToggleTheme}
              title={isDark ? "Ganti ke Tema Terang" : "Ganti ke Tema Gelap"}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Settings size={22} className="text-gradient" />
                <h3>Pengaturan Endpoint Backend</h3>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowSettings(false)}>✕</button>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Saat di-deploy di <strong>Vercel</strong>, Anda dapat menghubungkan website ini ke server FastAPI yang di-host di Render, Railway, Hugging Face, atau URL backend Anda sendiri.
            </p>

            <form onSubmit={handleSaveUrl}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  FastAPI Base URL:
                </label>
                <input 
                  type="url"
                  className="input-field"
                  placeholder="https://your-fastapi-backend.onrender.com (atau kosongkan untuk default proxy)"
                  value={customUrl}
                  onChange={e => setCustomUrl(e.target.value)}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'block' }}>
                  Default lokal: <code>http://localhost:8000</code> (via proxy Vite)
                </span>
              </div>

              {savedNotice && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  color: 'var(--accent-emerald)', 
                  fontSize: '0.85rem',
                  marginBottom: '1rem' 
                }}>
                  <CheckCircle2 size={16} /> Konfigurasi berhasil disimpan!
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary" onClick={handleResetUrl}>
                  Reset Default
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan & Hubungkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
