from datetime import date, time, timedelta

from pydantic import BaseModel


class SesionBase(BaseModel):
    id_reserva: int | None = None
    fecha_partida: date
    hora_inicio: time
    hora_fin: time
    escaparon: bool
    notas_game_master: str | None = None


class SesionCreate(SesionBase):
    pass


class SesionResponse(SesionBase):
    id_partida: int
    tiempo_escape: timedelta | None = None

    class Config:
        from_attributes = True
