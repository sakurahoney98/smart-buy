import math
import src.app.domain.regras_orcamento as calendario
from decimal import Decimal
VALOR_MAXIMO_PARCELAMENTO = 12
MESES_ANO = 12

def compra_rapida(itens_prioridade_atual: list[dict]) -> list[dict]:
    """
    Verifica se existem itens dentro de um prioridade específica que podem ser comprados em conjunto
    e em um curto período de tempo (definido em meses_compra_rapida).

    Args:
        itens_prioridade_atual: lista de itens para compra

    Returns:
        Lista de itens que NÃO foram comprados (itens que não se enquadraram nos critérios de compra rápida).
        
    Side Effects:
        Reserva o orçamento para a compra dos itens; bloqueia o parcelamento longo, para que não haja novas 
        obrigações e dedicando assim todos os esforços a compra em questão; atualiza o saldo disponível pós 
        compra dos itens; e remove os itens comprados da lista atual.
    """

    mes_inicio_economia = calendario.proximo_orcamento_livre()

    valor_maximo_compra_rapida = calendario.valor_maximo_para_compra_rapida(
        mes_inicio_economia
    )
    itens_compra_rapida = calendario.lista_compra_rapida(
        itens_prioridade_atual, mes_inicio_economia, valor_maximo_compra_rapida
    )

    if itens_compra_rapida:
        valor_total = sum(item["valor"] for item in itens_compra_rapida)
        tempo_de_economia = calendario.tempo_de_economia(
            mes_inicio_economia, valor_total
        )
        valor_disponivel = calendario.valor_total_tempo_de_economia(
            mes_inicio_economia, tempo_de_economia
        )

        valor_nao_usado = valor_disponivel - valor_total

        calendario.reservar_orcamento(mes_inicio_economia, tempo_de_economia)
        calendario.bloquear_parcelamento(mes_inicio_economia, tempo_de_economia - 1)
        
        mes_compra = mes_inicio_economia + tempo_de_economia - 1
        itens = ", ".join(item["nome"] for item in itens_compra_rapida)
        calendario.comprar_a_vista(mes_compra, valor_total, itens)

        if calendario.calendario[mes_compra]["item_monstro_ativo"]:
            calendario.atualizar_orcamento_normal(mes_compra, valor_nao_usado)

        calendario.atualizar_saldo_integral(mes_compra + 1)

    return [ipa for ipa in itens_prioridade_atual if ipa not in itens_compra_rapida]


