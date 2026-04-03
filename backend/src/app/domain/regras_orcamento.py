import math
from decimal import Decimal, ROUND_DOWN
from datetime import datetime


MESES = [
    "jan",
    "fev",
    "mar",
    "abr",
    "mai",
    "jun",
    "jul",
    "ago",
    "set",
    "out",
    "nov",
    "dez",
]
PRIORIDADE_MAXIMA = 1
PRIORIDADE_MINIMA = 4
ULTIMO_ITEM = -1


alertas = []
anos = []
mes_inicial = 0
ano_inicial = datetime.now().year
calendario = []
credito = 0
orcamento = 0
meses_compra_rapida = 3
limite_de_credito_seguro = 0


lista_de_compras = []



def aumentar_calendario(quantidade_de_anos: int):
    """
    Insere mais meses no calendário.

    Args:
        quantidade_de_anos: quantidade de anos para aumentar no calendário.
        
    Side Effects:
        Insere mais posições no array que representa o cronograma.
    """

    for i in range(quantidade_de_anos):

        mes_atual = mes_inicial if anos[ULTIMO_ITEM] == ano_inicial else 0

        for mes in MESES[mes_atual:]:
            calendario.append(
                {
                    "data": f"{mes}/{anos[ULTIMO_ITEM]}",
                    "acao": "",
                    "credito_disponivel": credito,
                    "credito_usado": 0,
                    "orcamento": orcamento,
                    "orcamento_monstro": truncar_valor_multiplicacao(orcamento, 0.7),
                    "orcamento_normal": truncar_valor_multiplicacao(orcamento, 0.3),
                    "acumulado_monstro": 0,
                    "acumulado_normal": 0,
                    "acumulado": 0,
                    "saldo_pos_compra": 0,
                    "saldo_pos_compra_monstro": 0,
                    "saldo_pos_compra_normal": 0,
                    "parcelamentos_ativos": 0,
                    "permitido_parcelamento_longo": 1,
                    "orcamento_reservado": 0,
                    "orcamento_monstro_reservado": 0,
                    "orcamento_normal_reservado": 0,
                    "item_monstro_ativo": 0,
                    "atualizacao_saldo_bloqueado": 0,
                    "obrigacoes": "",
                }
            )
        anos.append(anos[ULTIMO_ITEM] + 1)


def imprimir_calendario():
    """
    Exibe as informações principais de cada mês do calendário.
    
    """

    for data in calendario:
        print(data["data"])
        print(data["acao"])
        print(data["obrigacoes"])
        print(f"Orçamento: {data['orcamento']}")
        print(f"Acumulado: {data['acumulado']}")
        print(f"Saldo pós-compra: {data['saldo_pos_compra']}")
        print("----------------------------------")


def imprimir_lista_de_compras():
    """
    Imprime a lista de itens de compra e suas informações.
    
    """

    for item in lista_de_compras:
        print(item["nome"])
        print(f"Valor: {item['valor']} | Prioridade: {item['prioridade']}")
        print()


def atualizar_saldo_integral(mes_inicial: int):
    """
    Calcula e atualiza o saldo acumulado e o saldo pós compra a partir de um mês específico.

    Args:
        mes_inicial: mes para inicio do cálculo e atualização.
        
    Side Effects:
        Modifica o valor do saldo acumulado e do valor pós-compra do array.
    """

    mes_dentro_do_intervalo(mes_inicial)

    if mes_inicial == 0:
        calendario[0]["acumulado"] += calendario[0]["orcamento"]
        calendario[0]["saldo_pos_compra"] = calendario[0]["acumulado"]
        mes_inicial = 1

    for indice in range(mes_inicial, len(calendario)):
        if calendario[indice]["atualizacao_saldo_bloqueado"] == 0:
            calendario[indice]["acumulado"] = (
                calendario[indice - 1]["saldo_pos_compra"]
                + calendario[indice]["orcamento"]
            )

            if calendario[indice]["orcamento_monstro_reservado"]:
                calendario[indice]["acumulado"] += calendario[indice][
                    "orcamento_monstro"
                ]

            calendario[indice]["saldo_pos_compra"] = calendario[indice]["acumulado"]

        else:
            valor_compra = (
                calendario[indice]["acumulado"] - calendario[indice]["saldo_pos_compra"]
            )
            valor_acumulado = calendario[indice]["acumulado"] = (
                calendario[indice - 1]["saldo_pos_compra"]
                + calendario[indice]["orcamento"]
                + calendario[indice]["orcamento_monstro"]
            )
            calendario[indice]["saldo_pos_compra"] = valor_acumulado - valor_compra


