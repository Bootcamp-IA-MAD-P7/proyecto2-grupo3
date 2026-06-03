from datetime import datetime, timedelta
from decimal import Decimal

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def fecha_futura(hours: int = 0) -> str:
    return (datetime.now() + timedelta(days=1, hours=hours)).isoformat()


def crear_cliente():
    payload = {
        "nombre": "Juan",
        "apellido": "Pérez",
        "email": f"juan{datetime.now().timestamp()}@test.com",
        "telefono": "123456789"
    }
    response = client.post("/api/clientes/", json=payload)
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
    response = client.post("/api/salas/", json=payload)
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
            "fecha_hora": fecha_futura(),
            "numero_jugadores": 4,
            "total_pagado": "120.00"
        }
        response = client.post("/api/reservas/", json=payload)
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
            "fecha_hora": fecha_futura(),
            "numero_jugadores": 1,
            "total_pagado": "120.00"
        }
        response = client.post("/api/reservas/", json=payload)
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
        response = client.post("/api/reservas/", json=payload)
        assert response.status_code == 422

    def test_create_reserva_fecha_pasada(self):
        id_cliente = crear_cliente()
        id_sala = crear_sala()

        payload = {
            "id_sala": id_sala,
            "id_cliente": id_cliente,
            "id_empleado": None,
            "fecha_hora": (datetime.now() - timedelta(days=1)).isoformat(),
            "numero_jugadores": 4,
            "total_pagado": "120.00"
        }
        response = client.post("/api/reservas/", json=payload)
        assert response.status_code == 400
        assert "fechas u horas pasadas" in response.json()["detail"]


class TestReservasRead:

    def test_get_reservas_lista(self):
        id_cliente = crear_cliente()
        id_sala = crear_sala()

        payload = {
            "id_sala": id_sala,
            "id_cliente": id_cliente,
            "id_empleado": None,
            "fecha_hora": fecha_futura(),
            "numero_jugadores": 4,
            "total_pagado": "120.00"
        }
        client.post("/api/reservas/", json=payload)

        response = client.get("/api/reservas/")
        assert response.status_code == 200
        data = response.json()
        assert len(data["items"]) > 0
        assert data["items"][0]["numero_jugadores"] == 4
        assert data["paginacion"]["total"] > 0

    def test_get_reserva_por_id(self):
        id_cliente = crear_cliente()
        id_sala = crear_sala()

        payload = {
            "id_sala": id_sala,
            "id_cliente": id_cliente,
            "id_empleado": None,
            "fecha_hora": fecha_futura(),
            "numero_jugadores": 4,
            "total_pagado": "120.00"
        }
        r1 = client.post("/api/reservas/", json=payload)
        reserva_id = r1.json()["id_reserva"]

        response = client.get(f"/api/reservas/{reserva_id}")
        assert response.status_code == 200
        assert response.json()["id_reserva"] == reserva_id

    def test_get_reserva_no_existe(self):
        response = client.get("/api/reservas/99999")
        assert response.status_code == 404


class TestReservasUpdate:

    def test_update_reserva_ok(self):
        id_cliente = crear_cliente()
        id_sala = crear_sala()

        payload = {
            "id_sala": id_sala,
            "id_cliente": id_cliente,
            "id_empleado": None,
            "fecha_hora": fecha_futura(),
            "numero_jugadores": 4,
            "total_pagado": "120.00"
        }
        r1 = client.post("/api/reservas/", json=payload)
        reserva_id = r1.json()["id_reserva"]

        update = {
            "id_sala": id_sala,
            "id_cliente": id_cliente,
            "id_empleado": 10,
            "fecha_hora": fecha_futura(hours=1),
            "numero_jugadores": 5,
            "total_pagado": "150.00"
        }
        response = client.put(f"/api/reservas/{reserva_id}", json=update)
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
            "fecha_hora": fecha_futura(hours=1),
            "numero_jugadores": 4,
            "total_pagado": "120.00"
        }
        response = client.put("/api/reservas/99999", json=update)
        assert response.status_code == 404

    def test_update_reserva_fecha_pasada(self):
        id_cliente = crear_cliente()
        id_sala = crear_sala()

        payload = {
            "id_sala": id_sala,
            "id_cliente": id_cliente,
            "id_empleado": None,
            "fecha_hora": fecha_futura(),
            "numero_jugadores": 4,
            "total_pagado": "120.00"
        }
        reserva = client.post("/api/reservas/", json=payload)
        reserva_id = reserva.json()["id_reserva"]

        payload["fecha_hora"] = (datetime.now() - timedelta(days=1)).isoformat()
        response = client.put(f"/api/reservas/{reserva_id}", json=payload)
        assert response.status_code == 400
        assert "fechas u horas pasadas" in response.json()["detail"]


class TestReservasDelete:

    def test_delete_reserva_ok(self):
        id_cliente = crear_cliente()
        id_sala = crear_sala()

        payload = {
            "id_sala": id_sala,
            "id_cliente": id_cliente,
            "id_empleado": None,
            "fecha_hora": fecha_futura(),
            "numero_jugadores": 4,
            "total_pagado": "120.00"
        }
        r1 = client.post("/api/reservas/", json=payload)
        reserva_id = r1.json()["id_reserva"]

        response = client.delete(f"/api/reservas/{reserva_id}")
        assert response.status_code == 200
        assert response.json()["message"] == "Reserva eliminada correctamente"

        verify = client.get(f"/api/reservas/{reserva_id}")
        assert verify.status_code == 404

    def test_delete_reserva_no_existe(self):
        response = client.delete("/api/reservas/99999")
        assert response.status_code == 404


class TestReservasPaginacionFiltros:

    def test_paginacion_default(self):
        cid = crear_cliente()
        sid = crear_sala()
        for i in range(3):
            client.post("/api/reservas/", json={
                "id_sala": sid, "id_cliente": cid, "fecha_hora": fecha_futura(hours=i),
                "numero_jugadores": 2, "total_pagado": "60.00"
            })
        response = client.get("/api/reservas/")
        assert response.status_code == 200
        data = response.json()
        assert "paginacion" in data
        assert data["paginacion"]["total"] >= 3

    def test_filtro_id_cliente(self):
        cid = crear_cliente()
        sid = crear_sala()
        client.post("/api/reservas/", json={
            "id_sala": sid, "id_cliente": cid, "fecha_hora": fecha_futura(),
            "numero_jugadores": 2, "total_pagado": "50.00"
        })
        response = client.get(f"/api/reservas/?id_cliente={cid}")
        assert response.status_code == 200
        data = response.json()
        assert all(item["id_cliente"] == cid for item in data["items"])

    def test_filtro_estado(self):
        cid = crear_cliente()
        sid = crear_sala()
        client.post("/api/reservas/", json={
            "id_sala": sid, "id_cliente": cid, "fecha_hora": fecha_futura(),
            "numero_jugadores": 2, "total_pagado": "50.00"
        })
        response = client.get("/api/reservas/?estado=Confirmada")
        assert response.status_code == 200
        data = response.json()
        assert all(item["estado"] == "Confirmada" for item in data["items"])
