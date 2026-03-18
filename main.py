from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.culture_routes import router as culture_router
from api.language_routes import router as language_router
from api.routes import router as products_router

app = FastAPI(title="An ka dambé API", version="0.1.0")

# Configuration CORS minimale pour le MVP ; à restreindre avec les domaines du front.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products_router)
app.include_router(culture_router)
app.include_router(language_router)


@app.get("/", tags=["santé"])
async def healthcheck() -> dict[str, str]:
    """Route de santé simple."""
    return {"status": "API An ka dambé opérationnelle"}
