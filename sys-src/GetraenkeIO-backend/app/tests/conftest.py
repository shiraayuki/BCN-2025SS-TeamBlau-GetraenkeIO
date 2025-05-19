from contextlib import asynccontextmanager
from typing import Generator
from fastapi import FastAPI
from fastapi.testclient import TestClient
import pytest
from sqlmodel import Session, delete
from starlette.routing import _DefaultLifespan

from app.core.database import create_db_and_tables
from app.models.user import User
from ..core.database import engine
from ..crud.user import store_user
from ..main import app


def clear_db(session: Session):
    session.exec(delete(User))
    session.commit()

@pytest.fixture(scope="session", autouse=True)
def db() -> Generator[Session, None, None]:
    with Session(engine) as session:
        clear_db(session)
        create_db_and_tables()
        yield session
        clear_db(session)

# Es muss in den environment Variablen ein anderer Datenbankname für die Testdatenbank angegeben werden.
@pytest.fixture(scope="module")
def client():
    app.router.lifespan_context = _DefaultLifespan(app.router)
    with TestClient(app) as c:
        yield c
