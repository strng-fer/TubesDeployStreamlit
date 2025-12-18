"""
Script untuk membuat dataset ringan dari fix_dataset2.csv
Hanya mengambil kolom company_id, name, dan about
"""
import pandas as pd

print("🔄 Memproses fix_dataset2.csv...")
print("⏳ Mohon tunggu, ini mungkin memakan waktu beberapa menit...")

# Load hanya kolom yang diperlukan
df = pd.read_csv('fix_dataset2.csv', usecols=['company_id', 'name', 'about'])

print(f"✅ Data berhasil dimuat: {len(df)} baris")

# Bersihkan data
df['company_id'] = df['company_id'].astype(str).str.strip()
df['name'] = df['name'].fillna('Unknown')
df['about'] = df['about'].fillna('(Tidak ada deskripsi)')

# Hapus duplikat berdasarkan company_id
df_clean = df.drop_duplicates(subset=['company_id'], keep='first')
print(f"✅ Setelah hapus duplikat: {len(df_clean)} baris")

# Simpan ke file baru
df_clean.to_csv('company_info.csv', index=False)
print(f"✅ File ringan berhasil dibuat: company_info.csv")
print(f"📊 Ukuran: {len(df_clean)} perusahaan")
print(f"📋 Kolom: company_id, name, about")
