import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

const SAMPLE_PROMPTS = [
  {
    title: 'Teknologi & Cloud',
    text: 'We are an innovative enterprise software company focused on artificial intelligence, big data analytics, and cloud infrastructure automation for businesses worldwide.'
  },
  {
    title: 'Energi & Petrokimia',
    text: 'A multinational oil and gas exploration company transitioning into renewable wind, solar energy, and sustainable low-carbon power generation systems.'
  },
  {
    title: 'Fintech & Finansial',
    text: 'A high-growth financial technology startup providing mobile payment gateways, digital wallets, cross-border remittance, and credit scoring solutions.'
  },
  {
    title: 'Konsumsi (FMCG)',
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
    <div className="surface-card" style={{ padding: '1.75rem', maxWidth: '780px', margin: '0 auto' }}>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Text Area Input */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                Deskripsi Bisnis Baru
              </label>
              <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {wordCount} kata · {charCount} karakter
              </span>
            </div>

            <textarea
              id="company-text-input"
              className="form-textarea"
              placeholder="Masukkan deskripsi profil, produk, atau fokus bisnis (contoh: Kami adalah perusahaan yang menyediakan layanan komputasi awan, kecerdasan buatan, dan otomatisasi alur kerja untuk korporasi...)"
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{ minHeight: '120px' }}
            />
          </div>

          {/* Clean Preset Samples */}
          <div>
            <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              Contoh template profil:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {SAMPLE_PROMPTS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setText(sample.text)}
                  className="btn btn-secondary"
                  style={{
                    padding: '0.25rem 0.6rem',
                    fontSize: '0.75rem',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  {sample.title}
                </button>
              ))}
            </div>
          </div>

          {/* Top-K Range Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                Batas Hasil Pencarian (Top-K)
              </label>
              <span className="badge">
                {topK} Perusahaan
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
              className="clean-slider"
            />
          </div>

          {/* Submit Button */}
          <button
            id="text-search-submit-btn"
            type="submit"
            className="btn btn-primary"
            disabled={loading || !text.trim() || text.trim().length < 3}
            style={{ padding: '0.7rem', marginTop: '0.25rem' }}
          >
            {loading ? (
              <>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Meng-encode Vektor Semantik...</span>
              </>
            ) : (
              <span>Cari Perusahaan Serupa</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
