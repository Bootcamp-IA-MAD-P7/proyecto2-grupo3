from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, field_validator


class ReservaBase(BaseModel):
    id_sala: int
    id_cliente: int
    id_empleado: int | None = None
    fecha_hora: datetime
    numero_jugadores: int
    total_pagado: Decimal


class ReservaCreate(ReservaBase):
    @field_validator("numero_jugadores")
    @classmethod
    def validar_num_jugadores(cls, value: int) -> int:
        if value < 2 or value > 6:
            raise ValueError("El numero de jugadores debe estar entre 2 y 6")
        return value


class ReservaResponse(ReservaBase):
    id_reserva: int
    estado: str

    class Config:
        from_attributes = True
