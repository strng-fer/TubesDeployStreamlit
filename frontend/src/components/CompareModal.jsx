import React from 'react';
import { X } from 'lucide-react';

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
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '820px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Komparasi Semantik Profil</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Perbandingan entitas acuan vs entitas target
            </span>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Minimal Score Banner */}
        {score && (
          <div style={{
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cosine Similarity Match</span>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.35rem', fontWeight: 600 }}>
                {score}% <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({target.similarity_score.toFixed(4)})</span>
              </div>
            </div>
            <div style={{ width: '180px' }}>
              <div className="meter-track">
                <div 
                  className="meter-fill" 
                  style={{ width: `${score}%`, backgroundColor: 'var(--accent)' }} 
                />
              </div>
            </div>
          </div>
        )}

        {/* Two Columns Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
          gap: '1rem',
          marginBottom: '1.25rem' 
        }}>
          {/* Column 1: Source */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)'
          }}>
            <span className="badge" style={{ marginBottom: '0.5rem' }}>ENTITAS ACUAN</span>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.4rem' }}>{sourceName}</h3>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.75rem' }}>
              {sourceTags.map((t, i) => (
                <span key={i} className="badge" style={{ fontSize: '0.675rem' }}>{t}</span>
              ))}
            </div>

            <div style={{
              fontSize: '0.825rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.55,
              maxHeight: '220px',
              overflowY: 'auto'
            }}>
              {sourceAbout}
            </div>
          </div>

          {/* Column 2: Target */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)'
          }}>
            <span className="badge" style={{ marginBottom: '0.5rem' }}>HASIL #{target.rank}</span>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.4rem' }}>{targetName}</h3>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.75rem' }}>
              {targetTags.map((t, i) => (
                <span key={i} className="badge" style={{ fontSize: '0.675rem' }}>{t}</span>
              ))}
            </div>

            <div style={{
              fontSize: '0.825rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.55,
              maxHeight: '220px',
              overflowY: 'auto'
            }}>
              {targetAbout}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose} style={{ fontSize: '0.8rem' }}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
