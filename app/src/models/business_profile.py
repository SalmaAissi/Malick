from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

class SectorEnum(str, Enum):
    """Liste des secteurs d'activité disponibles"""
    FINANCE = "Finance"
    HEALTHCARE = "Santé"
    TECHNOLOGY = "Technologie"
    INDUSTRY = "Industrie"
    ENERGY = "Énergie"
    COMMERCE = "Commerce"
    TELECOM = "Télécommunications"

class BusinessProfileCreate(BaseModel):
    """Modèle pour la création d'un Business Profile (données d'entrée)"""
    company_name: str = Field(..., min_length=1, max_length=200)
    sector: SectorEnum
    description: Optional[str] = Field(None, max_length=1000)
    reference_currency: str = Field(default="EUR", pattern="^[A-Z]{3}$")
    fiscal_year: int = Field(..., ge=2000, le=2100)
    annual_revenue: Optional[float] = Field(None, ge=0)
    headquarter_country: str = Field(..., min_length=2, max_length=100)
    operating_countries: List[str] = Field(..., min_items=1)

    class Config:
        schema_extra = {
            "example": {
                "company_name": "TechCorp SAS",
                "sector": "Technology",
                "description": "Éditeur de solutions SaaS sécurité",
                "reference_currency": "EUR",
                "fiscal_year": 2025,
                "annual_revenue": 5000000.0,
                "headquarter_country": "France",
                "operating_countries": ["France", "Belgique", "Suisse"]
            }
        }

class BusinessProfileRead(BusinessProfileCreate):
    """Modèle pour la lecture (inclut les champs systèmes générés)"""
    id: str  # UUID généré
    created_at: str  # Timestamp ISO
    responsible_name: Optional[str] = None
    
    class Config:
        orm_mode = True