def compra_de_parcelamento_longo(item_parcelamento_longo: dict) -> bool:
    """
    Verifica se há vantagem em dividir um item em 12x.
    Os seguintes critérios são necessários para um item ser dividido integralmente:
    - Valor do parcelamento ser menor que o orçamento definido;
    - Ser mais vantajoso do que comprar com economia, que acontece quando:
        - No mês de início de parcelamento o orçamento está reservado para compra de outro item;
        - No mês de ínicio de parcelamento há um item monstro ativo;
        - O valor economizado no mês é menor que o valor do item.
        Se pelo menos um desses critérios for falso, não há vantagem no parcelamento integral do item.
    - O valor ser menor do que 3 meses de economia do orçamento integral;
    - O valor do item ser menor do que o valor de limite de crédito seguro definido. 
    

    Args:
        item_parcelamento_longo: item da lista de compra.

    Returns:
        True se houver vantagem em dividir o item em 12x ou
        False se não houver vantagem.
        
    Side Effects:
        Caso o itm se enquadre nas regras estabelecidas, reserva o parcelamento, bloqueia o parcelamento
        longo e atualiza o saldo pós compra do item.
    """

    # Verifica e valida o mês em que um parcelamento longo está disponível
    mes_inicial_parcelamento = calendario.proximo_parcelamento_longo_livre()
    mes_inicial_parcelamento = calendario.validar_parcelamento(
        mes_inicial_parcelamento, VALOR_MAXIMO_PARCELAMENTO, item_parcelamento_longo["valor"]
    )

    # Verifica se o valor do parcelamento é maior que o orçamento definidio
    if mes_inicial_parcelamento != -1:

        vantagem_comprar_com_economia = (
            calendario.calendario[mes_inicial_parcelamento]["orcamento_reservado"] == 0
            and calendario.calendario[mes_inicial_parcelamento][
                "orcamento_monstro_reservado"
            ]
            == 0
            and calendario.calendario[mes_inicial_parcelamento]["saldo_pos_compra"]
            >= item_parcelamento_longo["valor"]
        )

        if (
            not vantagem_comprar_com_economia
            and item_parcelamento_longo["valor"] > calendario.orcamento * 3
            and item_parcelamento_longo["valor"] < calendario.limite_de_credito_seguro
        ):
            valor_parcela = calendario.truncar_valor_divisao(
                item_parcelamento_longo["valor"], VALOR_MAXIMO_PARCELAMENTO
            )

            if (
                valor_parcela
                <= calendario.calendario[mes_inicial_parcelamento + 1]["orcamento"]
            ):
                calendario.reservar_parcelamento(
                    mes_inicial_parcelamento,
                    item_parcelamento_longo["nome"],
                    item_parcelamento_longo["valor"],
                    VALOR_MAXIMO_PARCELAMENTO,
                )
                calendario.comprar_parcelado(
                    mes_inicial_parcelamento,
                    item_parcelamento_longo["nome"],
                    item_parcelamento_longo["valor"],
                    VALOR_MAXIMO_PARCELAMENTO,
                )
                calendario.atualizar_saldo_integral(mes_inicial_parcelamento + 1)

                return True

    return False


def converter_valores_da_lista(lista: list[dict]) -> list[dict]:
    """
    Converte o preço dos itens da lista de compras em Decimal.

    Args:
        lista: lista de compras.

    Returns:
        A mesma lista recebida, modificada in-place.
        
    Side Effects:
        Converte o campo valor dos itens da lista de compra de float para Decimal.
        
    Example:
        >>> lista = [
                        {'id': 1772573858039, 
                        'nome': 'bicicleta', 
                        'valor': 1000.1499999, 
                        'prioridade': 2}
                ]
        >>> converter_valores_da_lista(lista)
        [{'id': 1772573858039, 'nome': 'bicicleta', 'valor': 1000.14, 'prioridade': 2}]
    """
    for item in lista:
        item["valor"] = calendario.truncar_valor(item["valor"])

    return lista


