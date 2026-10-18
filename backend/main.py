import os
from contextlib import asynccontextmanager
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .schemas import (
    CompanyItem,
    SimilarityByCompanyRequest,
    SimilarityByTextRequest,
    SimilarityResponse,
    StatsResponse
)
from .ml_service import ml_service

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Load ML assets & data
    print("[INFO] Starting Company Similarity Search API...")
    ml_service.initialize()
    yield
    print("[INFO] Shutting down API...")

app = FastAPI(
    title="Company Similarity Search API",
    description="REST API untuk pencarian perusahaan serupa menggunakan LSTM Autoencoder dan Cosine Similarity",
    version="2.0.0",
    lifespan=lifespan
)

# Enable CORS for Vercel, localhost, and all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["General"])
def root():
    return {
        "name": "Company Similarity Search API",
        "version": "2.0.0",
        "status": "online",
        "docs_url": "/docs",
        "endpoints": [
            "/api/health",
            "/api/stats",
            "/api/companies",
            "/api/similarity/by-company",
            "/api/similarity/by-text"
        ]
    }

@app.get("/api/health", tags=["Health"])
def health_check():
    stats = ml_service.get_stats()
    return {
        "status": "healthy" if ml_service.is_ready else "degraded",
        "ready": ml_service.is_ready,
        "model_loaded": stats["model_loaded"],
        "companies_loaded": stats["total_companies"] > 0
    }

@app.get("/api/stats", response_model=StatsResponse, tags=["Analytics"])
def get_stats():
    return ml_service.get_stats()

@app.get("/api/companies", response_model=List[CompanyItem], tags=["Companies"])
def search_companies(
    q: Optional[str] = Query(default="", description="Pencarian nama perusahaan (autocomplete)"),
    limit: int = Query(default=20, ge=1, le=100, description="Batas hasil pencarian")
):
    """Mendapatkan daftar perusahaan atau mencari dengan autocomplete"""
    results = ml_service.search_companies(query=q, limit=limit)
    return results

@app.get("/api/companies/{company_name}", response_model=CompanyItem, tags=["Companies"])
def get_company_detail(company_name: str):
    """Mendapatkan detail profil dan deskripsi perusahaan"""
    detail = ml_service.get_company_detail(company_name)
    if not detail:
        raise HTTPException(status_code=404, detail=f"Perusahaan '{company_name}' tidak ditemukan")
    return detail

@app.post("/api/similarity/by-company", response_model=SimilarityResponse, tags=["Similarity"])
def find_similar_by_company(payload: SimilarityByCompanyRequest):
    """Mencari perusahaan yang paling mirip berdasarkan perusahaan yang sudah ada di database"""
    source, results, error = ml_service.find_similar_by_company(
        company_name=payload.company_name,
        top_k=payload.top_k
    )
    if error:
        raise HTTPException(status_code=400, detail=error)
    
    return {
        "query": payload.company_name,
        "mode": "company",
        "count": len(results),
        "source_company": source,
        "results": results
    }

@app.post("/api/similarity/by-text", response_model=SimilarityResponse, tags=["Similarity"])
def find_similar_by_text(payload: SimilarityByTextRequest):
    """Mencari perusahaan serupa berdasarkan deskripsi teks baru yang dianalisis menggunakan LSTM Autoencoder"""
    results, error = ml_service.find_similar_by_text(
        text=payload.text,
        top_k=payload.top_k
    )
    if error:
        raise HTTPException(status_code=400, detail=error)
    
    return {
        "query": payload.text[:120] + ("..." if len(payload.text) > 120 else ""),
        "mode": "text",
        "count": len(results),
        "source_company": None,
        "results": results
    }

@app.get("/api/clustering", tags=["Clustering"])
def get_clustering():
    """Mendapatkan data proyeksi 2D PCA dan penugasan klaster KMeans untuk visualisasi scatter map"""
    data = ml_service.get_clustering_data()
    return data

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
