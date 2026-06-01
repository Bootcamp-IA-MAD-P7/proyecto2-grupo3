from datetime import date, datetime, time, timedelta

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from core.database import get_db
from models.reserva import Reserva
from models.sala import Sala

router = APIRouter(prefix="/disponibilidad", tags=["Disponibilidad"])


HORA_APERTURA = 10
HORA_CIERRE = 22


@router.get("/")
def get_disponibilidad(
    sala_id: int = Query(..., description="ID de la sala"),
    fecha: date = Query(..., description="Fecha a consultar (YYYY-MM-DD)"),
    db: Session = Depends(get_db),
):
    sala = db.query(Sala).filter(Sala.id_sala == sala_id).first()
    if not sala:
        raise HTTPException(status_code=404, detail="Sala no encontrada")

    duracion = sala.duracion_minutos or 60

    inicio_dia = datetime.combine(fecha, time(HORA_APERTURA, 0))
    fin_dia = datetime.combine(fecha, time(HORA_CIERRE, 0))

    reservas = db.query(Reserva).filter(
        Reserva.id_sala == sala_id,
        Reserva.estado.in_(["Pendiente", "Confirmada"]),
        Reserva.fecha_hora >= inicio_dia,
        Reserva.fecha_hora < fin_dia,
    ).order_by(Reserva.fecha_hora).all()

    slots = []
    cursor = inicio_dia

    while cursor + timedelta(minutes=duracion) <= fin_dia:
        slot_fin = cursor + timedelta(minutes=duracion)

        ocupado = False
        for r in reservas:
            r_fin = r.fecha_hora + timedelta(minutes=duracion)
            if r.fecha_hora < slot_fin and r_fin > cursor:
                ocupado = True
                cursor = r_fin
                break

        if not ocupado:
            slots.append({
                "hora_inicio": cursor.time().isoformat(timespec="minutes"),
                "hora_fin": slot_fin.time().isoformat(timespec="minutes"),
                "disponible": True,
            })
            cursor = slot_fin

    return {
        "sala_id": sala_id,
        "fecha": fecha.isoformat(),
        "duracion_minutos": duracion,
        "slots": slots,
    }
