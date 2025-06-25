from pydantic import BaseModel, EmailStr
from models.user import RoleEnum

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str             
    role: RoleEnum

class UserLogin(BaseModel):
    email: EmailStr          
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: RoleEnum

    class Config:
        orm_mode = True
