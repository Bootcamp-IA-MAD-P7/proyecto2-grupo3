import sys
from pathlib import Path
import os
import warnings
import pytest

# Root path of the project
ROOT = Path(__file__).resolve().parents[1]
os.chdir(str(ROOT))

if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

# Environment variable for testing
os.environ["database_url"] = "sqlite:///./test.db"

# Import after path
from core.database import Base, engine

# --- SQLite compatibility for tests: patching the escape_time column ---
# This prevents SQLAlchemy from attempting to process Interval/Computed types, which are not properly supported by SQLite.
try:
    from sqlalchemy import String
    from models import sesion as sesion_model

    col = sesion_model.Sesion.__table__.c.get("tiempo_escape")
    if col is not None:
        # Change the type to String to avoid conversion issues during flush/select operations
        col.type = String()
        # Remove the computed expression if it exists, so that SQLite does not attempt to evaluate it
        try:
            col.computed = None
        except Exception:
            pass
except Exception:
    # If the module/column does not exist for any reason, we do not break the tests and simply ignore it
    pass


@pytest.fixture(autouse=True)
def clean_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)
