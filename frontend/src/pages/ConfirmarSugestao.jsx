import HeaderVoltar from '../components/HeaderVoltar'
import { formatarValorParaExibicao } from '../util/formatador'
import { useOrcamento } from "../context/OrcamentoContext"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

import icon_stars from '../assets/stars.png'
import icon_reject from '../assets/reject.png'
import icon_acept from '../assets/acept.png'
import style from '../styles/ConfirmarSugestao.module.css'



/**
 * Página para a confirmação de orçamento oferecida pelo sistema.
 * 
 * Esta página é protegida: só pode ser acessada se o usuário já tiver informado
 * o salário na página anterior. Caso contrário, é redirecionado automaticamente
 * para /salario.
 * 
 * Exibe a sugestão do sistema e permite que o usuário aceite ou não a sugestão. 
 * Em caso de rejeição, o usuário é redirecionado para a página de informar o orçamento 
 * normalmente. Em caso de aceitação, o usuário é redirecionado para a página de informar 
 * o valor do crédito.
 * 
 * @returns {JSX.Element} Página com botões de aceitar ou rejeitar orçamento.
 */
function ConfirmarSugestao() {
    const { dados } = useOrcamento()
    const navigate = useNavigate()

    // Proteção de rota: redireciona se salário não foi informado
    useEffect(() => {
        if (!dados.salario || dados.salario === 0) {
            navigate("/salario")
        }
    }, [dados.salario, navigate])

    //  Não carrega a página se salário não for informado
    if (!dados.salario || dados.salario === 0) {
        return null
    }

    const valorFormatado = formatarValorParaExibicao(dados.orcamento)

    return (
        <div className={style.confirmacao}>
            <div className={style.confirmacao__container}>
                <HeaderVoltar to="/salario" />
                <div className={style.confirmacao__content}>
                    <div className={style.confirmacao__content_icon}>
                        <img src={icon_stars} alt="Ícone de estrelas" width="32" height="32" />

                    </div>
                    <div className={style.confirmacao__content_text}>
                        <h2>Nossa sugestão</h2>
                        <p>Sugerimos esse valor como um limite confortável para manter sua saúde financeira. Você pode ajustar conforme sua realidade.</p>

                    </div>
                    <div className={style.confirmacao__content_value}>
                        <p>Valor sugerido</p>
                        <h1>{valorFormatado}</h1>
                        <p>(20% do seu salário líquido)</p>

                    </div>
                    <div className={style.confirmacao__content_button}>
                        <button className={style.confirmacao__content_button__rejeitar} onClick={() => navigate("/valor-orcamento")}>
                            <img src={icon_reject} alt="Ícone de X vermelho representando rejeitar sugestão" width="16" height="16" />
                            Rejeitar
                        </button>
                        <button className={style.confirmacao__content_button__aceitar} onClick={() => navigate("/credito")}>
                            <img src={icon_acept} alt="Ícone de V verde representando aceitar sugestão" width="16" height="16" />
                            Aceitar
                        </button>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default ConfirmarSugestao