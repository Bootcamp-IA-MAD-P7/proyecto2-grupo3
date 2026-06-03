# tests/test_clientes.py
from fastapi.testclient import TestClient
from main import app
from core.database import Base, engine

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
        response = client.post("/api/clientes/", json=payload)
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
        r1 = client.post("/api/clientes/", json=payload)
        assert r1.status_code == 200

        r2 = client.post("/api/clientes/", json=payload)
        assert r2.status_code == 400


class TestClientesGet:

    def test_get_clientes_lista(self):
        payload = {
            "nombre": "Test",
            "apellido": "User",
            "email": "test@test.com"
        }
        client.post("/api/clientes/", json=payload)

        response = client.get("/api/clientes/")
        assert response.status_code == 200
        data = response.json()
        assert len(data["items"]) > 0
        assert data["items"][0]["nombre"] == "Test"
        assert data["paginacion"]["total"] > 0

    def test_get_cliente_por_id(self):
        payload = {
            "nombre": "Carlos",
            "apellido": "Pérez",
            "email": "carlos@test.com"
        }
        r1 = client.post("/api/clientes/", json=payload)
        cliente_id = r1.json()["id_cliente"]

        response = client.get(f"/api/clientes/{cliente_id}")
        assert response.status_code == 200
        assert response.json()["nombre"] == "Carlos"

    def test_get_cliente_no_existe(self):
        response = client.get("/api/clientes/99999")
        assert response.status_code == 404


class TestClientesUpdate:

    def test_update_cliente_ok(self):
        payload = {
            "nombre": "Original",
            "apellido": "Nombre",
            "email": "original@test.com"
        }
        r1 = client.post("/api/clientes/", json=payload)
        cliente_id = r1.json()["id_cliente"]

        update = {
            "nombre": "Actualizado",
            "apellido": "Nuevo",
            "email": "actualizado@test.com"
        }
        response = client.put(f"/api/clientes/{cliente_id}", json=update)
        assert response.status_code == 200
        assert response.json()["nombre"] == "Actualizado"

    def test_update_cliente_no_existe(self):
        update = {
            "nombre": "Test",
            "apellido": "Test",
            "email": "test@test.com"
        }
        response = client.put("/api/clientes/99999", json=update)
        assert response.status_code == 404


class TestClientesDelete:

    def test_delete_cliente_ok(self):
        payload = {
            "nombre": "Borrar",
            "apellido": "Este",
            "email": "borrar@test.com"
        }
        r1 = client.post("/api/clientes/", json=payload)
        cliente_id = r1.json()["id_cliente"]

        response = client.delete(f"/api/clientes/{cliente_id}")
        assert response.status_code == 200
        assert "Cliente eliminado correctamente" in response.json()["message"]

        verify = client.get(f"/api/clientes/{cliente_id}")
        assert verify.status_code == 404

    def test_delete_cliente_no_existe(self):
        response = client.delete("/api/clientes/99999")
        assert response.status_code == 404


class TestClientesPaginacionFiltros:

    def test_paginacion_default(self):
        for i in range(5):
            client.post("/api/clientes/", json={
                "nombre": f"Pag{i}", "apellido": "Test", "email": f"pag{i}@test.com"
            })
        response = client.get("/api/clientes/")
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "paginacion" in data
        assert data["paginacion"]["page"] == 1
        assert data["paginacion"]["limit"] == 10
        assert data["paginacion"]["total"] >= 5

    def test_paginacion_limit(self):
        for i in range(3):
            client.post("/api/clientes/", json={
                "nombre": f"Lim{i}", "apellido": "User", "email": f"lim{i}@test.com"
            })
        response = client.get("/api/clientes/?limit=2")
        assert response.status_code == 200
        data = response.json()
        assert data["paginacion"]["limit"] == 2
        assert len(data["items"]) <= 2

    def test_filtro_nombre(self):
        client.post("/api/clientes/", json={
            "nombre": "Buscame", "apellido": "Filter", "email": "buscame@test.com"
        })
        response = client.get("/api/clientes/?nombre=Buscame")
        assert response.status_code == 200
        data = response.json()
        assert all("Buscame" in item["nombre"] for item in data["items"])

    def test_filtro_email(self):
        client.post("/api/clientes/", json={
            "nombre": "Email", "apellido": "Test", "email": "unico_email@test.com"
        })
        response = client.get("/api/clientes/?email=unico_email@test.com")
        assert response.status_code == 200
        data = response.json()
        assert any(item["email"] == "unico_email@test.com" for item in data["items"])