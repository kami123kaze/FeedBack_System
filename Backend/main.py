from fastapi import FastAPI
from database import SessionLocal,engine
from models import user
from models import feedback
from database import Base 


app = FastAPI()

#table creation 
Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    try:
        db = SessionLocal()
        db.execute("SELECT 1")
        db.close()
        return {"message": "Server & DB are up ✅"}
    except Exception as e:
        return {"error": str(e)}
   