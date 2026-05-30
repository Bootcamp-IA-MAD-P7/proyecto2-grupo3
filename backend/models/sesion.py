from sqlalchemy import Boolean, Column, Computed, Date, ForeignKey, Integer, Interval, Text, Time

from core.database import Base


class Sesion(Base):
    __tablename__ = "registros_partidas"

    id_partida = Column(Integer, primary_key=True, index=True)
    id_reserva = Column(Integer, ForeignKey("reservas.id_reserva"), nullable=True)
    fecha_partida = Column(Date, nullable=False)
    hora_inicio = Column(Time, nullable=False)
    hora_fin = Column(Time, nullable=False)
    tiempo_escape = Column(Interval, Computed("hora_fin - hora_inicio"), nullable=True)
    escaparon = Column(Boolean, nullable=False)
    notas_game_master = Column(Text, nullable=True)
