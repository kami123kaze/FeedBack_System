from fastapi import FastAPI
from sqlalchemy.orm import Session
from backend import schemas
from backend.database import SessionLocal, engine
from backend.models import user, feedback, tags
from backend.models.tags import Tag

from backend.routes import user as user_routes
from backend.routes import feedback as feedback_routes

from backend.database import Base, engine

from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
   allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)



def seed_default_tags(session: Session):
    default_tags = [
        "communication",
        "leadership",
        "teamwork",
        "problem-solving",
        "time management",
        "technical skills",
        "accountability",
        "initiative"
    ]
    for name in default_tags:
        if not session.query(Tag).filter_by(name=name).first():
            session.add(Tag(name=name))
    session.commit()

db = SessionLocal()
seed_default_tags(db)
db.close()

@app.get("/")
def read_root():
    return {"msg": "Feedback System backend running 🚀"}
app.include_router(user_routes.router)
app.include_router(feedback_routes.router)
