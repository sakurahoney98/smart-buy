import { formatarValorParaExibicao } from '../util/formatador'

import style from '../styles/ItemCronograma.module.css'



/**
 * Componente responsável por exibir um item do cronograma mensal,
 * apresentando informações financeiras formatadas.
 * 
 * @param {Object} props
 * @param {string} props.periodo -  Mês e ano da ação no formato "MMM/AAAA" (Ex.: "JAN/2025").
 * @param {string} props.acao - Atividade para ser feita no período.
 * @param {string} props.obrigacao - Descrição de pagamentos obrigatórios (parcelas, contas, etc.).
 * @param {number} props.orcamento - Orçamento disponível no período (em decimal).
 * @param {number} props.acumulado - Valor acumulado no mês (em decimal).
 * @param {number} props.saldoPosCompra - Valor real em caixa (em decimal).
 * @returns {JSX.Element} Card com as informações principais de um mês do cronograma.
 */
function ItemCronograma({ periodo, acao = "", obrigacao = "", orcamento = 0, acumulado = 0, saldoPosCompra = 0 }) {

    return (
        <div className={style.cronograma__item}>
            <h2>{periodo}</h2>
            <div className={style.cronograma__item_action}>
                <h4>Ação:</h4>
                <p>{acao}</p>
            </div>
            <div className={style.cronograma__item_action}>
                <h4>Obrigação do mês:</h4>
                <p>{obrigacao}</p>
            </div>

            <div className={style.cronograma__item_details}>
                <div className={style.cronograma__item_detail_column}>
                    <p>Orçamento:</p>
                    <h4>{formatarValorParaExibicao(orcamento)}</h4>

                </div>
                <div className={style.cronograma__item_detail_column}>
                    <p>Acumulado:</p>
                    <h4>{formatarValorParaExibicao(acumulado)}</h4>

                </div>
                <div className={style.cronograma__item_detail_column}>
                    <p>Saldo pós-compra:</p>
                    <h4 className={style.cronograma__emphasis}>{formatarValorParaExibicao(saldoPosCompra)}</h4>

                </div>
            </div>

        </div>
    )
}

export default ItemCronograma