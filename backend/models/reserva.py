from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from backend.core.database import Base


class Reserva(Base):
    __tablename__ = "reservas"

    id = Column(Integer, primary_key=True, index=True)
    cliente_id = Column(Integer, ForeignKey("clientes.id"), nullable=False)
    sesion_id = Column(Integer, ForeignKey("sesiones.id"), nullable=False)
    num_jugadores = Column(Integer, nullable=False)
    estado = Column(String, default="pendiente")

    cliente = relationship("Cliente", back_populates="reservas")
    sesion = relationship("Sesion", back_populates="reservas")