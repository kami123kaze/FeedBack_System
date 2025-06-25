from sqlalchemy import Column, Integer, String, Table, ForeignKey
from sqlalchemy.orm import relationship
from backend.database import Base

feedback_tags = Table(
    "feedback_tags",
    Base.metadata,
    Column("feedback_id", ForeignKey("feedbacks.id"), primary_key=True),
    Column("tag_id", ForeignKey("tags.id"), primary_key=True)
)

class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)

    feedbacks = relationship("Feedback", secondary="feedback_tags", back_populates="tags")
