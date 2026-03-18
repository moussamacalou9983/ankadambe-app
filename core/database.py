import os
import ssl
from pathlib import Path
from typing import AsyncGenerator

from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import declarative_base

# Charge les variables d'environnement depuis `.env` a la racine du projet.
load_dotenv(dotenv_path=Path(__file__).resolve().parents[1] / ".env")

# URL de connexion ; à surcharger via la variable d'environnement DATABASE_URL
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://postgres:postgres@localhost:5432/ankadambe",
)

connect_args: dict[str, object] = {}
db_ssl = os.getenv("DB_SSL", "").lower()
ssl_wanted = db_ssl in ("1", "true", "yes") or (
    db_ssl not in ("0", "false", "no")
    and ("supabase.co" in DATABASE_URL or "supabase.com" in DATABASE_URL)
)

if ssl_wanted:
    db_ssl_verify = os.getenv("DB_SSL_VERIFY", "").lower()
    db_ssl_ca_file = os.getenv("DB_SSL_CA_FILE")

    if db_ssl_verify in ("0", "false", "no"):
        ssl_context = ssl._create_unverified_context()
    else:
        ssl_context = (
            ssl.create_default_context(cafile=db_ssl_ca_file)
            if db_ssl_ca_file
            else ssl.create_default_context()
        )

    connect_args["ssl"] = ssl_context

engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    future=True,
    connect_args=connect_args,
)
SessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)

Base = declarative_base()


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """Fournit une session de base de données asynchrone."""
    async with SessionLocal() as session:
        yield session
