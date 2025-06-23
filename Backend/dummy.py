from database import SessionLocal
from models.user import User, RoleEnum
from models.feedback import Feedback, SentimentEnum
from models.tags import Tag

db = SessionLocal()


manager = User(name="manager_john", email="john@company.com", role=RoleEnum.manager)
employee = User(name="employee_amy", email="amy@company.com", role=RoleEnum.employee)

db.add_all([manager, employee])
db.commit()


db.refresh(manager)
db.refresh(employee)

tag1 = db.query(Tag).filter_by(name="communication").first()
tag2 = db.query(Tag).filter_by(name="leadership").first()


feedback = Feedback(
    manager_id=manager.id,
    employee_id=employee.id,
    text="Amy has shown great communication and leadership in the last sprint.",
    sentiment=SentimentEnum.positive,
    comment="Keep up the good work!"
)


feedback.tags.extend([tag1, tag2])


db.add(feedback)
db.commit()

print(" Dummy data inserted successfully.")

db.close()
