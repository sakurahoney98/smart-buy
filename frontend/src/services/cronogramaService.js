import { API_CRONOGRAMA } from "./api"

/**
 * Envia os dados financeiros para processamento e retorna o cronograma gerado.
 * 
 * @param {Object} dados - Parâmetros financeiros (crédito, orçamento, itens, data).
 * @returns {Promise<Array<Object>>} O cronograma processado pelo backend.
 * @throws {Error} Se a requisição falhar ou a resposta não for bem-sucedida.
 */
export async function buscarCronograma(dados) {
    try {

        const response = await fetch(API_CRONOGRAMA, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                dados: dados
            })
        })

        if (!response.ok) {
            throw new Error("Erro ao buscar cronograma.")
        }

        const data = await response.json()
        return data

    } catch (error) {
        console.error("Erro na API:", error)
        throw error
    }
}