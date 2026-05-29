# tests/test_sesiones.py
from datetime import datetime, timedelta
from decimal import Decimal

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


def parse_timedelta(s: str) -> timedelta:
    """
    Convert common interval representations (e.g. "0:45:00", "1 day, 0:45:00", "0:45:00.000000")
    into a datetime.timedelta. Returns None if s is None.
    """
    if s is None:
        return None
    s = str(s)
    if "day" in s:
        parts = s.split(",")
        s = parts[-1].strip()
    # No ms support, solo h:m:s
    time_part = s.split(".")[0]
    hms = time_part.split(":")
    try:
        if len(hms) == 3:
            h, m, sec = hms
            return timedelta(hours=int(h), minutes=int(m), seconds=int(sec))
        elif len(hms) == 2:
            m, sec = hms
            return timedelta(minutes=int(m), seconds=int(sec))
        else:
            # float secs
            secs = float(s)
            return timedelta(seconds=secs)
    except Exception as e:
        raise ValueError(f"Formato desconocido para timedelta: {s}") from e


def crear_cliente():
    payload = {
        "nombre": "Juan",
        "apellido": "Pérez",
        "email": f"juan{datetime.now().timestamp()}@test.com",
        "telefono": "123456789"
    }
    response = client.post("/clientes/", json=payload)
    assert response.status_code == 200
    return response.json()["id_cliente"]


def crear_sala():
    payload = {
        "nombre": "Sala Sesión",
        "tematica": "Misterio",
        "dificultad": "Medio",
        "capacidad_max": 6,
        "precio": "30.00"
    }
    response = client.post("/salas/", json=payload)
    assert response.status_code == 200
    return response.json()["id_sala"]


def crear_reserva():
    id_cliente = crear_cliente()
    id_sala = crear_sala()

    payload = {
        "id_sala": id_sala,
        "id_cliente": id_cliente,
        "id_empleado": None,
        "fecha_hora": "2026-05-29T18:00:00",
        "numero_jugadores": 4,
        "total_pagado": "120.00"
    }
    response = client.post("/reservas/", json=payload)
    assert response.status_code == 200
    return response.json()["id_reserva"]


class TestSesionesCreate:

    def test_create_sesion_ok(self):
        id_reserva = crear_reserva()

        payload = {
            "id_reserva": id_reserva,
            "fecha_partida": "2026-05-29",
            "hora_inicio": "18:00:00",
            "hora_fin": "18:45:00",
            "escaparon": True,
            "notas_game_master": "Buena partida"
        }
        response = client.post("/sesiones/", json=payload)
        assert response.status_code == 200

        data = response.json()
        assert data["id_reserva"] == id_reserva
        assert data["fecha_partida"] == "2026-05-29"
        assert data["hora_inicio"] == "18:00:00"
        assert data["hora_fin"] == "18:45:00"
        assert data["escaparon"] is True
        assert data["notas_game_master"] == "Buena partida"
        assert "id_partida" in data

        # check tiempo de escape if the case
        resp_te = data.get("tiempo_escape", None)
        if resp_te is not None:
            hi = datetime.fromisoformat(data["fecha_partida"] + "T" + data["hora_inicio"])
            hf = datetime.fromisoformat(data["fecha_partida"] + "T" + data["hora_fin"])
            expected = hf - hi
            resp_td = parse_timedelta(resp_te)
            assert resp_td == expected

    def test_create_sesion_falta_campo(self):
        payload = {"escaparon": True}
        response = client.post("/sesiones/", json=payload)
        assert response.status_code == 422


