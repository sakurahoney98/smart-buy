import style from '../styles/CardFormulario.module.css'

/**
 * @typedef {Object} OpcaoFormulario
 * @property {string} props.alternativa - Identificador da opção (A - E).
 * @property {string} props.texto - Descrição textual da opção.
 */

/**
 * Componente de formulário para priorização de itens.
 * 
 * Atua como um "Humble Object", focando apenas na apresentação visual e 
 * delegando a lógica de estado para o componente pai.
 * 
 * @param {Object} props
 * @param {string} props.nome - Nome do item sendo avaliado.
 * @param {number} posicaoItem - Posição do item no questionário.
 * @param {number} totalItens - Total de itens a avaliar.
 * @param {string} props.tipo - Categoria da pergunta (IMPACTO, URGÊNCIA e SITUAÇÃO).
 * @param {string} props.pergunta - Descrição textual da pergunta a ser exibida.
 * @param {Array<OpcaoFormulario>} opcoes - Lista de alternativas disponíveis.
 * @param {string} props.valorSelecionado - A alternativa atualmente marcada.
 * @param {string} props.progresso - Porcentagem de preenchimento do formulário para a barra de progresso (ex: "50%").
 * @param {Function} atualizarResposta - Callback disparado ao mudar a opção.
 * 
 * @returns {JSX.Element} Card com a pergunta relacionada a um item da lista de compras.
 */
function CardFormulario({ nome = "", posicaoItem = 1, totalItens = 1, idItem = 0, tipo = "", pergunta = "", opcoes = [], valorSelecionado="", progresso="0%", atualizarResposta }) {
    
   
    return (
        <div>
            <div className={style.formulario__text}>
                <p>Item {posicaoItem} de {totalItens}</p>
                <h2>{nome}</h2>
            </div>

            <div className={style.formulario__progress_bar}>
                <div className={style.formulario__progress_bar__extern}>
                    <div className={style.formulario__progress_bar__intern} style={{width:progresso}}>

                    </div>
                </div>

            </div>
            <div className={style.formulario__form}>
                <div className={style.formulario__form_ask}>
                    <div className={style.formulario__form_ask__type}>
                        {tipo}


                    </div>
                    <div className={style.formulario__form_ask__question}>
                        <h3>{pergunta}</h3>
                    </div>

                </div>
                <div className={style.formulario__form_options}>
                    {opcoes.map((item) => (
                        <label key={`pergunta_${tipo}_${idItem}_${item.alternativa}`} className={style.formulario__form_group}>
                            <input
                                type="radio"
                                name={`pergunta_${tipo}_${idItem}`}
                                value={item.alternativa}
                                checked={valorSelecionado === item.alternativa}
                                onChange={() => atualizarResposta(tipo, item.alternativa)}
                            />
                            <span>{item.texto}</span>
                        </label>
                    )

                    )

                    }
                </div>

            </div>

        </div>

    )
}

export default CardFormulario