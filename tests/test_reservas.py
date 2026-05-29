from datetime import datetime, timedelta
from decimal import Decimal

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


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
        "nombre": "Sala Reserva",
        "tematica": "Misterio",
        "dificultad": "Medio",
        "capacidad_max": 6,
        "precio": "30.00"
    }
    response = client.post("/salas/", json=payload)
    assert response.status_code == 200
    return response.json()["id_sala"]


class TestReservasCreate:

    def test_create_reserva_ok(self):
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

        data = response.json()
        assert data["id_sala"] == id_sala
        assert data["id_cliente"] == id_cliente
        assert data["numero_jugadores"] == 4
        assert Decimal(data["total_pagado"]) == Decimal("120.00")
        assert "id_reserva" in data
        assert data["estado"] == "Confirmada"

    def test_create_reserva_num_jugadores_invalido(self):
        id_cliente = crear_cliente()
        id_sala = crear_sala()

        payload = {
            "id_sala": id_sala,
            "id_cliente": id_cliente,
            "id_empleado": None,
            "fecha_hora": "2026-05-29T18:00:00",
            "numero_jugadores": 1,
            "total_pagado": "120.00"
        }
        response = client.post("/reservas/", json=payload)
        assert response.status_code == 422
        # This is just an extra check for the ‘fields’ field, which I recently added in the error handling spec.
        data = response.json()
        fields = data["fields"]
        assert "fields" in data
        assert fields[0]["loc"][-1] == "numero_jugadores"
        assert "entre 2 y 6" in fields[0]["msg"]

    def test_create_reserva_faltan_campos(self):
        payload = {
            "numero_jugadores": 4
        }
        response = client.post("/reservas/", json=payload)
        assert response.status_code == 422


class TestReservasRead:

    def test_get_reservas_lista(self):
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
        client.post("/reservas/", json=payload)

        response = client.get("/reservas/")
        assert response.status_code == 200
        data = response.json()
        assert len(data) > 0
        assert data[0]["numero_jugadores"] == 4

    def test_get_reserva_por_id(self):
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
        r1 = client.post("/reservas/", json=payload)
        reserva_id = r1.json()["id_reserva"]

        response = client.get(f"/reservas/{reserva_id}")
        assert response.status_code == 200
        assert response.json()["id_reserva"] == reserva_id

    def test_get_reserva_no_existe(self):
        response = client.get("/reservas/99999")
        assert response.status_code == 404
        assert "Reserva no encontrada" in response.json()["detail"]


class TestReservasUpdate:

    def test_update_reserva_ok(self):
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
        r1 = client.post("/reservas/", json=payload)
        reserva_id = r1.json()["id_reserva"]

        update = {
            "id_sala": id_sala,
            "id_cliente": id_cliente,
            "id_empleado": 10,
            "fecha_hora": "2026-05-29T19:00:00",
            "numero_jugadores": 5,
            "total_pagado": "150.00"
        }
        response = client.put(f"/reservas/{reserva_id}", json=update)
        assert response.status_code == 200

        data = response.json()
        assert data["id_reserva"] == reserva_id
        assert data["id_empleado"] == 10
        assert data["numero_jugadores"] == 5
        assert Decimal(data["total_pagado"]) == Decimal("150.00")

    def test_update_reserva_no_existe(self):
        id_cliente = crear_cliente()
        id_sala = crear_sala()

        update = {
            "id_sala": id_sala,
            "id_cliente": id_cliente,
            "id_empleado": None,
            "fecha_hora": "2026-05-29T19:00:00",
            "numero_jugadores": 4,
            "total_pagado": "120.00"
        }
        response = client.put("/reservas/99999", json=update)
        assert response.status_code == 404


class TestReservasDelete:

    def test_delete_reserva_ok(self):
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
        r1 = client.post("/reservas/", json=payload)
        reserva_id = r1.json()["id_reserva"]

        response = client.delete(f"/reservas/{reserva_id}")
        assert response.status_code == 200
        assert response.json()["message"] == "Reserva eliminada correctamente"

        verify = client.get(f"/reservas/{reserva_id}")
        assert verify.status_code == 404

    def test_delete_reserva_no_existe(self):
        response = client.delete("/reservas/99999")
        assert response.status_code == 404