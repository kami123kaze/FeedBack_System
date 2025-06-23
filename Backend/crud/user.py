from sqlalchemy.orm import Session
from models.user import User
from schemas.user import UserCreate

def create_user(db: Session, user_data: UserCreate):
    user = User(**user_data.dict())
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_users(db: Session):
    return db.query(User).all()
