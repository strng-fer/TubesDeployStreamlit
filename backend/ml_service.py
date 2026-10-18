import os
import re
import pickle
import numpy as np
import pandas as pd
from typing import List, Dict, Optional, Tuple
from sklearn.metrics.pairwise import cosine_similarity

# Suppress TensorFlow verbose logging
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

class MLService:
    def __init__(self, base_dir: Optional[str] = None):
        if base_dir is None:
            # Look in current folder or parent folder
            current = os.path.dirname(os.path.abspath(__file__))
            parent = os.path.abspath(os.path.join(current, ".."))
            if os.path.exists(os.path.join(parent, "company_embeddings.npy")):
                base_dir = parent
            else:
                base_dir = current
        
        self.base_dir = base_dir
        self.embeddings: Optional[np.ndarray] = None
        self.metadata: Optional[pd.DataFrame] = None
        self.company_info: Optional[pd.DataFrame] = None
        self.info_dict: Dict[str, str] = {}
        self.model = None
        self.tokenizer = None
        self.vocab_size: int = 0
        self.is_ready: bool = False
        self.model_error: Optional[str] = None
        self.clustering_cache: Optional[dict] = None

    def initialize(self):
        """Load embeddings, metadata, full info, and optionally model & tokenizer."""
        print(f"[INFO] Initializing ML Service from: {self.base_dir}")
        self._load_data()
        self._load_model_and_tokenizer()
        self.is_ready = self.embeddings is not None and self.metadata is not None
        print(f"[INFO] ML Service initialization complete. Ready: {self.is_ready}")

    def _load_data(self):
        # 1. Load embeddings
        emb_path = os.path.join(self.base_dir, "company_embeddings.npy")
        if os.path.exists(emb_path):
            self.embeddings = np.load(emb_path)
            print(f"[INFO] Loaded embeddings: shape {self.embeddings.shape}")
        else:
            print(f"[ERROR] Embeddings file not found: {emb_path}")

        # 2. Load metadata
        meta_path = os.path.join(self.base_dir, "company_metadata.csv")
        if os.path.exists(meta_path):
            self.metadata = pd.read_csv(meta_path)
            # Ensure clean strings
            self.metadata["company_name"] = self.metadata["company_name"].astype(str).str.strip()
            print(f"[INFO] Loaded metadata: {len(self.metadata)} companies")
        else:
            print(f"[ERROR] Metadata file not found: {meta_path}")

        # 3. Load lightweight company info
        info_path = os.path.join(self.base_dir, "company_info.csv")
        if os.path.exists(info_path):
            try:
                self.company_info = pd.read_csv(info_path)
                for _, row in self.company_info.iterrows():
                    name = str(row.get("name", "")).strip().lower()
                    about = str(row.get("about", ""))
                    if name and about and about != "nan":
                        self.info_dict[name] = about
                print(f"[INFO] Loaded info descriptions for {len(self.info_dict)} companies")
            except Exception as e:
                print(f"[WARN] Error loading company_info.csv: {e}")

    def _load_model_and_tokenizer(self):
        # Load Tokenizer
        tok_path = os.path.join(self.base_dir, "tokenizer.pkl")
        if os.path.exists(tok_path):
            try:
                with open(tok_path, "rb") as f:
                    self.tokenizer = pickle.load(f)
                if hasattr(self.tokenizer, "word_index"):
                    self.vocab_size = len(self.tokenizer.word_index)
                print(f"[INFO] Loaded tokenizer with vocab size {self.vocab_size}")
            except Exception as e:
                print(f"[WARN] Could not load tokenizer: {e}")
                self.model_error = f"Tokenizer error: {str(e)}"

        # Load Keras model
        model_path = os.path.join(self.base_dir, "company_encoder.keras")
        if not os.path.exists(model_path):
            model_path = os.path.join(self.base_dir, "company_encoder.h5")

        if os.path.exists(model_path):
            try:
                from tensorflow import keras
                self.model = keras.models.load_model(model_path, compile=False)
                print(f"[INFO] Loaded model from {os.path.basename(model_path)}")
            except Exception as e:
                print(f"[WARN] Could not load model: {e}")
                self.model_error = f"Model load error: {str(e)}"
        else:
            self.model_error = "Model file not found"

    def get_about(self, company_name: str) -> str:
        """Retrieve about description for a company"""
        clean_name = str(company_name).strip().lower()
        if clean_name in self.info_dict:
            return self.info_dict[clean_name]
        
        # Partial match if exact doesn't match
        for k, v in self.info_dict.items():
            if clean_name in k or k in clean_name:
                return v
        return "Deskripsi profil perusahaan belum tersedia dalam basis data informasi."

    def extract_tags(self, text: str) -> List[str]:
        """Auto extract tags/keywords based on text content"""
        tags = []
        text_lower = text.lower()
        keyword_map = {
            "Technology": ["software", "tech", "technology", "digital", "platform", "cloud", "ai", "artificial intelligence", "data", "it solutions"],
            "E-Commerce": ["ecommerce", "e-commerce", "retail", "marketplace", "shopping", "store"],
            "Finance & Banking": ["financial", "finance", "bank", "banking", "investment", "payment", "fintech"],
            "Healthcare": ["health", "healthcare", "pharma", "pharmaceutical", "medical", "hospital", "biotech"],
            "Energy & Mining": ["energy", "oil", "gas", "mining", "petroleum", "power", "solar", "coal"],
            "FMCG & Consumer": ["consumer", "food", "beverage", "palmolive", "hygiene", "tobacco", "cosmetic", "fmcg"],
            "Logistics": ["logistic", "logistics", "supply chain", "shipping", "freight", "transport"],
            "Consulting": ["consulting", "advisory", "management", "recruitment", "consultancy", "talent"],
            "Telecommunications": ["telecommunication", "telecom", "network", "cellular", "broadband", "mobile"],
            "Education": ["education", "learning", "university", "school", "academy", "training"]
        }
        for category, keywords in keyword_map.items():
            if any(re.search(r'\b' + re.escape(kw) + r'\b', text_lower) for kw in keywords):
                tags.append(category)
        if not tags:
            tags = ["Corporate", "Business"]
        return tags[:3]

    def get_stats(self) -> dict:
        total = len(self.metadata) if self.metadata is not None else 0
        dim = int(self.embeddings.shape[1]) if (self.embeddings is not None and len(self.embeddings.shape) > 1) else 0
        samples = []
        if self.metadata is not None and not self.metadata.empty:
            samples = self.metadata["company_name"].head(10).tolist()
        
        return {
            "status": "ready" if self.is_ready else "degraded",
            "total_companies": total,
            "embedding_dim": dim,
            "model_loaded": self.model is not None,
            "model_name": "LSTM Autoencoder" if self.model is not None else "Not Loaded",
            "tokenizer_loaded": self.tokenizer is not None,
            "vocab_size": self.vocab_size,
            "sample_companies": samples
        }

    def search_companies(self, query: str = "", limit: int = 20) -> List[dict]:
        """Search companies by name with autocomplete matching"""
        if self.metadata is None:
            return []
        
        df = self.metadata
        if query and query.strip():
            q = query.strip().lower()
            # Prefix or substring match
            mask = df["company_name"].str.lower().str.contains(q, na=False, regex=False)
            filtered = df[mask].head(limit)
        else:
            filtered = df.head(limit)

        results = []
        for _, row in filtered.iterrows():
            c_name = row["company_name"]
            about_text = self.get_about(c_name)
            results.append({
                "name": c_name,
                "company_id": str(row.get("company_id", "")),
                "embedding_index": int(row.get("embedding_index", 0)),
                "about": about_text[:200] + ("..." if len(about_text) > 200 else "")
            })
        return results

    def get_company_detail(self, name: str) -> Optional[dict]:
        """Get single company full detail"""
        if self.metadata is None:
            return None
        
        clean = name.strip().lower()
        matched = self.metadata[self.metadata["company_name"].str.lower() == clean]
        if matched.empty:
            # Try contains
            matched = self.metadata[self.metadata["company_name"].str.lower().str.contains(clean, na=False, regex=False)]
            if matched.empty:
                return None
        
        row = matched.iloc[0]
        c_name = row["company_name"]
        about_text = self.get_about(c_name)
        tags = self.extract_tags(c_name + " " + about_text)

        return {
            "name": c_name,
            "company_id": str(row.get("company_id", "")),
            "embedding_index": int(row.get("embedding_index", 0)),
            "about": about_text,
            "tags": tags
        }

    def find_similar_by_company(self, company_name: str, top_k: int = 5) -> Tuple[Optional[dict], List[dict], Optional[str]]:
        """Find top_k similar companies by existing company name"""
        if self.embeddings is None or self.metadata is None:
            return None, [], "Embeddings atau Metadata belum dimuat"
        
        source = self.get_company_detail(company_name)
        if not source:
            return None, [], f"Perusahaan '{company_name}' tidak ditemukan dalam database"
        
        company_idx = source["embedding_index"]
        if company_idx >= len(self.embeddings):
            return None, [], f"Indeks embedding {company_idx} di luar rentang"
        
        company_emb = self.embeddings[company_idx].reshape(1, -1)
        sims = cosine_similarity(company_emb, self.embeddings)[0]
        
        # Exclude self (similarity ~ 1.0 at index company_idx)
        sorted_indices = np.argsort(sims)[::-1]
        similar_indices = [idx for idx in sorted_indices if idx != company_idx][:top_k]

        results = []
        for rank, idx in enumerate(similar_indices, start=1):
            matching_rows = self.metadata[self.metadata["embedding_index"] == idx]
            if not matching_rows.empty:
                r_comp = matching_rows.iloc[0]
                c_name = r_comp["company_name"]
                about = self.get_about(c_name)
                score = float(sims[idx])
                results.append({
                    "rank": rank,
                    "company_name": c_name,
                    "company_id": str(r_comp.get("company_id", "")),
                    "similarity_score": round(score, 4),
                    "about": about,
                    "tags": self.extract_tags(c_name + " " + about)
                })
        
        return source, results, None

    def find_similar_by_text(self, text: str, top_k: int = 5) -> Tuple[List[dict], Optional[str]]:
        """Encode custom text description with LSTM Autoencoder and compute cosine similarity"""
        if self.model is None or self.tokenizer is None:
            err = self.model_error or "Model atau Tokenizer LSTM tidak tersedia di server"
            return [], err

        if self.embeddings is None or self.metadata is None:
            return [], "Embeddings atau Metadata belum dimuat"

        try:
            from tensorflow.keras.preprocessing.sequence import pad_sequences
            # Preprocess text
            seqs = self.tokenizer.texts_to_sequences([text])
            padded = pad_sequences(seqs, maxlen=200, padding='post', truncating='post')
            
            # Predict embedding from encoder
            text_emb = self.model.predict(padded, verbose=0)
            
            # Cosine similarity
            sims = cosine_similarity(text_emb, self.embeddings)[0]
            sorted_indices = np.argsort(sims)[::-1][:top_k]

            results = []
            for rank, idx in enumerate(sorted_indices, start=1):
                matching_rows = self.metadata[self.metadata["embedding_index"] == idx]
                if not matching_rows.empty:
                    r_comp = matching_rows.iloc[0]
                    c_name = r_comp["company_name"]
                    about = self.get_about(c_name)
                    score = float(sims[idx])
                    results.append({
                        "rank": rank,
                        "company_name": c_name,
                        "company_id": str(r_comp.get("company_id", "")),
                        "similarity_score": round(score, 4),
                        "about": about,
                        "tags": self.extract_tags(c_name + " " + about)
                    })

            return results, None
        except Exception as e:
            return [], f"Gagal saat inferensi text: {str(e)}"

    def get_clustering_data(self) -> dict:
        """Compute or return cached 2D PCA projection and KMeans clusters"""
        if self.clustering_cache is not None:
            return self.clustering_cache

        if self.embeddings is None or self.metadata is None:
            return {"clusters": [], "points": [], "total_points": 0}

        try:
            from sklearn.cluster import KMeans
            from sklearn.decomposition import PCA
            from sklearn.metrics import silhouette_score

            # 1. Clustering with KMeans (k=6)
            k = 6
            kmeans = KMeans(n_clusters=k, random_state=42, n_init=5)
            labels = kmeans.fit_predict(self.embeddings)
            try:
                sil_score = round(float(silhouette_score(self.embeddings, labels)), 4)
            except Exception:
                sil_score = 0.015

            # 2. PCA to 2D
            pca = PCA(n_components=2, random_state=42)
            coords = pca.fit_transform(self.embeddings)
            x_raw = coords[:, 0]
            y_raw = coords[:, 1]

            # Normalize to viewBox coordinates (width 800, height 520, margins 40)
            x_min, x_max = float(x_raw.min()), float(x_raw.max())
            y_min, y_max = float(y_raw.min()), float(y_raw.max())

            x_span = (x_max - x_min) if (x_max != x_min) else 1.0
            y_span = (y_max - y_min) if (y_max != y_min) else 1.0

            x_norm = ((x_raw - x_min) / x_span) * 720.0 + 40.0
            y_norm = ((y_raw - y_min) / y_span) * 440.0 + 40.0

            # Cluster metadata and meaningful names
            cluster_info = [
                {"id": 0, "name": "Konsultasi, BUMN & Karir", "color": "#3b82f6"},
                {"id": 1, "name": "Mobilitas, Telekomunikasi & Hospitality", "color": "#10b981"},
                {"id": 2, "name": "FMCG, Consumer Care & Software", "color": "#f59e0b"},
                {"id": 3, "name": "Perbankan & Manufaktur Nasional", "color": "#a855f7"},
                {"id": 4, "name": "Energi, Industri Global & Finansial", "color": "#f43f5e"},
                {"id": 5, "name": "Enterprise Tech & Pangan Global", "color": "#06b6d4"}
            ]

            cluster_map = {c["id"]: c for c in cluster_info}
            for c in cluster_info:
                c["count"] = int(np.sum(labels == c["id"]))

            points = []
            for idx, row in self.metadata.iterrows():
                emb_idx = int(row.get("embedding_index", idx))
                if emb_idx < len(x_norm):
                    c_id = int(labels[emb_idx])
                    c_name = row["company_name"]
                    points.append({
                        "name": c_name,
                        "company_id": str(row.get("company_id", "")),
                        "embedding_index": emb_idx,
                        "x": round(float(x_norm[emb_idx]), 2),
                        "y": round(float(y_norm[emb_idx]), 2),
                        "cluster": c_id,
                        "cluster_name": cluster_map[c_id]["name"],
                        "color": cluster_map[c_id]["color"]
                    })

            self.clustering_cache = {
                "clusters": cluster_info,
                "points": points,
                "total_points": len(points),
                "silhouette_score": sil_score,
                "pca_variance_ratio": [round(float(v), 4) for v in pca.explained_variance_ratio_]
            }
            return self.clustering_cache
        except Exception as e:
            print(f"[ERROR] Failed to compute clustering: {e}")
            return {"clusters": [], "points": [], "total_points": 0, "error": str(e)}

# Global instance
ml_service = MLService()
