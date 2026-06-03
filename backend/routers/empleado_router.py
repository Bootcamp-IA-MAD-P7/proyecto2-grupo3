from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from core.database import get_db
from models.empleado import Empleado
from schemas.empleado import EmpleadoCreate, EmpleadoPage, EmpleadoResponse
from schemas.paginacion import Paginacion

router = APIRouter(prefix="/empleados", tags=["Empleados"])


@router.post("/", response_model=EmpleadoResponse)
def create_empleado(empleado: EmpleadoCreate, db: Session = Depends(get_db)):
    db_empleado = Empleado(**empleado.model_dump())
    db.add(db_empleado)
    db.commit()
    db.refresh(db_empleado)
    return db_empleado


@router.get("/", response_model=EmpleadoPage)
def get_empleados(
    page: int = Query(1, ge=1, description="Número de página"),
    limit: int = Query(10, ge=1, le=100, description="Elementos por página"),
    rol: str | None = Query(None, description="Filtrar por rol"),
    activo: bool | None = Query(None, description="Filtrar por estado activo"),
    db: Session = Depends(get_db),
):
    query = db.query(Empleado)

    if rol:
        query = query.filter(Empleado.rol == rol)
    if activo is not None:
        query = query.filter(Empleado.activo == activo)

    total = query.count()
    items = query.order_by(Empleado.apellido, Empleado.nombre).offset((page - 1) * limit).limit(limit).all()

    return EmpleadoPage(
        items=items,
        paginacion=Paginacion(
            page=page,
            limit=limit,
            total=total,
            total_pages=(total + limit - 1) // limit if total else 0,
        ),
    )


@router.get("/{empleado_id}", response_model=EmpleadoResponse)
def get_empleado(empleado_id: int, db: Session = Depends(get_db)):
    empleado = db.query(Empleado).filter(Empleado.id_empleado == empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    return empleado


@router.put("/{empleado_id}", response_model=EmpleadoResponse)
def update_empleado(empleado_id: int, data: EmpleadoCreate, db: Session = Depends(get_db)):
    empleado = db.query(Empleado).filter(Empleado.id_empleado == empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    for key, value in data.model_dump().items():
        setattr(empleado, key, value)

    db.commit()
    db.refresh(empleado)
    return empleado


@router.delete("/{empleado_id}")
def delete_empleado(empleado_id: int, db: Session = Depends(get_db)):
    empleado = db.query(Empleado).filter(Empleado.id_empleado == empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    db.delete(empleado)
    db.commit()
    return {"message": "Empleado eliminado correctamente"}
