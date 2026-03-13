
import { formatarValorParaExibicaoDecimal } from "../util/formatador"
import { useState } from "react"


import style from '../styles/ItemCompra.module.css'

/**
 * Componente controlado responsável por exibir e atualizar
 * um item da lista de compras, incluindo máscara monetária
 * para o campo de valor.
 * 
 * @param {Object} props
 * @param {number} props.numeroItem -  Posição do item na lista.
 * @param {string} props.nome - Nome do item.
 * @param {number} props.valor - Valor do item em decimal.
 * @param {Function} props.removerItem - Função que remove um item e/ou posição da lista.
 * @param {Function} props.atualizacao - Função callback chamada quando o item é modificado. 
 * @param {number} props.idItem - Identificador da posição.
 * @param {boolean} props.permiteExclusao - Valor que indica se o botão de excluir deve ser habilitado ou não.
 *                                          O botão só é habilitado se houver mais de um item na lista.
 * @returns {JSX.Element} Card para inserir informações do item de compra.
 */
function ItemCompra({ numeroItem = 0, nome = "", valor = 0, removerItem, atualizacao, idItem, permiteExclusao = false }) {


    const [valorFormatado, setValorFormatado] = useState(formatarValorParaExibicaoDecimal(Number(valor || 0) * 100))

    /**
     * Processa a entrada do usuário no campo de valor.
     * 
     * 1. Remove caracteres não numéricos do input
     * 2. Atualiza o estado local com o valor formatado para exibição
     * 3. Notifica o componente pai com o valor em reais (centavos / 100)
     * 
     * @param {Event} e - Evento de change do input
     */
    function atualizarValor(e) {
        const valorRecebido = e.target.value.replace(/\D/g, "")
        setValorFormatado(formatarValorParaExibicaoDecimal(valorRecebido))
        atualizacao(idItem, "valor", Number(valorRecebido) / 100)

    }

    return (
        <div className={style.item__content_item}>
            <div className={style.item__content_item_header}>
                <h4>Item {numeroItem}</h4>
                {permiteExclusao && (
                    <button onClick={() => removerItem(idItem)}></button>

                )

                }

            </div>
            <div className={style.item__content_item_form_group}>
                <label htmlFor={`nome-${numeroItem}`}>Nome do item</label>
                <input type="text" id={`nome-${numeroItem}`} placeholder="Ex: Geladeira, TV, Sofá..." value={nome} onChange={(e) => atualizacao(idItem, "nome", e.target.value)} />



            </div>
            <div className={style.item__content_item_form_group}>
                <label htmlFor={`valor-${numeroItem}`}>Valor</label>
                <input type="text" id={`valor-${numeroItem}`} placeholder="R$ 0,00" value={valorFormatado} onChange={atualizarValor} />

            </div>

        </div>
    )
}

export default ItemCompra