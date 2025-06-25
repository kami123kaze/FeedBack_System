import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base


BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))        
DB_FILE     = os.path.join(BACKEND_DIR, "feedback.db")           
DATABASE_URL = f"sqlite:///{DB_FILE}"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
