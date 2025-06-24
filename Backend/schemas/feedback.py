from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from models.feedback import SentimentEnum

from models.tags import Tag
from schemas.tags import TagOut

class FeedbackBase(BaseModel):
    text: str
    sentiment: SentimentEnum
    comment: Optional[str] = None
    tag_ids: Optional[List[int]] = []  

class FeedbackCreate(FeedbackBase):
    manager_id: int
    employee_id: int

class FeedbackOut(FeedbackBase):
    id: int
    manager_id: int
    employee_id: int
    created_at: datetime
    tags: List[TagOut] = []  
    
    class Config:
        orm_mode = True

  
class FeedbackUpdate(BaseModel):
    text: Optional[str] = None
    sentiment: Optional[SentimentEnum] = None
    comment: Optional[str] = None
    tag_ids: Optional[List[int]] = []
    

    class Config:
        orm_mode = True
