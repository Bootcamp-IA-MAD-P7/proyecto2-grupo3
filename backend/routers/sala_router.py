from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from core.database import get_db
from models.sala import Sala
from schemas.paginacion import Paginacion
from schemas.sala import SalaCreate, SalaPage, SalaResponse

router = APIRouter(prefix="/salas", tags=["Salas"])


@router.post("/", response_model=SalaResponse)
def create_sala(sala: SalaCreate, db: Session = Depends(get_db)):
    db_sala = Sala(**sala.model_dump())
    db.add(db_sala)
    db.commit()
    db.refresh(db_sala)
    return db_sala


@router.get("/", response_model=SalaPage)
def get_salas(
    page: int = Query(1, ge=1, description="Número de página"),
    limit: int = Query(10, ge=1, le=100, description="Elementos por página"),
    nombre: str | None = Query(None, description="Filtrar por nombre (contiene)"),
    tematica: str | None = Query(None, description="Filtrar por temática (contiene)"),
    db: Session = Depends(get_db),
):
    query = db.query(Sala)

    if nombre:
        query = query.filter(Sala.nombre.ilike(f"%{nombre}%"))
    if tematica:
        query = query.filter(Sala.tematica.ilike(f"%{tematica}%"))

    total = query.count()
    items = query.order_by(Sala.id_sala).offset((page - 1) * limit).limit(limit).all()

    return SalaPage(
        items=items,
        paginacion=Paginacion(
            page=page,
            limit=limit,
            total=total,
            total_pages=(total + limit - 1) // limit if total else 0,
        ),
    )


@router.get("/{sala_id}", response_model=SalaResponse)
def get_sala(sala_id: int, db: Session = Depends(get_db)):
    sala = db.query(Sala).filter(Sala.id_sala == sala_id).first()

    if not sala:
        raise HTTPException(status_code=404, detail="Sala no encontrada")

    return sala


@router.put("/{sala_id}", response_model=SalaResponse)
def update_sala(sala_id: int, data: SalaCreate, db: Session = Depends(get_db)):
    sala = db.query(Sala).filter(Sala.id_sala == sala_id).first()

    if not sala:
        raise HTTPException(status_code=404, detail="Sala no encontrada")

    for key, value in data.model_dump().items():
        setattr(sala, key, value)

    db.commit()
    db.refresh(sala)
    return sala


@router.delete("/{sala_id}")
def delete_sala(sala_id: int, db: Session = Depends(get_db)):
    sala = db.query(Sala).filter(Sala.id_sala == sala_id).first()

    if not sala:
        raise HTTPException(status_code=404, detail="Sala no encontrada")

    db.delete(sala)
    db.commit()
    return {"message": "Sala eliminada correctamente"}
