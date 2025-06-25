from sqlalchemy import Column, Integer, Text, Enum, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from backend.database import Base
import enum
from datetime import datetime
from backend.models.tags import feedback_tags
from sqlalchemy import Boolean



class SentimentEnum(enum.Enum):
    positive = "positive"
    neutral = "neutral"
    negative = "negative"

class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)

    manager_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    
    text = Column(Text, nullable=False)
    sentiment = Column(Enum(SentimentEnum), nullable=False)
    
   
    comment = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.now)
 
    acknowledged = Column(Boolean, default=False)
    
    manager = relationship("User", foreign_keys=[manager_id], backref="feedbacks_given")
    employee = relationship("User", foreign_keys=[employee_id], backref="feedbacks_received")
    tags = relationship("Tag", secondary=feedback_tags, back_populates="feedbacks")