def atualizar_orcamento_normal(mes: int, novo_valor: float | Decimal):
    """
    Atualiza o valor do orçamento de um mês especifico destinado a compras normais, quando há um item monstro ativo.

    Args:
        mes: posição do mês no array.
        novo_valor: novo valor de orçamento para o mês.
        
    Side Effects:
        Modifica o valor do orçamento destinado a compra de itens comuns quando há um item monstro ativo.
    """
    novo_valor = truncar_valor(novo_valor)
    if abs(novo_valor.as_tuple().exponent) > 2:
        novo_valor = truncar_valor(novo_valor)
    calendario[mes]["orcamento_normal"] = novo_valor


def mes_para_compra_monstro() -> int:
    """
    Identifica o primeiro mês disponível para iniciar uma economia a fim de comprar um item monstro.
    Para um mês ser elegível para iniciar a economia para uma compra monstro, ele deve:
    - Não estar com o orçamento reservado para a compra de outro item;
    - Não estar pagando o parcelamento de um item que foi dividido em 10x ou mais;
    - Estar com o orçamento integral disponível para uso.

    Returns:
        Posição no array correspondente ao mês.
    """

    mes = 0

   
    for data in calendario:
        if (
            data["orcamento_reservado"] == 1
            or data["permitido_parcelamento_longo"] == 0
            or data["orcamento"] < orcamento
        ):
            mes += 1
        else:
            break

    return mes


def proximo_orcamento_livre() -> int:
    
    """
    Identifica o primeiro mês disponível para iniciar uma economia a fim de comprar um item.
    Para um mês ser elegível para iniciar a economia para uma compra, ele deve:
    - Não estar com o orçamento reservado para a compra de outro item;
    - Não estar com o orçamento normal reservado para a compra de outro item (casos em que o mês tem uma 
    compra monstra ativa).

    Returns:
        Posição no array correspondente ao mês.
    """

    mes = 0

    for data in calendario:
        
        if data["orcamento_reservado"] == 1 and data['orcamento_monstro_reservado'] == 0:
            mes += 1
        else:
            if data["orcamento_normal_reservado"] == 1:
                mes+= 1
            else:
                break

    return mes


def proximo_parcelamento_longo_livre() -> int:
    """
    Identifica o primeiro mês disponível para iniciar um parcelamento de 12x.
    Para um mês ser elegível para iniciar um parcelamento longo, ele deve:
    - Não estar pagando o parcelamento de um item que foi dividido em 10x ou mais;
    - Não ter um item monstro ativo.

    Returns:
        Posição no array correspondente ao mês.
    """
    mes = 0

    for data in calendario:
        if data["permitido_parcelamento_longo"] == 0 or data["item_monstro_ativo"] == 1 or data['orcamento_reservado'] == 1:
            mes += 1
        else:
            break

    return mes


def tempo_economia_item_monstro(mes_inicial: int, valor: Decimal) -> int:
    """
    Calcula, a partir de um mês específico, a quantidade de meses necessários para ter um valor específico. 

    Args:
        mes_inicial: posição do array correspondente ao mes em que se inicia a economia para a compra monstro.
        valor: valor do item monstro.

    Returns:
        Quantidade de meses necessários para ter o valor do item.
    """

    meses = 0

    mes_dentro_do_intervalo(mes_inicial)

    soma = truncar_valor_multiplicacao(
        calendario[mes_inicial - 1]["saldo_pos_compra"], 0.7
    )

    for data in calendario[mes_inicial:]:
        if soma < valor:
            soma += data["orcamento_monstro"]
            meses += 1
        else:
            break

    return meses


