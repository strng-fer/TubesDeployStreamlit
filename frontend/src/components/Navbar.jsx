import React, { useState } from 'react';
import { 
  Building2,
  Sun, 
  Moon, 
  Settings, 
  BarChart2, 
  Check,
  X
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
    }, 800);
  };

  const handleResetUrl = () => {
    setCustomUrl('');
    setCustomBaseUrl('');
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      setShowSettings(false);
      onRefreshHealth();
    }, 800);
  };

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'var(--bg-canvas)',
        borderBottom: '1px solid var(--border-default)'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '60px'
        }}>
          {/* Logo & Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-main)'
            }}>
              <Building2 size={18} />
            </div>
            <div>
              <span style={{ 
                fontWeight: 600, 
                fontSize: '1rem',
                letterSpacing: '-0.02em',
                color: 'var(--text-main)'
              }}>
                CompanySimilarity
              </span>
              <span style={{ 
                fontSize: '0.75rem', 
                color: 'var(--text-muted)', 
                marginLeft: '0.5rem',
                fontFamily: 'var(--font-mono)' 
              }}>
                v2.0
              </span>
            </div>
          </div>

          {/* Right Action Menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* Backend Health Status */}
            <div 
              onClick={onRefreshHealth}
              title="Klik untuk cek ulang koneksi API"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.35rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              <span className={`status-indicator ${health?.ok ? 'online' : 'offline'}`} />
              <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                {health?.ok ? 'FastAPI Connected' : 'Disconnected'}
              </span>
              {health?.latency && (
                <span style={{ 
                  color: 'var(--text-muted)', 
                  fontFamily: 'var(--font-mono)' 
                }}>
                  {health.latency}ms
                </span>
              )}
            </div>

            {/* Model Architecture / Analytics Info */}
            <button
              id="analytics-toggle-btn"
              className="btn btn-ghost btn-icon"
              onClick={onOpenAnalytics}
              title="Spesifikasi Model & Data"
            >
              <BarChart2 size={16} />
            </button>

            {/* Backend Endpoint Settings */}
            <button
              id="settings-toggle-btn"
              className="btn btn-ghost btn-icon"
              onClick={() => setShowSettings(true)}
              title="Pengaturan URL Backend"
            >
              <Settings size={16} />
            </button>

            {/* Dark / Light Toggle */}
            <button
              id="theme-toggle-btn"
              className="btn btn-ghost btn-icon"
              onClick={onToggleTheme}
              title={isDark ? "Tema Terang" : "Tema Gelap"}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem' }}>Konfigurasi Backend API</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowSettings(false)}>
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Tentukan alamat server FastAPI yang digunakan oleh aplikasi. Kosongkan untuk menggunakan default lokal.
            </p>

            <form onSubmit={handleSaveUrl}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                  API Base URL
                </label>
                <input 
                  type="url"
                  className="form-input"
                  placeholder="http://localhost:8000"
                  value={customUrl}
                  onChange={e => setCustomUrl(e.target.value)}
                />
              </div>

              {savedNotice && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.4rem', 
                  color: 'var(--emerald-text)', 
                  fontSize: '0.8rem',
                  marginBottom: '1rem' 
                }}>
                  <Check size={14} /> Tersimpan
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={handleResetUrl}>
                  Reset
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
