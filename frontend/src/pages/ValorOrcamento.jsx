import HeaderVoltar from "../components/HeaderVoltar"
import CardValor from "../components/CardValor"
import { useOrcamento } from "../context/OrcamentoContext"
import { useNavigate } from "react-router-dom"


import icon_wallet from '../assets/icon_wallet.png'
import style from '../styles/ValorOrcamento.module.css'




/**
 * Página para inserção manual do valor do orçamento mensal.
 * 
 * O usuário informa quanto pode economizar por mês. Este valor é
 * armazenado no contexto e, após confirmado, redireciona para a
 * página de definição do limite de crédito (/credito).
 * 
 * @returns {JSX.Element} Página com input para informação do orçamento.
 */
function ValorOrcamento() {

    const { atualizarCampo, dados } = useOrcamento()
    const navigate = useNavigate()


    /**
     * Converte o valor do orçamento recebido para decimal e redireciona o usuário para 
     * a tela de informar o valor do crédito.
     * 
     * @param {number} valor - Valor em centavos retornado pelo CardValor.
     */
    function handleSalvarOrcamento(valor) {
        atualizarCampo("orcamento", valor / 100)
        navigate("/credito")
    }

    return (
        <div className={style.orcamento}>
            <div className={style.orcamento__container}>
                <HeaderVoltar to="/escolha-orcamento" />
                <CardValor titulo="Defina seu orçamento mensal"
                    descricao="Informe o valor máximo que você pode juntar todo mês para comprar os itens:"
                    icon={icon_wallet}
                    acao={handleSalvarOrcamento}
                    valorInicial={dados.orcamento} />

            </div>

        </div>
    )
}

export default ValorOrcamento