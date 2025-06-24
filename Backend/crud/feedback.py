from sqlalchemy.orm import Session,joinedload

from fastapi import HTTPException
from models.feedback import Feedback
from models.tags import Tag
from schemas.feedback import FeedbackCreate,FeedbackUpdate

def create_feedback(db: Session, feedback_data: FeedbackCreate):
    feedback = Feedback(
        manager_id=feedback_data.manager_id,
        employee_id=feedback_data.employee_id,
        text=feedback_data.text,
        sentiment=feedback_data.sentiment,
        comment=feedback_data.comment
    )

    
    if feedback_data.tag_ids:
        tags = db.query(Tag).filter(Tag.id.in_(feedback_data.tag_ids)).all()
        feedback.tags.extend(tags)

    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    return feedback

def get_feedback_for_employee(db: Session, employee_id: int):
    return db.query(Feedback).filter(Feedback.employee_id == employee_id).all()

def get_feedback_given_by_manager(db: Session, manager_id: int):
    return db.query(Feedback).filter(Feedback.manager_id == manager_id).all()

def update_feedback(db: Session, feedback_id: int, manager_id: int, update_data: FeedbackUpdate):
    feedback = (
    db.query(Feedback)
    .options(joinedload(Feedback.tags))
    .filter(Feedback.id == feedback_id)
    .first()
)

    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback not found")

    if feedback.manager_id != manager_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this feedback")

    if update_data.text is not None:
        feedback.text = update_data.text
    if update_data.sentiment is not None:
        feedback.sentiment = update_data.sentiment
    if update_data.comment is not None:
        feedback.comment = update_data.comment

    if update_data.tag_ids:
        tags = db.query(Tag).filter(Tag.id.in_(update_data.tag_ids)).all()
        feedback.tags = tags
        
    if update_data.acknowledged is not None:
       feedback.acknowledged = update_data.acknowledged
    
 
    db.commit()
    db.refresh(feedback)
    
    return feedback