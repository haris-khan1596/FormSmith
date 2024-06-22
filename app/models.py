from pydantic import BaseModel, Field
from typing import List, Optional

class FieldModel(BaseModel):
    type: str
    label: str
    required: bool
    placeholder: Optional[str] = None

class FormModel(BaseModel):
    title: str
    description: Optional[str]
    fields: List[FieldModel]

class FieldResponseModel(BaseModel):
    field: FieldModel
    data: Optional[str]

class User(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
