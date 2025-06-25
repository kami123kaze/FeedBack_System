

from typing import List

from fastapi import HTTPException
from sqlalchemy.orm import Session, joinedload

from backend.models.feedback import Feedback
from backend.models.user import User
from backend.models.tags import Tag

from backend.schemas.feedback import (
    FeedbackCreate,
    FeedbackUpdate,
    FeedbackOut,
)





def create_feedback(db: Session, feedback_data: FeedbackCreate) -> Feedback:
  
    fb = Feedback(
        manager_id=feedback_data.manager_id,
        employee_id=feedback_data.employee_id,
        text=feedback_data.text,
        sentiment=feedback_data.sentiment,
        comment=feedback_data.comment,
    )

    if feedback_data.tag_ids:
        tags = db.query(Tag).filter(Tag.id.in_(feedback_data.tag_ids)).all()
        fb.tags.extend(tags)

    db.add(fb)
    db.commit()
    db.refresh(fb)
    return fb


def get_feedbacks_for_employee(db: Session, employee_id: int) -> List[FeedbackOut]:
    rows = (
        db.query(Feedback, User.name.label("manager_name"))
        .join(User, User.id == Feedback.manager_id)  
        .filter(Feedback.employee_id == employee_id)
        .all()
    )

    result: List[FeedbackOut] = []
    for fb, manager_name in rows:
        fb.manager_name = manager_name  
        result.append(FeedbackOut.from_orm(fb))

    return result


def get_feedbacks_given_by_manager(db: Session, manager_id: int) -> List[Feedback]:
 
    return db.query(Feedback).filter(Feedback.manager_id == manager_id).all()


def update_feedback(
    db: Session,
    feedback_id: int,
    manager_id: int,
    update_data: FeedbackUpdate,
) -> Feedback:
   
    fb = (
        db.query(Feedback)
        .options(joinedload(Feedback.tags))
        .filter(Feedback.id == feedback_id)
        .first()
    )

    if not fb:
        raise HTTPException(status_code=404, detail="Feedback not found")

    if fb.manager_id != manager_id:
        raise HTTPException(status_code=403, detail="Not authorized")

   
    if update_data.text is not None:
        fb.text = update_data.text
    if update_data.sentiment is not None:
        fb.sentiment = update_data.sentiment
    if update_data.comment is not None:
        fb.comment = update_data.comment
    if update_data.tag_ids is not None:
        tags = db.query(Tag).filter(Tag.id.in_(update_data.tag_ids)).all()
        fb.tags = tags
    if update_data.acknowledged is not None:
        fb.acknowledged = update_data.acknowledged

    db.commit()
    db.refresh(fb)
    return fb
