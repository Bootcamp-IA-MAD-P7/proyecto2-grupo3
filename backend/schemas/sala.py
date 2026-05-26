from pydantic import BaseModel


class SalaBase(BaseModel):
    nombre: str
    capacidad_min: int
    capacidad_max: int


class SalaCreate(SalaBase):
    pass


class SalaResponse(SalaBase):
    id: int

    class Config:
        from_attributes = True