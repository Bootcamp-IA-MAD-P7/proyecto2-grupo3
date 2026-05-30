from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.database import get_db
from models.sesion import Sesion
from schemas.sesion import SesionCreate, SesionResponse

router = APIRouter(prefix="/sesiones", tags=["Sesiones"])

@router.post("/", response_model=SesionResponse)
def create_sesion(sesion: SesionCreate, db: Session = Depends(get_db)):
    db_sesion = Sesion(**sesion.model_dump())
    db.add(db_sesion)
    db.commit()
    db.refresh(db_sesion)
    return db_sesion


@router.get("/", response_model=list[SesionResponse])
def get_sesiones(db: Session = Depends(get_db)):
    return db.query(Sesion).all()


@router.get("/{sesion_id}", response_model=SesionResponse)
def get_sesion(sesion_id: int, db: Session = Depends(get_db)):
    sesion = db.query(Sesion).filter(Sesion.id_partida == sesion_id).first()

    if not sesion:
        raise HTTPException(status_code=404, detail="Sesión no encontrada")

    return sesion


@router.put("/{sesion_id}", response_model=SesionResponse)
def update_sesion(sesion_id: int, data: SesionCreate, db: Session = Depends(get_db)):
    sesion = db.query(Sesion).filter(Sesion.id_partida == sesion_id).first()

    if not sesion:
        raise HTTPException(status_code=404, detail="Sesión no encontrada")

    for key, value in data.model_dump().items():
        setattr(sesion, key, value)

    db.commit()
    db.refresh(sesion)
    return sesion


@router.delete("/{sesion_id}")
def delete_sesion(sesion_id: int, db: Session = Depends(get_db)):
    sesion = db.query(Sesion).filter(Sesion.id_partida == sesion_id).first()

    if not sesion:
        raise HTTPException(status_code=404, detail="Sesión no encontrada")

    db.delete(sesion)
    db.commit()
    return {"message": "Sesión eliminada correctamente"}
