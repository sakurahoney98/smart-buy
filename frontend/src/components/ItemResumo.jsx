import style from '../styles/ItemResumo.module.css'

/**
 * Componente responsável por exibir um item da lista com a prioridade definida.
 * 
 * @param {Object} props
 * @param {number} props.posicao - Posição do item na lista.
 * @param {string} props.nome - Nome do item.
 * @param {number} props.valor - Valor do item.
 * @param {string} props.cor - Cor em formato CSS (hex, rgb, nome) representando a prioridade.
 * @param {string} props.prioridade - Nome do nível de prioridade do item (Urgente - Baixo).
 * @returns {JSX.Element} Card com a informação de valor e indicativo visual de prioridade do item.
 */
function ItemResumo({posicao = 0, nome = "", valor = 0, cor = "", prioridade = ""}) {
    return (
        <div className={style.card__item}>
            <div className={style.card__column_left}>
                <p className={style.card__line__emphasis}>{posicao}.</p>
                <div className={style.card__priority_indicator} style={{backgroundColor:cor}}></div>
                <p style={{ color: "black" }}>{nome}</p>

            </div>
            <div className={style.card__column_right}>
                <p style={{ color: "black" }}>{valor}</p>
                <p className={style.card__line__small} >{prioridade}</p>

            </div>
        </div>
    )
}

export default ItemResumo