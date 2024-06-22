from fastapi import FastAPI
from app.routes import auth, forms

app = FastAPI()

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(forms.router, prefix="/forms", tags=["forms"])
