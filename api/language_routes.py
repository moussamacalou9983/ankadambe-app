from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_session
from models.domain import LanguageLesson
from schemas.api_schemas import LanguageLessonResponse

router = APIRouter(prefix="/languages", tags=["Languages"])


@router.get("/", response_model=list[LanguageLessonResponse], status_code=status.HTTP_200_OK)
async def lister_lecons_de_langue(
    session: AsyncSession = Depends(get_session),
) -> list[LanguageLessonResponse]:
    """Retourne les leçons de langue disponibles."""
    result = await session.execute(
        select(LanguageLesson).order_by(LanguageLesson.id.asc())
    )
    return list(result.scalars().all())


@router.get(
    "/{lesson_id}",
    response_model=LanguageLessonResponse,
    status_code=status.HTTP_200_OK,
)
async def recuperer_lecon_de_langue(
    lesson_id: int,
    session: AsyncSession = Depends(get_session),
) -> LanguageLessonResponse:
    """Retourne une leçon de langue par son identifiant."""
    lesson = await session.get(LanguageLesson, lesson_id)

    if lesson is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Leçon de langue introuvable",
        )

    return lesson
