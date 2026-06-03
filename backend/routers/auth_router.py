from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from core.database import get_db
from core.security import verify_password, create_access_token, create_refresh_token, decode_token
from models.empleado import Empleado

router = APIRouter(prefix="/auth", tags=["Auth"])


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    token: str
    refreshToken: str
    empleado: dict


class RefreshRequest(BaseModel):
    refreshToken: str


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    empleado = db.query(Empleado).filter(Empleado.email == data.email).first()
    if not empleado or not empleado.hashed_password:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    if not verify_password(data.password, empleado.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    payload = {"sub": str(empleado.id_empleado), "email": empleado.email}
    return {
        "token": create_access_token(payload),
        "refreshToken": create_refresh_token(payload),
        "empleado": {
            "id": empleado.id_empleado,
            "nombre": empleado.nombre,
            "apellido": empleado.apellido,
            "email": empleado.email,
            "rol": empleado.rol,
        }
    }


@router.post("/refresh")
def refresh(data: RefreshRequest):
    payload = decode_token(data.refreshToken)
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    new_token = create_access_token({"sub": payload["sub"], "email": payload["email"]})
    return {"token": new_token}
