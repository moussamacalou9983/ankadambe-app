from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_session
from models.domain import ArtisanProfile, Product
from schemas.api_schemas import ProductResponse

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("/", response_model=list[ProductResponse], status_code=status.HTTP_200_OK)
async def lister_produits(
    session: AsyncSession = Depends(get_session),
) -> list[ProductResponse]:
    """Retourne la liste de tous les produits disponibles dans le catalogue."""
    stmt = (
        select(Product, ArtisanProfile.telephone_whatsapp)
        .join(ArtisanProfile, Product.artisan_id == ArtisanProfile.id)
        .order_by(Product.id.asc())
    )
    result = await session.execute(stmt)

    responses: list[ProductResponse] = []
    for product, telephone_whatsapp in result.all():
        responses.append(
            ProductResponse(
                id=product.id,
                artisan_id=product.artisan_id,
                telephone_whatsapp=telephone_whatsapp,
                nom=product.nom,
                description=product.description,
                prix_fcfa=product.prix_fcfa,
                image_url=product.image_url,
                is_available=product.is_available,
            )
        )

    return responses


@router.get(
    "/{product_id}",
    response_model=ProductResponse,
    status_code=status.HTTP_200_OK,
)
async def recuperer_produit(
    product_id: int,
    session: AsyncSession = Depends(get_session),
) -> ProductResponse:
    """Retourne un produit par son identifiant."""
    stmt = (
        select(Product, ArtisanProfile.telephone_whatsapp)
        .join(ArtisanProfile, Product.artisan_id == ArtisanProfile.id)
        .where(Product.id == product_id)
    )
    result = await session.execute(stmt)
    row = result.first()

    if row is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produit introuvable",
        )

    product, telephone_whatsapp = row
    return ProductResponse(
        id=product.id,
        artisan_id=product.artisan_id,
        telephone_whatsapp=telephone_whatsapp,
        nom=product.nom,
        description=product.description,
        prix_fcfa=product.prix_fcfa,
        image_url=product.image_url,
        is_available=product.is_available,
    )
