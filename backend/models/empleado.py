from sqlalchemy import Boolean, Column, Integer, String

from core.database import Base


class Empleado(Base):
    __tablename__ = "empleados"

    id_empleado = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    apellido = Column(String, nullable=False)
    rol = Column(String, default="Game Master", nullable=True)
    activo = Column(Boolean, default=True, nullable=True)
