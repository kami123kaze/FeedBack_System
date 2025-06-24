from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from schemas.feedback import FeedbackCreate, FeedbackOut,FeedbackUpdate
from crud.feedback import create_feedback, get_feedback_for_employee, get_feedback_given_by_manager,update_feedback

router = APIRouter(prefix="/feedbacks", tags=["Feedback"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=FeedbackOut)
def create_feedback_route(feedback: FeedbackCreate, db: Session = Depends(get_db)):
    return create_feedback(db, feedback)

@router.get("/employee/{employee_id}", response_model=list[FeedbackOut])
def get_feedback_for_employee_route(employee_id: int, db: Session = Depends(get_db)):
    return get_feedback_for_employee(db, employee_id)

@router.get("/manager/{manager_id}", response_model=list[FeedbackOut])
def get_feedback_given_by_manager_route(manager_id: int, db: Session = Depends(get_db)):
    return get_feedback_given_by_manager(db, manager_id)

@router.put("/{feedback_id}", response_model=FeedbackOut)
def update_feedback_route(
    feedback_id: int,
    update_data: FeedbackUpdate,
    manager_id: int,
    db: Session = Depends(get_db)
):
    updated_feedback = update_feedback(db, feedback_id, manager_id, update_data)
    return FeedbackOut.from_orm(updated_feedback)

