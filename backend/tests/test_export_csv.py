from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_export_reservas_csv():
    response = client.get("/export/reservas/csv")

    assert response.status_code == 200
    assert "text/csv" in response.headers["content-type"]
    assert "attachment; filename=reservas.csv" in response.headers["content-disposition"]

    content = response.text

    assert "id_reserva" in content
    assert "id_sala" in content
    assert "id_cliente" in content
    assert "fecha_hora" in content
    assert "total_pagado" in content