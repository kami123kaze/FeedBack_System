from pydantic import BaseModel, EmailStr
from models.user import RoleEnum

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    role: RoleEnum

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: RoleEnum

    class Config:
        orm_mode = True 
