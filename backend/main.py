from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List

from database import engine, get_db, Base
from models import Study
from schemas import StudyCreate, StudyUpdate, StudyResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)

@app.get("/studies", response_model=List[StudyResponse])
def get_studies(db: Session = Depends(get_db)):
    pass

@app.post("/studies", response_model=StudyResponse, status_code=status.HTTP_201_CREATED)
def create_study(study: StudyCreate, db: Session = Depends(get_db)):
    pass

@app.patch("/studies/{study_id}", response_model=StudyResponse)
def update_study(study_id: int, study_update: StudyUpdate, db: Session = Depends(get_db)):
    pass
