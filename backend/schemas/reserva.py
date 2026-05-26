from pydantic import BaseModel, field_validator


class ReservaBase(BaseModel):
    cliente_id: int
    sesion_id: int
    num_jugadores: int


class ReservaCreate(ReservaBase):
    @field_validator("num_jugadores")
    @classmethod
    def validar_num_jugadores(cls, value: int) -> int:
        if value < 2 or value > 6:
            raise ValueError("El numero de jugadores debe estar entre 2 y 6")
        return value


class ReservaResponse(ReservaBase):
    id: int
    estado: str

    class Config:
        from_attributes = True