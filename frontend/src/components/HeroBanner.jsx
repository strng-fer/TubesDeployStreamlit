import React from 'react';
import { Database, Layers, GitCommit, Gauge } from 'lucide-react';

export default function HeroBanner({ stats }) {
  const totalCompanies = stats?.total_companies || 1986;
  const embeddingDim = stats?.embedding_dim || 256;
  const modelName = stats?.model_name || 'LSTM Autoencoder';

  return (
    <section style={{
      padding: '2.5rem 0 1.5rem 0',
      borderBottom: '1px solid var(--border-muted)',
      marginBottom: '2rem'
    }}>
      <div className="container">
        <div style={{ maxWidth: '720px' }}>
          <h1 style={{
            fontSize: '1.85rem',
            lineHeight: 1.25,
            marginBottom: '0.5rem',
            fontWeight: 600,
            color: 'var(--text-main)'
          }}>
            Pencarian Kemiripan Profil Perusahaan
          </h1>

          <p style={{
            fontSize: '0.95rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: '1.5rem'
          }}>
            Temukan entitas bisnis dengan karakteristik serupa berdasarkan analisis semantik profil perusahaan menggunakan representasi vektor 256-dimensi dan Cosine Similarity.
          </p>

          {/* Minimalist Specs Strip */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '1.25rem',
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Database size={14} />
              <span><strong>{totalCompanies.toLocaleString()}</strong> Perusahaan</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Layers size={14} />
              <span><strong>{embeddingDim}-D</strong> Vector Embeddings</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <GitCommit size={14} />
              <span>Model: <strong>{modelName}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Gauge size={14} />
              <span>Metrik: <strong>Cosine Similarity</strong></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
