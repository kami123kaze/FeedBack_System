
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from backend.database import get_db         
from backend.models.tags import Tag
from backend.schemas.tags import TagOut          

router = APIRouter(prefix="/tags", tags=["tags"])

@router.get("/", response_model=List[TagOut])
def list_tags(db: Session = Depends(get_db)):
   
    return db.query(Tag).all()
