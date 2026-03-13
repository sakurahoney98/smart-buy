from decimal import Decimal
from src.app.domain.regras_orcamento import truncar_valor_divisao


def test_truncar_valor_divisao_normal():
    # Build
    dividendo = 100
    divisor = 3

    # Operate
    resultado = truncar_valor_divisao(dividendo, divisor)

    # Check
    assert resultado == Decimal("33.33")


def test_truncar_valor_divisao_exata():
    # Build
    dividendo = 100
    divisor = 4

    # Operate
    resultado = truncar_valor_divisao(dividendo, divisor)

    # Check
    assert resultado == Decimal("25.00")