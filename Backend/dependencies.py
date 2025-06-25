from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.crud.user import get_user_by_email
from backend.utils.jwt import verify_token

from backend.models.user import RoleEnum


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    print("RAW JWT:", token)  
    payload = verify_token(token)
    print("DECODED PAYLOAD:", payload) 
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    user = get_user_by_email(db, payload.get("sub"))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    print("RESOLVED USER:", user.id, user.role)
    return user

def require_manager(current_user = Depends(get_current_user)):
    if current_user.role != RoleEnum.manager:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Manager access required")
    return current_user

def require_employee(current_user = Depends(get_current_user)):
    if current_user.role != RoleEnum.employee:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Employee access required")
    return current_user