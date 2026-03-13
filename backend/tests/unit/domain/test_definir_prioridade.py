from src.app.domain.priorizacao import definir_prioridade
    
    
def test_prioridade_1():
    
    # Build
    pontuacao_alta = [15, 13]
    
    # Operate
    resultados = [definir_prioridade(p) for p in pontuacao_alta]
    
    # Check
    assert resultados == [1, 1]


def test_prioridade_2():
    
    # Build
    pontuacoes = [12, 10]
    
    # Operate
    resultados = [definir_prioridade(p) for p in pontuacoes]
    
    # Check
    assert resultados == [2, 2]


def test_prioridade_3():
    
    # Build
    pontuacoes = [9, 7]
    
    # Operate
    resultados = [definir_prioridade(p) for p in pontuacoes]
    
    # Check
    assert resultados == [3, 3]


def test_prioridade_4():
    
    # Build
    pontuacoes = [6, 3]
    
    # Operate
    resultados = [definir_prioridade(p) for p in pontuacoes]
    
    # Check
    assert resultados == [4, 4]