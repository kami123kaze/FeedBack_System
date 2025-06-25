from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import SessionLocal
from backend.crud.user import create_user, get_users, authenticate_user,update_user_manager
from backend.schemas.user import UserCreate, UserOut, UserLogin
from backend.models.user import User
from backend.utils.jwt import create_access_token
from backend.dependencies import get_current_user
from datetime import datetime, timedelta
from backend.dependencies import require_manager

router = APIRouter(prefix="/users", tags=["Users"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=UserOut)
def create_user_route(user: UserCreate, db: Session = Depends(get_db)):
    return create_user(db, user)

@router.get("/", response_model=list[UserOut])
def get_all_users(db: Session = Depends(get_db)):
    return get_users(db)

@router.post("/login")
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = authenticate_user(db, user_data.email, user_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=30)
    )
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me", response_model=UserOut)
def get_me(current_user: UserOut = Depends(get_current_user)):
    return current_user

@router.put(
    "/{employee_id}/assign-manager/{manager_id}",
    response_model=UserOut
)
def assign_manager(
    employee_id: int,
    manager_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_manager),
):
    return update_user_manager(db, employee_id, manager_id)

@router.put("/{employee_id}/unassign", response_model=UserOut)
def unassign_manager_from_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager),
):
    emp = db.query(User).filter(User.id == employee_id).first()

    emp.manager_id = None
    db.commit()
    db.refresh(emp)
    return emp