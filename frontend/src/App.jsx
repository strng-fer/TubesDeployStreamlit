import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  PenTool, 
  LayoutGrid, 
  BarChart3, 
  Table as TableIcon, 
  Download, 
  AlertCircle
} from 'lucide-react';

import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import CompanySearchTab from './components/CompanySearchTab';
import TextSearchTab from './components/TextSearchTab';
import CompanyCard from './components/CompanyCard';
import SimilarityChart from './components/SimilarityChart';
import CompanyModal from './components/CompanyModal';
import CompareModal from './components/CompareModal';
import AnalyticsModal from './components/AnalyticsModal';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('company'); // 'company' | 'text'
  const [health, setHealth] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultsData, setResultsData] = useState(null);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'chart' | 'table'
  const [filterTag, setFilterTag] = useState('all');
  
  // Modals state
  const [modalCompany, setModalCompany] = useState(null);
  const [compareTarget, setCompareTarget] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  // Theme state
  const [isDark, setIsDark] = useState(true);

  // Toggle theme
  const toggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      document.body.className = next ? 'dark-theme' : 'light-theme';
      return next;
    });
  };

  // Initial load
  const refreshStatus = async () => {
    try {
      const h = await api.checkHealth();
      setHealth(h);
      if (h.ok) {
        const s = await api.getStats();
        setStats(s);
      }
    } catch (err) {
      console.error("Health check error:", err);
    }
  };

  useEffect(() => {
    refreshStatus();
  }, []);

  // Handle Search by Company
  const handleCompanySearch = async ({ company_name, top_k }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getSimilarByCompany(company_name, top_k);
      setResultsData(data);
      setFilterTag('all');
    } catch (err) {
      setError(err.message || 'Gagal mencari kemiripan perusahaan.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Search by Text
  const handleTextSearch = async ({ text, top_k }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getSimilarByText(text, top_k);
      setResultsData(data);
      setFilterTag('all');
    } catch (err) {
      setError(err.message || 'Gagal menganalisis kemiripan teks.');
    } finally {
      setLoading(false);
    }
  };

  // Pivot search
  const handlePivotSearch = (companyName) => {
    setActiveTab('company');
    handleCompanySearch({ company_name: companyName, top_k: 5 });
    window.scrollTo({ top: 220, behavior: 'smooth' });
  };

  // Export JSON
  const handleExportJSON = () => {
    if (!resultsData) return;
    const jsonStr = JSON.stringify(resultsData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `similarity_results_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export CSV
  const handleExportCSV = () => {
    if (!resultsData || !resultsData.results) return;
    const headers = ['Rank', 'Perusahaan', 'Company ID', 'Similarity Score', 'Tags', 'About'];
    const rows = resultsData.results.map(r => [
      r.rank,
      `"${r.company_name.replace(/"/g, '""')}"`,
      `"${(r.company_id || '').replace(/"/g, '""')}"`,
      r.similarity_score,
      `"${(r.tags || []).join(', ')}"`,
      `"${(r.about || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `similarity_results_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filter tags
  const allResultTags = resultsData?.results 
    ? Array.from(new Set(resultsData.results.flatMap(r => r.tags || [])))
    : [];

  const filteredResults = resultsData?.results 
    ? (filterTag === 'all' 
        ? resultsData.results 
        : resultsData.results.filter(r => (r.tags || []).includes(filterTag)))
    : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navbar */}
      <Navbar 
        health={health}
        onRefreshHealth={refreshStatus}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onOpenAnalytics={() => setShowAnalytics(true)}
      />

      {/* Main Content */}
      <main style={{ flex: 1, paddingBottom: '4rem' }}>
        <HeroBanner stats={stats} />

        {/* Search Mode Switcher & Form */}
        <section className="container" style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div className="segmented-control">
              <button
                id="tab-btn-company"
                className={`segmented-item ${activeTab === 'company' ? 'active' : ''}`}
                onClick={() => setActiveTab('company')}
              >
                <Building2 size={16} />
                <span>Pilih dari Database</span>
              </button>
              <button
                id="tab-btn-text"
                className={`segmented-item ${activeTab === 'text' ? 'active' : ''}`}
                onClick={() => setActiveTab('text')}
              >
                <PenTool size={16} />
                <span>Input Deskripsi Baru</span>
              </button>
            </div>
          </div>

          <div>
            {activeTab === 'company' ? (
              <CompanySearchTab 
                onSearch={handleCompanySearch}
                loading={loading}
              />
            ) : (
              <TextSearchTab 
                onSearch={handleTextSearch}
                loading={loading}
              />
            )}
          </div>
        </section>

        {/* Error Notification */}
        {error && (
          <section className="container" style={{ marginBottom: '1.5rem' }}>
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <AlertCircle size={18} color="#ef4444" />
                <span style={{ fontSize: '0.875rem', color: '#ef4444' }}>{error}</span>
              </div>
              <button className="btn btn-ghost" onClick={() => setError(null)} style={{ fontSize: '0.75rem' }}>
                Tutup
              </button>
            </div>
          </section>
        )}

        {/* Results Section */}
        {resultsData && (
          <section className="container">
            {/* Toolbar */}
            <div className="surface-card" style={{ 
              padding: '0.85rem 1.25rem', 
              marginBottom: '1.25rem',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.85rem'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h2 style={{ fontSize: '1.05rem', fontWeight: 600 }}>
                    Hasil Pencarian
                  </h2>
                  <span className="badge badge-accent">
                    {filteredResults.length} Hasil
                  </span>
                </div>
                <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                  Acuan: <strong>{resultsData.query}</strong>
                </span>
              </div>

              {/* View Switcher & Export */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <div className="segmented-control" style={{ padding: '0.15rem' }}>
                  <button
                    className={`segmented-item ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                    title="Grid Kartu"
                    style={{ padding: '0.35rem 0.6rem' }}
                  >
                    <LayoutGrid size={15} />
                  </button>
                  <button
                    className={`segmented-item ${viewMode === 'chart' ? 'active' : ''}`}
                    onClick={() => setViewMode('chart')}
                    title="Grafik Batang"
                    style={{ padding: '0.35rem 0.6rem' }}
                  >
                    <BarChart3 size={15} />
                  </button>
                  <button
                    className={`segmented-item ${viewMode === 'table' ? 'active' : ''}`}
                    onClick={() => setViewMode('table')}
                    title="Tabel"
                    style={{ padding: '0.35rem 0.6rem' }}
                  >
                    <TableIcon size={15} />
                  </button>
                </div>

                <button
                  className="btn btn-secondary"
                  onClick={handleExportCSV}
                  title="Unduh file CSV"
                  style={{ fontSize: '0.775rem', padding: '0.4rem 0.75rem' }}
                >
                  <Download size={14} /> CSV
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={handleExportJSON}
                  title="Unduh file JSON"
                  style={{ fontSize: '0.775rem', padding: '0.4rem 0.65rem' }}
                >
                  JSON
                </button>
              </div>
            </div>

            {/* Filter Tags */}
            {allResultTags.length > 0 && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                flexWrap: 'wrap', 
                gap: '0.35rem', 
                marginBottom: '1.25rem' 
              }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginRight: '0.25rem' }}>
                  Filter Kategori:
                </span>
                <button
                  className={`btn btn-secondary ${filterTag === 'all' ? 'active' : ''}`}
                  onClick={() => setFilterTag('all')}
                  style={{
                    padding: '0.2rem 0.55rem',
                    fontSize: '0.725rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: filterTag === 'all' ? 'var(--text-main)' : 'var(--bg-surface)',
                    color: filterTag === 'all' ? 'var(--bg-canvas)' : 'var(--text-secondary)'
                  }}
                >
                  Semua ({resultsData.results.length})
                </button>
                {allResultTags.map(tag => {
                  const count = resultsData.results.filter(r => (r.tags || []).includes(tag)).length;
                  return (
                    <button
                      key={tag}
                      className={`btn btn-secondary ${filterTag === tag ? 'active' : ''}`}
                      onClick={() => setFilterTag(tag)}
                      style={{
                        padding: '0.2rem 0.55rem',
                        fontSize: '0.725rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: filterTag === tag ? 'var(--text-main)' : 'var(--bg-surface)',
                        color: filterTag === tag ? 'var(--bg-canvas)' : 'var(--text-secondary)'
                      }}
                    >
                      {tag} ({count})
                    </button>
                  );
                })}
              </div>
            )}

            {/* View 1: Chart */}
            {viewMode === 'chart' && (
              <SimilarityChart 
                results={filteredResults}
                sourceName={resultsData.query}
              />
            )}

            {/* View 2: Cards Grid */}
            {viewMode === 'grid' && (
              <div className="grid-cards">
                {filteredResults.map((result) => (
                  <CompanyCard
                    key={result.rank + result.company_name}
                    result={result}
                    onViewDetail={(comp) => setModalCompany(comp)}
                    onCompare={(comp) => setCompareTarget(comp)}
                    onPivotSearch={handlePivotSearch}
                  />
                ))}
              </div>
            )}

            {/* View 3: Table */}
            {viewMode === 'table' && (
              <div className="surface-card" style={{ overflowX: 'auto', padding: '0.5rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-default)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '0.6rem 0.85rem', width: '50px' }}>#</th>
                      <th style={{ padding: '0.6rem 0.85rem' }}>Perusahaan</th>
                      <th style={{ padding: '0.6rem 0.85rem' }}>Cosine Similarity</th>
                      <th style={{ padding: '0.6rem 0.85rem' }}>Kategori</th>
                      <th style={{ padding: '0.6rem 0.85rem', textAlign: 'right' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResults.map((r) => (
                      <tr 
                        key={r.rank + r.company_name}
                        style={{ borderBottom: '1px solid var(--border-default)' }}
                      >
                        <td style={{ padding: '0.6rem 0.85rem', fontFamily: 'var(--font-mono)' }}>
                          {r.rank}
                        </td>
                        <td style={{ padding: '0.6rem 0.85rem', fontWeight: 500 }}>
                          {r.company_name}
                          {r.company_id && (
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                              ID: {r.company_id}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '0.6rem 0.85rem', fontFamily: 'var(--font-mono)' }}>
                          {(r.similarity_score * 100).toFixed(2)}% <span style={{ color: 'var(--text-muted)' }}>({r.similarity_score.toFixed(4)})</span>
                        </td>
                        <td style={{ padding: '0.6rem 0.85rem' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.2rem' }}>
                            {(r.tags || []).map((t, idx) => (
                              <span key={idx} className="badge" style={{ fontSize: '0.675rem' }}>
                                {t}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td style={{ padding: '0.6rem 0.85rem', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.25rem' }}>
                            <button className="btn btn-ghost" onClick={() => setModalCompany(r)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.725rem' }}>
                              Detail
                            </button>
                            <button className="btn btn-ghost" onClick={() => setCompareTarget(r)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.725rem' }}>
                              Bandingkan
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: 'var(--bg-canvas)',
        borderTop: '1px solid var(--border-default)',
        padding: '1.5rem',
        marginTop: 'auto'
      }}>
        <div className="container" style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>
              Company Similarity Search
            </span> · Model Vektor LSTM Autoencoder & Cosine Similarity
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span>FastAPI Backend</span>
            <span>·</span>
            <span>React + Vite</span>
            <span>·</span>
            <span>Vercel Ready</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {modalCompany && (
        <CompanyModal 
          company={modalCompany}
          onClose={() => setModalCompany(null)}
          onPivotSearch={handlePivotSearch}
        />
      )}

      {compareTarget && (
        <CompareModal
          source={resultsData?.source_company}
          target={compareTarget}
          queryMode={resultsData?.mode}
          queryText={resultsData?.query}
          onClose={() => setCompareTarget(null)}
        />
      )}

      {showAnalytics && (
        <AnalyticsModal 
          stats={stats}
          onClose={() => setShowAnalytics(false)}
        />
      )}
    </div>
  );
}
