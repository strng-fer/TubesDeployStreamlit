import React, { useState } from 'react';
import { Building2, X, Copy, Check, Tag, Hash, FileText, Sparkles } from 'lucide-react';

export default function CompanyModal({ company, onClose, onPivotSearch }) {
  const [copied, setCopied] = useState(false);

  if (!company) return null;

  const handleCopy = () => {
    const textToCopy = `Perusahaan: ${company.company_name || company.name}\nID: ${company.company_id || '-'}\nAbout: ${company.about || '-'}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const name = company.company_name || company.name;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--grad-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <Building2 size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', lineHeight: 1.2 }}>{name}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                {company.company_id && (
                  <span className="badge badge-primary">ID: {company.company_id}</span>
                )}
                {company.similarity_score !== undefined && (
                  <span className="badge badge-success">
                    Similarity: {(company.similarity_score * 100).toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
          </div>

          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Tags */}
        {company.tags && company.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
            {company.tags.map((t, idx) => (
              <span key={idx} className="badge badge-cyan" style={{ fontSize: '0.75rem' }}>
                <Tag size={12} /> {t}
              </span>
            ))}
          </div>
        )}

        {/* Full About Text */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.4rem', 
            fontSize: '0.85rem', 
            fontWeight: 600, 
            color: 'var(--text-muted)', 
            marginBottom: '0.6rem' 
          }}>
            <FileText size={16} /> Tentang Perusahaan (About Company):
          </div>
          <div style={{
            backgroundColor: 'var(--bg-tertiary)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.9rem',
            lineHeight: 1.7,
            color: 'var(--text-secondary)',
            maxHeight: '320px',
            overflowY: 'auto',
            whiteSpace: 'pre-wrap'
          }}>
            {company.about || 'Deskripsi profil tidak tersedia dalam dataset.'}
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            className="btn btn-secondary" 
            onClick={handleCopy}
            style={{ fontSize: '0.85rem' }}
          >
            {copied ? <Check size={16} color="var(--accent-emerald)" /> : <Copy size={16} />}
            <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Info'}</span>
          </button>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-ghost" onClick={onClose}>
              Tutup
            </button>
            {onPivotSearch && (
              <button 
                className="btn btn-primary"
                onClick={() => {
                  onPivotSearch(name);
                  onClose();
                }}
              >
                <Sparkles size={16} /> Cari Perusahaan Mirip Ini
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
