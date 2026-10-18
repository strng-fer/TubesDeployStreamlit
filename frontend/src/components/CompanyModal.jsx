import React, { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';

export default function CompanyModal({ company, onClose, onPivotSearch }) {
  const [copied, setCopied] = useState(false);

  if (!company) return null;

  const handleCopy = () => {
    const textToCopy = `Perusahaan: ${company.company_name || company.name}\nID: ${company.company_id || '-'}\nAbout: ${company.about || '-'}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const name = company.company_name || company.name;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
              {name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {company.company_id && (
                <span className="badge">ID: {company.company_id}</span>
              )}
              {company.similarity_score !== undefined && (
                <span className="badge badge-success">
                  Skor: {(company.similarity_score * 100).toFixed(1)}%
                </span>
              )}
            </div>
          </div>

          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Tags */}
        {company.tags && company.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
            {company.tags.map((t, idx) => (
              <span key={idx} className="badge" style={{ fontSize: '0.725rem' }}>
                {t}
              </span>
            ))}
          </div>
        )}

        {/* About Box */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            Deskripsi Profil
          </div>
          <div style={{
            backgroundColor: 'var(--bg-elevated)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)',
            fontSize: '0.85rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            maxHeight: '300px',
            overflowY: 'auto',
            whiteSpace: 'pre-wrap'
          }}>
            {company.about || 'Deskripsi profil tidak tersedia dalam dataset.'}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
          <button 
            className="btn btn-secondary" 
            onClick={handleCopy}
            style={{ fontSize: '0.8rem' }}
          >
            {copied ? <Check size={14} color="var(--emerald-text)" /> : <Copy size={14} />}
            <span>{copied ? 'Tersalin' : 'Salin Teks'}</span>
          </button>

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button className="btn btn-ghost" onClick={onClose} style={{ fontSize: '0.8rem' }}>
              Tutup
            </button>
            {onPivotSearch && (
              <button 
                className="btn btn-primary"
                onClick={() => {
                  onPivotSearch(name);
                  onClose();
                }}
                style={{ fontSize: '0.8rem' }}
              >
                Gunakan sebagai Acuan
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
