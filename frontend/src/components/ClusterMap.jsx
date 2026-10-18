import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Filter, Info, Eye, Sparkles, Layers, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

export default function ClusterMap({ 
  sourceCompany, 
  searchResults, 
  onSelectCompany, 
  onViewDetail 
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCluster, setActiveCluster] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const svgRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    api.getClusteringData()
      .then(res => {
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err.message || 'Gagal memuat data klasterisasi');
          setLoading(false);
        }
      });
    return () => { isMounted = false; };
  }, []);

  // Map points by name for quick lookup
  const pointByName = useMemo(() => {
    if (!data?.points) return new Map();
    const map = new Map();
    data.points.forEach(p => map.set(p.name.toLowerCase(), p));
    return map;
  }, [data]);

  // Find source point coordinate if active
  const sourcePoint = useMemo(() => {
    if (!sourceCompany) return null;
    const name = (sourceCompany.company_name || sourceCompany.name || '').toLowerCase();
    return pointByName.get(name) || null;
  }, [sourceCompany, pointByName]);

  // Find result points coordinates if active
  const resultPoints = useMemo(() => {
    if (!searchResults || searchResults.length === 0) return [];
    return searchResults.map(r => {
      const p = pointByName.get(r.company_name.toLowerCase());
      return p ? { ...p, rank: r.rank, similarity_score: r.similarity_score } : null;
    }).filter(Boolean);
  }, [searchResults, pointByName]);

  // Filtered points based on cluster & search
  const visiblePoints = useMemo(() => {
    if (!data?.points) return [];
    let list = data.points;
    if (activeCluster !== 'all') {
      const cId = Number(activeCluster);
      list = list.filter(p => p.cluster === cId);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q));
    }
    return list;
  }, [data, activeCluster, searchQuery]);

  const handleMouseMove = (e, point) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setHoveredPoint(point);
  };

  if (loading) {
    return (
      <div className="surface-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 0.75rem auto' }} />
        <p style={{ fontSize: '0.9rem' }}>Menghitung proyeksi 2D PCA dan matriks klaster...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="surface-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <p style={{ fontSize: '0.9rem' }}>{error || 'Data klasterisasi tidak tersedia'}</p>
      </div>
    );
  }

  return (
    <div className="surface-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      {/* Header & Controls Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '1.25rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 600 }}>
              Peta Klaster Vektor 2D (PCA Projection)
            </h2>
            <span className="badge">
              {data.total_points.toLocaleString()} Perusahaan
            </span>
          </div>
          <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
            Proyeksi ruang laten 256-dimensi ke dalam bidang 2D menggunakan Principal Component Analysis
          </span>
        </div>

        {/* Search within map */}
        <div style={{ position: 'relative', width: '240px' }}>
          <Search 
            size={14} 
            style={{ 
              position: 'absolute', 
              left: '0.75rem', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: 'var(--text-muted)' 
            }} 
          />
          <input
            type="text"
            className="form-input"
            placeholder="Cari titik perusahaan..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.1rem', fontSize: '0.8rem', padding: '0.45rem 0.75rem 0.45rem 2.1rem' }}
          />
        </div>
      </div>

      {/* Cluster Filter Buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
        <button
          className="btn btn-secondary"
          onClick={() => setActiveCluster('all')}
          style={{
            padding: '0.25rem 0.65rem',
            fontSize: '0.75rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: activeCluster === 'all' ? 'var(--text-main)' : 'var(--bg-surface)',
            color: activeCluster === 'all' ? 'var(--bg-canvas)' : 'var(--text-secondary)'
          }}
        >
          Semua Klaster ({data.total_points})
        </button>
        {data.clusters.map(c => {
          const isActive = activeCluster === String(c.id);
          return (
            <button
              key={c.id}
              onClick={() => setActiveCluster(isActive ? 'all' : String(c.id))}
              className="btn btn-secondary"
              style={{
                padding: '0.25rem 0.65rem',
                fontSize: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: isActive ? c.color : 'var(--bg-surface)',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                borderColor: isActive ? c.color : 'var(--border-default)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: isActive ? '#fff' : c.color,
                display: 'inline-block'
              }} />
              <span>{c.name}</span>
              <span style={{ opacity: 0.7, fontFamily: 'var(--font-mono)' }}>({c.count})</span>
            </button>
          );
        })}
      </div>

      {/* Interactive 2D Scatter Canvas Area */}
      <div 
        style={{
          position: 'relative',
          width: '100%',
          backgroundColor: 'var(--bg-elevated)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden'
        }}
        onMouseLeave={() => setHoveredPoint(null)}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 800 520"
          style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '560px' }}
        >
          {/* Subtle Grid Lines */}
          <line x1="40" y1="260" x2="760" y2="260" stroke="var(--border-default)" strokeDasharray="3 3" opacity="0.6" />
          <line x1="400" y1="40" x2="400" y2="480" stroke="var(--border-default)" strokeDasharray="3 3" opacity="0.6" />

          {/* Projection Lines from Source to Results (if search results exist) */}
          {sourcePoint && resultPoints.length > 0 && resultPoints.map((rp, idx) => (
            <line
              key={'line-' + idx}
              x1={sourcePoint.x}
              y1={sourcePoint.y}
              x2={rp.x}
              y2={rp.y}
              stroke="var(--accent)"
              strokeWidth="1.2"
              strokeDasharray="4 3"
              opacity="0.8"
            />
          ))}

          {/* Scatter Points */}
          {visiblePoints.map((point) => {
            const isHovered = hoveredPoint?.embedding_index === point.embedding_index;
            const isSource = sourcePoint?.embedding_index === point.embedding_index;
            const isResult = resultPoints.some(r => r.embedding_index === point.embedding_index);

            // Skip rendering if source or result (they will be rendered on top)
            if (isSource || isResult) return null;

            return (
              <circle
                key={point.embedding_index}
                cx={point.x}
                cy={point.y}
                r={isHovered ? 6 : 3}
                fill={point.color}
                opacity={isHovered ? 1 : 0.65}
                style={{ cursor: 'pointer', transition: 'r 0.1s ease, opacity 0.1s ease' }}
                onMouseMove={(e) => handleMouseMove(e, point)}
                onClick={() => onSelectCompany && onSelectCompany(point.name)}
              />
            );
          })}

          {/* Highlighted Result Points */}
          {resultPoints.map((rp) => (
            <g 
              key={'result-' + rp.embedding_index} 
              style={{ cursor: 'pointer' }}
              onMouseMove={(e) => handleMouseMove(e, rp)}
              onClick={() => onViewDetail && onViewDetail(rp)}
            >
              <circle cx={rp.x} cy={rp.y} r="8" fill="var(--bg-canvas)" stroke="var(--text-main)" strokeWidth="2" />
              <circle cx={rp.x} cy={rp.y} r="4.5" fill="var(--accent)" />
              <text 
                x={rp.x + 10} 
                y={rp.y + 4} 
                fontSize="11" 
                fontWeight="600" 
                fill="var(--text-main)"
                fontFamily="var(--font-sans)"
              >
                #{rp.rank} {rp.name}
              </text>
            </g>
          ))}

          {/* Highlighted Source Point */}
          {sourcePoint && (
            <g 
              style={{ cursor: 'pointer' }}
              onMouseMove={(e) => handleMouseMove(e, sourcePoint)}
            >
              <circle cx={sourcePoint.x} cy={sourcePoint.y} r="12" fill="none" stroke="var(--accent)" strokeWidth="2" strokeDasharray="3 2" />
              <circle cx={sourcePoint.x} cy={sourcePoint.y} r="6" fill="var(--text-main)" />
              <text 
                x={sourcePoint.x} 
                y={sourcePoint.y - 14} 
                fontSize="12" 
                fontWeight="700" 
                fill="var(--text-main)"
                textAnchor="middle"
                fontFamily="var(--font-sans)"
              >
                [Acuan] {sourcePoint.name}
              </text>
            </g>
          )}
        </svg>

        {/* Floating Tooltip */}
        {hoveredPoint && (
          <div style={{
            position: 'absolute',
            left: `${tooltipPos.x + 12}px`,
            top: `${tooltipPos.y + 12}px`,
            pointerEvents: 'none',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.5rem 0.75rem',
            boxShadow: 'var(--shadow-overlay)',
            zIndex: 10,
            maxWidth: '220px',
            fontSize: '0.775rem'
          }}>
            <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
              {hoveredPoint.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: hoveredPoint.color }} />
              <span>{hoveredPoint.cluster_name}</span>
            </div>
            {hoveredPoint.company_id && (
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '0.15rem' }}>
                ID: {hoveredPoint.company_id}
              </div>
            )}
            <div style={{ fontSize: '0.675rem', color: 'var(--text-muted)', marginTop: '0.3rem', fontStyle: 'italic' }}>
              Klik untuk memilih sebagai kueri
            </div>
          </div>
        )}
      </div>

      {/* Map Legend & Mathematical Interpretation Footer */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
        marginTop: '1rem',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        borderTop: '1px solid var(--border-default)',
        paddingTop: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Info size={14} />
          <span>
            Kedekatan posisi titik merefleksikan kedekatan sudut semantik dalam ruang vektor embedding (Cosine Distance).
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: 'var(--font-mono)' }}>
          <span>Silhouette Score: <strong>{data.silhouette_score}</strong></span>
          <span>·</span>
          <span>PCA D1/D2: <strong>{(data.pca_variance_ratio || [0.027, 0.026]).map(v => (v * 100).toFixed(1) + '%').join(', ')}</strong></span>
        </div>
      </div>
    </div>
  );
}
