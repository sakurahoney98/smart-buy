
import CardOpcao from '../components/CardOpcao'
import HeaderVoltar from '../components/HeaderVoltar'
import { useOrcamento } from "../context/OrcamentoContext"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

import icon_hand from '../assets/hand.png'
import icon_question from '../assets/question.png'
import style from '../styles/Escolha.module.css'

/**
 * Página para escolha de forma de priorização.
 * 
 * Esta página é protegida: só pode ser acessada se o usuário já tiver informado o orçamento e 
 * montado a lista de compras na página anterior. Caso contrário, é redirecionado automaticamente 
 * para /escolha-orcamento ou /lista-de-compras.
 * 
 * Permite que o usuário escolha se deseja priorizar os itens da lista de compra manualmente ou
 * que o sistema defina a priorização a partir de um questionário.
 * 
 * @returns {JSX.Element} Página com duas opções de cenário para escolha.
 */
function EscolhaPriorizacao(){

 const { dados } = useOrcamento()
    const navigate = useNavigate()

    
    useEffect(() => {
        // Proteção de rota: redireciona se o orçamento não foi definido
            if (!dados.orcamento || dados.orcamento === 0 ) {
                navigate("/escolha-orcamento")
            }
            // Proteção de rota: redireciona se a lista de compras não foi montada
            if(dados.itens.length === 0){
                navigate("/lista-de-compras")
            }
        }, [dados.orcamento, dados.itens.length, navigate])
    
    
        //  Não carrega a página se o orçamento não foi definido ou a lista de compras não
        // foi montada
        if (!dados.orcamento || dados.orcamento === 0 || dados.itens.length === 0) {
            return null
        }

    return(
         <div className={style.escolha}>
            <div className={style.escolha__container}>
                <HeaderVoltar to="/lista-de-compras" />
                <div className={style.escolha__question}>
                    <h1>Como deseja priorizar?</h1>
                    <p>Escolha como você quer organizar a ordem de compra dos seus itens.</p>

                </div>
                <div className={style.escolha__answer}>
                    <CardOpcao titulo="Priorizar manualmente"
                        descricao="Você define a prioridade de cada item de 1 a 4."
                        imagem={icon_hand} descricaoImagem="Ícone de mão segurando um lápis."
                        to="/priorizacao-manual" />
                    <CardOpcao titulo="Deixe o sistema priorizar"
                        descricao="Responda algumas perguntas e calculamos para você."
                        imagem={icon_question}
                        descricaoImagem="Ícone de questionário."
                        to="/priorizacao-automatica" />

                </div>

            </div>

        </div>
    )
}

export default EscolhaPriorizacao