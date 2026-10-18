import React, { useState, useEffect, useRef } from 'react';
import { Search, Building2, Sliders, ArrowRight, Loader2, Check } from 'lucide-react';
import { api } from '../services/api';

const QUICK_COMPANIES = [
  'Colgate-Palmolive',
  'Shell',
  'Shopee',
  'IBM',
  'Siemens',
  'PT Pertamina (Persero)',
  'Danone',
  'Michael Page',
  'Accenture',
  'Oracle'
];

export default function CompanySearchTab({ onSearch, loading }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('Colgate-Palmolive');
  const [topK, setTopK] = useState(5);
  const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);

  // Debounced search for suggestions
  useEffect(() => {
    if (!query.trim()) {
      // Load initial top companies for dropdown
      api.searchCompanies('', 12)
        .then(res => setSuggestions(res))
        .catch(() => {});
      return;
    }

    const timer = setTimeout(() => {
      setIsSearchingSuggestions(true);
      api.searchCompanies(query, 12)
        .then(res => {
          setSuggestions(res);
          setShowDropdown(true);
        })
        .catch(err => console.error(err))
        .finally(() => setIsSearchingSuggestions(false));
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (name) => {
    setSelectedCompany(name);
    setQuery(name);
    setShowDropdown(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showDropdown || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        handleSelect(suggestions[highlightedIndex].name);
      } else {
        handleSubmit(e);
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const target = selectedCompany || query.trim();
    if (!target) return;
    onSearch({ company_name: target, top_k: Number(topK) });
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', maxWidth: '850px', margin: '0 auto' }}>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          
          {/* Company Search Input with Autocomplete */}
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              fontSize: '0.9rem', 
              fontWeight: 600, 
              marginBottom: '0.5rem',
              color: 'var(--text-primary)'
            }}>
              <Building2 size={18} className="text-gradient" />
              Pilih / Cari Perusahaan Sumber:
            </label>

            <div style={{ position: 'relative' }}>
              <input
                id="company-search-input"
                type="text"
                className="input-field"
                placeholder="Ketik nama perusahaan (cth. Colgate, Pertamina, Shell)..."
                value={query || selectedCompany}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedCompany('');
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                style={{ paddingLeft: '2.75rem' }}
              />
              <Search 
                size={18} 
                style={{ 
                  position: 'absolute', 
                  left: '1rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: 'var(--text-muted)' 
                }} 
              />
              {isSearchingSuggestions && (
                <Loader2 
                  size={18} 
                  className="animate-spin" 
                  style={{ 
                    position: 'absolute', 
                    right: '1rem', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    color: 'var(--primary-500)',
                    animation: 'spin 1s linear infinite'
                  }} 
                />
              )}
            </div>

            {/* Dropdown Suggestions List */}
            {showDropdown && suggestions.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '0.4rem',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-hover)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                maxHeight: '260px',
                overflowY: 'auto',
                zIndex: 60,
                padding: '0.35rem'
              }}>
                {suggestions.map((item, idx) => (
                  <div
                    key={item.name + idx}
                    onClick={() => handleSelect(item.name)}
                    style={{
                      padding: '0.65rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: idx === highlightedIndex || item.name === selectedCompany 
                        ? 'var(--bg-tertiary)' 
                        : 'transparent',
                      color: item.name === selectedCompany ? 'var(--text-accent)' : 'var(--text-primary)',
                      transition: 'background-color 0.1s ease'
                    }}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.925rem' }}>{item.name}</div>
                      {item.about && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '400px' }}>
                          {item.about}
                        </div>
                      )}
                    </div>
                    {item.name === selectedCompany && <Check size={16} color="var(--primary-500)" />}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Select Chips */}
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Rekomendasi Cepat:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {QUICK_COMPANIES.map(company => (
                <button
                  key={company}
                  type="button"
                  onClick={() => handleSelect(company)}
                  className={`btn btn-secondary ${selectedCompany === company ? 'active' : ''}`}
                  style={{
                    padding: '0.3rem 0.75rem',
                    fontSize: '0.8rem',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: selectedCompany === company ? 'rgba(99, 102, 241, 0.25)' : 'var(--bg-glass-strong)',
                    borderColor: selectedCompany === company ? 'var(--primary-500)' : 'var(--border-subtle)',
                    color: selectedCompany === company ? 'var(--text-accent)' : 'var(--text-secondary)'
                  }}
                >
                  {company}
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
              id="topk-slider-company"
              type="range"
              min="3"
              max="20"
              step="1"
              value={topK}
              onChange={(e) => setTopK(e.target.value)}
              className="custom-range"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>3 (Spesifik)</span>
              <span>10 (Standar)</span>
              <span>20 (Komprehensif)</span>
            </div>
          </div>

          {/* Search Button */}
          <button
            id="company-search-submit-btn"
            type="submit"
            className="btn btn-primary"
            disabled={loading || (!selectedCompany && !query.trim())}
            style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', marginTop: '0.5rem' }}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Menghitung Vektor Cosine Similarity...</span>
              </>
            ) : (
              <>
                <span>Cari Perusahaan Serupa</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
