def test_capturar_prioridade(client):
    # Build
    payload = {
        "lista": [
            {
                "idItem": 1,
                "respostas": {
                    "URGÊNCIA": "A",
                    "IMPACTO": "B",
                    "SITUAÇÃO": "C"
                }
            }
        ]
    }

    # Operate
    response = client.post("/prioridade", json=payload)
    data = response.get_json()

    # Check
    assert response.status_code == 200
    assert "lista" in data