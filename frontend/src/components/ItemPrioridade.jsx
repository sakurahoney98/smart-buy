import { formatarValorParaExibicao } from '../util/formatador'

import style from '../styles/ItemPrioridade.module.css'


/**
 * Componente responsável por exibir um item afim de escolher sua prioridade
 * manualmente.
 * 
 * @param {Object} props
 * @param {string} props.nome - Nome do item.
 * @param {number} props.valor - Valor do item.
 * @param {number} props.prioridade - Nível de prioridade do item (1 - 4).
 * @param {number} props.idItem - Identificador do item na lista.
 * @param {Function} props.atualizacao - Callback chamada quando a prioridade é alterada.
 * @returns {JSX.Element} Card com informações do item e seletor de prioridade.
 */
function ItemPrioridade({nome = "", valor = 0, prioridade = 0, idItem = 0, atualizacao}) {

    return (
        <div className={style.priorizacao__content_item}>
            <div className={style.priorizacao__content_item_text}>
                <h4>{nome}</h4>
                <p>{formatarValorParaExibicao(valor)}</p>

            </div>
            <div className={style.priorizacao__content_item_select}>
                <select className={style.priorizacao__content_item_select__arrow} value={prioridade} name={`prioridade-${idItem}`} id={idItem} onChange={(e) => atualizacao(idItem, Number(e.target.value))}>
                    <option value="0">Nível</option>
                    <option value="1">1 - Necessário</option>
                    <option value="2">2 - Importante</option>
                    <option value="3">3 - Desejável</option>
                    <option value="4">4 - Luxo</option>
                </select>

            </div>

        </div>
    )
}

export default ItemPrioridade