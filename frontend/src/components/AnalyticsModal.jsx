import React from 'react';
import { X, Cpu, Layers, GitBranch, Database, ShieldCheck, Zap } from 'lucide-react';

export default function AnalyticsModal({ stats, onClose }) {
  if (!stats) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '720px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Cpu size={24} className="text-gradient" />
            <div>
              <h2 style={{ fontSize: '1.35rem' }}>Arsitektur Sistem & Statistik Vektor</h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Deep Learning LSTM Autoencoder + Cosine Similarity
              </span>
            </div>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* 4 Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
          marginBottom: '1.75rem'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-tertiary)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Perusahaan</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
              {stats.total_companies?.toLocaleString() || 1986}
            </div>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-tertiary)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dimensi Vektor</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
              {stats.embedding_dim || 256} D
            </div>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-tertiary)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Vocabulary Token</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
              {stats.vocab_size?.toLocaleString() || 19851}
            </div>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-tertiary)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status Model</span>
            <div style={{ 
              fontSize: '1rem', 
              fontWeight: 700, 
              color: stats.model_loaded ? 'var(--accent-emerald)' : 'var(--accent-amber)',
              marginTop: '0.25rem' 
            }}>
              {stats.model_loaded ? 'Aktif & Siap' : 'Embeddings Saja'}
            </div>
          </div>
        </div>

        {/* Technical Architecture Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{
            backgroundColor: 'var(--bg-tertiary)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
              <GitBranch size={16} color="var(--primary-500)" />
              1. NLP Text Preprocessing & Tokenization
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Deskripsi tekstual profil perusahaan dibersihkan, dipecah menjadi token melalui Keras Tokenizer (panjang sekuens maksimal 200 token), dan diubah menjadi matriks integer terindeks.
            </p>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-tertiary)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
              <Layers size={16} color="var(--accent-cyan)" />
              2. LSTM Encoder Latent Representation (256-D)
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Arsitektur encoder mengekstrak fitur kontekstual dan semantik abstrak ke dalam ruang vektor berdimensi 256. Kompresi ini menangkap keterkaitan industri secara mendalam melampaui sekadar pencocokan kata kunci harfiah.
            </p>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-tertiary)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
              <Zap size={16} color="var(--accent-emerald)" />
              3. Vector Cosine Similarity Engine
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Kemiripan dihitung menggunakan dot product normalisasi: <code>cos(θ) = (A · B) / (||A|| ||B||)</code>. Seluruh matriks kemiripan untuk 1,986 entitas dihitung dalam hitungan milidetik.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-primary" onClick={onClose}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
