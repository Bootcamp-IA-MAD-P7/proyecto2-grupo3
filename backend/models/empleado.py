from sqlalchemy import Boolean, Column, Integer, String
from sqlalchemy.orm import relationship

from core.database import Base


class Empleado(Base):
    __tablename__ = "empleados"

    id_empleado = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    apellido = Column(String, nullable=False)
    rol = Column(String, default="Game Master", nullable=True)
    activo = Column(Boolean, default=True, nullable=True)
    email = Column(String, unique=True, nullable=True)
    hashed_password = Column(String, nullable=True)

    reservas = relationship("Reserva", back_populates="empleado")
