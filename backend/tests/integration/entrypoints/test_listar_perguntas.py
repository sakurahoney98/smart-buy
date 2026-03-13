def test_listar_perguntas(client):
    # Operate
    response = client.get("/perguntas")
    data = response.get_json()

    # Check
    assert response.status_code == 200
    assert "perguntas" in data
    assert isinstance(data["perguntas"], list)