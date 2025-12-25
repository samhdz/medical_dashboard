from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from datetime import datetime, date, timezone
from typing import List

from database import engine, get_db, Base
from models import Study
from schemas import StudyCreate, StudyUpdate, StudyResponse

app = FastAPI()

# TODO no permitir cualquier origen!
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
    """
    Retorna estudios relevantes: todos los pendientes + completados hoy.
    Esto previene saturación del listado con estudios históricos.
    """
    today = date.today()
    
    studies = db.query(Study).filter(
        or_(
            Study.status == "pendiente",
            and_(
                Study.status == "completado",
                Study.completed_at >= today
            )
        )
    ).order_by(Study.created_at.desc()).all()
    
    return studies

@app.post("/studies", response_model=StudyResponse, status_code=status.HTTP_201_CREATED)
def create_study(study: StudyCreate, db: Session = Depends(get_db)):
    """
    Crea un nuevo estudio médico.
    Auto-asigna created_at y maneja completed_at si el estado es 'completado'.
    """
    db_study = Study(
        patient_name=study.patient_name,
        type=study.type,
        status=study.status
    )
    
    # Si se crea como completado, establecer completed_at
    if study.status == "completado":
        db_study.completed_at = datetime.now(timezone.utc)
    
    db.add(db_study)
    db.commit()
    db.refresh(db_study)
    
    return db_study

@app.patch("/studies/{study_id}", response_model=StudyResponse)
def update_study(study_id: int, study_update: StudyUpdate, db: Session = Depends(get_db)):
    """
    Actualiza el estado de un estudio.
    Establece completed_at automáticamente cuando se marca como 'completado'.
    """
    study = db.query(Study).filter(Study.id == study_id).first()
    
    if not study:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Estudio no encontrado"
        )
    
    # Actualizar estado
    study.status = study_update.status
    
    # Si se marca como completado, establecer timestamp
    if study_update.status == "completado":
        study.completed_at = datetime.now(timezone.utc)
    elif study_update.status == "pendiente":
        study.completed_at = None
    
    db.commit()
    db.refresh(study)
    
    return study
