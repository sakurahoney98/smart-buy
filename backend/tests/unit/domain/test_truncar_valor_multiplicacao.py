from decimal import Decimal
from src.app.domain.regras_orcamento import truncar_valor_multiplicacao


def test_truncar_valor_multiplicacao_normal():
    # Build
    fator1 = 100
    fator2 = 0.7

    # Operate
    resultado = truncar_valor_multiplicacao(fator1, fator2)

    # Check
    assert resultado == Decimal("70.00")


def test_truncar_valor_multiplicacao_com_decimal():
    # Build
    fator1 = Decimal("50.50")
    fator2 = 0.3

    # Operate
    resultado = truncar_valor_multiplicacao(fator1, fator2)

    # Check
    assert resultado == Decimal("15.15")