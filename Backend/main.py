from fastapi import FastAPI
from sqlalchemy.orm import Session

from database import SessionLocal, engine
from models import user, feedback, tags
from models.tags import Tag

from routes import user as user_routes
from routes import feedback as feedback_routes



app = FastAPI()


user.Base.metadata.create_all(bind=engine)


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
