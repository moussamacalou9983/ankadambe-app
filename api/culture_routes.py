from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_session
from models.domain import CulturalContent
from schemas.api_schemas import CulturalContentResponse

router = APIRouter(prefix="/culture", tags=["Culture"])


@router.get("/", response_model=list[CulturalContentResponse], status_code=status.HTTP_200_OK)
async def lister_contenus_culturels(
    session: AsyncSession = Depends(get_session),
) -> list[CulturalContentResponse]:
    """Retourne les contenus culturels disponibles."""
    result = await session.execute(
        select(CulturalContent).order_by(CulturalContent.id.asc())
    )
    return list(result.scalars().all())


@router.get(
    "/{content_id}",
    response_model=CulturalContentResponse,
    status_code=status.HTTP_200_OK,
)
async def recuperer_contenu_culturel(
    content_id: int,
    session: AsyncSession = Depends(get_session),
) -> CulturalContentResponse:
    """Retourne un contenu culturel par son identifiant."""
    content = await session.get(CulturalContent, content_id)

    if content is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contenu culturel introuvable",
        )

    return content
