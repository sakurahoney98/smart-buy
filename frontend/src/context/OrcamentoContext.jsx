import { createContext, useContext, useState, useEffect } from "react";

/**
 * @typedef {Object} OrcamentoDados
 * @property {number} orcamento - Valor de economia mensal.
 * @property {number} salario - Salário líquido informado.
 * @property {number} credito - Limite de crédito disponível.
 * @property {number} mes - Mês de referência (0-11).
 * @property {number} ano - Ano de referência.
 * @property {Array<Item>} itens - Lista de itens planejados para compra.
 */

/**
 * @typedef {Object} Item
 * @property {number} idItem - Identificador do item.
 * @property {string} item - Nome do item.
 * @property {number} valor - Valor do item.
 * @property {number} prioridade - Nível de prioridade do item (1 - 4).
 */

const OrcamentoContext = createContext()


/**
 * Provedor do Contexto de Orçamento.
 * 
 * Atua como uma "camada de cache em memória" e gerencia a persistência
 * dos dados financeiros no sessionStorage do navegador.
 */
export function OrcamentoProvider({ children }) {
    const [dados, setDados] = useState(() => {
        const dadosSalvos = sessionStorage.getItem("orcamentoApp")
        return dadosSalvos
            ? JSON.parse(dadosSalvos)
            : {
                orcamento: 0,
                salario: 0,
                credito: 0,
                mes: 0,
                ano: 0,
                itens: []
            }
    })


    /**
     * Atualiza um campo específico do estado de forma atômica.
     * 
     * @param {string} campo - O nome da propriedade a ser atualizada.
     * @param {any} valor - O novo valor para o campo.
     */
    function atualizarCampo(campo, valor) {
        setDados((prev) => ({
            ...prev,
            [campo]: valor
        }))
    }


    /**
     * Retorna os valores dos dados para o estado inicial.
     * 
     */
    function limparDados() {
        setDados({
            orcamento: 0,
            salario: 0,
            credito: 0,
            mes: 0,
            ano: 0,
            itens: []
        })
    }

    // Sincroniza o estado interno com o armazenamento externo
    useEffect(() => {
        sessionStorage.setItem("orcamentoApp", JSON.stringify(dados))
    }, [dados])

    return (
        <OrcamentoContext.Provider value={{
            dados,
            atualizarCampo,
            limparDados
        }}>
            {children}
        </OrcamentoContext.Provider>
    )

}

/**
 * Hook personalizado para acessar o contexto de orçamento.
 * Encapsula a lógica de consumo do contexto, promovendo a inversão de dependência.
 * 
 * @returns {{dados: OrcamentoDados, atualizarCampo: Function, limparDados: Function}}
 */
export function useOrcamento() {
    return useContext(OrcamentoContext)
}
