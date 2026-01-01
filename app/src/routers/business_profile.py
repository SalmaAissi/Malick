from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime
import uuid
from models.business_profile import BusinessProfileCreate, BusinessProfileRead
router = APIRouter(
    prefix="/api/business-profile",
    tags=["Business Profile"],
    responses={404: {"description": "Non trouvé"}}
)

# Base de données temporaire en mémoire
business_profiles_db = {}

@router.post("/", response_model=BusinessProfileRead, status_code=201)
async def create_business_profile(profile: BusinessProfileCreate):
    """Crée un nouveau Business Profile"""
    profile_id = str(uuid.uuid4())
    now_iso = datetime.utcnow().isoformat() + "Z"
    
    profile_data = profile.dict()
    profile_data["id"] = profile_id
    profile_data["created_at"] = now_iso
    profile_data["responsible_name"] = None
    
    business_profiles_db[profile_id] = profile_data
    return profile_data

@router.get("/", response_model=List[BusinessProfileRead])
async def get_all_business_profiles():
    """Récupère tous les Business Profiles"""
    return list(business_profiles_db.values())

@router.get("/{profile_id}", response_model=BusinessProfileRead)
async def get_business_profile(profile_id: str):
    """Récupère un Business Profile par son ID"""
    if profile_id not in business_profiles_db:
        raise HTTPException(status_code=404, detail="Business Profile non trouvé")
    return business_profiles_db[profile_id]

@router.delete("/{profile_id}")
async def delete_business_profile(profile_id: str):
    """Supprime un Business Profile"""
    if profile_id not in business_profiles_db:
        raise HTTPException(status_code=404, detail="Business Profile non trouvé")
    del business_profiles_db[profile_id]
    return {"message": "Business Profile supprimé avec succès"}
