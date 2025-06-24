from sqlalchemy.orm import Session
from models.feedback import Feedback
from models.tags import Tag
from schemas.feedback import FeedbackCreate

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
