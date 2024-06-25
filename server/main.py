from fastapi import FastAPI
from server.routes import auth, forms
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5173",  # React app URL
    "http://localhost:8000",  # FastAPI URL (if applicable)
    # Add other origins as needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(forms.router, prefix="/forms", tags=["forms"])

