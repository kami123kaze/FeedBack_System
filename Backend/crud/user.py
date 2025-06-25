from sqlalchemy.orm import Session
from backend.models.user import User
from backend.schemas.user import UserCreate
from fastapi import HTTPException
from passlib.context import CryptContext


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

#deps
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

 
  
def create_user(db: Session, user_data: UserCreate) -> User:
    hashed_pw = hash_password(user_data.password)
    user_dict = user_data.dict()
    user_dict["password"] = hashed_pw
    user = User(**user_dict)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user or not verify_password(password, user.password):
        return None
    return user

def get_users(db: Session):
    return db.query(User).all()



def update_user_manager(db: Session, user_id: int, manager_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.manager_id = manager_id
    db.commit()
    db.refresh(user)
    return user
