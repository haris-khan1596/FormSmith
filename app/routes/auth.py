from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from app.database import db
from app.models import User, Token
from datetime import datetime, timedelta
from jose import JWTError, jwt
import bcrypt

router = APIRouter()

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 160

token = OAuth2PasswordBearer(tokenUrl="token")

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
    access_token = create_access_token(data={"sub": form_dict["username"]})
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
    access_token = create_access_token(data={"sub": user["username"]})
    return {"access_token": access_token, "token_type": "bearer"}