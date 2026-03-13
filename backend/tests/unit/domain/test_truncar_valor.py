from decimal import Decimal
from src.app.domain.regras_orcamento import truncar_valor


def test_truncar_valor_float():
    # Build
    valor = 10.567

    # Operate
    resultado = truncar_valor(valor)

    # Check
    assert resultado == Decimal("10.56")


def test_truncar_valor_int():
    # Build
    valor = 10

    # Operate
    resultado = truncar_valor(valor)

    # Check
    assert resultado == Decimal("10.00")


def test_truncar_valor_decimal():
    # Build
    valor = Decimal("15.999")

    # Operate
    resultado = truncar_valor(valor)

    # Check
    assert resultado == Decimal("15.99")
    
def truncar_valor_dizima():
    # Build
    valor = Decimal("1000.1499999")

    # Operate
    resultado = truncar_valor(valor)

    # Check
    assert resultado == Decimal("1000.14")
    