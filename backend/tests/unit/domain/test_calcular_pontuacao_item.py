import pytest
from src.app.domain.priorizacao import  calcular_pontuacao_item
    
def test_calcular_pontuacao_item():
    # Build
    item = {
            "idItem": 1,
             "respostas": {
               "URGÊNCIA": "A",
                "IMPACTO": "B",
               "SITUAÇÃO": "C"
           }
        }
    
    # Operate
    resultado = calcular_pontuacao_item(item)
    
    # Check
    assert resultado == 12
    
def test_calcular_pontuacao_item_opcao_invalida():
    # Build
    item = {
            "idItem": 1,
             "respostas": {
               "URGÊNCIA": "X",
                "IMPACTO": "B",
               "SITUAÇÃO": "C"
           }
        }
    
    # Operate
    with pytest.raises(ValueError) as excinfo:
        calcular_pontuacao_item(item)

    # Check
    assert "Resposta inválida: X" in str(excinfo.value)