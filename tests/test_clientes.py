# tests/test_clientes.py
from fastapi.testclient import TestClient
from backend.main import app
from backend.core.database import Base, engine

client = TestClient(app)

# Make sure the database tables are created before running tests
Base.metadata.create_all(bind=engine)


class TestClientesCreate:

    def test_create_cliente_ok(self):
        payload = {
            "nombre": "Juan",
            "apellido": "García",
            "email": "juan@test.com",
            "telefono": "123456789"
        }
        response = client.post("/clientes/", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["nombre"] == "Juan"
        assert data["email"] == "juan@test.com"
        assert "id_cliente" in data

    def test_create_cliente_email_duplicado(self):
        payload = {
            "nombre": "Ana",
            "apellido": "López",
            "email": "dupli@test.com"
        }
        # Trying a dup
        r1 = client.post("/clientes/", json=payload)
        assert r1.status_code == 200

        r2 = client.post("/clientes/", json=payload)
        assert r2.status_code == 400


class TestClientesGet:

    def test_get_clientes_lista(self):
        payload = {
            "nombre": "Test",
            "apellido": "User",
            "email": "test@test.com"
        }
        client.post("/clientes/", json=payload)

        response = client.get("/clientes/")
        assert response.status_code == 200
        data = response.json()
        assert len(data) > 0
        assert data[0]["nombre"] == "Test"

    def test_get_cliente_por_id(self):
        payload = {
            "nombre": "Carlos",
            "apellido": "Pérez",
            "email": "carlos@test.com"
        }
        r1 = client.post("/clientes/", json=payload)
        cliente_id = r1.json()["id_cliente"]

        response = client.get(f"/clientes/{cliente_id}")
        assert response.status_code == 200
        assert response.json()["nombre"] == "Carlos"

    def test_get_cliente_no_existe(self):
        response = client.get("/clientes/99999")
        assert response.status_code == 404
        assert "Cliente no encontrado" in response.json()["detail"]


class TestClientesUpdate:

    def test_update_cliente_ok(self):
        payload = {
            "nombre": "Original",
            "apellido": "Nombre",
            "email": "original@test.com"
        }
        r1 = client.post("/clientes/", json=payload)
        cliente_id = r1.json()["id_cliente"]

        update = {
            "nombre": "Actualizado",
            "apellido": "Nuevo",
            "email": "actualizado@test.com"
        }
        response = client.put(f"/clientes/{cliente_id}", json=update)
        assert response.status_code == 200
        assert response.json()["nombre"] == "Actualizado"

    def test_update_cliente_no_existe(self):
        update = {
            "nombre": "Test",
            "apellido": "Test",
            "email": "test@test.com"
        }
        response = client.put("/clientes/99999", json=update)
        assert response.status_code == 404


class TestClientesDelete:

    def test_delete_cliente_ok(self):
        payload = {
            "nombre": "Borrar",
            "apellido": "Este",
            "email": "borrar@test.com"
        }
        r1 = client.post("/clientes/", json=payload)
        cliente_id = r1.json()["id_cliente"]

        response = client.delete(f"/clientes/{cliente_id}")
        assert response.status_code == 200
        assert "Cliente eliminado correctamente" in response.json()["message"]

        verify = client.get(f"/clientes/{cliente_id}")
        assert verify.status_code == 404

    def test_delete_cliente_no_existe(self):
        response = client.delete("/clientes/99999")
        assert response.status_code == 404