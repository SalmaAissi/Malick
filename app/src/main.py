from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import business_profile

app = FastAPI(
    title="SALMA Backend API",
    description="API pour la plateforme de gestion des risques et analyse financière SALMA",
    version="1.0.0"
)

# ========== MIDDLEWARE CORS ==========
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# =====================================

app.include_router(business_profile.router)

@app.get("/")
def read_root():
    return {"message": "API SALMA opérationnelle", "status": "online"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "salma-backend"}
