# -*- coding: utf-8 -*-
import asyncio
import unicodedata

from passlib.context import CryptContext
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from core.database import SessionLocal
from models.domain import (
    ArtisanProfile,
    CulturalContent,
    LanguageLesson,
    Product,
    User,
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

ARTISAN_EMAIL = "atelier.sanogo@ankadambe.ml"
ARTISAN_PASSWORD = "motdepasseFort123"
ARTISAN_WHATSAPP = "+223 72 88 41 07"
PRODUCT_FIXTURES: list[dict[str, str | int]] = [
    {
        "nom": "Pagne Bogolan de Ségou",
        "description": (
            "Tissage traditionnel en coton teint à la boue, "
            "motifs géométriques d'inspiration bambara."
        ),
        "prix_fcfa": 25000,
        "image_url": (
            "https://commons.wikimedia.org/wiki/Special:FilePath/"
            "S%C3%A9gou%20%2811%29.JPG"
        ),
    },
    {
        "nom": "Statuette en bois d'ébène",
        "description": (
            "Sculpture artisanale représentant une silhouette peule, "
            "bois d'ébène poli."
        ),
        "prix_fcfa": 48000,
        "image_url": (
            "https://commons.wikimedia.org/wiki/Special:FilePath/"
            "Wooden%20African%20Statues.JPG"
        ),
    },
    {
        "nom": "Collier en bronze de Mopti",
        "description": (
            "Pendentif en bronze avec finition artisanale, "
            "inspiré des bijoux sahariens."
        ),
        "prix_fcfa": 32000,
        "image_url": (
            "https://commons.wikimedia.org/wiki/Special:FilePath/"
            "African%20Necklace.JPG"
        ),
    },
]
CULTURAL_CONTENT_FIXTURES: list[dict[str, str | None]] = [
    {
        "type_contenu": "conte",
        "titre": "L'épopée de Soundiata Keïta",
        "contenu_texte": (
            "L'épopée de Soundiata Keïta raconte la naissance de l'empire du Mali "
            "à travers le destin du prince Soundiata, qui unit plusieurs royaumes "
            "et devient une figure fondatrice de la mémoire mandingue."
        ),
        "image_url": None,
        "audio_url": None,
    },
]
LANGUAGE_LESSON_FIXTURES: list[dict[str, str | None]] = [
    {
        "categorie": "expression",
        "mot_francais": "Bonjour, comment ça va ?",
        "traduction_bambara": "I ni cɛ, i ka kɛnɛ wa ?",
        "exemple_francais": "Bonjour, comment ça va ?",
        "exemple_bambara": "I ni cɛ, i ka kɛnɛ wa ?",
        "audio_prononciation_url": None,
    },
]


def normalize_name(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value)
    ascii_value = normalized.encode("ascii", "ignore").decode("ascii")
    return ascii_value.casefold().replace("'", "").replace("’", "")


async def seed() -> None:
    """Synchronise les données de test du MVP en UTF-8."""
    async with SessionLocal() as session:
        try:
            artisan_user = await session.scalar(
                select(User).where(User.email == ARTISAN_EMAIL)
            )
            if artisan_user is None:
                artisan_user = User(
                    email=ARTISAN_EMAIL,
                    hashed_password=pwd_context.hash(ARTISAN_PASSWORD),
                    is_artisan=True,
                )
                session.add(artisan_user)
                await session.flush()
            else:
                artisan_user.is_artisan = True

            artisan_profile = await session.scalar(
                select(ArtisanProfile).where(ArtisanProfile.user_id == artisan_user.id)
            )
            if artisan_profile is None:
                artisan_profile = ArtisanProfile(
                    user_id=artisan_user.id,
                    nom_atelier="Atelier Sanogo",
                    localisation="Ségou, Mali",
                    telephone_whatsapp=ARTISAN_WHATSAPP,
                )
                session.add(artisan_profile)
                await session.flush()
            else:
                artisan_profile.nom_atelier = "Atelier Sanogo"
                artisan_profile.localisation = "Ségou, Mali"
                artisan_profile.telephone_whatsapp = ARTISAN_WHATSAPP

            products_result = await session.execute(
                select(Product).where(Product.artisan_id == artisan_profile.id)
            )
            existing_products = {
                normalize_name(product.nom): product
                for product in products_result.scalars().all()
            }

            for fixture in PRODUCT_FIXTURES:
                fixture_name = str(fixture["nom"])
                product = existing_products.get(normalize_name(fixture_name))
                if product is None:
                    session.add(
                        Product(
                            artisan_id=artisan_profile.id,
                            nom=fixture_name,
                            description=str(fixture["description"]),
                            prix_fcfa=int(fixture["prix_fcfa"]),
                            image_url=str(fixture["image_url"]),
                            is_available=True,
                        )
                    )
                    continue

                product.nom = fixture_name
                product.description = str(fixture["description"])
                product.prix_fcfa = int(fixture["prix_fcfa"])
                product.image_url = str(fixture["image_url"])
                product.is_available = True

            cultural_contents_result = await session.execute(select(CulturalContent))
            existing_cultural_contents = {
                normalize_name(content.titre): content
                for content in cultural_contents_result.scalars().all()
            }

            for fixture in CULTURAL_CONTENT_FIXTURES:
                fixture_title = str(fixture["titre"])
                content = existing_cultural_contents.get(normalize_name(fixture_title))
                if content is None:
                    session.add(
                        CulturalContent(
                            type_contenu=str(fixture["type_contenu"]),
                            titre=fixture_title,
                            contenu_texte=str(fixture["contenu_texte"]),
                            image_url=fixture["image_url"],
                            audio_url=fixture["audio_url"],
                        )
                    )
                    continue

                content.type_contenu = str(fixture["type_contenu"])
                content.titre = fixture_title
                content.contenu_texte = str(fixture["contenu_texte"])
                content.image_url = fixture["image_url"]
                content.audio_url = fixture["audio_url"]

            language_lessons_result = await session.execute(select(LanguageLesson))
            existing_language_lessons = {
                normalize_name(lesson.mot_francais): lesson
                for lesson in language_lessons_result.scalars().all()
            }

            for fixture in LANGUAGE_LESSON_FIXTURES:
                fixture_french = str(fixture["mot_francais"])
                lesson = existing_language_lessons.get(normalize_name(fixture_french))
                if lesson is None:
                    session.add(
                        LanguageLesson(
                            categorie=str(fixture["categorie"]),
                            mot_francais=fixture_french,
                            traduction_bambara=str(fixture["traduction_bambara"]),
                            exemple_francais=str(fixture["exemple_francais"]),
                            exemple_bambara=str(fixture["exemple_bambara"]),
                            audio_prononciation_url=fixture["audio_prononciation_url"],
                        )
                    )
                    continue

                lesson.categorie = str(fixture["categorie"])
                lesson.mot_francais = fixture_french
                lesson.traduction_bambara = str(fixture["traduction_bambara"])
                lesson.exemple_francais = str(fixture["exemple_francais"])
                lesson.exemple_bambara = str(fixture["exemple_bambara"])
                lesson.audio_prononciation_url = fixture["audio_prononciation_url"]

            await session.commit()
            print("Seed terminé : catalogue, culture et langues synchronisés.")
        except IntegrityError as exc:
            await session.rollback()
            print(f"Seed annulé (intégrité) : {exc}")


if __name__ == "__main__":
    asyncio.run(seed())
