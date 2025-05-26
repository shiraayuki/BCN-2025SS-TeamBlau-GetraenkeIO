from contextlib import asynccontextmanager
from typing import Generator
from fastapi import FastAPI
from fastapi.testclient import TestClient
import pytest
from sqlmodel import SQLModel, Session, StaticPool, create_engine, delete
from starlette.routing import _DefaultLifespan

from app.core.database import create_db_and_tables
from app.models.user import User
from ..core.database import engine
from ..crud.user import store_user
from ..main import app
from ..api.dependencies import get_session


@pytest.fixture()
def db() -> Generator[Session, None, None]:
    # In Memory Database fuer Tests erzeugen.
    engine = create_engine(
        "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    with Session(engine) as session:
        SQLModel.metadata.create_all(engine)
        yield session

# Es muss in den environment Variablen ein anderer Datenbankname für die Testdatenbank angegeben werden.
@pytest.fixture()
def client(db: Session):
    # Eigenen lifespan fuer die App erzeugen.
    def get_session_override():
        return db
    app.dependency_overrides[get_session] = get_session_override
    app.router.lifespan_context = _DefaultLifespan(app.router)
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()
