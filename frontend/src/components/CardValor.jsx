import { useState } from "react"
import { formatarValorParaExibicaoConversao } from '../util/formatador'

import style from '../styles/CardValor.module.css'

/**
 * Componente responsável por capturar e formatar um valor monetário
 * em centavos, exibindo-o com máscara de moeda brasileira (BRL).
 *
 * Mantém estado interno para controle do input e delega o processamento final 
 * do valor ao callback fornecido.
 * O botão de confirmação é desabilitado quando:
 * - O campo de valor está vazio (!valor)
 * - OU (não é crédito E o valor é zero)
 * Isso evita confirmação de valores zerados para salário/orçamento,
 * mas permite valor zero para crédito (usuário pode não ter crédito).
 * 
 * @param {Object} props
 * @param {string} props.titulo - Resumo textual do card.
 * @param {string} props.descricao - Texto complementar do título.
 * @param {string} props.icon - Caminho da imagem que representa o card.
 * @param {string} props.descricaoImagem - Descrição textual da imagem para acessibilidade (alt text).
 * @param {Function} props.acao - Callback disparado ao realizar o submit das informações.
 * @param {number} props.valorInicial - Valor capturado em uma interação anterior do usuário com o componente.
 * @param {boolean} props.isCredito - Indicativo se o card foi acionado para inserir o valor de crédito do orçamento.
 */
function CardValor({ titulo = "", descricao = "", icon = "", descricaoImagem = "", acao, valorInicial = 0, isCredito = false }) {

    // Lógica de inicialização do estado:
    // - Se valorInicial > 0: converte para centavos (ex: 1500 → 150000)
    // - Se valorInicial = 0 e isCredito = true: começa com "0" (crédito pode ser zero)
    // - Se valorInicial = 0 e isCredito = false: começa com "" (exige input do usuário)
    const valorEmCentavos = valorInicial ? valorInicial * 100 : isCredito ? 0 : ""
    const [valor, setValor] = useState(valorEmCentavos.toString())
    const valorExibicao = formatarValorParaExibicaoConversao(valor)


    /**
     * Função para remover caracteres não numéricos do input de valor.
     * 
     * Modifica e formata o valor em exibição no input.
     * 
     * @param {Event} e - Evento acionado.
     */
    function formatarValorInput(e) {
        const valorRecebido = e.target.value.replace(/\D/g, "")

        setValor(valorRecebido)

    }

    return (
        <div className={style.card_valor__content}>
            <div className={style.card_valor__content_icon}>
                <img src={icon} alt={descricaoImagem} width="32" height="32" />

            </div>
            <div className={style.card_valor__content_text}>
                <h2>{titulo}</h2>
                <p>{descricao}</p>

            </div>
            <form onSubmit={(e) => {
                    e.preventDefault()
                    acao(valor)
                }}>
                <div className={style.card_valor__content_value}>

                    <input id={style.valor_card_valor} type="text" onChange={formatarValorInput} value={valor} />
                    <p>Valor: <strong>{valorExibicao}</strong> </p>

                </div>
                <div className={style.card_valor__content_button}>
                    
                    <button disabled={!valor || (!isCredito && Number(valor) === 0)}>Confirmar</button>

                </div>

            </form>


        </div>
    )
}

export default CardValor