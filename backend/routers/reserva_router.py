from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.database import get_db
from models.reserva import Reserva
from schemas.reserva import ReservaCreate, ReservaResponse

router = APIRouter(prefix="/reservas", tags=["Reservas"])

@router.post("/", response_model=ReservaResponse)
def create_reserva(reserva: ReservaCreate, db: Session = Depends(get_db)):
    db_reserva = Reserva(**reserva.model_dump())
    db.add(db_reserva)
    db.commit()
    db.refresh(db_reserva)
    return db_reserva


@router.get("/", response_model=list[ReservaResponse])
def get_reservas(db: Session = Depends(get_db)):
    return db.query(Reserva).all()


@router.get("/{reserva_id}", response_model=ReservaResponse)
def get_reserva(reserva_id: int, db: Session = Depends(get_db)):
    reserva = db.query(Reserva).filter(Reserva.id_reserva == reserva_id).first()

    if not reserva:
        raise HTTPException(status_code=404, detail="Reserva no encontrada")

    return reserva


@router.put("/{reserva_id}", response_model=ReservaResponse)
def update_reserva(reserva_id: int, data: ReservaCreate, db: Session = Depends(get_db)):
    reserva = db.query(Reserva).filter(Reserva.id_reserva == reserva_id).first()

    if not reserva:
        raise HTTPException(status_code=404, detail="Reserva no encontrada")

    for key, value in data.model_dump().items():
        setattr(reserva, key, value)

    db.commit()
    db.refresh(reserva)
    return reserva


@router.delete("/{reserva_id}")
def delete_reserva(reserva_id: int, db: Session = Depends(get_db)):
    reserva = db.query(Reserva).filter(Reserva.id_reserva == reserva_id).first()

    if not reserva:
        raise HTTPException(status_code=404, detail="Reserva no encontrada")

    db.delete(reserva)
    db.commit()
    return {"message": "Reserva eliminada correctamente"}
