from pydantic import BaseModel, Field
from typing import List, Optional

class FieldModel(BaseModel):
    type: str = Field(...,example="string")
    label: str = Field(...,example="Name")
    required: bool = Field(...,example="true")
    placeholder: Optional[str] = Field(...,example="Enter your name")

class FormModel(BaseModel):
    title: str = Field(...,example="My Form")
    description: Optional[str] = Field(...,example="This is my form")
    fields: List[FieldModel] 
class FormResponse(BaseModel):
    form_id: str = Field(...,example="6676e8ee20a81fa20ea84072")
    data: dict = Field(...,example={'Name': 'John'})

class User(BaseModel):
    username: str = Field(...,example="hariskhan")
    password: str = Field(...,example="password")

class Token(BaseModel):
    access_token: str = Field(...,example="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdHJuZyIsImV4cCI6MTcxOTA2ODQ3NH0.p4zIuXQdvjjoqXFNv3DJvfaO3GFIhoJmE23trILzkd0")
    token_type: str = Field(...,example="bearer")
