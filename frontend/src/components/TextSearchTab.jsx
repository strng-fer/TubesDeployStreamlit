import React, { useState } from 'react';
import { PenTool, Sparkles, Sliders, ArrowRight, Loader2, BookOpen } from 'lucide-react';

const SAMPLE_PROMPTS = [
  {
    title: 'Technology & AI',
    text: 'We are an innovative enterprise software company focused on generative AI, machine learning analytics, and cloud infrastructure automation for businesses worldwide.'
  },
  {
    title: 'Energy & Petrochemical',
    text: 'A multinational oil and gas exploration company transitioning into renewable wind, solar energy, and sustainable low-carbon power generation systems.'
  },
  {
    title: 'Fintech & Payment',
    text: 'A high-growth financial technology startup providing mobile payment gateways, digital wallets, cross-border remittance, and credit scoring solutions.'
  },
  {
    title: 'FMCG & Consumer Goods',
    text: 'A global consumer goods corporation manufacturing oral care, soaps, personal hygiene products, and eco-friendly household cleaning detergents.'
  }
];

export default function TextSearchTab({ onSearch, loading }) {
  const [text, setText] = useState('');
  const [topK, setTopK] = useState(5);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || text.trim().length < 3) return;
    onSearch({ text: text.trim(), top_k: Number(topK) });
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', maxWidth: '850px', margin: '0 auto' }}>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          
          {/* Header Description */}
          <div>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              fontSize: '0.9rem', 
              fontWeight: 600, 
              marginBottom: '0.5rem',
              color: 'var(--text-primary)'
            }}>
              <PenTool size={18} className="text-gradient" />
              Masukkan Deskripsi Profil Perusahaan:
            </label>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Teks akan diproses oleh tokenizer, di-encode oleh LSTM Autoencoder menjadi vektor 256-D, lalu dicocokkan kemiripannya ke seluruh dataset.
            </p>

            {/* Textarea */}
            <div style={{ position: 'relative' }}>
              <textarea
                id="company-text-input"
                className="textarea-field"
                placeholder="Contoh: Kami adalah perusahaan teknologi yang mengembangkan platform kecerdasan buatan, big data analytics, dan komputasi awan untuk optimalisasi operasional..."
                rows={5}
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{ minHeight: '140px' }}
              />
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                marginTop: '0.35rem'
              }}>
                <span>Gunakan minimal 10-20 kata untuk hasil embedding yang optimal</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>
                  {wordCount} kata | {charCount} karakter
                </span>
              </div>
            </div>
          </div>

          {/* Quick Preset Samples */}
          <div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.4rem', 
              fontSize: '0.8rem', 
              color: 'var(--text-muted)', 
              marginBottom: '0.5rem' 
            }}>
              <Sparkles size={14} color="var(--primary-500)" />
              <span>Gunakan Contoh Preset Industri:</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem' }}>
              {SAMPLE_PROMPTS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setText(sample.text)}
                  className="btn btn-secondary"
                  style={{
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.8rem',
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <BookOpen size={14} color="var(--accent-cyan)" />
                  <span style={{ fontWeight: 600 }}>{sample.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Top-K Range Slider */}
          <div className="slider-container">
            <div className="slider-header">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                <Sliders size={16} /> Jumlah Rekomendasi (Top-K):
              </span>
              <span className="badge badge-cyan" style={{ fontSize: '0.85rem' }}>
                {topK} Perusahaan Terdekat
              </span>
            </div>
            <input
              id="topk-slider-text"
              type="range"
              min="3"
              max="20"
              step="1"
              value={topK}
              onChange={(e) => setTopK(e.target.value)}
              className="custom-range"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>3 (Paling Mirip)</span>
              <span>10 (Standar)</span>
              <span>20 (Eksplorasi Luas)</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            id="text-search-submit-btn"
            type="submit"
            className="btn btn-primary"
            disabled={loading || !text.trim() || text.trim().length < 3}
            style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', marginTop: '0.5rem' }}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Menjalankan Model LSTM Autoencoder & Cosine Similarity...</span>
              </>
            ) : (
              <>
                <span>Analisis Teks & Cari Kemiripan</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
