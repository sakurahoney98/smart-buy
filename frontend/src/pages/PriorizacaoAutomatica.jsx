import HeaderVoltar from '../components/HeaderVoltar'
import CardFormulario from '../components/CardFormulario'
import { buscarPerguntas, buscarPrioridade } from '../services/priorizacaoService'
import { useOrcamento } from "../context/OrcamentoContext"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useState } from "react"

import icon_question from '../assets/question.png'
import style from '../styles/PriorizacaoAutomatica.module.css'


/**
 * Página para priorizar os itens de forma automática.
 * 
 * Esta página é protegida: só pode ser acessada se o usuário já tiver informado o orçamento 
 * e montado a lista de compras nas etapas anteriores. Caso contrário, é redirecionado automaticamente 
 * para /escolha-orcamento ou /lista-de-compras.
 * 
 * Apresenta um questionário sobre cada item da lista de compras. As respostas fornecidas pelo 
 * usuário são enviadas ao backend, que calcula automaticamente a prioridade dos itens.
 * 
 * @returns {JSX.Element} Página com questionário para definição automática das prioridades.
 */
function PriorizacaoAutomatica() {

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

    const [perguntas, setPerguntas] = useState([])
    const [indicePergunta, setIndicePergunta] = useState(0)
    const [indiceItem, setIndiceItem] = useState(0)
    const [respostas, setRespostas] = useState([])


    useEffect(() => {
        /**
         * Função assíncrona responsável por capturar as perguntas do backend.
         * 
         */
        async function carregar() {
            try {
                const listaPerguntas = await buscarPerguntas()
                setPerguntas(listaPerguntas.perguntas)
                console.log(listaPerguntas.perguntas)

            } catch (error) {
                console.log(error)
            }
        }

        carregar()
    }, [])

    useEffect(() => {
        // Espera o carregamento completo da lista de compras e das perguntas
        // do backend para montar a estrutura de respostas do questionário
        if (dados.itens.length > 0 && perguntas.length > 0) {

            const estruturaInicial = dados.itens.map((item) => ({
                idItem: item.id,
                respostas: perguntas.reduce((acc, pergunta) => {
                    acc[pergunta.tipo] = null
                    return acc
                }, {})
            }))

            setRespostas(estruturaInicial)
        }

    }, [dados.itens.length, perguntas.length])


    /**
     * Função responsável por atualizar na lista a resposta vinculada a um item.
     * 
     * @param {string} tipoPergunta - categoria da pergunta respondida (URGÊNCIA, IMPACTO e SITUAÇÃO).
     * @param {number} valorSelecionado - Alternativa escolhida para a categoria da pergunta (A - E).
     */
    function atualizarResposta(tipoPergunta, valorSelecionado) {
        setRespostas(prev =>
            prev.map((item, index) => {
                if (index !== indiceItem) return item

                return {
                    ...item,
                    respostas: {
                        ...item.respostas,
                        [tipoPergunta]: valorSelecionado
                    }
                }
            })
        )
    }

    /**
     * Função responsável por avançar uma pergunta no questionário.
     * 
     */
    function proximo() {

        const ultimaPergunta = indicePergunta === perguntas.length - 1
        const ultimoItem = isUltimoItem()

        if (!ultimaPergunta) {
            setIndicePergunta(prev => prev + 1)
            return
        }

        if (!ultimoItem) {
            setIndiceItem(prev => prev + 1)
            setIndicePergunta(0)
            return
        }


        console.log("Finalizou o formulário")
    }

     /**
     * Função responsável por retroceder uma pergunta no questionário.
     * 
     */
    function anterior() {

        const primeiraPergunta = indicePergunta === 0
        const primeiroItem = indiceItem === 0

        if (!primeiraPergunta) {
            setIndicePergunta(prev => prev - 1)
            return
        }

        if (!primeiroItem) {
            setIndiceItem(prev => prev - 1)
            setIndicePergunta(perguntas.length - 1)
        }


    }

     /**
     * Função assíncrona responsável por capturar a prioridade dos itens
     * da lista no backend.
     * 
     * A função envia as respostas fornecidas pelo usuário ao backend e 
     * retorna a lista priorizada, inserindo-a no contexto. Ao final,
     * redireciona o usuário para a tela de confirmação dos dados informados.
     * 
     */
    async function finalizar() {
        try {
   
            const listaPriorizada = await buscarPrioridade(respostas)

            const novaListaItens = dados.itens.map(item => {
                const itemPriorizado = listaPriorizada.lista.find(
                    obj => obj.idItem === item.id
                )

                if (!itemPriorizado) return item

                return {
                    ...item,
                    prioridade: itemPriorizado.prioridade
                }
            })

            atualizarCampo("itens", novaListaItens)

            navigate("/resumo")


        } catch (error) {
            console.log(`Erro ao tentar priorizar os itens: ${error}`)
        }

    }

     /**
     * Função responsável por retornar se o item atual é o último da lista.
     * 
     * @returns Indicativo se o item atual é ou não o último item da lista.
     */
    function isUltimoItem() {

        return indiceItem === dados.itens.length - 1

    }

    /**
     * Função responsável por retornar se a pergunta atual é a última do
     * questionário.
     * 
     * @returns Indicativo se a pergunta atual é ou não a última do questionário.
     */
    function isUltimaEtapa(){
        return isUltimoItem() && indicePergunta === perguntas.length - 1
    }

    /**
     * Função responsável por identificar a porcentagem de preenchimento do
     * questionário.
     * 
     * @returns Percentual em texto de quanto % o questionário foi preenchido.
     */
    function porcentagemProgresso(){
        const etapaAtual = (indiceItem * perguntas.length) + (indicePergunta + 1)
        const porcentagem = etapaAtual / (dados.itens.length * perguntas.length)

        

        return `${porcentagem * 100}%`
        
    }

    /**
     * Função responsável por bloquear o avanço do questionário.
     * 
     * A função verifica se a pergunta atual foi preenchida para
     * permitir o avanço para a próxima etapa.
     * 
     * @returns Indicativo se o usuário pode passar para a próxima etapa.
     */
    function bloquearProximo() {

        if (!perguntas[indicePergunta] || !respostas[indiceItem]) {
            return true
        }

        const tipoPerguntaAtual = perguntas[indicePergunta].tipo
        const respostasItem = respostas[indiceItem].respostas

        return respostasItem[tipoPerguntaAtual] === null


    }

    return (
        <div className={style.priorizacao}>
            <div className={style.priorizacao__container}>
                <HeaderVoltar to="/priorizacao" />
                <div className={style.priorizacao__content}>
                    <div className={style.priorizacao__icon}>
                        <img src={icon_question} alt="Ícone de formulário." width="32" height="32" />

                    </div>

                    {(perguntas.length > 0 && respostas.length > 0) && (
                        <>
                            <CardFormulario
                                nome={dados.itens[indiceItem].nome}
                                posicaoItem={indiceItem + 1}
                                totalItens={dados.itens.length}
                                idItem={dados.itens[indiceItem].id}
                                tipo={perguntas[indicePergunta].tipo}
                                pergunta={perguntas[indicePergunta].pergunta}
                                opcoes={perguntas[indicePergunta].opcoes}
                                atualizarResposta={atualizarResposta}
                                valorSelecionado={respostas[indiceItem]?.respostas[perguntas[indicePergunta].tipo]}
                                progresso={porcentagemProgresso()}
                            />


                            <div className={style.priorizacao__button}>
                                {!(indiceItem === 0 && indicePergunta === 0) && (
                                    <button className={style.priorizacao__button__anterior} onClick={anterior}>⭠ Anterior</button>
                                )}
                                {!isUltimaEtapa()&& (
                                    <button className={style.priorizacao__button__proximo} onClick={proximo} disabled={bloquearProximo()} >Próximo ⭢</button>
                                )}
                                {isUltimaEtapa() && (
                                    <button className={style.priorizacao__button__proximo} disabled={bloquearProximo()} onClick={finalizar}>Finalizar ✓</button>
                                )}


                            </div>


                        </>


                    )}


                </div>

            </div>

        </div>
    )
}

export default PriorizacaoAutomatica