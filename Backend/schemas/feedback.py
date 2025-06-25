from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from backend.models.feedback import SentimentEnum

from backend.models.tags import Tag
from backend.schemas.tags import TagOut

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
    acknowledged: bool  
    name: str
    
    class Config:
        orm_mode = True

  
class FeedbackUpdate(BaseModel):
    text: Optional[str] = None
    sentiment: Optional[SentimentEnum] = None
    comment: Optional[str] = None
    tag_ids: Optional[List[int]] = []
    acknowledged: Optional[bool] = None
    
class FeedbackOutWithName(FeedbackOut):
    name: str
    class Config:
        orm_mode = True
