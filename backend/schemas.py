from typing import List, Optional
from pydantic import BaseModel, Field

class CompanyItem(BaseModel):
    name: str
    company_id: Optional[str] = None
    embedding_index: Optional[int] = None
    about: Optional[str] = None

class SimilarityByCompanyRequest(BaseModel):
    company_name: str = Field(..., description="Nama perusahaan yang ingin dicari kemiripannya")
    top_k: int = Field(5, ge=1, le=50, description="Jumlah hasil perusahaan serupa (1-50)")

class SimilarityByTextRequest(BaseModel):
    text: str = Field(..., min_length=3, description="Deskripsi perusahaan baru untuk dianalisis oleh LSTM Autoencoder")
    top_k: int = Field(5, ge=1, le=50, description="Jumlah hasil perusahaan serupa (1-50)")

class SimilarCompanyResult(BaseModel):
    rank: int
    company_name: str
    company_id: Optional[str] = None
    similarity_score: float
    about: Optional[str] = None
    tags: Optional[List[str]] = None

class SimilarityResponse(BaseModel):
    query: str
    mode: str
    count: int
    source_company: Optional[CompanyItem] = None
    results: List[SimilarCompanyResult]

class StatsResponse(BaseModel):
    status: str
    total_companies: int
    embedding_dim: int
    model_loaded: bool
    model_name: str
    tokenizer_loaded: bool
    vocab_size: int
    sample_companies: List[str]
