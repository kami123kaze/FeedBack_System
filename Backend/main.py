from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "SERVER RUNS WITH MY SUBPAR CODE !! "}
