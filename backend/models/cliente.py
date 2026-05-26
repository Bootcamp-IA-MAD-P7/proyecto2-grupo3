from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from backend.core.database import Base


class Cliente(Base):
    __tablename__ = "clientes"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    telefono = Column(String, nullable=True)

    reservas = relationship("Reserva", back_populates="cliente")