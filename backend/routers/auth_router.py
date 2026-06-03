from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from core.database import get_db
from core.security import verify_password, create_access_token, create_refresh_token, decode_token
from models.empleado import Empleado

router = APIRouter(prefix="/auth", tags=["Auth"])


class LoginRequest(BaseModel):
    usuario: str
    password: str


class RefreshRequest(BaseModel):
    refreshToken: str


@router.post("/login")
def login(body: LoginRequest, db: Session = Depends(get_db)):
    empleado = db.query(Empleado).filter(Empleado.email == body.usuario).first()

    if not empleado or not empleado.hashed_password:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales inválidas")

    if not verify_password(body.password, empleado.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales inválidas")

    if not empleado.activo:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Empleado inactivo")

    token_data = {"sub": str(empleado.id_empleado), "rol": empleado.rol}

    return {
        "token": create_access_token(token_data),
        "refreshToken": create_refresh_token(token_data),
        "empleado": {
            "id": empleado.id_empleado,
            "nombre": empleado.nombre,
            "apellido": empleado.apellido,
            "rol": empleado.rol,
        },
    }


@router.post("/refresh")
def refresh(body: RefreshRequest, db: Session = Depends(get_db)):
    payload = decode_token(body.refreshToken)

    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token inválido")

    empleado_id = payload.get("sub")
    empleado = db.query(Empleado).filter(Empleado.id_empleado == int(empleado_id)).first()

    if not empleado or not empleado.activo:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Empleado no encontrado o inactivo")

    token_data = {"sub": str(empleado.id_empleado), "rol": empleado.rol}

    return {"token": create_access_token(token_data)}
