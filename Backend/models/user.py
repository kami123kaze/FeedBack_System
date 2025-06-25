from sqlalchemy import Column, Integer, String, Enum, ForeignKey
from backend.database import Base
from sqlalchemy.orm import relationship
import enum

class RoleEnum(enum.Enum):
    manager = "manager"
    employee = "employee"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    role = Column(Enum(RoleEnum), nullable=False)
    password = Column(String, nullable=False)
    manager_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    manager = relationship("User", remote_side=[id], backref="employees")


