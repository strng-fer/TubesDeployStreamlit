import streamlit as st
import numpy as np
import pandas as pd
import pickle
from tensorflow import keras
from tensorflow.keras.preprocessing.sequence import pad_sequences
from sklearn.metrics.pairwise import cosine_similarity

# Set page config
st.set_page_config(
    page_title="Company Similarity Search",
    page_icon="🔍",
    layout="wide"
)

# Cache untuk loading model dan data
@st.cache_resource
def load_model():
    """Load LSTM Autoencoder model"""
    try:
        # Load model dari file .keras (format baru)
        model = keras.models.load_model('company_encoder.keras', compile=False)
        st.success("✅ Model berhasil dimuat!")
        return model
    except Exception as e:
        st.warning(f"⚠️ Model tidak dapat dimuat: {str(e)[:100]}...")
        st.info("💡 Model diperlukan untuk fitur 'Input Deskripsi Baru'. Fitur 'Cari dari Perusahaan yang Ada' tetap berfungsi.")
        return None

@st.cache_data
def load_embeddings():
    """Load company embeddings"""
    try:
        embeddings = np.load('company_embeddings.npy')
        st.success(f"✅ Embeddings berhasil dimuat! Shape: {embeddings.shape}")
        return embeddings
    except Exception as e:
        st.error(f"❌ Error loading embeddings: {e}")
        return None

@st.cache_data
def load_metadata():
    """Load company metadata"""
    try:
        metadata = pd.read_csv('company_metadata.csv')
        st.success(f"✅ Metadata berhasil dimuat! Total perusahaan: {len(metadata)}")
        return metadata
    except Exception as e:
        st.error(f"❌ Error loading metadata: {e}")
        return None

@st.cache_resource
def load_tokenizer():
    """Load tokenizer untuk preprocessing text"""
    try:
        with open('tokenizer.pkl', 'rb') as f:
            tokenizer = pickle.load(f)
        st.success("✅ Tokenizer berhasil dimuat!")
        return tokenizer
    except Exception as e:
        st.warning(f"⚠️ Tokenizer tidak dapat dimuat: {e}")
        return None
@st.cache_data
def load_full_dataset():
    """Load dataset lengkap dengan informasi about company"""
    try:
        # Load dataset ringan yang sudah diproses
        dataset = pd.read_csv('company_info.csv')
        st.success(f"✅ Dataset info berhasil dimuat! Total: {len(dataset)} perusahaan")
        return dataset
    except Exception as e:
        st.warning(f"⚠️ Dataset info tidak dapat dimuat: {e}")
        st.info("💡 Jalankan 'python prepare_lightweight_dataset.py' untuk membuat file company_info.csv")
        return None
def find_similar_companies(company_name, embeddings, metadata, top_k=5):
    """
    Mencari perusahaan yang paling mirip berdasarkan embeddings
    
    Parameters:
    - company_name: nama perusahaan yang dicari
    - embeddings: array embeddings dari semua perusahaan
    - metadata: dataframe metadata perusahaan
    - top_k: jumlah perusahaan mirip yang dikembalikan
    
    Returns:
    - DataFrame dengan perusahaan yang paling mirip beserta similarity score
    """
    # Cari index perusahaan yang dicari
    company_row = metadata[metadata['company_name'] == company_name]
    
    if company_row.empty:
        return None
    
    company_idx = company_row['embedding_index'].values[0]
    company_embedding = embeddings[company_idx].reshape(1, -1)
    
    # Hitung cosine similarity dengan semua perusahaan
    similarities = cosine_similarity(company_embedding, embeddings)[0]
    
    # Dapatkan top k indices (exclude perusahaan itu sendiri)
    similar_indices = np.argsort(similarities)[::-1][1:top_k+1]
    
    # Buat dataframe hasil
    results = []
    for idx in similar_indices:
        similar_company = metadata[metadata['embedding_index'] == idx].iloc[0]
        results.append({
            'Perusahaan': similar_company['company_name'],
            'Company ID': similar_company['company_id'],
            'Similarity Score': f"{similarities[idx]:.4f}"
        })
    
    return pd.DataFrame(results)

