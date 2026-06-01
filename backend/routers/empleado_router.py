from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.database import get_db
from models.empleado import Empleado
from schemas.empleado import EmpleadoCreate, EmpleadoResponse

router = APIRouter(prefix="/empleados", tags=["Empleados"])


@router.post("/", response_model=EmpleadoResponse)
def create_empleado(empleado: EmpleadoCreate, db: Session = Depends(get_db)):
    db_empleado = Empleado(**empleado.model_dump())
    db.add(db_empleado)
    db.commit()
    db.refresh(db_empleado)
    return db_empleado


@router.get("/", response_model=list[EmpleadoResponse])
def get_empleados(db: Session = Depends(get_db)):
    return db.query(Empleado).all()


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
