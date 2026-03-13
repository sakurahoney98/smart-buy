import { describe, it, expect } from "vitest"

import {
    formatarValorParaExibicaoConversao,
    formatarValorParaExibicao,
    formatarValorParaExibicaoDecimal
} from "./formatador"


describe("formatador", () => {

    it("converte centavos para moeda", () => {
        const valor = formatarValorParaExibicaoConversao(12345)

        expect(valor).toContain("123,45")
        expect(valor).toContain("R$")
    })


    it("retorna R$ 0,00 se valor vazio", () => {
        expect(formatarValorParaExibicaoConversao(null))
            .toContain("0,00")
    })


    it("formata decimal para moeda", () => {
        const valor = formatarValorParaExibicao(123.45)

        expect(valor).toContain("123,45")
        expect(valor).toContain("R$")
    })


    it("retorna R$ 0,00 se valor vazio", () => {
        const valor = formatarValorParaExibicao(undefined)

        expect(valor).toContain("0,00")
    })


    it("formata centavos sem símbolo", () => {
        expect(formatarValorParaExibicaoDecimal(12345))
            .toBe("123,45")
    })


    it("retorna vazio quando não há valor", () => {
        expect(formatarValorParaExibicaoDecimal(null))
            .toBe("")
    })

})