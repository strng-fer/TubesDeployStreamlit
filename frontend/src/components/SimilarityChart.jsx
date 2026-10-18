import React, { useState } from 'react';
import { BarChart3, TrendingUp, Info } from 'lucide-react';

export default function SimilarityChart({ results, sourceName }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!results || results.length === 0) return null;

  const maxScore = Math.max(...results.map(r => r.similarity_score), 0.01);

  return (
    <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            padding: '0.4rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(99, 102, 241, 0.15)',
            color: 'var(--primary-500)'
          }}>
            <BarChart3 size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem' }}>Distribusi Cosine Similarity Score</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Tingkat kemiripan relatif terhadap: <strong>{sourceName || 'Query Teks'}</strong>
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="badge badge-primary">
            <TrendingUp size={12} /> {results.length} Data Points
          </span>
        </div>
      </div>

      {/* Chart Bars Stack */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {results.map((item, index) => {
          const percent = (item.similarity_score / maxScore) * 100;
          const isHovered = hoveredIdx === index;

          return (
            <div 
              key={index}
              onMouseEnter={() => setHoveredIdx(index)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(140px, 220px) 1fr 90px',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.4rem 0.6rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: isHovered ? 'var(--bg-tertiary)' : 'transparent',
                transition: 'background-color 0.15s ease'
              }}
            >
              {/* Company Label */}
              <div style={{ 
                fontSize: '0.875rem', 
                fontWeight: isHovered ? 700 : 500,
                color: isHovered ? 'var(--text-accent)' : 'var(--text-primary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                <span style={{ 
                  color: 'var(--text-muted)', 
                  fontFamily: 'var(--font-mono)', 
                  marginRight: '0.5rem',
                  fontSize: '0.75rem' 
                }}>
                  #{item.rank}
                </span>
                {item.company_name}
              </div>

              {/* Progress Bar Container */}
              <div style={{ 
                width: '100%', 
                height: '14px', 
                backgroundColor: 'var(--bg-tertiary)', 
                borderRadius: 'var(--radius-pill)',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <div 
                  style={{
                    height: '100%',
                    width: `${percent}%`,
                    background: index === 0 
                      ? 'linear-gradient(90deg, #6366F1, #EC4899)' 
                      : index < 3 
                        ? 'linear-gradient(90deg, #6366F1, #8B5CF6)' 
                        : 'linear-gradient(90deg, #3B82F6, #06B6D4)',
                    borderRadius: 'var(--radius-pill)',
                    transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: isHovered ? '0 0 12px rgba(99, 102, 241, 0.5)' : 'none'
                  }}
                />
              </div>

              {/* Score Value */}
              <div style={{ 
                textAlign: 'right', 
                fontFamily: 'var(--font-mono)', 
                fontWeight: 700, 
                fontSize: '0.85rem',
                color: item.similarity_score >= 0.6 ? 'var(--accent-emerald)' : 'var(--text-primary)'
              }}>
                {item.similarity_score.toFixed(4)}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ 
        marginTop: '1.25rem', 
        paddingTop: '0.75rem', 
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        fontSize: '0.75rem',
        color: 'var(--text-muted)'
      }}>
        <Info size={14} />
        <span>Nilai Cosine Similarity berkisar antara -1.0 hingga +1.0 (nilai &gt; 0.50 mengindikasikan kemiripan semantik dan industri yang kuat).</span>
      </div>
    </div>
  );
}
