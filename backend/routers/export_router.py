import csv
import io

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from core.database import get_db
from models.reserva import Reserva

router = APIRouter(prefix="/export", tags=["Export CSV"])


@router.get("/reservas/csv")
def export_reservas_csv(db: Session = Depends(get_db)):
    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow([
        "id_reserva",
        "id_sala",
        "id_cliente",
        "id_empleado",
        "fecha_hora",
        "numero_jugadores",
        "estado",
        "total_pagado",
    ])

    reservas = db.query(Reserva).all()

    for reserva in reservas:
        writer.writerow([
            reserva.id_reserva,
            reserva.id_sala,
            reserva.id_cliente,
            reserva.id_empleado,
            reserva.fecha_hora,
            reserva.numero_jugadores,
            reserva.estado,
            reserva.total_pagado,
        ])

    output.seek(0)

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=reservas.csv"},
    )