from pydantic import BaseModel, Field


class EmpleadoBase(BaseModel):
    nombre: str = Field(max_length=20)
    apellido: str = Field(max_length=20)
    rol: str | None = Field(default="Game Master", max_length=50)
    activo: bool | None = True


class EmpleadoCreate(EmpleadoBase):
    pass


class EmpleadoResponse(EmpleadoBase):
    id_empleado: int

    class Config:
        from_attributes = True