def tempo_de_economia(mes_inicial: int, valor: Decimal) -> int:
    
    """
    Calcula, a partir de um mês específico, a quantidade de meses necessários para ter um valor específico.
    Nesse caso é necessário verificar se o orçamento utilizado é integral ou só 30% (quando há uma compra monstro planejada).

    Args:
        mes_inicial: posição do array correspondente ao mes em que se inicia a economia para a compra.
        valor: valor do item.

    Returns:
        Quantidade de meses necessários para ter o valor do item.
    """

    mes_dentro_do_intervalo(mes_inicial)
    mes = 1

    if mes_inicial > 0 and calendario[mes_inicial - 1]["orcamento_normal"] < (
        truncar_valor_multiplicacao(orcamento, 0.3)
    ):
        soma = calendario[mes_inicial - 1]["orcamento_normal"]
    else:
        soma = (
            calendario[mes_inicial]["saldo_pos_compra"]
            if calendario[mes_inicial]["orcamento_monstro_reservado"] == 0
            else truncar_valor_multiplicacao(
                calendario[mes_inicial]["saldo_pos_compra"], 0.3
            )
        )

    soma = truncar_valor(soma)

    mes_inicial += 1
    index = mes_inicial

    for data in calendario[mes_inicial:]:
        if soma < valor or valor > data['saldo_pos_compra']:
            soma += data["orcamento"]
            mes += 1
        else:
            break
        index += 1
        mes_dentro_do_intervalo(index)
           
        

    return mes


def valor_total_tempo_de_economia(mes_inicial: int, tempo_economia: int) -> Decimal:
    
    """
    Calcula, a partir de um mês específico, o valor disponível em um tempo X economizando. 

    Args:
        mes_inicial: posição do array correspondente ao mes em que se inicia a economia.
        tempo_economia: quantidade de meses para fazer a economia.

    Returns:
        Valor economizado.
    """

    mes_dentro_do_intervalo(mes_inicial)
    mes_final = mes_inicial + tempo_economia
    mes_dentro_do_intervalo(mes_final)

    if mes_inicial > 0 and calendario[mes_inicial - 1][
        "orcamento_normal"
    ] < truncar_valor_multiplicacao(orcamento, 0.3):
        soma = calendario[mes_inicial - 1]["orcamento_normal"]
    else:
        soma = (
            calendario[mes_inicial]["saldo_pos_compra"]
            if calendario[mes_inicial]["orcamento_monstro_reservado"] == 0
            else truncar_valor_multiplicacao(calendario[mes_inicial]["saldo_pos_compra"], 0.3)
        )

    soma = truncar_valor(soma)

    mes_inicial += 1

    for data in calendario[mes_inicial:mes_final]:
        soma += data["orcamento"]

    return truncar_valor(soma)


def valor_total_tempo_economia_item_monstro(mes_inicial: int, tempo_economia: int) -> Decimal:
    """
    Calcula, a partir de um mês específico, o valor disponível para o item monstro em um tempo X economizando. 

    Args:
        mes_inicial: posição do array correspondente ao mes em que se inicia a economia.
        tempo_economia: quantidade de meses para fazer a economia.

    Returns:
        Valor economizado.
    """

    mes_dentro_do_intervalo(mes_inicial)
    mes_final = mes_inicial + tempo_economia
    mes_dentro_do_intervalo(mes_final)

    soma = truncar_valor_multiplicacao(
        calendario[mes_inicial - 1]["saldo_pos_compra"], 0.7
    )

    for data in calendario[mes_inicial:mes_final]:
        soma += data["orcamento_monstro"]

    return truncar_valor(soma)


