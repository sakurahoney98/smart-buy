import pytest
from src.app.domain.priorizacao import priorizar_itens
    
    
def test_priorizar_itens():
    # Build
    itens = [
        {
            "idItem": 1,
            "respostas": {
                "URGÊNCIA": "A",
                "IMPACTO": "A",
                "SITUAÇÃO": "A"
            }
        },
        {
            "idItem": 2,
            "respostas": {
                "URGÊNCIA": "C",
                "IMPACTO": "C",
                "SITUAÇÃO": "C"
            }
        }
    ]

    # Operate
    resultado = priorizar_itens(itens)

    # Check
    assert resultado == [
        {"idItem": 1, "prioridade": 1},
        {"idItem": 2, "prioridade": 3}
    ]
    
def test_priorizar_itens_lista_vazia():
    # Build
    itens = [
    
    ]

    # Operate
    resultado = priorizar_itens(itens)

    # Check
    assert resultado == []
    
def test_priorizar_um_item():
    # Build
    itens = [
        {
            "idItem": 1,
            "respostas": {
                "URGÊNCIA": "A",
                "IMPACTO": "A",
                "SITUAÇÃO": "A"
            }
        }
    ]

    # Operate
    resultado = priorizar_itens(itens)

    # Check
    assert resultado == [
        {"idItem": 1, "prioridade": 1},
    ]
    
def test_priorizar_item_resposta_invalida():
    # Build
    itens = [
        {
            "idItem": 1,
            "respostas": {
                "URGÊNCIA": "X",
                "IMPACTO": "A",
                "SITUAÇÃO": "A"
            }
        }
    ]

    # Operate
    with pytest.raises(ValueError) as excinfo:
        priorizar_itens(itens)

    # Check
    assert "Resposta inválida: X" in str(excinfo.value)