import HeaderVoltar from '../components/HeaderVoltar'
import ItemPrioridade from '../components/ItemPrioridade'
import { useOrcamento } from "../context/OrcamentoContext"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useState } from "react"

import icon_hand from '../assets/hand.png'
import style from '../styles/PriorizacaoManual.module.css'

/**
 * Página para priorizar os itens de forma manual.
 * 
 * Esta página é protegida: só pode ser acessada se o usuário já tiver informado o orçamento e montado 
 * a lista de compras nas etapas anteriores. Caso contrário, é redirecionado automaticamente para 
 * /escolha-orcamento ou /lista-de-compras.
 * 
 * Permite que o usuário defina individualmente o nível de prioridade de cada item, de 1 a 4.
 * 
 * @returns {JSX.Element} Página com itens listados para serem priorizados.
 */
function PriorizacaoManual() {

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

    const [itens, setItens] = useState(dados.itens)

    /**
     * Função responsável por atualizar a prioridade do item na lista quando
     * o usuário altera.
     * 
     * @param {number} id - Identificador do item.
     * @param {number} valor - Prioridade do item (1 - 4).
     */
    function atualizarPrioridade(id, valor) {
        setItens(prevItens =>
            prevItens.map(item =>
                item.id === id
                    ? { ...item, ["prioridade"]: valor }
                    : item
            )
        )

    }

    /**
     * Função responsável por bloquear o avanço do sistema enquanto todos os
     * itens da lista não forem priorizados.
     * 
     * @returns Indicativo se o sistema pode ou não passar para a próxima etapa.
     */
    function bloquearAvancar() {

        return itens.some(item =>
            !item.prioridade || item.prioridade === 0
        )

    }

    /**
     * Função responsável por atualizar a prioridade dos itens no contexto e avançar
     * para a etapa de confirmação dos dados informados.
     * 
     */
    function avancar() {

        atualizarCampo("itens", itens)
        navigate("/resumo")
    }

    return (
        <div className={style.priorizacao}>
            <div className={style.priorizacao__container}>
                <HeaderVoltar to="/priorizacao" />
                <div className={style.priorizacao__content}>
                    <div className={style.priorizacao__content_icon}>
                        <img src={icon_hand} alt="Ícone de mão segurando lápis" width="32" height="32" />

                    </div>
                    <div className={style.priorizacao__content_text}>
                        <h2>Priorização Manual</h2>
                        <p>Escolha a prioridade de cada item (1 = mais urgente, 4 = menos urgente)</p>

                    </div>
                    <div className={style.priorizacao__content_list_item}>
                        {itens.map((item) => (
                            <ItemPrioridade
                                key={item.id}
                                nome={item.nome}
                                valor={item.valor}
                                prioridade={item.prioridade}
                                idItem={item.id}
                                atualizacao={atualizarPrioridade}
                            />
                        )

                        )

                        }

                    </div>
                    <div className={style.priorizacao__content_button}>
                        <button disabled={bloquearAvancar()} onClick={avancar}>Avançar</button>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default PriorizacaoManual