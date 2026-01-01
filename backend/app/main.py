from fastapi import FastAPI
from app.core import financial_formulas
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="SALMA Platform API", version="0.1.0")

# Configuration CORS pour permettre au frontend de communiquer avec l'API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # URL de votre frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Modèle pour le formulaire de contact
class ContactForm(BaseModel):
    name: str
    email: str
    message: str


# Modèle pour le profil d'entreprise
class BusinessProfile(BaseModel):
    company_name: str
    sector: str = "Technologie"
    description: str = None
    reference_currency: str = "EUR"
    fiscal_year: int
    annual_revenue: float = 0
    headquarter_country: str
    operating_countries: list
    responsible_name: str = None


@app.get("/")
def read_root():
    return {"message": "API SALMA opérationnelle", "status": "ok"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.post("/api/kpi/calculate")
def calculate_kpi(kpi_type: str, inputs: dict):
    """
    Endpoint pour calculer un KPI.
    Exemple d'utilisation:
    POST /api/kpi/calculate?kpi_type=roi
    Body JSON: {"net_profit": 50000, "investment_cost": 200000}
    """
    try:
        if kpi_type.lower() == "roi":
            result = financial_formulas.calculate_roi(
                inputs.get("net_profit"), inputs.get("investment_cost")
            )
        elif kpi_type.lower() == "profit_margin":
            result = financial_formulas.calculate_profit_margin(
                inputs.get("revenue"), inputs.get("cost_of_goods_sold")
            )
        else:
            return {"error": f"Type de KPI non supporté: {kpi_type}"}

        return {"success": True, "data": result}

    except ValueError as e:
        return {"success": False, "error": str(e)}
    except Exception as e:
        return {"success": False, "error": f"Erreur de calcul: {str(e)}"}


# Route pour le formulaire de contact
@app.post("/api/contact")
async def submit_contact(form: ContactForm):
    """
    Endpoint pour recevoir les données du formulaire de contact.
    """
    print(f"📧 Nouveau message de contact reçu:")
    print(f"   Nom: {form.name}")
    print(f"   Email: {form.email}")
    print(f"   Message: {form.message}")

    return {
        "success": True,
        "message": "Votre message a été envoyé avec succès. Nous vous répondrons rapidement !",
        "data": {"name": form.name, "email": form.email, "message": form.message},
    }


# Route pour récupérer la liste des profils (GET)
@app.get("/api/business-profile/")
async def get_business_profiles():
    """
    Retourne la liste de tous les profils d'entreprise.
    Pour l'instant, on retourne une liste vide.
    Plus tard, vous irez chercher les données en base de données ici.
    """
    return []


# Route pour créer un profil d'entreprise (POST)
@app.post("/api/business-profile/")
async def create_business_profile(profile: BusinessProfile):
    """
    Reçoit et traite les données d'un nouveau profil d'entreprise.
    """
    # 1. Affiche les données reçues dans le terminal
    print(f"🏢 NOUVEAU PROFIL D'ENTREPRISE REÇU:")
    print(f"   Société: {profile.company_name}")
    print(f"   Secteur: {profile.sector}")
    print(f"   Devise: {profile.reference_currency}")
    print(f"   Année fiscale: {profile.fiscal_year}")
    print(f"   Revenu annuel: {profile.annual_revenue}")
    print(f"   Pays siège: {profile.headquarter_country}")
    print(f"   Pays d'opération: {profile.operating_countries}")
    print(f"   Responsable: {profile.responsible_name}")

    # 2. IMPORTANT : Retourne une réponse JSON au frontend
    return {
        "success": True,
        "message": f"Profil '{profile.company_name}' créé avec succès !",
        "data": profile.dict(),
    }
