from fastapi import APIRouter, Depends, HTTPException
from server.models import FormModel, FormResponse
from server.database import db
from .auth import token, decode_token
from bson import ObjectId

router = APIRouter()

def to_id(form_id: str):
    try:
        return ObjectId(form_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid form ID")


@router.get("/all")
async def get_all_forms(token: str = Depends(token)):
    user = decode_token(token)
    forms = db.forms.find({"user_id": user["id"]})
    result = []
    for f in forms:
        f["_id"] = str(f["_id"])
        result.append(f)
    return result


@router.post("/create")
async def create(form: FormModel, token: str = Depends(token)):
    form_dict = form.model_dump()
    user = decode_token(token)
    form_dict["user_id"] = user["id"]
    db.forms.insert_one(form_dict)
    form_dict["_id"] = str(form_dict["_id"])
    return {"message": "Form created successfully", "data": form_dict}




@router.delete("/delete/{form_id}")
async def delete(form_id: str, token: str = Depends(token)):
    user = decode_token(token)
    db.forms.delete_one({"_id": to_id(form_id), "user_id": user["id"]})
    return {"message": "Form deleted successfully"}


@router.get("/update/{form_id}")
async def get_form_for_edit(form_id: str, token: str = Depends(token)):
    user = decode_token(token)
    form = db.forms.find_one({"_id": to_id(form_id), "user_id": user["id"]})
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    form["_id"] = str(form["_id"])
    return form


@router.put("/update/{form_id}")
async def update(form_id: str, form: FormModel, token: str = Depends(token)):
    user = decode_token(token)
    db.forms.update_one(
        {"_id": to_id(form_id), "user_id": user["id"]},
        {"$set": form.model_dump()}
    )
    return {"message": "Form updated successfully"}


@router.post("/submit/{form_id}")
async def submit_form(form_id: str, data: FormResponse):
    form = db.forms.find_one({"_id": to_id(form_id)})
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    db.responses.insert_one(data.model_dump())
    return {"message": "Form submitted successfully"}


@router.get("/responses/{form_id}")
async def get_responses(form_id: str, token: str = Depends(token)):
    responses = db.responses.find({"form_id": form_id})
    result = []
    for r in responses:
        r["_id"] = str(r["_id"])
        result.append(r)
    return result


# Keep this LAST — wildcard catches everything above if placed earlier
@router.get("/{form_id}")
async def get_form(form_id: str):
    form = db.forms.find_one({"_id": to_id(form_id)})
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    form["_id"] = str(form["_id"])
    return form