def add_about_info(results, full_dataset):
    """Menambahkan informasi about company ke hasil pencarian"""
    if full_dataset is None or results is None or results.empty:
        return results
    
    # Merge berdasarkan nama perusahaan (bukan company_id karena tidak match)
    full_dataset_copy = full_dataset.copy()
    results_copy = results.copy()
    
    # Clean nama untuk matching yang lebih baik
    full_dataset_copy['name'] = full_dataset_copy['name'].astype(str).str.strip()
    results_copy['Perusahaan'] = results_copy['Perusahaan'].astype(str).str.strip()
    
    # Merge menggunakan nama perusahaan
    results_with_about = results_copy.merge(
        full_dataset_copy[['name', 'about']], 
        left_on='Perusahaan',
        right_on='name',
        how='left'
    )
    
    # Hapus kolom name yang duplikat dari merge
    results_with_about.drop(columns=['name'], inplace=True, errors='ignore')
    
    # Rename kolom about untuk lebih jelas
    results_with_about.rename(columns={'about': 'About Company'}, inplace=True)
    
    # Fill NaN dengan string kosong dan truncate panjang about
    results_with_about['About Company'] = results_with_about['About Company'].fillna('(Tidak ada deskripsi)')
    
    # Truncate about yang terlalu panjang untuk tampilan yang lebih baik
    results_with_about['About Company'] = results_with_about['About Company'].apply(
        lambda x: x[:200] + '...' if isinstance(x, str) and len(x) > 200 else x
    )
    
    return results_with_about

def find_similar_companies_from_text(text, model, tokenizer, embeddings, metadata, top_k=5):
    """
    Mencari perusahaan yang paling mirip berdasarkan text input
    
    Parameters:
    - text: deskripsi perusahaan (about company)
    - model: LSTM autoencoder model untuk encoding
    - tokenizer: tokenizer untuk preprocessing
    - embeddings: array embeddings dari semua perusahaan
    - metadata: dataframe metadata perusahaan
    - top_k: jumlah perusahaan mirip yang dikembalikan
    
    Returns:
    - DataFrame dengan perusahaan yang paling mirip beserta similarity score
    """
    if model is None or tokenizer is None:
        return None, "Model atau tokenizer tidak tersedia"
    
    try:
        # Preprocessing text dengan max_length default 100
        sequences = tokenizer.texts_to_sequences([text])
        padded = pad_sequences(sequences, maxlen=200, padding='post', truncating='post')
        
        # Generate embedding dari text menggunakan encoder
        text_embedding = model.predict(padded, verbose=0)
        
        # Hitung cosine similarity dengan semua perusahaan
        similarities = cosine_similarity(text_embedding, embeddings)[0]
        
        # Dapatkan top k indices
        similar_indices = np.argsort(similarities)[::-1][:top_k]
        
        # Buat dataframe hasil
        results = []
        for idx in similar_indices:
            similar_company = metadata[metadata['embedding_index'] == idx].iloc[0]
            results.append({
                'Perusahaan': similar_company['company_name'],
                'Company ID': similar_company['company_id'],
                'Similarity Score': f"{similarities[idx]:.4f}"
            })
        
        return pd.DataFrame(results), None
    except Exception as e:
        return None, f"Error saat memproses text: {str(e)}"

