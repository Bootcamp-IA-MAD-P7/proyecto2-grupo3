from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from backend.core.database import Base


class Sala(Base):
    __tablename__ = "salas"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    capacidad_min = Column(Integer, nullable=False)
    capacidad_max = Column(Integer, nullable=False)

    sesiones = relationship("Sesion", back_populates="sala")