def inicializar(credito: float, orcamento: float, lista: list[dict], mes: int, ano: int) -> list[dict]:
    """
    Define e organiza o cronograma de compras. Função orquestradora principal do sistema.
    Fluxo geral:
    1. Inicializa parâmetros financeiros
    2. Ordena itens por prioridade e valor
    3. Para cada prioridade:
        a. Processa itens monstro
        b. Tenta compras rápidas
        c. Planeja demais compras (à vista ou parceladas)
    4. Formata cronograma final

    Args:
        credito: valor de crédito disponível.
        orcamento: valor economizado por mês.
        lista: lista de compras.
        mes: mês de início do cronograma.
        ano: ano de início do cronograma.

    Returns:
        Lista de cronograma apenas dos meses com ação ou obrigação.
        
    Side Effects:
        - Altera:
            calendário global
            crédito global
            orçamento global
            limite de crédito
            anos
            lista de compras
        - Redefine completamente calendario.calendario
        - Sobrescreve configurações anteriores
        - Executa compras efetivas
        - Gera saída filtrada

    """
    
    mes = int(mes) if isinstance(mes, str) else mes
    mes = mes - 1
    ano = int(ano) if isinstance(ano, str) else ano
    
    # Inicialização das variáveis
    calendario.calendario = []
    calendario.credito = calendario.truncar_valor(credito)
    calendario.orcamento = calendario.truncar_valor(orcamento)
    calendario.lista_de_compras = converter_valores_da_lista(lista)
    calendario.anos = [ano]
    calendario.ano_inicial = ano
    calendario.mes_inicial = mes
    calendario.limite_de_credito_seguro = calendario.truncar_valor_multiplicacao(credito, 0.7)
    calendario.lista_de_compras.sort(key=lambda x: x["prioridade"], reverse=False)
    lista_de_compras = calendario.lista_de_compras
    compras_com_credito = True if calendario.credito > 0 else False
    estimativa = math.ceil(
        (
            sum(item["valor"] for item in calendario.lista_de_compras)
            / calendario.orcamento
        )
        / MESES_ANO
    )
    calendario.aumentar_calendario(estimativa)
    calendario.atualizar_saldo_integral(0)

    # Verifica os itens de cada prioridade
    for prioridade in range(
        calendario.PRIORIDADE_MAXIMA, calendario.PRIORIDADE_MINIMA + 1
    ):
        itens_prioridade_atual = [
            ipa for ipa in lista_de_compras if ipa["prioridade"] == prioridade
        ]

        # Verifica se há itens categorizados com a prioridade atual
        if itens_prioridade_atual:

            # Organiza os itens da prioridade por valor crescente
            itens_prioridade_atual.sort(key=lambda x: x["valor"], reverse=False)

            # Verifica se há itens monstros na prioridade atual
            itens_monstro = calendario.lista_itens_monstro(
                compras_com_credito, itens_prioridade_atual
            )

            # Compra SEM cartão de crédito
            if not compras_com_credito:
                
                # Planeja as compras monstro se houverem
                for item_monstro in itens_monstro:
                    mes_inicial_economia_monstro = calendario.mes_para_compra_monstro()
                    tempo_de_economia = calendario.tempo_economia_item_monstro(
                        mes_inicial_economia_monstro, item_monstro["valor"]
                    )

                    calendario.reservar_orcamento_monstro(
                        mes_inicial_economia_monstro, tempo_de_economia
                    )

                    mes_compra_monstro = (
                        mes_inicial_economia_monstro + tempo_de_economia
                    )

                    calendario.comprar_a_vista(
                        mes_compra_monstro, item_monstro["valor"], item_monstro["nome"]
                    )

                    calendario.atualizar_saldo_integral(mes_compra_monstro + 1)

                    calendario.bloquear_atualizacao_de_saldo(mes_compra_monstro)

                # Remove os itens monstro, se houverem, da lista de itens da prioridade atual
                itens_prioridade_atual = [
                    ipa for ipa in itens_prioridade_atual if ipa not in itens_monstro
                ]

                # Verifica a possibilidade de compras casadas
                itens_prioridade_atual = compra_rapida(itens_prioridade_atual)
                
                # Faz o planejamento do restante dos itens, se houverem
                for item in itens_prioridade_atual:

                    # Identifica o primeiro mês que o orçamento não está comprometido, calcula o tempo necessário
                    # de economia, reserva o orçamento e atualiza o saldo após a compra do item
                    mes_inicio_economia = calendario.proximo_orcamento_livre()

                    tempo_de_economia = calendario.tempo_de_economia(
                        mes_inicio_economia, item["valor"]
                    )

                    calendario.reservar_orcamento(
                        mes_inicio_economia, tempo_de_economia
                    )
                    mes_compra = mes_inicio_economia + tempo_de_economia - 1
                    calendario.comprar_a_vista(mes_compra, item["valor"], item["nome"])

                    valor_disponivel = calendario.valor_total_tempo_de_economia(
                        mes_inicio_economia, tempo_de_economia
                    )
                    valor_nao_usado = valor_disponivel - item["valor"]

                    if calendario.calendario[mes_compra]["item_monstro_ativo"]:
                        calendario.atualizar_orcamento_normal(
                            mes_compra, valor_nao_usado
                        )

                    calendario.atualizar_saldo_integral(mes_compra + 1)

            # Compra COM cartão de crédito
            else:
                
                # Planeja as compras monstro se houverem
                for item_monstro in itens_monstro:
                    mes_inicial_economia_monstro = calendario.mes_para_compra_monstro()
                    entrada_minima = (
                        item_monstro["valor"] - calendario.limite_de_credito_seguro
                    )
                    valor_maximo_parcelamento = calendario.orcamento * VALOR_MAXIMO_PARCELAMENTO
                    entrada_minima = (item_monstro["valor"] - valor_maximo_parcelamento) if (item_monstro["valor"] - entrada_minima) > valor_maximo_parcelamento else entrada_minima
                    tempo_de_economia = calendario.tempo_economia_item_monstro(
                        mes_inicial_economia_monstro, entrada_minima
                    )

                    calendario.reservar_orcamento_monstro(
                        mes_inicial_economia_monstro, tempo_de_economia
                    )

                    mes_compra_monstro = (
                        mes_inicial_economia_monstro + tempo_de_economia
                    )
                    entrada_real = calendario.valor_total_tempo_economia_item_monstro(
                        mes_inicial_economia_monstro, tempo_de_economia
                    )
                    valor_a_parcelar = item_monstro["valor"] - entrada_real

                    calendario.reservar_parcelamento(
                        mes_compra_monstro, item_monstro["nome"], valor_a_parcelar, VALOR_MAXIMO_PARCELAMENTO
                    )
                    calendario.comprar_parcelado_com_entrada(
                        mes_compra_monstro,
                        item_monstro["nome"],
                        entrada_real,
                        valor_a_parcelar,
                        VALOR_MAXIMO_PARCELAMENTO,
                    )

                    calendario.atualizar_saldo_integral(mes_compra_monstro + 1)

                    calendario.bloquear_atualizacao_de_saldo(mes_compra_monstro)

                # Remove os itens monstro, se houverem, da lista de itens da prioridade atual
                itens_prioridade_atual = [
                    ipa for ipa in itens_prioridade_atual if ipa not in itens_monstro
                ]

                # Verifica a possibilidade de compras casadas
                itens_prioridade_atual = compra_rapida(itens_prioridade_atual)

                # Faz o planejamento do restante dos itens, se houverem
                if itens_prioridade_atual:
                    
                    # Verifica se o item mais caro da prioridade, que não se enquadra como item monstro, é elegível 
                    # ao parcelamento longo. Se for, remove-o da lista de prioridade atual
                    item_parcelamento_longo = itens_prioridade_atual[-1]

                    if compra_de_parcelamento_longo(item_parcelamento_longo):
                        itens_prioridade_atual = [
                            ipa
                            for ipa in itens_prioridade_atual
                            if ipa != item_parcelamento_longo
                        ]

                    
                    for item in itens_prioridade_atual:
                        mes_inicio_economia = calendario.proximo_orcamento_livre()
                        

                        tempo_total_para_aquisicao = calendario.tempo_de_economia(
                            mes_inicio_economia, item["valor"]
                        )

                        # Se o item levar menos de 4 meses de economia para compra, vale mais a pena juntar e comprar 
                        # à vista do que usar o entrada + crédito
                        if tempo_total_para_aquisicao <= calendario.meses_compra_rapida:
                            calendario.reservar_orcamento(
                                mes_inicio_economia, tempo_total_para_aquisicao
                            )
                            mes_compra = (
                                mes_inicio_economia + tempo_total_para_aquisicao - 1
                            )
                            calendario.comprar_a_vista(
                                mes_compra, item["valor"], item["nome"]
                            )
                            valor_disponivel = calendario.valor_total_tempo_de_economia(
                                mes_inicio_economia, tempo_total_para_aquisicao
                            )
                            valor_nao_usado = valor_disponivel - item["valor"]
                            indice_atualizacao = mes_compra + 1

                        else:
                            
                            # Se o item levar mais de 3 meses de economia tentar realizar a compra dando uma entrada 
                            # e parcelando o resto
                            tempo_de_economia = parcelas = math.ceil(
                                tempo_total_para_aquisicao / 2
                            )
                            
                            # Nunca dividir em mais de 12x, sempre optar por dar uma entrada maior do que dividir m muitas parcelas
                            if parcelas > VALOR_MAXIMO_PARCELAMENTO:
                                parcelas = VALOR_MAXIMO_PARCELAMENTO
                                tempo_de_economia += tempo_de_economia - VALOR_MAXIMO_PARCELAMENTO

                            entrada = calendario.valor_total_tempo_de_economia(
                                mes_inicio_economia, tempo_de_economia
                            )
                            valor_a_parcelar = item["valor"] - entrada

                            # O valor a parcelar nunca pode ser maior que o limite seguro do cartão e as parcelas nunca podem ser 
                            # do mesmo valor do orçamento definido
                            while valor_a_parcelar > 0 and (
                                valor_a_parcelar > calendario.limite_de_credito_seguro
                                or calendario.valor_parcelas(
                                    valor_a_parcelar, parcelas
                                )[-1]
                                == calendario.orcamento
                            ):
                                tempo_de_economia += 1
                                if (
                                    valor_a_parcelar
                                    > calendario.limite_de_credito_seguro
                                ):
                                    parcelas -= 1
                                entrada = calendario.valor_total_tempo_de_economia(
                                    mes_inicio_economia, tempo_de_economia
                                )
                                valor_a_parcelar = item["valor"] - entrada
                                
                            

                            mes_compra = mes_inicio_economia + tempo_de_economia - 1

                            # Se EXISTE valor a parcelar após todas as validações
                            if valor_a_parcelar > 0:
                                
                                # Se o item estiver sendo dividido em 1x
                                if calendario.calendario[mes_compra + 1][
                                    "orcamento"
                                ] < calendario.truncar_valor_divisao(
                                    valor_a_parcelar, parcelas
                                ) or parcelas == 1:
                                    # Economiza mais um mês e compra o item à vista
                                    calendario.reservar_orcamento(
                                        mes_inicio_economia, tempo_total_para_aquisicao
                                    )
                                    mes_compra = (
                                        mes_inicio_economia
                                        + tempo_total_para_aquisicao - 1
                                    )
                                    calendario.comprar_a_vista(
                                        mes_compra, item["valor"], item["nome"]
                                    )

                                else:
                                    
                                    # Se o item estiver sendo dividido em mais de 1x
                                    calendario.reservar_parcelamento(
                                        mes_compra,
                                        item["nome"],
                                        valor_a_parcelar,
                                        parcelas,
                                    )
                                    calendario.reservar_orcamento(
                                        mes_inicio_economia, tempo_de_economia
                                    )
                                    calendario.comprar_parcelado_com_entrada(
                                        mes_compra,
                                        item["nome"],
                                        entrada,
                                        valor_a_parcelar,
                                        parcelas,
                                    )

                                indice_atualizacao = mes_compra + 1

                                valor_nao_usado = 0
                            else:
                                
                                # Se NÃO EXISTE valor a parcelar após todas as validações
                                calendario.reservar_orcamento(
                                    mes_inicio_economia, tempo_de_economia
                                )
                                calendario.comprar_a_vista(
                                    mes_compra, item["valor"], item["nome"]
                                )
                                indice_atualizacao = mes_compra + 1

                        if calendario.calendario[mes_compra]["item_monstro_ativo"]:
                            calendario.atualizar_orcamento_normal(
                                mes_compra, valor_nao_usado
                            )

                        calendario.atualizar_saldo_integral(indice_atualizacao)

    cronograma_formatado = []

    # Formata a exibição do cronograma
    for mes in calendario.calendario:
        if mes["acao"] != "" or mes["obrigacoes"] != "":
            cronograma_formatado.append(mes)
        else:
            break
        
    return cronograma_formatado

lista = [{'id': 1772573858039, 'nome': 'bicicleta', 'valor': 1000, 'prioridade': 2},
{'id': 1772573895188, 'nome': 'playstation 5', 'valor': 3910, 'prioridade': 4},
{'id': 1772573920356, 'nome': 'sapato para o dia  a dia ', 'valor': 350, 'prioridade': 1}
]

inicializar(300, 120,lista,4, 2026)


