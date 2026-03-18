import asyncio

from core.database import Base, engine
from models import domain as _domain  # noqa: F401


async def init_db() -> None:
    """Crée les tables dans la base PostgreSQL."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


if __name__ == "__main__":
    asyncio.run(init_db())
