from decimal import Decimal
from src.app.service_layer.cronograma import converter_valores_da_lista


def test_converter_valores_da_lista_converte_float():
    # Build
    lista = [
        {
            "id": 1,
            "nome": "bicicleta",
            "valor": 1000.1499999,
            "prioridade": 2,
        }
    ]

    # Operate
    resultado = converter_valores_da_lista(lista)

    # Check
    assert resultado[0]["valor"] == Decimal("1000.14")


def test_converter_valores_da_lista_varios_itens():
    # Build
    lista = [
        {"id": 1, "nome": "tv", "valor": 1500.999, "prioridade": 1},
        {"id": 2, "nome": "notebook", "valor": 3200.456, "prioridade": 2},
    ]

    # Operate
    resultado = converter_valores_da_lista(lista)

    # Check
    assert resultado[0]["valor"] == Decimal("1500.99")
    assert resultado[1]["valor"] == Decimal("3200.45")
    
def test_converter_valores_modifica_lista_original():
    # Build
    lista = [
        {"id": 1, "nome": "geladeira", "valor": 4500.999, "prioridade": 1}
    ]

    # Operate
    converter_valores_da_lista(lista)

    # Check
    assert lista[0]["valor"] == Decimal("4500.99")