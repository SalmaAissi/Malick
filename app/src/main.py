from fastapi import FastAPI
from routers import business_profile

app = FastAPI(
    title="SALMA Backend API",
    description="API pour la plateforme de gestion des risques et analyse financière SALMA",
    version="1.0.0"
)

app.include_router(business_profile.router)

@app.get("/")
def read_root():
    return {"message": "API SALMA opérationnelle", "status": "online"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "salma-backend"}
