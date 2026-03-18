from __future__ import annotations

from typing import List, Optional

from sqlalchemy import Boolean, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from core.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    is_artisan: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    artisan_profile: Mapped[Optional["ArtisanProfile"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
        uselist=False,
    )


class ArtisanProfile(Base):
    __tablename__ = "artisan_profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False
    )
    nom_atelier: Mapped[str] = mapped_column(String(255), nullable=False)
    localisation: Mapped[str] = mapped_column(String(255), nullable=False)
    telephone_whatsapp: Mapped[str] = mapped_column(String(30), nullable=False)

    user: Mapped["User"] = relationship(back_populates="artisan_profile")
    produits: Mapped[List["Product"]] = relationship(back_populates="artisan")


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    artisan_id: Mapped[int] = mapped_column(
        ForeignKey("artisan_profiles.id", ondelete="CASCADE"), nullable=False, index=True
    )
    nom: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    prix_fcfa: Mapped[int] = mapped_column(Integer, nullable=False)
    image_url: Mapped[str] = mapped_column(String(500), nullable=False)
    is_available: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    artisan: Mapped["ArtisanProfile"] = relationship(back_populates="produits")


class CulturalContent(Base):
    __tablename__ = "cultural_contents"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    type_contenu: Mapped[str] = mapped_column(String(50), nullable=False)
    titre: Mapped[str] = mapped_column(String(255), nullable=False)
    contenu_texte: Mapped[str] = mapped_column(Text, nullable=False)
    image_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    audio_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)


class LanguageLesson(Base):
    __tablename__ = "language_lessons"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    categorie: Mapped[str] = mapped_column(String(50), nullable=False)
    mot_francais: Mapped[str] = mapped_column(String(255), nullable=False)
    traduction_bambara: Mapped[str] = mapped_column(String(255), nullable=False)
    exemple_francais: Mapped[str] = mapped_column(Text, nullable=False)
    exemple_bambara: Mapped[str] = mapped_column(Text, nullable=False)
    audio_prononciation_url: Mapped[Optional[str]] = mapped_column(
        String(500), nullable=True
    )
