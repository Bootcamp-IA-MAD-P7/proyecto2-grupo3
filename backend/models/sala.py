from sqlalchemy import Column, Integer, Numeric, String
from sqlalchemy.orm import relationship

from backend.core.database import Base


class Sala(Base):
    __tablename__ = "salas"

    id_sala = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    tematica = Column(String, nullable=False)
    dificultad = Column(String, nullable=True)
    capacidad_max = Column(Integer, nullable=False)
    precio = Column(Numeric, nullable=False)

    reservas = relationship("Reserva", back_populates="sala")
