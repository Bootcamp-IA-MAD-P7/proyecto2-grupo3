# tests/test_salas.py
from decimal import Decimal
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


class TestSalasCreate:

    def test_create_sala_ok(self):
        payload = {
            "nombre": "La Cripta",
            "tematica": "Terror",
            "dificultad": "Medio",
            "capacidad_max": 4,
            "precio": "25.50"
        }
        response = client.post("/salas/", json=payload)
        assert response.status_code == 200
        data = response.json()
        # This is a first where I check all the data, usually I just check a few fields
        # but I want to be sure that all the data is correct only in this case
        assert data["nombre"] == payload["nombre"]
        assert data["tematica"] == payload["tematica"]
        assert data["dificultad"] == payload["dificultad"]
        assert data["capacidad_max"] == payload["capacidad_max"]
        assert Decimal(data["precio"]) == Decimal(payload["precio"])
        assert "id_sala" in data

    def test_create_sala_sin_dificultad(self):
        payload = {
            "nombre": "Refugio",
            "tematica": "Misterio",
            "capacidad_max": 6,
            "precio": "30.00"
        }
        # Check whether the difficulty field is accepted when it is not provided, since it is optional.
        response = client.post("/salas/", json=payload)
        assert response.status_code == 200
        assert response.json()["dificultad"] is None

    def test_create_sala_dificultad_invalida(self):
        payload = {
            "nombre": "Test",
            "tematica": "Test",
            "dificultad": "Imposible",
            "capacidad_max": 4,
            "precio": "25.00"
        }
        # Checking the difficulty constraint, since there are only 4 predefined options.
        response = client.post("/salas/", json=payload)
        assert response.status_code == 422

    def test_create_sala_falta_nombre(self):
        payload = {
            "tematica": "Test",
            "capacidad_max": 4,
            "precio": "25.00"
        }
        # Check that the name is not omitted, since it is required.
        response = client.post("/salas/", json=payload)
        assert response.status_code == 422


class TestSalasRead:

    def test_get_salas_lista(self):
        payload = {
            "nombre": "Test Sala",
            "tematica": "Ciencia",
            "capacidad_max": 5,
            "precio": "35.00"
        }
        client.post("/salas/", json=payload)

        response = client.get("/salas/")
        assert response.status_code == 200
        data = response.json()
        assert len(data) > 0
        assert data[0]["nombre"] == "Test Sala"

    def test_get_sala_por_id(self):
        payload = {
            "nombre": "Sala Especial",
            "tematica": "Aventura",
            "capacidad_max": 8,
            "precio": "50.00"
        }
        r1 = client.post("/salas/", json=payload)
        sala_id = r1.json()["id_sala"]

        response = client.get(f"/salas/{sala_id}")
        assert response.status_code == 200
        assert response.json()["nombre"] == "Sala Especial"

    def test_get_sala_no_existe(self):
        response = client.get("/salas/99999")
        assert response.status_code == 404
        assert "Sala no encontrada" in response.json()["detail"]


class TestSalasUpdate:

    def test_update_sala_ok(self):
        payload = {
            "nombre": "Original",
            "tematica": "Terror",
            "capacidad_max": 4,
            "precio": "25.00"
        }
        r1 = client.post("/salas/", json=payload)
        sala_id = r1.json()["id_sala"]

        update = {
            "nombre": "Actualizada",
            "tematica": "Comedia",
            "dificultad": "Fácil",
            "capacidad_max": 6,
            "precio": "40.00"
        }
        response = client.put(f"/salas/{sala_id}", json=update)
        assert response.status_code == 200
        data = response.json()
        assert data["nombre"] == "Actualizada"
        assert data["capacidad_max"] == 6

    def test_update_sala_no_existe(self):
        update = {
            "nombre": "Test",
            "tematica": "Test",
            "capacidad_max": 4,
            "precio": "25.00"
        }
        response = client.put("/salas/99999", json=update)
        assert response.status_code == 404


class TestSalasDelete:

    def test_delete_sala_ok(self):
        payload = {
            "nombre": "Borrar",
            "tematica": "Temporal",
            "capacidad_max": 2,
            "precio": "10.00"
        }
        r1 = client.post("/salas/", json=payload)
        sala_id = r1.json()["id_sala"]

        response = client.delete(f"/salas/{sala_id}")
        assert response.status_code == 200
        assert response.json()["message"] == "Sala eliminada correctamente"

        # Just a second check to be sure that the sala was really deleted
        verify = client.get(f"/salas/{sala_id}")
        assert verify.status_code == 404

    def test_delete_sala_no_existe(self):
        response = client.delete("/salas/99999")
        assert response.status_code == 404