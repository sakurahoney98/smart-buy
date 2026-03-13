from decimal import Decimal
from src.app.domain.regras_orcamento import valor_parcelas


def test_valor_parcelas_divisao_exata():
    # Build
    valor = Decimal("100")
    parcelas = 4

    # Operate
    resultado = valor_parcelas(valor, parcelas)

    # Check
    assert resultado == [
        Decimal("25.00"),
        Decimal("25.00"),
        Decimal("25.00"),
        Decimal("25.00"),
    ]


def test_valor_parcelas_com_resto():
    # Build
    valor = Decimal("100")
    parcelas = 3

    # Operate
    resultado = valor_parcelas(valor, parcelas)

    # Check
    assert resultado == [
        Decimal("33.33"),
        Decimal("33.33"),
        Decimal("33.34"),
    ]