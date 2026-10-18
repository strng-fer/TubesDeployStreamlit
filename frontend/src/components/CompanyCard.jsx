import React from 'react';
import { Award, ArrowUpRight, Scale, Eye, Tag, Sparkles } from 'lucide-react';

export default function CompanyCard({ 
  result, 
  onViewDetail, 
  onCompare, 
  onPivotSearch 
}) {
  const { rank, company_name, company_id, similarity_score, about, tags } = result;

  // Percentage value for UI
  const scorePercent = Math.min(100, Math.max(0, Math.round(similarity_score * 100)));

  // Rank styling
  const getRankBadge = (r) => {
    if (r === 1) return { bg: 'linear-gradient(135deg, #F59E0B, #D97706)', text: '#fff', label: '#1 Paling Mirip' };
    if (r === 2) return { bg: 'linear-gradient(135deg, #94A3B8, #64748B)', text: '#fff', label: '#2 Kedua Mirip' };
    if (r === 3) return { bg: 'linear-gradient(135deg, #B45309, #78350F)', text: '#fff', label: '#3 Ketiga Mirip' };
    return { bg: 'var(--bg-tertiary)', text: 'var(--text-secondary)', label: `#${r}` };
  };

  const rankStyle = getRankBadge(rank);

  return (
    <div 
      className="glass-panel" 
      style={{
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        transition: 'all 0.25s ease',
        cursor: 'default'
      }}
    >
      <div>
        {/* Top Header: Rank + Similarity Score */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <span 
            style={{
              background: rankStyle.bg,
              color: rankStyle.text,
              padding: '0.25rem 0.65rem',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.75rem',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            {rank <= 3 && <Award size={13} />}
            {rankStyle.label}
          </span>

          {/* Similarity Score Pill */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ 
              fontFamily: 'var(--font-mono)', 
              fontWeight: 800, 
              fontSize: '1.25rem',
              color: scorePercent >= 60 ? 'var(--accent-emerald)' : 'var(--text-accent)'
            }}>
              {(similarity_score * 100).toFixed(1)}%
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Cosine Similarity: {similarity_score.toFixed(4)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="similarity-bar-bg" style={{ marginBottom: '1rem' }}>
          <div 
            className="similarity-bar-fill" 
            style={{ 
              width: `${scorePercent}%`,
              background: scorePercent >= 60 
                ? 'var(--grad-emerald)' 
                : 'var(--grad-primary)'
            }} 
          />
        </div>

        {/* Company Title */}
        <h3 style={{ 
          fontSize: '1.2rem', 
          marginBottom: '0.35rem', 
          lineHeight: 1.3,
          color: 'var(--text-primary)'
        }}>
          {company_name}
        </h3>

        {company_id && (
          <div style={{ 
            fontSize: '0.75rem', 
            color: 'var(--text-muted)', 
            marginBottom: '0.75rem',
            fontFamily: 'var(--font-mono)'
          }}>
            ID: {company_id}
          </div>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
            {tags.map((tag, i) => (
              <span key={i} className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                <Tag size={11} /> {tag}
              </span>
            ))}
          </div>
        )}

        {/* About Snippet */}
        <p style={{
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.55,
          marginBottom: '1.25rem',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {about || "Profil ringkasan perusahaan belum dicatat secara detail."}
        </p>
      </div>

      {/* Card Action Footer */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        gap: '0.5rem',
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: '0.85rem'
      }}>
        <button
          className="btn btn-ghost"
          onClick={() => onViewDetail(result)}
          style={{ fontSize: '0.8rem', padding: '0.4rem 0.65rem' }}
          title="Lihat Profil Lengkap"
        >
          <Eye size={15} /> Detail
        </button>

        <button
          className="btn btn-ghost"
          onClick={() => onCompare(result)}
          style={{ fontSize: '0.8rem', padding: '0.4rem 0.65rem' }}
          title="Bandingkan dengan Query"
        >
          <Scale size={15} /> Bandingkan
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => onPivotSearch(company_name)}
          style={{ 
            fontSize: '0.8rem', 
            padding: '0.4rem 0.75rem',
            borderRadius: 'var(--radius-pill)',
            marginLeft: 'auto'
          }}
          title={`Jadikan ${company_name} sebagai query pencarian berikutnya`}
        >
          <Sparkles size={13} color="var(--primary-500)" /> Cari Serupa
        </button>
      </div>
    </div>
  );
}
