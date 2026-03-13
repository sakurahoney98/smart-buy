import HeaderVoltar from '../components/HeaderVoltar'
import CardValor from '../components/CardValor'
import { buscarSugestao } from "../services/salarioService"
import { useOrcamento } from "../context/OrcamentoContext"
import { useNavigate } from 'react-router-dom'



import icon_money from '../assets/icon_money.png'
import style from '../styles/Salario.module.css'

/**
 * Página para inserção do salário líquido a fim de receber uma sugestão 
 * do sistema.
 * 
 * O usuário informa seu salário mensal, e o sistema consulta uma API
 * que retorna uma sugestão de quanto ele pode destinar ao orçamento
 * de compras.
 * 
 * @returns {JSX.Element} Página com input para informação do salário.
 */
function Salario() {

    const { atualizarCampo } = useOrcamento()
    const navigate = useNavigate()

    /**
     * Função responsável para realizar a chamada via API que captura a sugestão
     * do orçamento e redirecionar o usuário para a página de confirmação da sugestão.
     * 
     * @param {number} valor - Valor em centavos retornado pelo CardValor.
     */
    async function handleCapturarSugestao(valor) {
        const salario = valor / 100

        try{
            const sugestao = await buscarSugestao(salario)

            atualizarCampo("orcamento", sugestao.sugestao)
            atualizarCampo("salario", salario)
            navigate('/confirmar-sugestao')

        } catch (error) {
            console.log(`Erro ao buscar sugestão: ${error}`)
        }
    }

    return (
        <div className={style.salario}>
            <div className={style.salario__container}>
                <HeaderVoltar to="/escolha-orcamento" />
                <CardValor titulo="Informe seu salário"
                    descricao="Informe seu salário LÍQUIDO ou um valor aproximado:"
                    icon={icon_money}
                    acao={handleCapturarSugestao} />
            </div>

        </div>

    )
}

export default Salario