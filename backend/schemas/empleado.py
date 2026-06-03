from pydantic import BaseModel, Field, EmailStr
from typing import Optional


class EmpleadoBase(BaseModel):
    nombre: str = Field(max_length=20)
    apellido: str = Field(max_length=20)
    rol: str | None = Field(default="Game Master", max_length=50)
    activo: bool | None = True


class EmpleadoCreate(EmpleadoBase):
    email: Optional[EmailStr] = None
    password: Optional[str] = None


class EmpleadoResponse(EmpleadoBase):
    id_empleado: int
    email: Optional[str] = None

    class Config:
        from_attributes = True
