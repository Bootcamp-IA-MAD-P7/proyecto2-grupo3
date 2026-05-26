from sqlalchemy import Column, DateTime, ForeignKey, Integer
from sqlalchemy.orm import relationship

from backend.core.database import Base


class Sesion(Base):
    __tablename__ = "sesiones"

    id = Column(Integer, primary_key=True, index=True)
    sala_id = Column(Integer, ForeignKey("salas.id"), nullable=False)
    fecha_hora_inicio = Column(DateTime, nullable=False)

    sala = relationship("Sala", back_populates="sesiones")
    reservas = relationship("Reserva", back_populates="sesion")