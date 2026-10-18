import React from 'react';
import { Scale, X, ArrowRight, Building2, Tag, Percent } from 'lucide-react';

export default function CompareModal({ source, target, queryMode, queryText, onClose }) {
  if (!target) return null;

  const sourceName = source ? (source.company_name || source.name) : queryText;
  const sourceAbout = source ? (source.about || '') : queryText;
  const sourceTags = source?.tags || ['Query Input'];

  const targetName = target.company_name || target.name;
  const targetAbout = target.about || '';
  const targetTags = target.tags || [];

  const score = target.similarity_score !== undefined ? (target.similarity_score * 100).toFixed(1) : null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '880px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Scale size={24} className="text-gradient" />
            <div>
              <h2 style={{ fontSize: '1.35rem' }}>Komparasi Semantik Side-by-Side</h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Bandingkan keselarasan profil dan bidang industri antar entitas
              </span>
            </div>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Central Match Score Pill */}
        {score && (
          <div style={{
            background: 'var(--grad-card)',
            border: '1px solid var(--border-hover)',
            borderRadius: 'var(--radius-lg)',
            padding: '1rem',
            textAlign: 'center',
            marginBottom: '1.5rem'
          }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Cosine Similarity Match
            </span>
            <div style={{ 
              fontFamily: 'var(--font-mono)', 
              fontSize: '2rem', 
              fontWeight: 800, 
              color: 'var(--text-accent)' 
            }}>
              {score}%
            </div>
            <div className="similarity-bar-bg" style={{ maxWidth: '320px', margin: '0.5rem auto 0 auto' }}>
              <div 
                className="similarity-bar-fill" 
                style={{ width: `${score}%`, background: 'var(--grad-primary)' }} 
              />
            </div>
          </div>
        )}

        {/* Two Columns Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '1.5rem' 
        }}>
          {/* Column 1: Source */}
          <div style={{
            backgroundColor: 'var(--bg-tertiary)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span className="badge badge-primary">SUMBER (QUERY)</span>
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>{sourceName}</h3>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.85rem' }}>
              {sourceTags.map((t, i) => (
                <span key={i} className="badge badge-primary" style={{ fontSize: '0.7rem' }}>{t}</span>
              ))}
            </div>

            <div style={{
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              maxHeight: '220px',
              overflowY: 'auto'
            }}>
              {sourceAbout}
            </div>
          </div>

          {/* Column 2: Target */}
          <div style={{
            backgroundColor: 'var(--bg-tertiary)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-hover)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span className="badge badge-cyan">PERUSAHAAN MIRIP (#{target.rank})</span>
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>{targetName}</h3>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.85rem' }}>
              {targetTags.map((t, i) => (
                <span key={i} className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>{t}</span>
              ))}
            </div>

            <div style={{
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              maxHeight: '220px',
              overflowY: 'auto'
            }}>
              {targetAbout}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Tutup Komparasi
          </button>
        </div>
      </div>
    </div>
  );
}
