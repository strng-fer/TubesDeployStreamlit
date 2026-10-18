import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function CompanyCard({ 
  result, 
  onViewDetail, 
  onCompare, 
  onPivotSearch 
}) {
  const { rank, company_name, company_id, similarity_score, about, tags } = result;

  const scorePercent = Math.min(100, Math.max(0, (similarity_score * 100))).toFixed(1);

  return (
    <div 
      className="surface-card" 
      style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'border-color 0.15s ease'
      }}
    >
      <div>
        {/* Top Header: Rank + Score */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
          <span className="badge">
            #{rank}
          </span>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
            <span style={{ 
              fontFamily: 'var(--font-mono)', 
              fontWeight: 600, 
              fontSize: '1rem',
              color: similarity_score >= 0.55 ? 'var(--emerald-text)' : 'var(--text-main)'
            }}>
              {scorePercent}%
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              ({similarity_score.toFixed(4)})
            </span>
          </div>
        </div>

        {/* Minimal Progress Line */}
        <div className="meter-track" style={{ marginBottom: '1rem' }}>
          <div 
            className="meter-fill" 
            style={{ 
              width: `${scorePercent}%`,
              backgroundColor: similarity_score >= 0.55 ? 'var(--emerald-text)' : 'var(--text-main)'
            }} 
          />
        </div>

        {/* Company Title */}
        <h3 style={{ 
          fontSize: '1.05rem', 
          marginBottom: '0.25rem', 
          lineHeight: 1.35,
          fontWeight: 600,
          color: 'var(--text-main)'
        }}>
          {company_name}
        </h3>

        {company_id && (
          <div style={{ 
            fontSize: '0.725rem', 
            color: 'var(--text-muted)', 
            marginBottom: '0.75rem',
            fontFamily: 'var(--font-mono)'
          }}>
            ID: {company_id}
          </div>
        )}

        {/* Taxonomy Tags */}
        {tags && tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.85rem' }}>
            {tags.map((tag, i) => (
              <span key={i} className="badge" style={{ fontSize: '0.675rem' }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Truncated Description */}
        <p style={{
          fontSize: '0.825rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.55,
          marginBottom: '1rem',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {about || "Profil ringkasan perusahaan belum dicatat secara detail."}
        </p>
      </div>

      {/* Action Links */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        borderTop: '1px solid var(--border-default)',
        paddingTop: '0.75rem',
        marginTop: '0.5rem'
      }}>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <button
            className="btn btn-ghost"
            onClick={() => onViewDetail(result)}
            style={{ fontSize: '0.75rem', padding: '0.3rem 0.5rem' }}
          >
            Detail
          </button>

          <button
            className="btn btn-ghost"
            onClick={() => onCompare(result)}
            style={{ fontSize: '0.75rem', padding: '0.3rem 0.5rem' }}
          >
            Bandingkan
          </button>
        </div>

        <button
          className="btn btn-secondary"
          onClick={() => onPivotSearch(company_name)}
          style={{ 
            fontSize: '0.75rem', 
            padding: '0.3rem 0.6rem',
            borderRadius: 'var(--radius-sm)'
          }}
          title={`Gunakan ${company_name} sebagai acuan pencarian`}
        >
          <span>Pilih Acuan</span>
          <ArrowUpRight size={13} />
        </button>
      </div>
    </div>
  );
}
