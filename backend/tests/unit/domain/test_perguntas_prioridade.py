from src.app.domain.priorizacao import perguntas_prioridade

QUANTIDADE_PERGUNTAS = 3


def test_retorno_perguntas_prioridade():
    # Operate
    lista_perguntas = perguntas_prioridade()
    
    # Check
    assert len(lista_perguntas) == QUANTIDADE_PERGUNTAS