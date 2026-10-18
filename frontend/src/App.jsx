import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Building2, 
  PenTool, 
  LayoutGrid, 
  BarChart3, 
  Table as TableIcon, 
  Download, 
  Filter, 
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Search,
  CheckCircle2,
  ExternalLink
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

  // Trigger confetti on search complete
  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#6366F1', '#06B6D4', '#10B981', '#A855F7']
      });
    } catch {
      // ignore
    }
  };

  // Handle Search by Company
  const handleCompanySearch = async ({ company_name, top_k }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getSimilarByCompany(company_name, top_k);
      setResultsData(data);
      setFilterTag('all');
      triggerCelebration();
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
      triggerCelebration();
    } catch (err) {
      setError(err.message || 'Gagal menganalisis kemiripan teks.');
    } finally {
      setLoading(false);
    }
  };

  // Pivot search: click "Cari Serupa" from any result card
  const handlePivotSearch = (companyName) => {
    setActiveTab('company');
    handleCompanySearch({ company_name: companyName, top_k: 5 });
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  // Export results to JSON
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

  // Export results to CSV
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

  // Filter tags calculation
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

      {/* Main Content Area */}
      <main style={{ flex: 1, paddingBottom: '5rem' }}>
        {/* Hero Section */}
        <HeroBanner stats={stats} />

        {/* Search Engine Controls Section */}
        <section className="container" style={{ marginBottom: '3rem' }}>
          {/* Tab Switcher Pills */}
          <div className="tabs-container" style={{ marginBottom: '2rem' }}>
            <button
              id="tab-btn-company"
              className={`tab-btn ${activeTab === 'company' ? 'active' : ''}`}
              onClick={() => setActiveTab('company')}
            >
              <Building2 size={18} />
              <span>Cari dari Perusahaan yang Ada</span>
            </button>
            <button
              id="tab-btn-text"
              className={`tab-btn ${activeTab === 'text' ? 'active' : ''}`}
              onClick={() => setActiveTab('text')}
            >
              <PenTool size={18} />
              <span>Input Deskripsi Baru (AI NLP)</span>
            </button>
          </div>

          {/* Tab Contents */}
          <div className="animate-fade-in">
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

        {/* Error Notification Alert */}
        {error && (
          <section className="container" style={{ marginBottom: '2rem' }}>
            <div style={{
              backgroundColor: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid var(--accent-rose)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <AlertTriangle size={24} color="var(--accent-rose)" />
                <div>
                  <h4 style={{ color: 'var(--accent-rose)', fontSize: '0.95rem' }}>Terjadi Kendala Pencarian</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{error}</p>
                </div>
              </div>
              <button className="btn btn-secondary" onClick={() => setError(null)} style={{ fontSize: '0.8rem' }}>
                Tutup
              </button>
            </div>
          </section>
        )}

        {/* Results Presentation Section */}
        {resultsData && (
          <section className="container animate-slide-up" style={{ marginTop: '1rem' }}>
            {/* Results Header Toolbar */}
            <div className="glass-panel" style={{ 
              padding: '1.25rem 1.75rem', 
              marginBottom: '1.5rem',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h2 style={{ fontSize: '1.35rem' }}>
                    Hasil Pencarian Perusahaan Serupa
                  </h2>
                  <span className="badge badge-success">
                    {filteredResults.length} Ditemukan
                  </span>
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Kueri: <strong>{resultsData.query}</strong> | Mode: {resultsData.mode === 'company' ? 'Database Lookup' : 'LSTM Encoding'}
                </span>
              </div>

              {/* View Switcher & Export */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  display: 'flex',
                  backgroundColor: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.2rem',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <button
                    className={`btn btn-ghost btn-icon ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                    title="Tampilan Kartu Grid"
                    style={{ backgroundColor: viewMode === 'grid' ? 'var(--bg-card-hover)' : 'transparent' }}
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button
                    className={`btn btn-ghost btn-icon ${viewMode === 'chart' ? 'active' : ''}`}
                    onClick={() => setViewMode('chart')}
                    title="Tampilan Grafik Batang Similarity"
                    style={{ backgroundColor: viewMode === 'chart' ? 'var(--bg-card-hover)' : 'transparent' }}
                  >
                    <BarChart3 size={18} />
                  </button>
                  <button
                    className={`btn btn-ghost btn-icon ${viewMode === 'table' ? 'active' : ''}`}
                    onClick={() => setViewMode('table')}
                    title="Tampilan Tabel Detail"
                    style={{ backgroundColor: viewMode === 'table' ? 'var(--bg-card-hover)' : 'transparent' }}
                  >
                    <TableIcon size={18} />
                  </button>
                </div>

                {/* Export Dropdown */}
                <button
                  className="btn btn-secondary"
                  onClick={handleExportCSV}
                  title="Unduh hasil sebagai file CSV"
                  style={{ fontSize: '0.85rem' }}
                >
                  <Download size={16} /> Ekspor CSV
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={handleExportJSON}
                  title="Unduh hasil sebagai file JSON"
                  style={{ fontSize: '0.85rem' }}
                >
                  JSON
                </button>
              </div>
            </div>

            {/* Filter by Tag Chips */}
            {allResultTags.length > 0 && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                flexWrap: 'wrap', 
                gap: '0.5rem', 
                marginBottom: '1.5rem' 
              }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Filter size={14} /> Filter Kategori:
                </span>
                <button
                  className={`btn btn-secondary ${filterTag === 'all' ? 'active' : ''}`}
                  onClick={() => setFilterTag('all')}
                  style={{
                    padding: '0.25rem 0.75rem',
                    fontSize: '0.75rem',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: filterTag === 'all' ? 'var(--primary-600)' : 'var(--bg-tertiary)',
                    color: filterTag === 'all' ? '#fff' : 'var(--text-secondary)'
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
                        padding: '0.25rem 0.75rem',
                        fontSize: '0.75rem',
                        borderRadius: 'var(--radius-pill)',
                        backgroundColor: filterTag === tag ? 'var(--primary-600)' : 'var(--bg-tertiary)',
                        color: filterTag === tag ? '#fff' : 'var(--text-secondary)'
                      }}
                    >
                      {tag} ({count})
                    </button>
                  );
                })}
              </div>
            )}

            {/* View 1: Chart Mode */}
            {viewMode === 'chart' && (
              <SimilarityChart 
                results={filteredResults}
                sourceName={resultsData.query}
              />
            )}

            {/* View 2: Cards Grid Mode */}
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

            {/* View 3: Table Mode */}
            {viewMode === 'table' && (
              <div className="glass-panel" style={{ overflowX: 'auto', padding: '1rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '0.75rem 1rem' }}>Rank</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Perusahaan</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Similarity Score</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Kategori / Industri</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResults.map((r) => (
                      <tr 
                        key={r.rank + r.company_name}
                        style={{ borderBottom: '1px solid var(--border-subtle)' }}
                      >
                        <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                          #{r.rank}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>
                          {r.company_name}
                          {r.company_id && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                              ID: {r.company_id}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-emerald)', fontWeight: 700 }}>
                          {(r.similarity_score * 100).toFixed(2)}% ({r.similarity_score.toFixed(4)})
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                            {(r.tags || []).map((t, idx) => (
                              <span key={idx} className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                                {t}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            <button className="btn btn-ghost" onClick={() => setModalCompany(r)} style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}>
                              Detail
                            </button>
                            <button className="btn btn-ghost" onClick={() => setCompareTarget(r)} style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}>
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
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '2.5rem 1.5rem',
        marginTop: 'auto'
      }}>
        <div className="container" style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          fontSize: '0.85rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
              Company Similarity Engine
            </span> — Modern Full-Stack AI Application
            <div>
              Frontend siap dideploy di <strong>Vercel</strong> | Backend ditenagai oleh <strong>FastAPI & Keras</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="badge badge-primary">FastAPI 0.143</span>
            <span className="badge badge-cyan">React + Vite</span>
            <span className="badge badge-success">LSTM 256-D</span>
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
