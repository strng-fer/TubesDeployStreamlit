# 🔍 Company Similarity Engine (FastAPI + React / Vercel)

Aplikasi web modern dan interaktif untuk mencari perusahaan yang serupa menggunakan arsitektur deep learning **LSTM Autoencoder** dan representasi vektor **256-dimensi** dengan **Cosine Similarity**. 

Aplikasi ini telah dimodernisasi dari Streamlit menjadi arsitektur decoupled:
- **Backend:** [FastAPI](https://fastapi.tiangolo.com/) (High-performance Python REST API + OpenAPI Swagger Docs)
- **Frontend:** [React + Vite](https://vitejs.dev/) dengan styling modern Vanilla CSS Glassmorphism, siap dideploy langsung ke **[Vercel](https://vercel.com/)**.

---

## ✨ Fitur-Fitur Utama

1. **🏢 Pencarian dari Perusahaan yang Ada (Database Lookup)**
   - Input autocomplete dengan debounce dan navigasi keyboard (Up/Down/Enter).
   - Chip rekomendasi perusahaan populer (Colgate-Palmolive, Shell, Shopee, IBM, Siemens, Pertamina, dll).
   - Slider Top-K interaktif (3 hingga 20 hasil).
   - Hasil pencarian menampilkan rank badge emas/perak/perunggu, similarity meter progresif, kategori industri, dan ringkasan profil.

2. **✍️ Analisis Deskripsi Baru (AI NLP Encoder)**
   - Masukkan deskripsi bebas atau gunakan preset template industri (Technology, Energy, Fintech, FMCG).
   - Live character counter dan word counter.
   - Text diproses melalui Tokenizer, di-encode oleh LSTM Autoencoder menjadi embedding 256-D, lalu dicocokkan dengan seluruh database.

3. **📊 Multi-View Hasil Pencarian**
   - **Grid Card View:** Kartu interaktif dengan visual percentage meter dan tombol aksi.
   - **Bar Chart View:** Visualisasi grafik batang dinamis perbandingan nilai cosine similarity.
   - **Table View:** Format tabel ringkas dengan kolom terstruktur.

4. **⚖️ Fitur Komparasi Side-by-Side (`CompareModal`)**
   - Bandingkan profil perusahaan sumber vs perusahaan target secara langsung.
   - Visualisasi persentase kecocokan dan analisis keselarasan kategori industri.

5. **📥 Ekspor Data & Aksi Pivot**
   - Ekspor hasil pencarian ke format **CSV** atau **JSON** dengan 1-klik.
   - Tombol **"Cari Serupa"** pada tiap kartu untuk langsung menjadikan hasil tersebut sebagai kueri pencarian baru (*pivot search*).

6. **🎨 Desain Modern & User-Friendly**
   - Tema Gelap (*Dark Theme*) dengan efek Glassmorphism dan ambient lighting, serta toggle Tema Terang.
   - Indikator koneksi API real-time dengan meter latensi (ms).
   - Pop-up konfigurasi endpoint API langsung di UI.
   - Efek perayaan partikel (*confetti burst*) saat pencarian berhasil.

---

## 📁 Struktur Direktori

```
TubesDeployStreamlit/
├── backend/                         # Backend FastAPI
│   ├── main.py                      # Server FastAPI & endpoint routing
│   ├── ml_service.py                # Service loader model LSTM, embeddings, data
│   ├── schemas.py                   # Model validasi Pydantic
│   ├── test_api.py                  # Smoke test otomatis endpoint API
│   └── __init__.py
├── frontend/                        # Frontend React + Vite (Vercel-Ready)
│   ├── src/
│   │   ├── components/              # Komponen modular UI (Navbar, Cards, Modals, dll)
│   │   ├── services/api.js          # Client API dengan auto-proxy & custom URL
│   │   ├── App.jsx                  # Dashboard aplikasi utama
│   │   └── index.css                # Sistem desain Vanilla CSS modern & tokens
│   ├── vercel.json                  # Konfigurasi routing Vercel SPA
│   ├── vite.config.js               # Proxy otomatis ke backend localhost:8000
│   └── package.json
├── company_encoder.keras            # Model LSTM Autoencoder (Keras 3)
├── company_embeddings.npy           # Pre-computed vector embeddings (1,986 x 256)
├── company_metadata.csv             # Metadata perusahaan (id, name, embedding_index)
├── company_info.csv                 # Dataset informasi profil perusahaan (id, name, about)
├── tokenizer.pkl                    # Keras text tokenizer (vocab ~19,851)
├── requirements.txt                 # Dependencies Python (FastAPI, Uvicorn, TensorFlow, dll)
├── run_app.bat                      # Script 1-klik menjalankan Backend & Frontend di Windows
├── vercel.json                      # Root configuration untuk import repository Vercel
└── README.md
```

---

## 🚀 Panduan Menjalankan Secara Lokal

### 1. Prasyarat
- Python 3.10 - 3.12
- Node.js 18+ dan npm

### 2. Install Dependencies Python
```powershell
pip install -r requirements.txt
```
> **Catatan:** Pastikan menggunakan `numpy<2` (sudah diatur di `requirements.txt`) agar kompatibel dengan TensorFlow 2.17.

### 3. Install Dependencies Frontend
```powershell
cd frontend
npm install
cd ..
```

### 4. Menjalankan Aplikasi

#### Cara 1: Menggunakan Script Otomatis (Windows)
Cukup jalankan file:
```powershell
.\run_app.bat
```
Script ini akan otomatis membuka terminal backend FastAPI dan terminal frontend Vite.

#### Cara 2: Menjalankan Secara Manual

**Terminal 1 (Backend FastAPI):**
```powershell
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
- Swagger API Docs aktif di: [http://localhost:8000/docs](http://localhost:8000/docs)

**Terminal 2 (Frontend React Vite):**
```powershell
cd frontend
npm run dev
```
- Buka browser di: [http://localhost:5173](http://localhost:5173)

---

## ☁️ Panduan Deploy ke Vercel

Frontend React telah disiapkan untuk deployment langsung ke **Vercel**:

### Opsi A: Deploy via Vercel Dashboard (Rekomendasi)
1. Push repository ini ke GitHub.
2. Buka [vercel.com](https://vercel.com) dan klik **"Add New Project"**.
3. Import repository GitHub Anda.
4. Pada bagian **Root Directory**, pilih folder `frontend` (atau biarkan root, file `vercel.json` sudah dikonfigurasi).
5. (Opsional) Tambahkan Environment Variable:
   - `VITE_API_URL`: URL server FastAPI backend Anda (contoh: `https://company-similarity-api.onrender.com`).
6. Klik **"Deploy"**!

### Opsi B: Deploy via Vercel CLI
```bash
npm install -g vercel
cd frontend
vercel
```

---

## 🌐 Menghubungkan Backend yang Di-host Cloud

Karena model TensorFlow dan embedding membutuhkan server Python, backend FastAPI dapat di-deploy ke layanan gratis seperti:
- **[Render.com](https://render.com/)** (Web Service: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`)
- **[Railway.app](https://railway.app/)**
- **[Hugging Face Spaces](https://huggingface.co/spaces)** (Docker / Gradio / FastAPI Space)

Setelah backend aktif di cloud:
1. Buka website Vercel Anda.
2. Klik tombol **ikon Gear (Settings)** di navbar pojok kanan atas.
3. Masukkan URL backend Anda (misal `https://my-backend.onrender.com`) lalu klik **"Simpan & Hubungkan"**.
4. Website akan langsung tersambung dan indikator berubah menjadi hijau **"FastAPI Connected"**!

---

## 📡 Dokumentasi Endpoint REST API

| Endpoint | Method | Deskripsi |
|---|---|---|
| `/` | `GET` | Status umum API dan daftar rute |
| `/api/health` | `GET` | Health check & ketersediaan model |
| `/api/stats` | `GET` | Jumlah perusahaan, dimensi vektor, dan info model |
| `/api/companies` | `GET` | Autocomplete pencarian nama perusahaan (`?q=...&limit=20`) |
| `/api/companies/{name}` | `GET` | Profil detail dan deskripsi tentang perusahaan |
| `/api/similarity/by-company` | `POST` | Cari kemiripan berdasarkan nama perusahaan sumber |
| `/api/similarity/by-text` | `POST` | Cari kemiripan berdasarkan teks deskripsi baru via LSTM |

Dokumentasi interaktif Swagger UI tersedia di `http://localhost:8000/docs`.
