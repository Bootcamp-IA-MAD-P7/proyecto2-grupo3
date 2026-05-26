from pydantic import BaseModel, EmailStr


class ClienteBase(BaseModel):
    nombre: str
    email: EmailStr
    telefono: str | None = None


class ClienteCreate(ClienteBase):
    pass


class ClienteResponse(ClienteBase):
    id: int

    class Config:
        from_attributes = True