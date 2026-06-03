from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from core.database import get_db
from models.cliente import Cliente
from models.reserva import Reserva
from schemas.cliente import ClienteConReservas, ClienteCreate, ClientePage, ClienteResponse
from schemas.paginacion import Paginacion

router = APIRouter(prefix="/clientes", tags=["Clientes"])


@router.post("/", response_model=ClienteResponse)
def create_cliente(cliente: ClienteCreate, db: Session = Depends(get_db)):
    db_cliente = Cliente(**cliente.model_dump())
    db.add(db_cliente)
    db.commit()
    db.refresh(db_cliente)
    return db_cliente


@router.get("/", response_model=ClientePage)
def get_clientes(
    page: int = Query(1, ge=1, description="Número de página"),
    limit: int = Query(10, ge=1, le=100, description="Elementos por página"),
    nombre: str | None = Query(None, description="Filtrar por nombre (contiene)"),
    apellido: str | None = Query(None, description="Filtrar por apellido (contiene)"),
    email: str | None = Query(None, description="Filtrar por email (contiene)"),
    db: Session = Depends(get_db),
):
    query = db.query(Cliente)

    if nombre:
        query = query.filter(Cliente.nombre.ilike(f"%{nombre}%"))
    if apellido:
        query = query.filter(Cliente.apellido.ilike(f"%{apellido}%"))
    if email:
        query = query.filter(Cliente.email.ilike(f"%{email}%"))

    total = query.count()
    items = query.order_by(Cliente.apellido, Cliente.nombre).offset((page - 1) * limit).limit(limit).all()

    return ClientePage(
        items=items,
        paginacion=Paginacion(
            page=page,
            limit=limit,
            total=total,
            total_pages=(total + limit - 1) // limit if total else 0,
        ),
    )


@router.get("/{cliente_id}", response_model=ClienteConReservas)
def get_cliente(cliente_id: int, db: Session = Depends(get_db)):
    cliente = db.query(Cliente).filter(Cliente.id_cliente == cliente_id).first()

    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")

    reservas = db.query(Reserva).filter(Reserva.id_cliente == cliente_id).order_by(Reserva.fecha_hora.desc()).all()

    return ClienteConReservas(
        id_cliente=cliente.id_cliente,
        nombre=cliente.nombre,
        apellido=cliente.apellido,
        email=cliente.email,
        telefono=cliente.telefono,
        fecha_registro=cliente.fecha_registro,
        reservas=reservas,
    )


@router.put("/{cliente_id}", response_model=ClienteResponse)
def update_cliente(cliente_id: int, data: ClienteCreate, db: Session = Depends(get_db)):
    cliente = db.query(Cliente).filter(Cliente.id_cliente == cliente_id).first()

    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")

    for key, value in data.model_dump().items():
        setattr(cliente, key, value)

    db.commit()
    db.refresh(cliente)
    return cliente


@router.delete("/{cliente_id}")
def delete_cliente(cliente_id: int, db: Session = Depends(get_db)):
    cliente = db.query(Cliente).filter(Cliente.id_cliente == cliente_id).first()

    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")

    db.delete(cliente)
    db.commit()
    return {"message": "Cliente eliminado correctamente"}
