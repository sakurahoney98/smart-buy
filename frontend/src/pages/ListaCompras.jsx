import HeaderVoltar from '../components/HeaderVoltar'
import ItemCompra from '../components/ItemCompra'
import { useOrcamento } from "../context/OrcamentoContext"
import { useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"

import icon_bag from '../assets/shopping_bag.png'
import style from '../styles/ListaCompras.module.css'

/**
 * Página para a montagem da lista de compras.
 * 
 * Esta página é protegida: só pode ser acessada se o usuário já tiver informado o 
 * orçamento nas etapas anteriores. Caso contrário, é redirecionado automaticamente 
 * para /escolha-orcamento.
 * 
 * Permite que o usuário inclua ou remova itens na lista de compras informando nome e
 * valor do item.
 * 
 * @returns {JSX.Element} Página com formulário para montagem da lista de compras.
 */
function ListaCompras() {

    const { dados, atualizarCampo } = useOrcamento()
    const navigate = useNavigate()

    // Proteção de rota: redireciona se o orçamento não foi definido
    useEffect(() => {
        if (!dados.orcamento || dados.orcamento === 0) {
            navigate("/escolha-orcamento")
        }
    }, [dados.orcamento, navigate])


    //  Não carrega a página se o orçamento não foi definido
    if (!dados.orcamento || dados.orcamento === 0) {
        return null
    }

    const listaRef = useRef(null)

    // Cria uma lista auxiliar para armazenar os itens
    const [itens, setItens] = useState([
        { id: Date.now(), nome: "", valor: 0, prioridade: 0 }
    ])

    // Carrega uma lista anteriormente montada (quando houver)
    useEffect(() => {
        if (dados.itens.length > 0) {
            setItens(dados.itens)
        }
    }, [dados.itens])

    /**
     * Adiciona um item na lista de compras.
     * 
     */
    function adicionarItem() {
        setItens(prevItens => [
            ...prevItens,
            { id: Date.now(), nome: "", valor: 0, prioridade: 0 }
        ])
    }

    /**
     * Remove um item na lista de compras a partir do identificador.
     * 
     * @param {number} id - Identificador do item a ser removido.
     */
    function removerItem(id) {
        setItens(prevItens =>
            prevItens.filter(item => item.id !== id)
        )
    }

    /**
     * Altera o nome ou valor de um item da lista de compras.
     * 
     * @param {number} id - Identificador do item.
     * @param {string} campo - Campo a ser alterado.
     * @param {number | string} valor - Novo valor do campo.
     */
    function atualizarItem(id, campo, valor) {
        setItens(prevItens =>
            prevItens.map(item =>
                item.id === id
                    ? { ...item, [campo]: valor }
                    : item
            )
        )


    }

    /**
     * Impede que o usuário avance para outras etapas se não houver pelo menos
     * um item na lista de compras.
     * 
     * @returns Indicativo se o usuário pode ou não avançar para a próxima etapa.
     */
    function bloquearAvancar() {


        return !itens.some(item =>
            item.nome.trim() !== "" && item.valor > 0
        )

    }

    /**
     * Salva a lista de itens auxiliar na lista de itens global e redireciona
     * o usuário para a definição do modo de priorização dos itens.
     * 
     * Só faz a inserção de itens que possuem nome e valor preenchidos.
     * 
     */
    function avancar() {

        const itensValidos = itens.filter(item =>
            item.nome.trim() !== "" && item.valor > 0
        )
        atualizarCampo("itens", itensValidos)
        navigate("/priorizacao")

    }

    // Acompanha o último item inserido na lista
    useEffect(() => {
        if (listaRef.current) {
            listaRef.current.scrollTop = listaRef.current.scrollHeight
        }
    }, [itens])

    return (
        <div className={style.lista}>
            <div className={style.lista__container}>
                <HeaderVoltar to="/credito" />
                <div className={style.lista__content}>
                    <div className={style.lista__content_icon}>
                        <img src={icon_bag} alt="Ícone de sacola de compras" width="32" height="32" />

                    </div>
                    <div className={style.lista__content_text}>
                        <h2>Lista de Compras</h2>
                        <p>Adicione os itens que você deseja comprar</p>

                    </div>
                    <div className={style.lista__content_list_item} ref={listaRef}>
                        {itens.map((item, index) => (
                            <ItemCompra key={item.id}
                                numeroItem={index + 1}
                                nome={item.nome}
                                valor={item.valor}
                                removerItem={removerItem}
                                atualizacao={atualizarItem}
                                idItem={item.id}
                                permiteExclusao={itens.length > 1}
                            />
                        )

                        )

                        }

                    </div>
                    <div className={style.lista__content_button}>
                        <button className={style.lista__content_button__adicionar} onClick={adicionarItem}>Adicionar mais um item</button>
                        <button disabled={bloquearAvancar()} className={style.lista__content_button__avancar} onClick={avancar}>Avançar</button>

                    </div>

                </div>

            </div>

        </div>
    )
}
export default ListaCompras