def reservar_orcamento_monstro(mes_inicial: int, tempo_reserva: int):
    
    """
    Reserva mes(es) para a economia a fim de realizar uma compra monstro. 

    Args:
        mes_inicial: posição do array correspondente ao mes em que se inicia a economia.
        tempo_reserva: quantidade de meses para fazer a economia.
        
    Side Effects:
        Bloqueia os meses para a compra de outros itens monstro, reduz o valor do orçamento para compras normais, ativa a flag de item monstro
        e bloqueia parcelamento longo.
        Os valores de orçamento são divididos em:
        - 70% para itens monstro (orcamento_monstro)
        - 30% para itens normais (orcamento_normal)

    """
    mes_dentro_do_intervalo(mes_inicial)
    mes_final = mes_inicial + tempo_reserva + 1
    mes_dentro_do_intervalo(mes_final)

    for data in calendario[mes_inicial:mes_final]:
        data["item_monstro_ativo"] = 1
        data["orcamento"] -= data["orcamento_monstro"]
        data["permitido_parcelamento_longo"] = 0
        data["orcamento_monstro_reservado"] = 1
        data[
            "acao"
        ] += f"Reservar R${data['orcamento_monstro']} para a compra do item monstro.\n"

    for data in calendario[mes_inicial - 1 :: ULTIMO_ITEM]:
        if data["orcamento_reservado"] == 0:
            data["orcamento_reservado"] = 1
        else:
            break


def reservar_orcamento(mes_inicial: int, tempo_reserva: int):
    """
    Reserva mes(es) para a economia a fim de realizar uma compra. 

    Args:
        mes_inicial: posição do array correspondente ao mes em que se inicia a economia.
        tempo_economia: quantidade de meses para fazer a economia.
        
    Side Effects:
        Bloqueia o orçamento para a compra de outros itens.

    """

    mes_dentro_do_intervalo(mes_inicial)
    mes_final = mes_inicial + tempo_reserva
    mes_dentro_do_intervalo(mes_final)

    for data in calendario[mes_inicial:mes_final]:

        data["orcamento_reservado"] = 1
        if data['item_monstro_ativo'] == 1:
            data["orcamento_normal_reservado"] = 1
        data["acao"] += f"Reservar R${data['orcamento']} para compra de item/itens da lista.\n"
        

def reservar_parcelamento(
    mes_inicial: int, nome_item: str, valor_parcelamento: float | Decimal, meses_parcelamento: int
):
    """
    Reserva meses para pagar o parcelamento de uma compra.

    Args:
        mes_inicial: posição do array referente ao mes do inicio do parcelamento.
        nome_item: nome do item a ser parcelado.
        valor_parcelamento: valor total do parcelamento.
        meses_parcelamento: quantidade de parcelas.
        
    Side Effects:
        Bloqueia parcelamentos longos quando o parcelamento em questão tem mais de 9 parcelas.
    """

    mes_dentro_do_intervalo(mes_inicial + 1)
    mes_final = mes_inicial + meses_parcelamento + 1
    mes_dentro_do_intervalo(mes_final)

    valor_das_parcelas = valor_parcelas(valor_parcelamento, meses_parcelamento)

    calendario[mes_inicial]["parcelamentos_ativos"] += 1
    limite_novo = calendario[mes_inicial]["credito_disponivel"] - valor_parcelamento
    calendario[mes_inicial]["credito_usado"] = credito - limite_novo
    calendario[mes_inicial]["credito_disponivel"] = limite_novo

    if meses_parcelamento > 10:
        calendario[mes_inicial]["permitido_parcelamento_longo"] = 0

    mes_inicial += 1
    indice = 0

    for data in calendario[mes_inicial:mes_final]:

        data["orcamento"] -= valor_das_parcelas[indice]
        limite_novo += valor_das_parcelas[indice]
        data["parcelamentos_ativos"] += 1
        data["credito_usado"] = credito - limite_novo
        data["credito_disponivel"] = limite_novo
        data["parcelamentos_ativos"] = +1
        data["obrigacoes"] += f"Pagar parcela {indice + 1} de {meses_parcelamento} no valor de {valor_das_parcelas[indice]} do item {nome_item}.\n"

        if meses_parcelamento > 10:
            data["permitido_parcelamento_longo"] = 0

        indice += 1


