// Centralized API Service for Company Similarity Engine

const STORAGE_KEY = 'cs_custom_api_url';

export const getBaseUrl = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && saved.trim()) {
    return saved.trim().replace(/\/$/, '');
  }
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, '');
  }
  // In dev, Vite proxies /api to http://localhost:8000
  return '';
};

export const setCustomBaseUrl = (url) => {
  if (!url || !url.trim()) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, url.trim().replace(/\/$/, ''));
  }
};

const handleResponse = async (res) => {
  if (!res.ok) {
    let errorMsg = `HTTP Error ${res.status}: ${res.statusText}`;
    try {
      const data = await res.json();
      if (data && data.detail) {
        errorMsg = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
      }
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }
  return res.json();
};

export const api = {
  async checkHealth() {
    const base = getBaseUrl();
    const start = performance.now();
    try {
      const res = await fetch(`${base}/api/health`, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(6000)
      });
      const data = await handleResponse(res);
      const latency = Math.round(performance.now() - start);
      return { ok: true, data, latency };
    } catch (err) {
      return { ok: false, error: err.message, latency: null };
    }
  },

  async getStats() {
    const base = getBaseUrl();
    const res = await fetch(`${base}/api/stats`, {
      headers: { 'Accept': 'application/json' }
    });
    return handleResponse(res);
  },

  async searchCompanies(query = '', limit = 20) {
    const base = getBaseUrl();
    const url = new URL(`${base || window.location.origin}/api/companies`);
    if (query) url.searchParams.append('q', query);
    url.searchParams.append('limit', limit);

    const res = await fetch(url.toString(), {
      headers: { 'Accept': 'application/json' }
    });
    return handleResponse(res);
  },

  async getCompanyDetail(companyName) {
    const base = getBaseUrl();
    const res = await fetch(`${base}/api/companies/${encodeURIComponent(companyName)}`, {
      headers: { 'Accept': 'application/json' }
    });
    return handleResponse(res);
  },

  async getSimilarByCompany(companyName, topK = 5) {
    const base = getBaseUrl();
    const res = await fetch(`${base}/api/similarity/by-company`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        company_name: companyName,
        top_k: topK
      })
    });
    return handleResponse(res);
  },

  async getSimilarByText(text, topK = 5) {
    const base = getBaseUrl();
    const res = await fetch(`${base}/api/similarity/by-text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        text: text,
        top_k: topK
      })
    });
    return handleResponse(res);
  }
};
