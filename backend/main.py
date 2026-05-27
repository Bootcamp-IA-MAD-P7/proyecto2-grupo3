from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.core.database import SessionLocal, engine, Base
from backend.models.cliente import Cliente
from backend.schemas.cliente import ClienteCreate, ClienteResponse

# Crear tablas automáticamente (desactivado temporalmente)
# Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Escape Rooms API",
    description="API REST para la gestion de un negocio de escape rooms",
    version="1.0.0",
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "OK"}


@app.post("/clientes", response_model=ClienteResponse, tags=["Clientes"])
def crear_cliente(cliente: ClienteCreate, db: Session = Depends(get_db)):

    nuevo_cliente = Cliente(
        nombre=cliente.nombre,
        email=cliente.email,
        telefono=cliente.telefono
    )

    db.add(nuevo_cliente)
    db.commit()
    db.refresh(nuevo_cliente)

    return nuevo_cliente


@app.get("/clientes", response_model=list[ClienteResponse], tags=["Clientes"])
def listar_clientes(db: Session = Depends(get_db)):

    clientes = db.query(Cliente).all()

    return clientes


@app.get("/clientes/{cliente_id}", response_model=ClienteResponse, tags=["Clientes"])
def obtener_cliente(cliente_id: int, db: Session = Depends(get_db)):

    cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()

    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")

    return cliente


@app.put("/clientes/{cliente_id}", response_model=ClienteResponse, tags=["Clientes"])
def actualizar_cliente(
    cliente_id: int,
    cliente_actualizado: ClienteCreate,
    db: Session = Depends(get_db)
):

    cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()

    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")

    cliente.nombre = cliente_actualizado.nombre
    cliente.email = cliente_actualizado.email
    cliente.telefono = cliente_actualizado.telefono

    db.commit()
    db.refresh(cliente)

    return cliente


@app.delete("/clientes/{cliente_id}", tags=["Clientes"])
def eliminar_cliente(cliente_id: int, db: Session = Depends(get_db)):

    cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()

    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")

    db.delete(cliente)
    db.commit()

    return {"message": "Cliente eliminado correctamente"}