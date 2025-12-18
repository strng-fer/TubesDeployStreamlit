# Company Similarity Search dengan LSTM Autoencoder

Aplikasi Streamlit untuk mencari perusahaan yang serupa menggunakan LSTM Autoencoder dan Cosine Similarity.

## 📁 Struktur Project

```
TubesDeployStreamlit/
├── streamlit_app.py          # Aplikasi Streamlit utama
├── requirements.txt           # Dependencies Python
├── company_encoder.h5         # Model LSTM Autoencoder
├── company_embeddings.npy     # Embeddings perusahaan
├── company_metadata.csv       # Metadata perusahaan
├── fix_dataset2.csv          # Dataset (tidak digunakan saat runtime)
└── README.md                 # Dokumentasi ini
```

## 🚀 Setup Virtual Environment (venv)

### 1. Buat Virtual Environment

```powershell
# Di direktori project
python -m venv venv
```

### 2. Aktifkan Virtual Environment

```powershell
# Windows PowerShell
.\venv\Scripts\Activate.ps1

# Jika ada error execution policy, jalankan:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 3. Install Dependencies

```powershell
pip install -r requirements.txt
```

## 💻 Menjalankan Aplikasi Lokal

Setelah virtual environment aktif dan dependencies terinstall:

```powershell
streamlit run streamlit_app.py
```

Aplikasi akan terbuka di browser pada `http://localhost:8501`

## ☁️ Deploy ke Streamlit Cloud

### Persiapan

1. **Push ke GitHub Repository**
   - Buat repository baru di GitHub
   - Push semua file kecuali `venv/` (tambahkan ke `.gitignore`)

```powershell
# Buat .gitignore
echo "venv/" > .gitignore
echo "__pycache__/" >> .gitignore
echo "*.pyc" >> .gitignore

# Initialize git (jika belum)
git init
git add .
git commit -m "Initial commit: Company similarity search app"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO_NAME.git
git push -u origin main
```

### Deploy ke Streamlit Cloud

1. Pergi ke [share.streamlit.io](https://share.streamlit.io)
2. Login dengan GitHub
3. Klik **"New app"**
4. Pilih:
   - **Repository:** Repository GitHub Anda
   - **Branch:** main
   - **Main file path:** streamlit_app.py
5. Klik **"Deploy"**

⚠️ **Catatan Penting:**
- File `fix_dataset2.csv` sangat besar (>50MB), tidak perlu di-upload ke GitHub
- Pastikan file berikut ada di repository:
  - `streamlit_app.py`
  - `requirements.txt`
  - `company_encoder.h5`
  - `company_embeddings.npy`
  - `company_metadata.csv`

## 🔧 Fitur Aplikasi

- **Similarity Search:** Mencari perusahaan yang serupa berdasarkan embeddings
- **Interactive UI:** Pilih perusahaan dari dropdown
- **Adjustable Results:** Atur jumlah hasil pencarian (3-20)
- **Visualization:** Bar chart untuk similarity scores
- **Real-time Processing:** Menggunakan cache untuk performa optimal

## 📊 Cara Kerja

1. **Load Model:** Memuat LSTM Autoencoder dari file `.h5`
2. **Load Embeddings:** Memuat embeddings yang sudah di-generate
3. **Load Metadata:** Memuat informasi perusahaan
4. **Similarity Calculation:** Menghitung cosine similarity antara embeddings
5. **Display Results:** Menampilkan perusahaan paling mirip dengan score

## 🛠️ Troubleshooting

### Error saat aktifkan venv
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Error TensorFlow
Pastikan versi Python 3.8-3.11 (TensorFlow 2.15.0 tidak support Python 3.12+)

### Error loading files
Pastikan semua file berada di direktori yang sama dengan `streamlit_app.py`

## 📦 Dependencies

- **streamlit:** Framework web app
- **tensorflow:** Load dan run model LSTM
- **numpy:** Operasi array dan embeddings
- **pandas:** Manipulasi data metadata
- **scikit-learn:** Cosine similarity calculation

## 👨‍💻 Development

Untuk development lebih lanjut, edit file [streamlit_app.py](streamlit_app.py) sesuai kebutuhan.

## 📝 License

Project ini untuk keperluan akademik.
