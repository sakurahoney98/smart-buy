def test_capturar_cronograma(client):
    # Build
    payload = {
        "dados": {
            "credito": 2000,
            "orcamento": 1000,
            "itens": [],
            "mes": 1,
            "ano": 2025
        }
    }

    # Operate
    response = client.post("/cronograma", json=payload)
    data = response.get_json()

    # Check
    assert response.status_code == 200
    assert "cronograma" in data