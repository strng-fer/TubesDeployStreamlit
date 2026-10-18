import os
import sys

# Ensure project root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from backend.main import app

def test_endpoints():
    print("Testing FastAPI endpoints with TestClient...")
    with TestClient(app) as client:
        # 1. Root
        r = client.get("/")
        print("Root response:", r.status_code, r.json())
        assert r.status_code == 200

        # 2. Health
        r = client.get("/api/health")
        print("Health response:", r.status_code, r.json())
        assert r.status_code == 200

        # 3. Stats
        r = client.get("/api/stats")
        print("Stats response:", r.status_code, r.json()["total_companies"])
        assert r.status_code == 200
        assert r.json()["total_companies"] > 0

        # 4. Search companies
        r = client.get("/api/companies?q=Colgate&limit=5")
        print("Search Colgate response:", r.status_code, len(r.json()))
        assert r.status_code == 200
        assert len(r.json()) > 0

        # 5. Similar by company
        r = client.post("/api/similarity/by-company", json={"company_name": "Colgate-Palmolive", "top_k": 3})
        print("Similar by company status:", r.status_code)
        assert r.status_code == 200
        data = r.json()
        print("Found similar companies count:", len(data["results"]))
        for comp in data["results"]:
            print(f"  - {comp['company_name']}: {comp['similarity_score']}")

        # 6. Similar by text
        r = client.post("/api/similarity/by-text", json={"text": "Global energy and oil exploration company", "top_k": 3})
        print("Similar by text status:", r.status_code)
        assert r.status_code == 200
        data = r.json()
        print("Found similar companies for text query count:", len(data["results"]))
        for comp in data["results"]:
            print(f"  - {comp['company_name']}: {comp['similarity_score']}")

    print("\n[SUCCESS] ALL FASTAPI SMOKE TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_endpoints()
