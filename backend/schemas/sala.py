from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, Field


class SalaBase(BaseModel):
    nombre: str = Field(max_length=100)
    tematica: str = Field(max_length=100)
    dificultad: Literal["Fácil", "Medio", "Difícil", "Experto"] | None = None
    capacidad_max: int
    precio: Decimal


class SalaCreate(SalaBase):
    pass


class SalaResponse(SalaBase):
    id_sala: int

    class Config:
        from_attributes = True