class TestSesionesRead:

    def test_get_sesiones_lista(self):
        id_reserva = crear_reserva()

        payload = {
            "id_reserva": id_reserva,
            "fecha_partida": "2026-05-29",
            "hora_inicio": "18:00:00",
            "hora_fin": "18:45:00",
            "escaparon": True,
            "notas_game_master": "Buena partida"
        }
        client.post("/sesiones/", json=payload)

        response = client.get("/sesiones/")
        assert response.status_code == 200
        data = response.json()
        assert len(data) > 0
        assert data[0]["escaparon"] is True

    def test_get_sesion_por_id(self):
        id_reserva = crear_reserva()

        payload = {
            "id_reserva": id_reserva,
            "fecha_partida": "2026-05-29",
            "hora_inicio": "18:00:00",
            "hora_fin": "18:45:00",
            "escaparon": False,
            "notas_game_master": "No escaparon"
        }
        r1 = client.post("/sesiones/", json=payload)
        sesion_id = r1.json()["id_partida"]

        response = client.get(f"/sesiones/{sesion_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id_partida"] == sesion_id

        resp_te = data.get("tiempo_escape", None)
        if resp_te is not None:
            hi = datetime.fromisoformat(data["fecha_partida"] + "T" + data["hora_inicio"])
            hf = datetime.fromisoformat(data["fecha_partida"] + "T" + data["hora_fin"])
            expected = hf - hi
            resp_td = parse_timedelta(resp_te)
            assert resp_td == expected

    def test_get_sesion_no_existe(self):
        response = client.get("/sesiones/99999")
        assert response.status_code == 404
        assert "Sesión no encontrada" in response.json()["detail"]


class TestSesionesUpdate:

    def test_update_sesion_ok(self):
        id_reserva = crear_reserva()

        payload = {
            "id_reserva": id_reserva,
            "fecha_partida": "2026-05-29",
            "hora_inicio": "18:00:00",
            "hora_fin": "18:45:00",
            "escaparon": False,
            "notas_game_master": "Partida original"
        }
        r1 = client.post("/sesiones/", json=payload)
        sesion_id = r1.json()["id_partida"]

        update = {
            "id_reserva": id_reserva,
            "fecha_partida": "2026-05-30",
            "hora_inicio": "19:00:00",
            "hora_fin": "19:50:00",
            "escaparon": True,
            "notas_game_master": "Actualizada"
        }
        response = client.put(f"/sesiones/{sesion_id}", json=update)
        assert response.status_code == 200

        data = response.json()
        assert data["id_partida"] == sesion_id
        assert data["escaparon"] is True
        assert data["notas_game_master"] == "Actualizada"

        resp_te = data.get("tiempo_escape", None)
        if resp_te is not None:
            hi = datetime.fromisoformat(data["fecha_partida"] + "T" + data["hora_inicio"])
            hf = datetime.fromisoformat(data["fecha_partida"] + "T" + data["hora_fin"])
            expected = hf - hi
            resp_td = parse_timedelta(resp_te)
            assert resp_td == expected

    def test_update_sesion_no_existe(self):
        id_reserva = crear_reserva()

        update = {
            "id_reserva": id_reserva,
            "fecha_partida": "2026-05-30",
            "hora_inicio": "19:00:00",
            "hora_fin": "19:50:00",
            "escaparon": True,
            "notas_game_master": "Actualizada"
        }
        response = client.put("/sesiones/99999", json=update)
        assert response.status_code == 404


class TestSesionesDelete:

    def test_delete_sesion_ok(self):
        id_reserva = crear_reserva()

        payload = {
            "id_reserva": id_reserva,
            "fecha_partida": "2026-05-29",
            "hora_inicio": "18:00:00",
            "hora_fin": "18:45:00",
            "escaparon": True,
            "notas_game_master": "Para borrar"
        }
        r1 = client.post("/sesiones/", json=payload)
        sesion_id = r1.json()["id_partida"]

        response = client.delete(f"/sesiones/{sesion_id}")
        assert response.status_code == 200
        assert response.json()["message"] == "Sesión eliminada correctamente"

        verify = client.get(f"/sesiones/{sesion_id}")
        assert verify.status_code == 404

    def test_delete_sesion_no_existe(self):
        response = client.delete("/sesiones/99999")
        assert response.status_code == 404