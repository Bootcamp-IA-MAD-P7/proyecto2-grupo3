from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class ClienteBase(BaseModel):
    nombre: str = Field(max_length=20)
    apellido: str = Field(max_length=20)
    email: EmailStr = Field(max_length=50)
    telefono: str | None = Field(default=None, max_length=20)


class ClienteCreate(ClienteBase):
    pass


class ClienteResponse(ClienteBase):
    id_cliente: int
    fecha_registro: datetime | None = None

    class Config:
        from_attributes = True