# Main App
def main():
    st.title("🔍 Company Similarity Search")
    st.markdown("### Pencarian Perusahaan Serupa menggunakan LSTM Autoencoder")
    
    st.markdown("---")
    
    # Load resources
    with st.spinner("Memuat model dan data..."):
        model = load_model()
        tokenizer = load_tokenizer()
        embeddings = load_embeddings()
        metadata = load_metadata()
        full_dataset = load_full_dataset()
    
    # Only embeddings and metadata are required, model is optional
    if embeddings is None or metadata is None:
        st.error("⚠️ Gagal memuat embeddings atau metadata. Pastikan file tersedia.")
        st.stop()

    st.markdown("---")
    
    # Sidebar untuk informasi
    with st.sidebar:
        st.header("ℹ️ Informasi")
        st.markdown(f"""
        **Total Perusahaan:** {len(metadata)}
        
        **Embedding Dimension:** {embeddings.shape[1] if len(embeddings.shape) > 1 else 'N/A'}
        
        **Model:** LSTM Autoencoder
        
        **Metode Similarity:** Cosine Similarity
        """)
        
        st.markdown("---")
        
        st.header("📊 Statistik")
        if embeddings is not None:
            st.metric("Jumlah Embeddings", len(embeddings))
            st.metric("Dimensi Vector", embeddings.shape[1] if len(embeddings.shape) > 1 else 'N/A')
    
    # Tabs untuk berbagai mode pencarian
    tab1, tab2 = st.tabs(["🏢 Cari dari Perusahaan yang Ada", "✍️ Input Deskripsi Baru"])
    
    # Tab 1: Pencarian dari perusahaan yang ada
    with tab1:
        col1, col2 = st.columns([2, 1])
        
        with col1:
            st.subheader("Pilih Perusahaan")
            selected_company = st.selectbox(
                "Pilih perusahaan untuk mencari yang serupa:",
                options=sorted(metadata['company_name'].tolist()),
                index=0
            )
        
        with col2:
            st.subheader("Jumlah Hasil")
            top_k = st.slider(
                "Jumlah perusahaan serupa:",
                min_value=3,
                max_value=20,
                value=5,
                step=1,
                key="slider_tab1"
            )
    
        # Search button
        if st.button("🔍 Cari Perusahaan Serupa", type="primary", use_container_width=True, key="search_btn_tab1"):
            with st.spinner(f"Mencari perusahaan yang mirip dengan {selected_company}..."):
                results = find_similar_companies(selected_company, embeddings, metadata, top_k)
                
                if results is not None:
                    # Tambahkan informasi about company
                    results = add_about_info(results, full_dataset)
                    
                    st.success(f"✅ Ditemukan {len(results)} perusahaan serupa!")
                    
                    st.markdown("### 📊 Hasil Pencarian")
                    st.dataframe(
                        results,
                        use_container_width=True,
                        hide_index=True
                    )
                    
                    # Visualisasi similarity scores
                    st.markdown("### 📈 Visualisasi Similarity Score")
                    st.bar_chart(
                        data=results.set_index('Perusahaan')['Similarity Score'].astype(float),
                        use_container_width=True
                    )
                else:
                    st.error(f"❌ Perusahaan '{selected_company}' tidak ditemukan.")
    
    # Tab 2: Input deskripsi baru
    with tab2:
        st.subheader("Input Deskripsi Perusahaan")
        
        if model is None or tokenizer is None:
            st.error("⚠️ Fitur ini memerlukan model dan tokenizer. Pastikan file company_encoder.keras dan tokenizer.pkl tersedia dan dapat dimuat.")
        else:
            st.info("💡 Masukkan deskripsi perusahaan (about company) untuk mencari perusahaan serupa.")
            
            # Text area untuk input
            company_text = st.text_area(
                "Deskripsi Perusahaan:",
                placeholder="Contoh: We are a technology company focused on artificial intelligence and machine learning solutions...",
                height=150,
                help="Masukkan deskripsi lengkap tentang perusahaan"
            )
            
            top_k_text = st.slider(
                "Jumlah perusahaan serupa:",
                min_value=3,
                max_value=20,
                value=5,
                step=1,
                key="slider_tab2"
            )
            
            # Search button
            if st.button("🔍 Cari Perusahaan Serupa", type="primary", use_container_width=True, key="search_btn_tab2"):
                if not company_text.strip():
                    st.warning("⚠️ Mohon masukkan deskripsi perusahaan terlebih dahulu.")
                else:
                    with st.spinner("Memproses text dan mencari perusahaan serupa..."):
                        results, error = find_similar_companies_from_text(
                            company_text, model, tokenizer, embeddings, metadata, top_k_text
                        )
                        
                        if error:
                            st.error(f"❌ {error}")
                        elif results is not None:
                            # Tambahkan informasi about company
                            results = add_about_info(results, full_dataset)
                            
                            st.success(f"✅ Ditemukan {len(results)} perusahaan serupa!")
                            
                            # Tampilkan text input
                            with st.expander("📝 Text yang Dianalisis", expanded=False):
                                st.write(company_text)
                            
                            st.markdown("### 📊 Hasil Pencarian")
                            st.dataframe(
                                results,
                                use_container_width=True,
                                hide_index=True
                            )
                            
                            # Visualisasi similarity scores
                            st.markdown("### 📈 Visualisasi Similarity Score")
                            st.bar_chart(
                                data=results.set_index('Perusahaan')['Similarity Score'].astype(float),
                                use_container_width=True
                            )
                        else:
                            st.error("❌ Terjadi kesalahan saat memproses text.")
    
    # Footer
    st.markdown("---")
    st.markdown("""
    <div style='text-align: center'>
        <p style='color: gray;'>
            Dibuat dengan ❤️ menggunakan Streamlit | 
            Model: LSTM Autoencoder | 
            Similarity: Cosine Similarity
        </p>
    </div>
    """, unsafe_allow_html=True)

if __name__ == "__main__":
    main()
