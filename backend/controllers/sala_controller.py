from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.core.database import get_db
from backend.models.sala import Sala
from backend.schemas.sala import SalaCreate, SalaResponse

router = APIRouter(prefix="/salas", tags=["Salas"])


@router.post("/", response_model=SalaResponse)
def create_sala(sala: SalaCreate, db: Session = Depends(get_db)):
    db_sala = Sala(**sala.model_dump())
    db.add(db_sala)
    db.commit()
    db.refresh(db_sala)
    return db_sala


@router.get("/", response_model=list[SalaResponse])
def get_salas(db: Session = Depends(get_db)):
    return db.query(Sala).all()


@router.get("/{sala_id}", response_model=SalaResponse)
def get_sala(sala_id: int, db: Session = Depends(get_db)):
    sala = db.query(Sala).filter(Sala.id == sala_id).first()

    if not sala:
        raise HTTPException(status_code=404, detail="Sala no encontrada")

    return sala


@router.put("/{sala_id}", response_model=SalaResponse)
def update_sala(sala_id: int, data: SalaCreate, db: Session = Depends(get_db)):
    sala = db.query(Sala).filter(Sala.id == sala_id).first()

    if not sala:
        raise HTTPException(status_code=404, detail="Sala no encontrada")

    for key, value in data.model_dump().items():
        setattr(sala, key, value)

    db.commit()
    db.refresh(sala)
    return sala


@router.delete("/{sala_id}")
def delete_sala(sala_id: int, db: Session = Depends(get_db)):
    sala = db.query(Sala).filter(Sala.id == sala_id).first()

    if not sala:
        raise HTTPException(status_code=404, detail="Sala no encontrada")

    db.delete(sala)
    db.commit()
    return {"message": "Sala eliminada correctamente"}