
import src.app.domain.regras_orcamento as regras_orcamento
from decimal import Decimal

class SalarioInvalido(Exception): pass

"""
Calcula um valor de orçamento com base no salário informado.

Tenta fazer a conversão da informação recebida em float e calcula
20% do valor recebido.

Args:
    salario: salário informado.
    
Returns:
    Valor que representa 20% do salário informado.
    
Raises:
    SalarioInvalido: se o valor informado não puder ser convertido para float.
"""
def sugestao_orcamento(salario: int | float | str) -> Decimal:
    try:
        salario = float(salario)
    except ValueError:
        raise SalarioInvalido("Salário inválido")
    
    return regras_orcamento.truncar_valor_multiplicacao(salario, 0.2)