def bloquear_parcelamento(mes_inicial: int, tempo_bloqueio:int):
    
    """
    Bloqueia o parcelamento longo para meses especificos.
    
    Args:
        mes_inicial (int): posição do array correspondente ao mês do início do bloqueio.
        tempo_bloqueio (int): quantidade de meses de bloqueio.
        
    Side Effects:
        Bloqueia parcelamentos longos.
    """
    
    mes_dentro_do_intervalo(mes_inicial + 1)
    mes_final = mes_inicial + tempo_bloqueio
    mes_dentro_do_intervalo(mes_final)

    for data in calendario[mes_inicial:mes_final]:
        data["permitido_parcelamento_longo"] = 0


def bloquear_atualizacao_de_saldo(mes: int):
    """
    Bloqueia a atualização automática do saldo.

    Args:
        mes: posição do array correspondente ao mês do bloqueio.
        
    Side Effects:
        Bloqueia a atualização do saldo quando o método atualizar_saldo_integral é acionado.
    """
    calendario[mes]["atualizacao_saldo_bloqueado"] = 1


def comprar_a_vista(mes: int, valor: Decimal, nome_item: str):
    """
    Insere a informação de compra à vista de um item em um mês específico.

    Args:
        mes: posição do array correspondente ao mês da compra.
        valor: valor do item comprado.
        nome_item: nome do item a ser comprado.
        
    Side Effects:
        Insere ação no mês em questão e diminui o valor do saldo em caixa.
    """
    calendario[mes]["acao"] += f"Comprar {nome_item} por R$ {valor}.\n"
    calendario[mes]["saldo_pos_compra"] -= valor


def comprar_parcelado_com_entrada(
    mes: int, nome_item: str, entrada: float | Decimal, valor_a_parcelar: float | Decimal, quantidades_parcelas: int
):
    """
    Insere a informação de compra de um item dando uma parte à vista e parcelando o restante em um mês específico.

    Args:
        mes: posição do array que representa o mês da ação.
        nome_item: nome do item comprado.
        entrada: valor para dar de entrada na compra do item.
        valor_a_parcelar: valor para ser parcelado.
        quantidades_parcelas: quantidade de vezes que o valor do item será dividido.
        
    Side Effects:
        Insere ação no mês em questão e diminui o valor do saldo em caixa.
    """
    calendario[mes]["acao"] += f"Comprar {nome_item} dando R$ {entrada} de entrada e parcelando R$ {valor_a_parcelar} em {quantidades_parcelas}x.\n"
    calendario[mes]["saldo_pos_compra"] -= entrada


def comprar_parcelado(mes: int, nome_item: str, valor: float | Decimal, quantidades_parcelas: int):
    """
    Insere a informação de compra totalmente parcelada de um item.

    Args:
        mes: posição do array que representa o mês da ação.
        nome_item: nome do item comprado.
        valor_a_parcelar: valor para ser parcelado.
        quantidades_parcelas: quantidade de vezes que o valor do item será dividido.
        
    Side Effects:
        Insere ação no mês em questão.
    """
    calendario[mes]["acao"] += f"Comprar {nome_item} parcelando R$ {valor} em {quantidades_parcelas}x.\n"


