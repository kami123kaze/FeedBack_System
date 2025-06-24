from pydantic import BaseModel

class TagOut(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True
