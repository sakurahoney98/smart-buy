import { API_SALARIO } from "./api"

/**
 * Realiza requisição POST enviando o salário do usuário.
 * Envia o salário do usuário e retorna o valor sugerido para orçamento.
 * 
 * @param {number} salario - Valor do salário mensal informado pelo usuário.
 * @returns {Promise<number>} Sugestão de orçamento mensal.
 * @throws {Error} Se a requisição falhar ou a resposta não for bem-sucedida.
 */
export async function buscarSugestao(salario) {
    try {

        const response = await fetch(API_SALARIO, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                salario: salario
            })
        })

        if (!response.ok) {
            throw new Error("Erro ao buscar sugestão")
        }

        const data = await response.json()
        return data

    } catch (error) {
        console.error("Erro na API:", error)
        throw error
    }
}