import HeaderVoltar from '../components/HeaderVoltar'
import CardValor from "../components/CardValor"
import { useOrcamento } from "../context/OrcamentoContext"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

import icon_card from '../assets/credit_card.png'
import style from '../styles/Credito.module.css'


/**
 * Página para inserir a informação de crédito a ser usado no projeto.
 * 
 * Esta página é protegida: só pode ser acessada se o usuário já tiver informado o orçamento 
 * na página anterior. Caso contrário, é redirecionado automaticamente para /escolha-orcamento.
 * 
 * @returns {JSX.Element} Página com input para capturar o crédito a ser usado.
 */
function Credito() {

    const { atualizarCampo, dados } = useOrcamento()
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


    /**
     * Converte o valor do crédito recebido para decimal e redireciona o usuário para 
     * a tela para montar a lista de compras.
     * 
     * @param {number} valor - Valor em centavos retornado pelo CardValor.
     */
    function handleSalvarCredito(valor) {
        atualizarCampo("credito", valor / 100)
        navigate("/lista-de-compras")
    }

    return (
        <div className={style.credito}>
            <div className={style.credito__container}>
                <HeaderVoltar to="/escolha-orcamento" />
                <CardValor titulo="Limite do Cartão de Crédito"
                    descricao="Informe o valor do cartão de crédito disponível que você quer usar no projeto. Se não tiver ou não quiser usar, digite 0:"
                    icon={icon_card}
                    acao={handleSalvarCredito}
                    valorInicial={dados.credito}
                    isCredito />

            </div>

        </div>
    )
}

export default Credito