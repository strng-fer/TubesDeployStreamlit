# ⚡ Panduan Cepat (Quickstart)

## Menjalankan Aplikasi Lokal

### 1. Jalankan via Script 1-Klik (Windows)
Cukup double-click atau jalankan melalui PowerShell:
```powershell
.\run_app.bat
```

### 2. Jalankan Manual via Dua Terminal

**Terminal 1 - FastAPI Backend:**
```powershell
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
Akses Swagger Docs: `http://localhost:8000/docs`

**Terminal 2 - Frontend React Vite:**
```powershell
cd frontend
npm run dev
```
Akses Website: `http://localhost:5173`

---

## Deploy ke Vercel

1. Buka [https://vercel.com/new](https://vercel.com/new)
2. Import repository GitHub ini.
3. Tetapkan **Root Directory** ke `frontend` (atau biarkan default karena sudah ada root `vercel.json`).
4. Klik **Deploy**!
5. Masukkan URL backend FastAPI Anda pada modal Pengaturan (ikon Gear) di navbar.
