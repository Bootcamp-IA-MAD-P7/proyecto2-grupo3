from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.database import get_db
from models.reserva import Reserva
from schemas.reserva import ReservaCreate, ReservaResponse

router = APIRouter(prefix="/reservas", tags=["Reservas"])

DURACION_MINUTOS = 60


def _hay_solapamiento(
    db: Session, id_sala: int, inicio: datetime, duracion: int, exclude_id: int | None = None
) -> bool:
    fin = inicio + timedelta(minutes=duracion)
    query = db.query(Reserva).filter(
        Reserva.id_sala == id_sala,
        Reserva.estado.in_(["Pendiente", "Confirmada"]),
        Reserva.fecha_hora < fin,
    )
    if exclude_id:
        query = query.filter(Reserva.id_reserva != exclude_id)

    for r in query.all():
        r_fin = r.fecha_hora + timedelta(minutes=duracion)
        if r.fecha_hora < fin and r_fin > inicio:
            return True
    return False


@router.post("/", response_model=ReservaResponse)
def create_reserva(reserva: ReservaCreate, db: Session = Depends(get_db)):
    inicio = reserva.fecha_hora

    if _hay_solapamiento(db, reserva.id_sala, inicio, DURACION_MINUTOS):
        raise HTTPException(
            status_code=409,
            detail="La sala ya tiene una reserva en ese horario. Por favor, elige otra hora o sala.",
        )

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

    inicio = data.fecha_hora

    if _hay_solapamiento(db, data.id_sala, inicio, DURACION_MINUTOS, exclude_id=reserva_id):
        raise HTTPException(
            status_code=409,
            detail="La sala ya tiene una reserva en ese horario. Por favor, elige otra hora o sala.",
        )

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
