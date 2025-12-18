# Quick Start Guide

## Menjalankan Aplikasi

1. **Aktifkan virtual environment:**
```powershell
.\venv\Scripts\Activate.ps1
```

2. **Jalankan aplikasi:**
```powershell
streamlit run streamlit_app.py
```

3. **Buka browser** di `http://localhost:8501`

## Troubleshooting

Jika ada error saat mengaktifkan venv:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Deploy ke Streamlit Cloud

1. Push ke GitHub (jangan lupa .gitignore untuk venv/)
2. Pergi ke https://share.streamlit.io
3. Connect repository dan deploy!

Lihat [README.md](README.md) untuk dokumentasi lengkap.
