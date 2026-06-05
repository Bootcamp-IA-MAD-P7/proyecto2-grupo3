from datetime import date, time, timedelta
from decimal import Decimal

from sqlalchemy.orm import Session

from models.sala import Sala
from models.cliente import Cliente
from models.empleado import Empleado
from models.reserva import Reserva
from models.sesion import Sesion


def seed_database(db: Session):
    """Inserta datos iniciales si las tablas están vacías."""

    if db.query(Sala).first() is not None:
        return

    # --- SALAS ---
    salas = [
        Sala(nombre="La Cripta Maldita", tematica="Terror", dificultad="Difícil", capacidad_max=6, precio=Decimal("30.00")),
        Sala(nombre="El Laboratorio Secreto", tematica="Ciencia Ficción", dificultad="Medio", capacidad_max=4, precio=Decimal("25.00")),
        Sala(nombre="La Isla Perdida", tematica="Aventura", dificultad="Fácil", capacidad_max=5, precio=Decimal("22.50")),
        Sala(nombre="El Tesoro del Faraón", tematica="Historia", dificultad="Experto", capacidad_max=6, precio=Decimal("35.00")),
        Sala(nombre="Hackeo Imposible", tematica="Tecnología", dificultad="Medio", capacidad_max=4, precio=Decimal("28.00")),
    ]
    db.add_all(salas)
    db.flush()

    # --- CLIENTES ---
    clientes = [
        Cliente(nombre="Carlos", apellido="García", email="carlos.garcia@email.com", telefono="612345678"),
        Cliente(nombre="María", apellido="López", email="maria.lopez@email.com", telefono="623456789"),
        Cliente(nombre="Pedro", apellido="Martínez", email="pedro.martinez@email.com", telefono="634567890"),
        Cliente(nombre="Laura", apellido="Fernández", email="laura.fernandez@email.com", telefono="645678901"),
        Cliente(nombre="Ana", apellido="Rodríguez", email="ana.rodriguez@email.com", telefono="656789012"),
        Cliente(nombre="Javier", apellido="Sánchez", email="javier.sanchez@email.com", telefono="667890123"),
    ]
    db.add_all(clientes)
    db.flush()

    # --- EMPLEADOS ---
    empleados = [
        Empleado(nombre="David", apellido="Ruiz", rol="Game Master", activo=True),
        Empleado(nombre="Sofía", apellido="Torres", rol="Recepcionista", activo=True),
        Empleado(nombre="Miguel", apellido="Hernández", rol="Gerente", activo=True),
        Empleado(nombre="Elena", apellido="Vega", rol="Game Master", activo=True),
    ]
    db.add_all(empleados)
    db.flush()

    # --- RESERVAS ---
    now = datetime_now()
    reservas = [
        Reserva(id_sala=salas[0].id_sala, id_cliente=clientes[0].id_cliente, id_empleado=empleados[0].id_empleado,
                fecha_hora=now + timedelta(days=1, hours=10), numero_jugadores=4, total_pagado=Decimal("30.00"), estado="Confirmada"),
        Reserva(id_sala=salas[1].id_sala, id_cliente=clientes[1].id_cliente, id_empleado=empleados[3].id_empleado,
                fecha_hora=now + timedelta(days=1, hours=14), numero_jugadores=3, total_pagado=Decimal("25.00"), estado="Confirmada"),
        Reserva(id_sala=salas[2].id_sala, id_cliente=clientes[2].id_cliente, id_empleado=empleados[0].id_empleado,
                fecha_hora=now + timedelta(days=2, hours=11), numero_jugadores=5, total_pagado=Decimal("22.50"), estado="Confirmada"),
        Reserva(id_sala=salas[3].id_sala, id_cliente=clientes[3].id_cliente, id_empleado=empleados[3].id_empleado,
                fecha_hora=now + timedelta(days=2, hours=16), numero_jugadores=6, total_pagado=Decimal("35.00"), estado="Confirmada"),
        Reserva(id_sala=salas[4].id_sala, id_cliente=clientes[4].id_cliente, id_empleado=empleados[0].id_empleado,
                fecha_hora=now + timedelta(days=3, hours=12), numero_jugadores=4, total_pagado=Decimal("28.00"), estado="Confirmada"),
    ]
    db.add_all(reservas)
    db.flush()

    # --- SESIONES (partidas jugadas) ---
    sesiones = [
        Sesion(id_reserva=reservas[0].id_reserva, fecha_partida=(now - timedelta(days=3)).date(),
               hora_inicio=time(18, 0), hora_fin=time(18, 45), escaparon=True, notas_game_master="Gran trabajo en equipo"),
        Sesion(id_reserva=reservas[1].id_reserva, fecha_partida=(now - timedelta(days=2)).date(),
               hora_inicio=time(17, 0), hora_fin=time(17, 50), escaparon=False, notas_game_master="No encontraron la pista final"),
    ]
    db.add_all(sesiones)
    db.commit()


def datetime_now():
    from datetime import datetime
    return datetime.now()
