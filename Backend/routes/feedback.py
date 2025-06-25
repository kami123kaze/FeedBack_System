
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database import SessionLocal
from backend.schemas.feedback import (
    FeedbackCreate,
    FeedbackOut,
    FeedbackUpdate,
    FeedbackOutWithName,
)
from backend.crud.feedback import (
    create_feedback,
    get_feedbacks_for_employee,  
    update_feedback,
)
from backend.dependencies import require_manager, get_current_user,require_employee
from backend.models.feedback import Feedback
from backend.models.user import User, RoleEnum


router = APIRouter(prefix="/feedbacks", tags=["Feedback"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=FeedbackOut)
def create_feedback_route(
    feedback_data: FeedbackCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager),
):
    if feedback_data.manager_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only submit feedback as yourself")
    return create_feedback(db, feedback_data)

@router.get("/employee/{employee_id}", response_model=List[FeedbackOut])
def get_feedback_for_employee_route(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != RoleEnum.employee or current_user.id != employee_id:
        raise HTTPException(status_code=403, detail="Not authorized to view this feedback")
    return get_feedbacks_for_employee(db, employee_id)

@router.get("/manager/{manager_id}", response_model=List[FeedbackOutWithName])
def get_feedback_given_by_manager_route(
    manager_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager),
):
    if current_user.id != manager_id:
        raise HTTPException(status_code=403, detail="Not your feedback")

   
    results = (
        db.query(Feedback, User.name)
        .join(User, Feedback.employee_id == User.id)
        .filter(Feedback.manager_id == manager_id)
        .all()
    )

    return [
        {
            "id": fb.id,
            "text": fb.text,
            "sentiment": fb.sentiment,
            "comment": fb.comment,
            "acknowledged": fb.acknowledged,
            "created_at": fb.created_at,
            "manager_id": fb.manager_id,
            "employee_id": fb.employee_id,
            "tags": fb.tags,
            "name": emp_name,
        }
        for fb, emp_name in results
    ]

@router.put("/{feedback_id}", response_model=FeedbackOut)
def update_feedback_route(
    feedback_id: int,
    update_data: FeedbackUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager),
):
    updated_feedback = update_feedback(
        db,
        feedback_id,
        current_user.id,
        update_data,
    )
    return FeedbackOut.from_orm(updated_feedback)


@router.put("/acknowledge/{feedback_id}", response_model=FeedbackOut)
def acknowledge_feedback_route(
    feedback_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_employee),
):
    fb = db.query(Feedback).filter(Feedback.id == feedback_id).first()
    if not fb:
        raise HTTPException(status_code=404, detail="Feedback not found")
    if fb.employee_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your feedback")

    fb.acknowledged = True
    db.commit()
    db.refresh(fb)
    return fb