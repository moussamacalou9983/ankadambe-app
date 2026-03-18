from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, HttpUrl, conint, constr


class UserCreate(BaseModel):
    """Payload de création d'utilisateur."""

    email: EmailStr
    password: constr(min_length=8)
    is_artisan: bool = False


class UserResponse(BaseModel):
    """Représentation publique de l'utilisateur."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    is_artisan: bool


class ArtisanProfileCreate(BaseModel):
    """Payload de création pour un profil artisan."""

    user_id: int
    nom_atelier: str
    localisation: str
    telephone_whatsapp: str


class ArtisanProfileResponse(BaseModel):
    """Représentation publique d'un profil artisan."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    nom_atelier: str
    localisation: str
    telephone_whatsapp: str


class ProductCreate(BaseModel):
    """Payload de création d'un produit artisanal."""

    artisan_id: int
    nom: str
    description: str
    prix_fcfa: conint(ge=0)
    image_url: HttpUrl
    is_available: bool = True


class ProductResponse(BaseModel):
    """Représentation publique d'un produit artisanal."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    artisan_id: int
    telephone_whatsapp: str
    nom: str
    description: str
    prix_fcfa: int
    image_url: HttpUrl
    is_available: bool


class CulturalContentCreate(BaseModel):
    """Payload de création d'un contenu culturel."""

    type_contenu: Literal["conte", "histoire", "site_touristique"]
    titre: str
    contenu_texte: str
    image_url: HttpUrl | None = None
    audio_url: HttpUrl | None = None


class CulturalContentResponse(BaseModel):
    """Représentation publique d'un contenu culturel."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    type_contenu: Literal["conte", "histoire", "site_touristique"]
    titre: str
    contenu_texte: str
    image_url: HttpUrl | None
    audio_url: HttpUrl | None


class LanguageLessonCreate(BaseModel):
    """Payload de création d'une leçon de langue."""

    categorie: Literal["vocabulaire", "expression", "grammaire"]
    mot_francais: str
    traduction_bambara: str
    exemple_francais: str
    exemple_bambara: str
    audio_prononciation_url: HttpUrl | None = None


class LanguageLessonResponse(BaseModel):
    """Représentation publique d'une leçon de langue."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    categorie: Literal["vocabulaire", "expression", "grammaire"]
    mot_francais: str
    traduction_bambara: str
    exemple_francais: str
    exemple_bambara: str
    audio_prononciation_url: HttpUrl | None
