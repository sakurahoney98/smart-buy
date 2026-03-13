import { API_PRIORIZACAO, API_PRIORIZACAO_PERGUNTAS } from "./api"

/**
 * @typedef {Object} Pergunta
 * @property {string} tipo - Categoria da pergunta (Urgência, Impacto e Situação).
 * @property {string} pergunta - Descrição textual da pergunta.
 * @property {Array<Opcao>} opcoes - Alternativas a serem escolhidas.
 */

/**
 * @typedef {Object} Opcao
 * @property {string} alternativa - Identificador da opção (A - E).
 * @property {string} texto - Descrição textual da alternativa.
 */

/**
 * @typedef {Object} ItemComResposta
 * @property {number} idItem - Identificador do item.
 * @property {Respostas} respostas - Respostas fornecidas para cada pergunta
 */

/**
 * @typedef {Object} Respostas
 * @property {string} IMPACTO - Alternativa escolhida para a categoria (A - E).
 * @property {string} SITUAÇÃO - Alternativa escolhida para a categoria (A - E).
 * @property {string} URGÊNCIA - Alternativa escolhida para a categoria (A - E).
 */

/**
 * @typedef {Object} ItemPriorizado
 * @property {number} idItem - Identificador do item.
 * @property {number} prioridade - Nível de prioridade do item (1 - 4).
 */



/**
 * Realiza requisição GET para o endpoint de perguntas.
 * Busca no backend as perguntas do questionário de priorização de itens.
 * 
 * @returns {Promise<Array<Pergunta>>} Lista de perguntas.
 * @throws {Error} Se a requisição falhar ou a resposta não for bem-sucedida.
 */
export async function buscarPerguntas() {
    try {

        const response = await fetch(API_PRIORIZACAO_PERGUNTAS, {
            method: "GET"
        })

        if (!response.ok) {
            throw new Error("Erro ao buscar perguntas.")
        }

        const data = await response.json()
        return data

    } catch (error) {
        console.error("Erro na API:", error)
        throw error
    }
}


/**
 * Realiza requisição POST enviando JSON.
 * Submete as respostas do usuário para cálculo das prioridades dos itens.
 * 
 * @param {Array<ItemComResposta>} lista - Lista de itens com as respectivas respostas.
 * @returns {Promise<Array<ItemPriorizado>>} Lista de itens priorizados.
 * @throws {Error} Se a requisição falhar ou a resposta não for bem-sucedida.
 */
export async function buscarPrioridade(lista) {
    try {

        const response = await fetch(API_PRIORIZACAO, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                lista: lista
            })
        })

        if (!response.ok) {
            throw new Error("Erro ao priorizar.")
        }

        const data = await response.json()
        return data

    } catch (error) {
        console.error("Erro na API:", error)
        throw error
    }
}