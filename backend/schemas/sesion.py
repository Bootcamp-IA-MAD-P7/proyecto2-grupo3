from datetime import datetime

from pydantic import BaseModel


class SesionBase(BaseModel):
    sala_id: int
    fecha_hora_inicio: datetime


class SesionCreate(SesionBase):
    pass


class SesionResponse(SesionBase):
    id: int

    class Config:
        from_attributes = True