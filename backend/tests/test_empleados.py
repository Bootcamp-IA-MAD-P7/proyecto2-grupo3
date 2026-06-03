from fastapi.testclient import TestClient
from main import app
from core.database import Base, engine

Base.metadata.create_all(bind=engine)

client = TestClient(app)


class TestEmpleadosCreate:

    def test_create_empleado_ok(self):
        payload = {
            "nombre": "Carlos",
            "apellido": "Ruiz",
            "rol": "Game Master"
        }
        response = client.post("/api/empleados/", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["nombre"] == "Carlos"
        assert data["rol"] == "Game Master"
        assert data["activo"] is True
        assert "id_empleado" in data

    def test_create_empleado_sin_rol(self):
        payload = {
            "nombre": "Ana",
            "apellido": "Lopez"
        }
        response = client.post("/api/empleados/", json=payload)
        assert response.status_code == 200
        assert response.json()["rol"] == "Game Master"


class TestEmpleadosRead:

    def test_get_empleados_lista(self):
        payload = {
            "nombre": "Ana",
            "apellido": "Lopez",
            "rol": "Recepcionista"
        }
        client.post("/api/empleados/", json=payload)

        response = client.get("/api/empleados/")
        assert response.status_code == 200
        data = response.json()
        assert len(data["items"]) > 0
        assert data["paginacion"]["total"] > 0

    def test_get_empleado_por_id(self):
        payload = {
            "nombre": "Pedro",
            "apellido": "Gomez",
            "rol": "Game Master"
        }
        r1 = client.post("/api/empleados/", json=payload)
        emp_id = r1.json()["id_empleado"]

        response = client.get(f"/api/empleados/{emp_id}")
        assert response.status_code == 200
        assert response.json()["nombre"] == "Pedro"

    def test_get_empleado_no_existe(self):
        response = client.get("/api/empleados/99999")
        assert response.status_code == 404


class TestEmpleadosUpdate:

    def test_update_empleado_ok(self):
        payload = {
            "nombre": "Original",
            "apellido": "Apellido",
            "rol": "Game Master"
        }
        r1 = client.post("/api/empleados/", json=payload)
        emp_id = r1.json()["id_empleado"]

        update = {
            "nombre": "Actualizado",
            "apellido": "Nuevo",
            "rol": "Recepcionista",
            "activo": True
        }
        response = client.put(f"/api/empleados/{emp_id}", json=update)
        assert response.status_code == 200
        assert response.json()["nombre"] == "Actualizado"
        assert response.json()["rol"] == "Recepcionista"

    def test_update_empleado_no_existe(self):
        update = {
            "nombre": "Test",
            "apellido": "Test",
            "rol": "Game Master"
        }
        response = client.put("/api/empleados/99999", json=update)
        assert response.status_code == 404


class TestEmpleadosDelete:

    def test_delete_empleado_ok(self):
        payload = {
            "nombre": "Eliminar",
            "apellido": "Este",
            "rol": "Game Master"
        }
        r1 = client.post("/api/empleados/", json=payload)
        emp_id = r1.json()["id_empleado"]

        response = client.delete(f"/api/empleados/{emp_id}")
        assert response.status_code == 200
        assert "eliminado correctamente" in response.json()["message"]

        verify = client.get(f"/api/empleados/{emp_id}")
        assert verify.status_code == 404

    def test_delete_empleado_no_existe(self):
        response = client.delete("/api/empleados/99999")
        assert response.status_code == 404


class TestEmpleadosPaginacionFiltros:

    def test_paginacion_default(self):
        for i in range(3):
            client.post("/api/empleados/", json={
                "nombre": f"Emp{i}", "apellido": "Test", "rol": "Game Master"
            })
        response = client.get("/api/empleados/")
        assert response.status_code == 200
        data = response.json()
        assert "paginacion" in data
        assert data["paginacion"]["total"] >= 3

    def test_filtro_rol(self):
        client.post("/api/empleados/", json={
            "nombre": "RolTest", "apellido": "User", "rol": "Recepcionista"
        })
        response = client.get("/api/empleados/?rol=Recepcionista")
        assert response.status_code == 200
        data = response.json()
        assert all(item["rol"] == "Recepcionista" for item in data["items"])

    def test_filtro_activo(self):
        client.post("/api/empleados/", json={
            "nombre": "ActivoTest", "apellido": "User", "rol": "Game Master"
        })
        response = client.get("/api/empleados/?activo=true")
        assert response.status_code == 200
        data = response.json()
        assert all(item["activo"] is True for item in data["items"])
