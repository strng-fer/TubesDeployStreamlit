import React, { useState } from 'react';

export default function SimilarityChart({ results, sourceName }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!results || results.length === 0) return null;

  const maxScore = Math.max(...results.map(r => r.similarity_score), 0.01);

  return (
    <div className="surface-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Distribusi Skor Kemiripan</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Perbandingan relatif terhadap acuan: <strong>{sourceName || 'Query Teks'}</strong>
          </span>
        </div>
        <span className="badge">
          {results.length} Entitas
        </span>
      </div>

      {/* Chart Stack */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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
                gridTemplateColumns: 'minmax(140px, 200px) 1fr 75px',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.35rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: isHovered ? 'var(--bg-elevated)' : 'transparent',
                transition: 'background-color 0.1s ease'
              }}
            >
              {/* Company Label */}
              <div style={{ 
                fontSize: '0.825rem', 
                fontWeight: isHovered ? 600 : 500,
                color: 'var(--text-main)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginRight: '0.4rem', fontSize: '0.75rem' }}>
                  #{item.rank}
                </span>
                {item.company_name}
              </div>

              {/* Bar Fill */}
              <div className="meter-track" style={{ height: '8px' }}>
                <div 
                  style={{
                    height: '100%',
                    width: `${percent}%`,
                    backgroundColor: index === 0 ? 'var(--accent)' : 'var(--text-secondary)',
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 0.25s ease'
                  }}
                />
              </div>

              {/* Exact Score */}
              <div style={{ 
                textAlign: 'right', 
                fontFamily: 'var(--font-mono)', 
                fontSize: '0.8rem',
                color: item.similarity_score >= 0.55 ? 'var(--emerald-text)' : 'var(--text-secondary)'
              }}>
                {item.similarity_score.toFixed(4)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
