from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from core.database import Base


class Cliente(Base):
    __tablename__ = "clientes"

    id_cliente = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    apellido = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    telefono = Column(String, nullable=True)
    fecha_registro = Column(DateTime, server_default=func.now(), nullable=True)

    reservas = relationship("Reserva", back_populates="cliente")
