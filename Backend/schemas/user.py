from pydantic import BaseModel, EmailStr
from backend.models.user import RoleEnum
from typing import Optional


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str             
    role: RoleEnum
    manager_id: Optional[int] = None

class UserLogin(BaseModel):
    email: EmailStr          
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: RoleEnum
    manager_id: Optional[int] = None 

    class Config:
        orm_mode = True
