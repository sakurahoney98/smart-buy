    /**
     * Formata um valor numérico (em centavos) para o formato de moeda brasileira.
     * 
     * @param {string} valorRecebido - Valor recebido.
     * @returns {string} Valor formatado.
     */
    export function formatarValorParaExibicaoConversao(valorRecebido) {
        return valorRecebido
            ? new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(Number(valorRecebido) / 100)
            : 'R$ 0,00'
    }

    /**
     * Formata um valor numérico (decimal) para o formato de moeda brasileira.
     * 
     * @param {string} valorRecebido - Valor recebido.
     * @returns {string} Valor formatado.
     */
    export function formatarValorParaExibicao(valorRecebido) {
        return valorRecebido
            ? new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(Number(valorRecebido))
            : 'R$ 0,00'
    }


    /**
     * Formata um valor em centavos para exibição como moeda brasileira,
     * removendo o símbolo "R$" do resultado final.
     * 
     * @param {string|number} valorRecebido - Valor em centavos.
     * @returns {string} Valor formatado sem o símbolo R$.
     */
    export function formatarValorParaExibicaoDecimal(valorRecebido) {
        return valorRecebido
            ? new Intl.NumberFormat('pt-BR', {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(Number(valorRecebido) / 100)
            : ""

    }
