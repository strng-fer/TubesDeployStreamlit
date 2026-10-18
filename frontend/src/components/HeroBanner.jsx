import React from 'react';
import { Sparkles, Database, Layers, Zap, GitBranch } from 'lucide-react';

export default function HeroBanner({ stats }) {
  const totalCompanies = stats?.total_companies || 1986;
  const embeddingDim = stats?.embedding_dim || 256;
  const modelName = stats?.model_name || 'LSTM Autoencoder';
  const vocabSize = stats?.vocab_size || 19851;

  return (
    <section style={{
      padding: '3rem 0 2rem 0',
      textAlign: 'center',
      position: 'relative'
    }}>
      <div className="container">
        {/* Top Badge */}
        <div style={{ display: 'inline-flex', marginBottom: '1.25rem' }}>
          <div className="badge badge-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', gap: '0.5rem' }}>
            <Sparkles size={16} />
            <span>AI Neural Embedding & Vector Similarity Search</span>
          </div>
        </div>

        {/* Main Headline */}
        <h1 style={{
          fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
          lineHeight: 1.15,
          marginBottom: '1rem',
          maxWidth: '850px',
          margin: '0 auto 1rem auto'
        }}>
          Temukan Perusahaan Serupa dengan{' '}
          <span className="text-gradient">Deep Learning Autoencoder</span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.2rem)',
          color: 'var(--text-secondary)',
          maxWidth: '680px',
          margin: '0 auto 2.5rem auto',
          fontWeight: 400
        }}>
          Eksplorasi ribuan profil industri berdasarkan representasi semantik teks 256-dimensi dan Cosine Similarity berkecepatan tinggi.
        </p>

        {/* Metric Badges Strip */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          maxWidth: '960px',
          margin: '0 auto'
        }}>
          {/* Card 1: Total Companies */}
          <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{
                padding: '0.5rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                color: 'var(--primary-500)'
              }}>
                <Database size={20} />
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Database Perusahaan</span>
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
              {totalCompanies.toLocaleString()} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Entitas</span>
            </div>
          </div>

          {/* Card 2: Vector Dimension */}
          <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{
                padding: '0.5rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(6, 182, 212, 0.15)',
                color: 'var(--accent-cyan)'
              }}>
                <Layers size={20} />
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Vector Embedding</span>
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
              {embeddingDim} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Dimensi</span>
            </div>
          </div>

          {/* Card 3: Neural Model */}
          <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{
                padding: '0.5rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(168, 85, 247, 0.15)',
                color: 'var(--accent-purple)'
              }}>
                <GitBranch size={20} />
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Arsitektur Model</span>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {modelName}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Vocab: {vocabSize.toLocaleString()} token</span>
          </div>

          {/* Card 4: Sub-millisecond Cosine Engine */}
          <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{
                padding: '0.5rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: 'var(--accent-emerald)'
              }}>
                <Zap size={20} />
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Cosine Metric</span>
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-emerald)' }}>
              &lt; 5ms <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Latency</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