def lista_itens_monstro(compras_com_credito: bool, itens_prioridade_atual: list[dict]) -> list[dict]:
    """
    
    Define os itens da lista atual que se enquadram como itens monstro.
    O critério de item monstro é definido de diferentes formas com base no uso ou não de cartão de crédito:
    - Sem crédito: Itens cujo a economia para a compra levará mais de 1 ano contando a partir do início do seu planejamento;
    - Com crédito: Itens cujo o valor é 12 vezes maior do que o orçamento estipulado E é maior que o limite de crédito.
    Para ambos os casos deve haver pelo menos 2 itens na lista para a validação ser realizada.

    Args:
        compras_com_credito: indicativo se o planejamento do cronograma utiliza ou não crédito.
        itens_prioridade_atual: lista de itens de uma prioridade especifica cujo a compra está sendo planejada.

    Returns:
        Lista de itens que se enquadram como compras monstro.
    """
    if len(itens_prioridade_atual) > 1:
        if not compras_com_credito:
            return [im for im in itens_prioridade_atual if im["valor"] > orcamento * 12]
        else:
            return [
                im
                for im in itens_prioridade_atual
                if im["valor"] > orcamento * 12 and im["valor"] > credito
            ]
    return []


def lista_compra_rapida(lista_de_compras: list[dict], mes_inicial: int, valor_maximo: float | Decimal) -> list[dict]:
    
    """
    Define uma lista de quais itens podem ser comprados até um valor específico.
    
    Args:
        lista_de_compras:lista de itens de uma prioridade especifica cujo a compra está sendo planejada.
        mes_inicial: posição do array referente ao mes do inicio da compra.
        valor_maximo: valor limite para compras rápidas.

    Returns:
        Lista de itens de uma prioridade específica que podem ser comprados em conjunto.
    """

    mes_dentro_do_intervalo(mes_inicial)
    mes_final = mes_inicial + meses_compra_rapida + 1
    mes_dentro_do_intervalo(mes_final)

    soma = 0
    lista = []

    for item in lista_de_compras:
        if item["valor"] + soma <= valor_maximo:
            soma += item["valor"]
            lista.append(item)
        else:
            break

    return lista


def valor_maximo_para_compra_rapida(mes_inicial: int) -> Decimal:
    """
    Define o valor acumulado em um tempo X de economia (meses_compra_rapida) contados a partir de um mês específico.

    Args:
        mes_inicial: posição do array referente ao mes do inicio da economia.

    Returns:
        Valor total economizado.
    """
    
    mes_dentro_do_intervalo(mes_inicial)
    mes_final = mes_inicial + meses_compra_rapida
    mes_dentro_do_intervalo(mes_final)

    if mes_inicial > 0 and calendario[mes_inicial - 1]["orcamento_normal"] < truncar_valor_multiplicacao(orcamento, 0.3):
        soma = calendario[mes_inicial - 1]["orcamento_normal"]
    else:
        soma = (
            calendario[mes_inicial]["saldo_pos_compra"]
            if calendario[mes_inicial]["orcamento_monstro_reservado"] == 0
            else truncar_valor_multiplicacao(calendario[mes_inicial]["saldo_pos_compra"], 0.3)
        )

    soma = truncar_valor(soma)

    mes_inicial += 1

    for data in calendario[mes_inicial:mes_final]:
        soma += data["orcamento"]

    return truncar_valor(soma)


def truncar_valor_divisao(dividendo: int | float | Decimal, divisor: int | float | Decimal) -> Decimal:
    """
    Calcula a divisão entre dois números e converte o resultado em Decimal.

    Args:
        dividendo: valor a ser dividido.
        divisor: quantidade de vezes que o dividendo deve ser dividido.

    Returns:
        Resultado na divisão.
    """
    if not isinstance(dividendo, Decimal):
        dividendo = Decimal(str(dividendo))
        
    if not isinstance(divisor, Decimal):
        divisor = Decimal(str(divisor))
        
    quociente = dividendo / divisor

    return Decimal(str(quociente)).quantize(Decimal("0.01"), rounding=ROUND_DOWN)


