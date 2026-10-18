import React from 'react';
import { X } from 'lucide-react';

export default function AnalyticsModal({ stats, onClose }) {
  if (!stats) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '680px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Spesifikasi Teknis & Data</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Detail konfigurasi model embedding dan pipeline cosine similarity
            </span>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* 4 Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '0.75rem',
          marginBottom: '1.25rem'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-elevated)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)'
          }}>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Total Perusahaan</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
              {stats.total_companies?.toLocaleString() || 1986}
            </div>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-elevated)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)'
          }}>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Dimensi Vektor</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
              {stats.embedding_dim || 256}
            </div>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-elevated)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)'
          }}>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Vocabulary Size</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
              {stats.vocab_size?.toLocaleString() || 19851}
            </div>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-elevated)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)'
          }}>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Status Model</span>
            <div style={{ 
              fontSize: '0.875rem', 
              fontWeight: 600, 
              color: stats.model_loaded ? 'var(--emerald-text)' : 'var(--text-secondary)',
              marginTop: '0.2rem' 
            }}>
              {stats.model_loaded ? 'Tersedia' : 'Embeddings Saja'}
            </div>
          </div>
        </div>

        {/* Technical Explanations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <div style={{
            backgroundColor: 'var(--bg-elevated)',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)'
          }}>
            <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>
              1. NLP Text Preprocessing
            </strong>
            Teks profil perusahaan diproses melalui Keras Tokenizer dengan batas panjang sekuens 200 token untuk menghasilkan matriks input representatif.
          </div>

          <div style={{
            backgroundColor: 'var(--bg-elevated)',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)'
          }}>
            <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>
              2. LSTM Encoder Latent Vector
            </strong>
            Lapisan encoder mengekstrak fitur semantik ke dalam ruang laten 256-dimensi. Representasi ini merekam keterkaitan industri dan kata kunci kontekstual.
          </div>

          <div style={{
            backgroundColor: 'var(--bg-elevated)',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)'
          }}>
            <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>
              3. Cosine Similarity Engine
            </strong>
            Peringkat dihitung menggunakan rumus Cosine Similarity antara vektor kueri dan seluruh matriks embedding yang telah dihitung sebelumnya (*pre-computed matrix*).
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-primary" onClick={onClose} style={{ fontSize: '0.8rem' }}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
