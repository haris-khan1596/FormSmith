from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import Optional
from app.database import db


class FormModel(BaseModel):
    title: str
    description: Optional[str]

router = APIRouter()

@router.get("/")
async def root():
    return "hello Form"

@router.post("/create")
async def create(form: FormModel):
    form_dict = form.dict()
    db.forms.insert_one(form_dict)
    form_dict["_id"] = str(form_dict["_id"])
    return {"message": "Form created successfully",
        "data": form_dict}

    