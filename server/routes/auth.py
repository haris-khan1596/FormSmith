import os
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from server.database import db
from server.models import User, Token
from datetime import datetime, timedelta
from jose import JWTError, jwt
import bcrypt

router = APIRouter()

# Load environment variables from the .env file
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

token = OAuth2PasswordBearer(tokenUrl="auth/login")

def authenticate_user(username: str, password: str):
    """
    A function to authenticate a user based on the provided username and password.

    Parameters:
    - username: str, the username of the user trying to authenticate.
    - password: str, the password of the user trying to authenticate.

    Returns:
    - Returns the user object if authentication is successful, otherwise returns False.
    """
    user = db.users.find_one({"username": username})
    if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
        return user
    return False


def decode_token(token: str):
    """
    A function to decode an access token.

    Parameters:
    - token: str, the access token to be decoded.

    Returns:
    - Returns the decoded token if it is valid, otherwise returns None.
    """
    token_data = {"name": "", "id": ""}
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
        token_data["name"] = payload.get("sub")
        token_data["id"] = payload.get("id")
    except JWTError:
        return None
    return token_data
def create_access_token(data: dict):
    """
        A function to create an access token based on the provided data.

        Parameters:
        - data: dict, the data to be encoded into the access token.

        Returns:
        - Returns the encoded access token.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
@router.post("/register", response_model=Token, responses={
    200: {"description": "User registered successfully", "content": {"application/json": {"example": {"access_token": "token", "token_type": "bearer"}}}},
    400: {"description": "User already exists"}
})
async def register(form: User):
    """
    A function to register a user with the provided form data.

    Parameters:
    - form: User, the user form data to be registered. 
    - User: includes the username and password of the user.

    Raises:
    - HTTPException if the user already exists.

    Returns:
    - Returns a dictionary containing the generated access token and token type upon successful registration.
    """
    form_dict = form.dict()
    if db.users.find_one({"username": form_dict["username"]}):
        raise HTTPException(status_code=400, detail="User already exists")
    hashed_password = bcrypt.hashpw(form_dict["password"].encode('utf-8'), bcrypt.gensalt())
    form_dict["password"] = hashed_password.decode('utf-8')
    db.users.insert_one(form_dict)
    access_token = create_access_token(data={"sub": form_dict["username"],"id": str(form_dict["_id"])})
    return {"access_token": access_token, "token_type": "bearer"}




@router.post("/login", response_model=Token, responses={
    200: {"description": "User authenticated successfully", "content": {"application/json": {"example": {"access_token": "token", "token_type": "bearer"}}}},
    400: {"description": "Incorrect username or password"}
})
async def login(form: OAuth2PasswordRequestForm = Depends()):
    """
    A function to authenticate a user based on the provided username and password.

    Parameters:
    - form: OAuth2PasswordRequestForm, the form data containing the username and password.

    Raises:
    - HTTPException if the username or password is incorrect.

    Returns:
    - Returns a dictionary containing the access token and token type upon successful authentication.
    """
    user = authenticate_user(form.username, form.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token = create_access_token(data={"sub": user["username"],"id": str(user["_id"])})
    return {"access_token": access_token, "token_type": "bearer"}