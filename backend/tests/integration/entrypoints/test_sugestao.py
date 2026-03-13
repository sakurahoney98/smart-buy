def test_sugestao(client):
    # Build
    payload = {
        "salario": 5000
    }

    # Operate
    response = client.post("/sugestao", json=payload)
    data = response.get_json()

    # Check
    assert response.status_code == 200
    assert "sugestao" in data