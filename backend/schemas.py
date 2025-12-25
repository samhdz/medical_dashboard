from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import Optional

class StudyCreate(BaseModel):
    patient_name: str = Field(..., min_length=1, description="Patient's full name")
    type: str = Field(..., min_length=1, description="Type of medical study")
    status: str = Field(..., description="Study status: 'pendiente' or 'completado'")

    @field_validator('status')
    @classmethod
    def validate_status(cls, v):
        if v not in ['pendiente', 'completado']:
            raise ValueError("Status must be either 'pendiente' or 'completado'")
        return v

class StudyUpdate(BaseModel):
    status: str = Field(..., description="Study status: 'pendiente' or 'completado'")

    @field_validator('status')
    @classmethod
    def validate_status(cls, v):
        if v not in ['pendiente', 'completado']:
            raise ValueError("Status must be either 'pendiente' or 'completado'")
        return v

class StudyResponse(BaseModel):
    id: int
    patient_name: str
    type: str
    status: str
    created_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True
