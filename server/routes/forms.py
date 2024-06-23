from fastapi import APIRouter, Depends, HTTPException, status
from app.models import FormModel, FormResponse
from typing import List
from app.database import db
from .auth import token, decode_token


router = APIRouter()

@router.get("/all", response_model=list[FormModel])
async def root(token: str = Depends(token)):
    """
    Returns a list of all forms in the database of the authenticated user.

    Parameters:
        token (str, optional): The authentication token. Defaults to Depends(token).

    Returns:
        list[FormModel]: A list of all forms in the database.

    Raises:
        HTTPException: If the user is not authenticated.

    """
    user = decode_token(token)
    form = db.forms.find({"user_id": user["id"]})
    form_list = []
    for i in form:
        i["_id"] = str(i["_id"])
        form_list.append(i)
    return {"data": form_list} 

@router.post("/create", responses={
        200: {"description": "Form created successfully"},
        401: {"description": "Not authenticated", "content": {"application/json": {"example": {"detail": "Not authenticated"}
        }}}})
async def create(form: FormModel, token: str = Depends(token)):
    """
    Creates a new form in the database.

    Parameters:
        form (FormModel): The form data to be created.
        token (str, optional): The authentication token. Defaults to Depends(token).

    Returns:
        dict: A dictionary containing the message and the created form data.

    Raises:
        HTTPException: If the user is not authenticated.

    """
    form_dict = form.dict()
    user = decode_token(token)
    form_dict["user_id"] = user["id"]
    db.forms.insert_one(form_dict)
    form_dict["_id"] = str(form_dict["_id"])
    return {"message": "Form created successfully",
        "data": form_dict}

@router.delete("/delete/{form_id}", responses={
        200: {"description": "Form deleted successfully"},
        401: {"description": "Not authenticated", "content": {"application/json": {"example": {"detail": "Not authenticated"}
        }}}})
async def delete(form_id: str, token: str = Depends(token)):
    """
    Deletes a form from the database.

    Parameters:
        form_id (str): The ID of the form to be deleted.
        token (str, optional): The authentication token. Defaults to Depends(token).

    Returns:
        dict: A dictionary containing the message.

    Raises:
        HTTPException: If the user is not authenticated.

    """
    user = decode_token(token)
    db.forms.delete_one({"_id": form_id, "user_id": user["id"]})
    return {"message": "Form deleted successfully"}

@router.get("/{form_id}", response_model=FormModel)
async def get_form(form_id: str):
    form = db.forms.find_one({"_id": form_id})
    # delete the _id field
    form.pop("_id")
    return form

@router.get("/update/{form_id}", response_model=FormModel, responses={
    200: {"description": "Form found"}, 
    404: {"description": "Form not found"}
    })
async def update_form(form_id: str, token: str = Depends(token)):
    """
    Get a form from the database for updating.

    Args:
        form_id (str): The ID of the form to be updated.
        token (str): The authentication token.

    Returns:
        dict: The form data to be updated.

    Raises:
        HTTPException: If the form is not found.
    """
    # Decode the authentication token
    user = decode_token(token)

    # Get the form from the database
    form = db.forms.find_one({"_id": form_id, "user_id": user["id"]})

    # Raise an error if the form is not found
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")

    # Convert the form's ID to a string and return the form data
    form["_id"] = str(form["_id"])
    return form



@router.put("/update/{form_id}", responses={
        200: {"description": "Form updated successfully"},
        401: {"description": "Not authenticated", "content": {"application/json": {"example": {"detail": "Not authenticated"}
        }}}
})
async def update(form_id: str, form: FormModel, token: str = Depends(token)):
    """
    Updates a form in the database.

    Parameters:
        form_id (str): The ID of the form to be updated.
        form (FormModel): The updated form data.
        token (str, optional): The authentication token. Defaults to Depends(token).

    Returns:
        dict: A dictionary containing the message.

    Raises:
        HTTPException: If the user is not authenticated.

    """
    user = decode_token(token)
    db.forms.update_one({"_id": form_id, "user_id": user["id"]}, {"$set": form.dict()})
    return {"message": "Form updated successfully"}

@router.post("/submit/{form_id}", responses={
        200: {"description": "Form submitted successfully"},
        404: {"description": "Form not found"},
})
async def submit_form(form_id: str, data: FormResponse):
    """
    Submits a form in the database.

    Parameters:
        form_id (str): The ID of the form to be submitted.
        token (str, optional): The authentication token. Defaults to Depends(token).

    Returns:
        dict: A dictionary containing the message.

    Raises:
        HTTPException: If the form is not found.

    """
    form = db.forms.find({"_id": form_id})
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    print(data)
    db.responses.insert_one({**data.dict()})
    
    return {"message": "Form submitted successfully"}

@router.get("/responses/{form_id}")
async def get_responses(form_id: str):
    """
    Get responses for a specific form.

    Args:
        form_id (str): The ID of the form.

    Returns:
        responses (Cursor): A cursor of responses.
    """
    # Get all responses for a specific form
    responses = db.responses.find({"form_id": form_id})

    # Return the responses
    return responses
    
@router.get("/responses/{form_id}/{response_id}")
async def get_response(form_id: str, response_id: str):
    """
    Get a response for a specific form.

    Args:
        form_id (str): The ID of the form.
        response_id (str): The ID of the response.

    Returns:
        response (Cursor): A cursor of responses.
    """
    # Get all responses for a specific form
    response = db.responses.find_one({"_id": response_id})

    # Return the responses
    return response