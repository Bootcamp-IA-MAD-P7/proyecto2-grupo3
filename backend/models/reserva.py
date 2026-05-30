from sqlalchemy import Column, DateTime, ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import relationship

from core.database import Base


class Reserva(Base):
    __tablename__ = "reservas"

    id_reserva = Column(Integer, primary_key=True, index=True)
    id_sala = Column(Integer, ForeignKey("salas.id_sala"), nullable=True)
    id_cliente = Column(Integer, ForeignKey("clientes.id_cliente"), nullable=True)
    id_empleado = Column(Integer, nullable=True)
    fecha_hora = Column(DateTime, nullable=False)
    numero_jugadores = Column(Integer, nullable=False)
    estado = Column(String, default="Confirmada", nullable=True)
    total_pagado = Column(Numeric, nullable=False)

    cliente = relationship("Cliente", back_populates="reservas")
    sala = relationship("Sala", back_populates="reservas")