def truncar_valor_multiplicacao(fator_1: int | float | Decimal, fator_2: int | float | Decimal) -> Decimal:
    """
    Calcula a multiplicação entre dois números e converte o resultado em Decimal.

    Args:
        fator_1: fator multiplicador.
        fator_2: fator multiplicador.

    Returns:
        Resultado na multiplicação.
    """
    if not isinstance(fator_1, Decimal):
        fator_1 = Decimal(str(fator_1))
        
    if not isinstance(fator_2, Decimal):
        fator_2 = Decimal(str(fator_2))

    produto = fator_1 * fator_2

    return Decimal(str(produto)).quantize(Decimal("0.01"), rounding=ROUND_DOWN)


def truncar_valor(valor: int | float | Decimal) -> Decimal:
    """
    Converte um valor em Decimal.

    Args:
        valor: valor a ser convertido.

    Returns:
        Valor convertido.
    """
    
    return Decimal(str(valor)).quantize(Decimal("0.01"), rounding=ROUND_DOWN)


def mes_dentro_do_intervalo(mes: int) -> bool:
    
    """
    Verifica se um mês existe no cronograma, para acrescentá-lo quando necessário.
    
    Args:
        mes: posição do array que representa o mês.

    Returns:
        True se o mês já existia no calendário,
        False se foi necessário adicionar novos meses ao calendário
        
    Side Effects:
        Aciona função que insere mais meses no cronograma quando necessário.
    """

    if mes >= (len(calendario) - 1):
        index_para_atualizacao = len(calendario)
        meses_excedentes = mes - len(calendario) + 1
        anos_a_inserir = math.ceil(meses_excedentes / 12)
        anos_a_inserir = anos_a_inserir if anos_a_inserir > 0 else 1
        aumentar_calendario(anos_a_inserir)
        atualizar_saldo_integral(index_para_atualizacao)
        
        return False
    
    return True

        


def validar_parcelamento(mes_inicial: int, tempo_parcelamento: int, valor_a_parcelar: Decimal) -> int:
    
    """
    Verifica se o parcelamento de um item pode realmente ser realizado no mês em que foi suposto.
    A verificação ocorre determinando se o valor das parcelas cabem no orçamento e se durante o parcelamento haverá orçamento 
    suficiente para conseguir pagar as parcelas correspondentes.
    
    Args:
        mes_inicial: posição do array referente ao mes do inicio do parcelamento.
        tempo_parcelamento: quantidade de parcelas necessárias para quitar o item.
        valor_a_parcelar: valor do parcelamento do item.

    Returns:
        Posição do array que representa o mês definitivo para o inicio do parcelamento.
    """

    mes_dentro_do_intervalo(mes_inicial)
    mes_final = mes_inicial + tempo_parcelamento + 1
    mes_dentro_do_intervalo(mes_final)

    valor_das_parcelas = valor_parcelas(valor_a_parcelar, tempo_parcelamento)

    
    if valor_das_parcelas[ULTIMO_ITEM] < orcamento:
        parcelamento_validado = False

        while not parcelamento_validado:

            bloquear_parcelamento = False
            indice_parcela = 0

            for data in calendario[mes_inicial + 1 : mes_final]:
                if data["orcamento"] < valor_das_parcelas[indice_parcela]:
                    mes_inicial += 1
                    mes_final += 1
                    bloquear_parcelamento = True
                    break
                indice_parcela += 1

            if not bloquear_parcelamento:
                parcelamento_validado = True
    else:
            mes_inicial = -1

    return mes_inicial


def valor_parcelas(valor_parcelamento: float | Decimal, meses_parcelamento: int) -> list[Decimal]:
    
    """
    Determina o valor de cada parcela a ser paga no mês.
    
    Args:
        valor_parcelamento: valor total do item a ser parcelado.
        meses_parcelamento: quantidade de vezes que o item foi dividido.

    Returns:
        Valor de cada parcela a ser paga no mês.
    """

    parcela = truncar_valor_divisao(valor_parcelamento, meses_parcelamento)
    resto_parcela = valor_parcelamento - (parcela * meses_parcelamento)
    valor_das_parcelas = [parcela] * meses_parcelamento
    valor_das_parcelas[ULTIMO_ITEM] += resto_parcela

    return valor_das_parcelas
