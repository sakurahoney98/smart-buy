import pytest
from src.app.domain.salario import sugestao_orcamento, SalarioInvalido


def test_sugestao_orcamento_valido():
    # Build 
    salario = 5000
    
    # Operate
    resultado = sugestao_orcamento(salario)

    # Check 
    assert resultado == 1000


def test_sugestao_orcamento_string_numerica():
    # Build 
    salario = "6000"
    
    # Operate
    resultado = sugestao_orcamento(salario)

    # Check 
    assert resultado == 1200


def test_sugestao_orcamento_salario_invalido(app):
    # Build & Operate (Integrados no context manager do pytest)
    with pytest.raises(SalarioInvalido) as excinfo:
        sugestao_orcamento("abc")
    
    # Check
    assert str(excinfo.value) == "Salário inválido"