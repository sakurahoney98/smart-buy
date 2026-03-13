PONTUACAO = {
    "A": 5,
    "B": 4,
    "C": 3,
    "D": 2,
    "E": 1,
}


def perguntas_prioridade() -> list[object]:
    """
    Lista de perguntas para definir a prioridade dos itens.
    
    Returns:
        list: lista com o texto das perguntas e opções. 
    """
    return [
        {
            "tipo": "URGÊNCIA",
            "pergunta": "Qual o nível de NECESSIDADE deste item para você hoje?",
            "opcoes": [
                {"texto": "Essencial para minha rotina (sem ele tenho prejuízo real)", "alternativa": "A"},
                {"texto": "Muito importante, mas consigo me virar sem por um tempo", "alternativa": "B"},
                {"texto": "Seria bom ter, mas não é prioridade imediata", "alternativa": "C"},
                {"texto": "Baixa necessidade no momento", "alternativa": "D" },
                {"texto": "Sem pressa (apenas desejo)", "alternativa": "E"},
            ],
        },
        {
            "tipo": "IMPACTO",
            "pergunta": "Como este item AFETA seu dia a dia?",
            "opcoes": [
                {
                    "texto": "Impacto direto na SAÚDE ou SEGURANÇA (ex: fogão, geladeira, colchão)",
                    "alternativa": "A",
                },
                {
                    "texto": "Impacto na PRODUTIVIDADE ou RENDA (ex: computador, ferramentas de trabalho)",
                    "alternativa": "B",
                },
                {
                    "texto": "Impacto no CONFORTO ESSENCIAL (ex: cama, sofá, mesa de jantar)",
                    "alternativa": "C",
                },
                {
                    "texto": "Impacto no LAZER ou CONVENIÊNCIA (ex: TV, videogame, microondas)",
                    "alternativa": "D",
                },
                {
                    "texto": "Impacto apenas ESTÉTICO (ex: decoração, upgrade visual)",
                    "alternativa": "E",
                },
            ],
        },
        {
            "tipo": "SITUAÇÃO",
            "pergunta": "Qual sua SITUAÇÃO ATUAL com este item?",
            "opcoes": [
                {"texto": "Não tenho / não funciona ", "alternativa": "A"},
                {
                    "texto": "Tenho, mas está QUEBRADO ou precisa conserto urgente",
                    "alternativa": "B",
                },
                {
                    "texto": "Tenho, mas está MUITO VELHO",
                    "alternativa": "C",
                },
                {
                    "texto": "Tenho e funciona, mas quero um MELHOR",
                    "alternativa": "D",
                },
                {
                    "texto": "Tenho e funciona, mas quero um EXTRA",
                    "alternativa": "E",
                },
            ],
        },
    ]


def priorizar_itens(lista: list[dict[int, any]]) -> list[dict[int, any]]:
    
    """
    Prioriza os itens da lista de compra.
    
    Args:
        lista: lista de itens para compra.
        
    Returns:
        Lista com os itens para compra priorizados.
        
    Raises:
        ValueError: Se alguma resposta for inválida (não estiver em PONTUACAO)
    
    Example:
        >>> itens = [
             {
                 "idItem": 1,
                 "respostas": {
                     "URGÊNCIA": "A",
                     "IMPACTO": "B",
                     "SITUAÇÃO": "C"
                 }
             }
         ]
        >>> priorizar_itens(itens)
        [{'idItem': 1, 'prioridade': 2}]
    """
    lista_prioridade = []

    for item in lista:
        
        pontuacao_total = calcular_pontuacao_item(item)
        
        lista_prioridade.append(
                {
                    "idItem": item["idItem"],
                    "prioridade": definir_prioridade(pontuacao_total),
                }
            )

    return lista_prioridade


def calcular_pontuacao_item(item: object) -> int:
    
    """
    Calcula a pontuação do item com base nas respostas fornecidas.
    
    Args:
        item: Item da lista de compras.
        
    Returns:
        Pontuação calculada.
        
        Raises:
        ValueError: Se alguma resposta não estiver em PONTUACAO.
    
    Example:
        >>> item = {
        ...     "idItem": 1,
        ...     "respostas": {
        ...         "URGÊNCIA": "A",
        ...         "IMPACTO": "B",
        ...         "SITUAÇÃO": "C"
        ...     }
        ... }
        >>> calcular_pontuacao_item(item)
        12  # 5 + 4 + 3
    """
    pontuacao_total = 0
    
    for resposta in item["respostas"].values():
        try:
            pontuacao_total += PONTUACAO[resposta]
            
        except KeyError:
             raise ValueError(f"Resposta inválida: {resposta}") 
        
    return pontuacao_total

def definir_prioridade(pontuacao: int) -> int:
    """
    Determina o nível de prioridade com base na pontuação total acumulada.
    
    Args:
        pontuacao: A soma dos pontos das respostas do item.
        
    Returns:
        Prioridade de 1 (Crítico) a 4 (Suntuoso).
    
    Mapeamento:
    13-15 pontos → PRIORIDADE 1 (Crítico)
    10-12 pontos → PRIORIDADE 2 (Importante)
    7-9 pontos  → PRIORIDADE 3 (Desejável)
    3-6 pontos  → PRIORIDADE 4 (Suntuoso)
    """
    if pontuacao >= 13:
        return 1
    elif pontuacao >= 10:
        return 2
    elif pontuacao >= 7:
        return 3
    else:
        return 4



