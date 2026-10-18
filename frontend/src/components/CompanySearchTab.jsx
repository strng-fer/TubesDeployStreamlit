import React, { useState, useEffect, useRef } from 'react';
import { Search, Check, Loader2, Sliders } from 'lucide-react';
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
  'Accenture'
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

  useEffect(() => {
    if (!query.trim()) {
      api.searchCompanies('', 10)
        .then(res => setSuggestions(res))
        .catch(() => {});
      return;
    }

    const timer = setTimeout(() => {
      setIsSearchingSuggestions(true);
      api.searchCompanies(query, 10)
        .then(res => {
          setSuggestions(res);
          setShowDropdown(true);
        })
        .catch(err => console.error(err))
        .finally(() => setIsSearchingSuggestions(false));
    }, 180);

    return () => clearTimeout(timer);
  }, [query]);

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
    <div className="surface-card" style={{ padding: '1.75rem', maxWidth: '780px', margin: '0 auto' }}>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Search Input with Autocomplete */}
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.85rem', 
              fontWeight: 500, 
              marginBottom: '0.4rem',
              color: 'var(--text-secondary)'
            }}>
              Pilih Perusahaan Acuan
            </label>

            <div style={{ position: 'relative' }}>
              <Search 
                size={16} 
                style={{ 
                  position: 'absolute', 
                  left: '0.85rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: 'var(--text-muted)' 
                }} 
              />
              <input
                id="company-search-input"
                type="text"
                className="form-input"
                placeholder="Cari nama perusahaan (cth. Colgate-Palmolive, Pertamina, Shell)..."
                value={query || selectedCompany}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedCompany('');
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                style={{ paddingLeft: '2.4rem', paddingRight: isSearchingSuggestions ? '2.4rem' : '0.85rem' }}
              />
              {isSearchingSuggestions && (
                <Loader2 
                  size={16} 
                  style={{ 
                    position: 'absolute', 
                    right: '0.85rem', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    color: 'var(--text-muted)',
                    animation: 'spin 1s linear infinite'
                  }} 
                />
              )}
            </div>

            {/* Clean Autocomplete Popover */}
            {showDropdown && suggestions.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '0.35rem',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-overlay)',
                maxHeight: '260px',
                overflowY: 'auto',
                zIndex: 60,
                padding: '0.25rem'
              }}>
                {suggestions.map((item, idx) => (
                  <div
                    key={item.name + idx}
                    onClick={() => handleSelect(item.name)}
                    style={{
                      padding: '0.55rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: idx === highlightedIndex || item.name === selectedCompany 
                        ? 'var(--bg-elevated)' 
                        : 'transparent',
                      color: 'var(--text-main)',
                      fontSize: '0.875rem'
                    }}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                  >
                    <div>
                      <div style={{ fontWeight: 500 }}>{item.name}</div>
                      {item.company_id && (
                        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          ID: {item.company_id}
                        </div>
                      )}
                    </div>
                    {item.name === selectedCompany && <Check size={14} color="var(--text-main)" />}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Filter Chips */}
          <div>
            <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              Pilihan cepat:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {QUICK_COMPANIES.map(company => (
                <button
                  key={company}
                  type="button"
                  onClick={() => handleSelect(company)}
                  className="btn btn-secondary"
                  style={{
                    padding: '0.25rem 0.6rem',
                    fontSize: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: selectedCompany === company ? 'var(--bg-subtle)' : 'var(--bg-surface)',
                    borderColor: selectedCompany === company ? 'var(--border-focus)' : 'var(--border-default)',
                    color: selectedCompany === company ? 'var(--text-main)' : 'var(--text-secondary)'
                  }}
                >
                  {company}
                </button>
              ))}
            </div>
          </div>

          {/* Top-K Slider */}
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
              id="topk-slider-company"
              type="range"
              min="3"
              max="20"
              step="1"
              value={topK}
              onChange={(e) => setTopK(e.target.value)}
              className="clean-slider"
            />
          </div>

          {/* Action Button */}
          <button
            id="company-search-submit-btn"
            type="submit"
            className="btn btn-primary"
            disabled={loading || (!selectedCompany && !query.trim())}
            style={{ padding: '0.7rem', marginTop: '0.25rem' }}
          >
            {loading ? (
              <>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Memproses Vektor...</span>
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
