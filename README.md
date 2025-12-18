# Company Similarity Search dengan LSTM Autoencoder

Aplikasi Streamlit untuk mencari perusahaan yang serupa menggunakan LSTM Autoencoder dan Cosine Similarity.

## ✨ Fitur Utama

- 🏢 **Cari dari Perusahaan yang Ada**: Pilih perusahaan dari database dan temukan yang serupa
- ✍️ **Input Deskripsi Baru**: Masukkan deskripsi perusahaan dan sistem akan mencari perusahaan serupa
- 📊 **Visualisasi Similarity Score**: Bar chart interaktif untuk melihat tingkat kemiripan
- 📝 **Informasi Lengkap**: Menampilkan nama, company ID, dan deskripsi lengkap (about company)

## 📁 Struktur Project

```
TubesDeployStreamlit/
├── streamlit_app.py              # Aplikasi Streamlit utama
├── requirements.txt               # Dependencies Python
├── company_encoder.keras          # Model LSTM Autoencoder (format Keras 3)
├── company_embeddings.npy         # Embeddings perusahaan (pre-computed)
├── company_metadata.csv           # Metadata perusahaan (id, name, index)
├── company_info.csv               # Dataset ringan (id, name, about)
├── tokenizer.pkl                  # Tokenizer untuk preprocessing text
├── prepare_lightweight_dataset.py # Script untuk membuat company_info.csv
└── README.md                      # Dokumentasi ini
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

### Persiapan Dataset (Pertama Kali)

Jika belum memiliki `company_info.csv`, jalankan script untuk membuat dataset ringan:

```powershell
python prepare_lightweight_dataset.py
```

Script ini akan:
- Membaca `fix_dataset2.csv` (file besar 50MB+)
- Mengekstrak kolom yang diperlukan: `company_id`, `name`, `about`
- Membuat file ringan `company_info.csv` (~1728 perusahaan)

### Menjalankan Aplikasi

Setelah virtual environment aktif dan dependencies terinstall:

```powershell
streamlit run streamlit_app.py
```

Aplikasi akan terbuka di browser pada `http://localhost:8501`

### Menggunakan Aplikasi

**Tab 1: 🏢 Cari dari Perusahaan yang Ada**
1. Pilih perusahaan dari dropdown
2. Atur jumlah hasil yang diinginkan (3-20)
3. Klik "🔍 Cari Perusahaan Serupa"
4. Lihat hasil dengan similarity score dan deskripsi lengkap

**Tab 2: ✍️ Input Deskripsi Baru**
1. Masukkan deskripsi perusahaan di text area
2. Atur jumlah hasil yang diinginkan (3-20)
3. Klik "🔍 Cari Perusahaan Serupa"
4. Sistem akan encode text dan mencari perusahaan serupa

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
- File `fix_dataset2.csv` sangat besar (>50MB), **JANGAN** di-upload ke GitHub
- File `prepare_lightweight_dataset.py` tidak perlu di-upload (hanya untuk development)
- **Pastikan file berikut ada di repository:**
  - `streamlit_app.py`
  - `requirements.txt`
  - `company_encoder.keras` (format Keras 3, bukan .h5)
  - `company_embeddings.npy`
  - `company_metadata.csv`
  - `company_info.csv` (dataset ringan)
  - `tokenizer.pkl`

## � Cara Kerja

### Mode 1: Cari dari Perusahaan yang Ada
1. **Load Embeddings:** Memuat embeddings yang sudah di-precompute
2. **Load Metadata:** Memuat informasi perusahaan (id, name, index)
3. **Load Company Info:** Memuat deskripsi lengkap perusahaan
4. **Select Company:** User memilih perusahaan dari dropdown
5. **Similarity Calculation:** Menghitung cosine similarity antara embeddings
6. **Display Results:** Menampilkan top-K perusahaan paling mirip dengan:
   - Nama perusahaan
   - Company ID
   - Deskripsi lengkap (about company)
   - Similarity score

### Mode 2: Input Deskripsi Baru
1. **Load Model:** Memuat LSTM Autoencoder dari file `.keras`
2. **Load Tokenizer:** Memuat tokenizer untuk preprocessing
3. **Input Text:** User memasukkan deskripsi perusahaan
4. **Text Processing:** 
   - Tokenization menggunakan tokenizer
   - Padding/truncating ke panjang sequence (default: 100)
5. **Encoding:** Model LSTM Autoencoder encode text menjadi embedding vector
6. **Similarity Search:** Hitung cosine similarity dengan semua embeddings
7. **Display Results:** Tampilkan top-K perusahaan paling mirip

### Teknologi yang Digunakan

- **LSTM Autoencoder:** Model neural network untuk encoding text menjadi embeddings
- **Cosine Similarity:** Metrik untuk mengukur kemiripan antar embeddings
- **Streamlit:** Framework untuk web app interaktif
- **TensorFlow/Keras:** Framework deep learning
- **Pandas:** Manipulasi data
- **NumPy:** Operasi array dan numerical computing

## 🛠️ Troubleshooting

### Error saat aktifkan venv
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Error loading model
- Model menggunakan format `.keras` (Keras 3), bukan `.h5`
- Pastikan file `company_encoder.keras` tersedia
- Jika masih error, model optional - similarity search tetap berfungsi dengan embeddings

### File company_info.csv tidak ada
Jalankan script untuk membuat dataset ringan:
```powershell
python prepare_lightweight_dataset.py
```

### "About Company" menampilkan "(Tidak ada deskripsi)"
- Pastikan `company_info.csv` sudah dibuat dengan script di atas
- File harus berisi kolom: `company_id`, `name`, `about`

### Aplikasi lambat saat input text baru
- Fitur ini memerlukan model untuk encoding
- Gunakan Tab 1 (Cari dari Perusahaan yang Ada) untuk pencarian lebih cepat
- Tab 1 menggunakan embeddings pre-computed, tidak perlu model

### Error loading files
Pastikan struktur direktori benar dan semua file ada:
```
TubesDeployStreamlit/
├── streamlit_app.py
├── company_encoder.keras
├── company_embeddings.npy
├── company_metadata.csv
├── company_info.csv
└── tokenizer.pkl
```

## 📦 Dependencies

- **streamlit** >= 1.31.0: Framework web app
- **tensorflow** >= 2.16.0: Load dan run model LSTM
- **numpy** >= 1.24.3: Operasi array dan embeddings
- **pandas** >= 2.1.4: Manipulasi data
- **scikit-learn** >= 1.3.2: Cosine similarity calculation
- **pickle**: Load tokenizer (built-in Python)

## 👨‍💻 Development

Untuk development lebih lanjut, edit file [streamlit_app.py](streamlit_app.py) sesuai kebutuhan.

## 📝 License

Project ini untuk keperluan akademik.
