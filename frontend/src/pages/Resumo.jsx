import HeaderVoltar from "../components/HeaderVoltar"
import ItemResumo from "../components/ItemResumo"
import { formatarValorParaExibicao } from '../util/formatador'
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useState } from "react"
import { useOrcamento } from "../context/OrcamentoContext"

import icon_calendar from '../assets/calendar.png'
import style from '../styles/Resumo.module.css'


/**
 * Página para visualizar informações preenchidas e informar mês e ano do início do projeto.
 * 
 * Esta página é protegida: só pode ser acessada se o usuário já tiver informado o orçamento 
 * e montado a lista de compras nas etapas anteriores. Caso contrário, é redirecionado 
 * automaticamente para /escolha-orcamento ou /lista-de-compras.
 * 
 * Apresenta as informações inseridas nas etapas anteriores de orçamento, crédito e lista de 
 * compras com seus respectivos níveis de prioridade, bem como os valores financeiros resumidos 
 * do planejamento. O usuário informa o mês e o ano de início do projeto e é redirecionado para 
 * a página de cronograma.
 * 
 * @returns {JSX.Element} Página com as informações principais do projeto e seletor de período 
 * de início do projeto.
 */
function Resumo() {

    const { dados, atualizarCampo } = useOrcamento()
    const navigate = useNavigate()

    useEffect(() => {
        // Proteção de rota: redireciona se o orçamento não foi definido
        if (!dados.orcamento || dados.orcamento === 0) {
            navigate("/escolha-orcamento")
        }
        // Proteção de rota: redireciona se a lista de compras não foi montada
        if (dados.itens.length === 0) {
            navigate("/lista-de-compras")
        }
    }, [dados.orcamento, dados.itens.length, navigate])


    //  Não carrega a página se o orçamento não foi definido ou a lista de compras não
    // foi montada
    if (!dados.orcamento || dados.orcamento === 0 || dados.itens.length === 0) {
        return null
    }


    const anoAtual = new Date().getFullYear()

    // Cria a opção de mais 10 anos contando do ano atual
    const anosDisponiveis = Array.from({ length: 11 }, (_, index) => anoAtual + index)

    const [mes, setMes] = useState(1)
    const [ano, setAno] = useState(anoAtual)

    const tabelaNomePrioridade = {
        1: "Urgente",
        2: "Alta",
        3: "Média",
        4: "Baixa"
    }

    const tabelaCorPrioridade = {
        1: "var(--red-priority)",
        2: "var(--orange-priority)",
        3: "var(--yellow-priority)",
        4: "var(--green-priority)"
    }

    /**
     * Função que retorna o nome da prioridade com base no valor de
     * prioridade recebido.
     * 
     * @param {number} prioridade - Prioridade do item (1 - 4).
     * @returns Prioridade do item representada de forma textual.
     */
    function nomePrioridade(prioridade) {
        return tabelaNomePrioridade[prioridade]
    }

    /**
     * Função que retorna o a cor que representa a prioridade com base 
     * no valor de prioridade recebido.
     * 
     * @param {number} prioridade - Prioridade do item (1 - 4).
     * @returns Nome da variável CSS representando a cor da prioridade.
     */
    function corPrioridade(prioridade) {
        return tabelaCorPrioridade[prioridade]
    }

    /**
     * Função que calcula e retorna a somatária dos preços dos itens
     * da lista.
     * 
     * @returns Valor total da lista de compras.
     */
    function valorTotalItens() {
        return dados.itens.reduce((soma, item) => soma + Number(item.valor), 0)
    }

    /**
     * Função que salva o valor de mês e ano de início do projeto no
     * contexto e redireciona o usuário para a página do cronograma.
     * 
     */
    function avancar() {
        atualizarCampo("ano", ano)
        atualizarCampo("mes", mes)

        navigate("/cronograma")

    }

    return (
        <div className={style.resumo}>
            <div className={style.resumo__container}>
                <HeaderVoltar to="/priorizacao" />
                <div className={style.resumo__content}>
                    <div className={style.resumo__content_icon}>
                        <img src={icon_calendar} alt="Ícone de calendário representando planejamento temporal" width="32" height="32" />

                    </div>
                    <div className={style.resumo__content_text}>
                        <h2>Resumo das informações</h2>

                    </div>
                    <div className={style.resumo__content_information}>
                        <div className={style.resumo__content_summary}>
                            <div className={style.card__content}>
                                <h4>Resumo Financeiro</h4>
                                <div className={style.card__line}>
                                    <p>Orçamento mensal:</p>
                                    <p>{formatarValorParaExibicao(dados.orcamento)}</p>
                                </div>
                                <div className={`${style.card__line} ${style.card__line__partition}`} >
                                    <p>Crédito disponível:</p>
                                    <p>{formatarValorParaExibicao(dados.credito)}</p>
                                </div>
                                <div className={style.card__line}>
                                    <p>Total disponível:</p>
                                    <p className={style.card__line__emphasis}>{formatarValorParaExibicao(dados.orcamento + dados.credito)}</p>
                                </div>
                                <div className={style.card__line}>
                                    <p>Total itens:</p>
                                    <p>{formatarValorParaExibicao(valorTotalItens())}</p>
                                </div>

                            </div>
                            <div className={style.card__content}>
                                <h4>Itens Priorizados</h4>
                                {dados.itens.map((item, index) => (
                                    <ItemResumo key={item.id}
                                        nome={item.nome}
                                        valor={formatarValorParaExibicao(item.valor)}
                                        prioridade={nomePrioridade(item.prioridade)}
                                        cor={corPrioridade(item.prioridade)}
                                        posicao={index + 1}

                                    />
                                )

                                )}


                            </div>

                        </div>
                        <div className={style.resumo__content_date}>

                            <div className={style.card__content}>
                                <h4>Mês de início do planejamento:</h4>
                                <select className={style.resumo__content_item_select__arrow} value={mes} name="mes_inicio" onChange={(e) => setMes(e.target.value)}>
                                    <option value="1">Janeiro</option>
                                    <option value="2">Fevereiro</option>
                                    <option value="3">Março</option>
                                    <option value="4">Abril</option>
                                    <option value="5">Maio</option>
                                    <option value="6">Junho</option>
                                    <option value="7">Julho</option>
                                    <option value="8">Agosto</option>
                                    <option value="9">Setembro</option>
                                    <option value="10">Outubro</option>
                                    <option value="11">Novembro</option>
                                    <option value="12">Dezembro</option>
                                </select>
                                <select className={style.resumo__content_item_select__arrow} value={ano} name="ano_inicio" onChange={(e) => setAno(e.target.value)}>
                                    {anosDisponiveis.map((item) => (
                                        <option key={item} value={item}>
                                            {item}
                                        </option>
                                    ))}

                                </select>
                                <div className={style.resumo__content_date_button}>
                                    <button onClick={avancar}>Avançar</button>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default Resumo