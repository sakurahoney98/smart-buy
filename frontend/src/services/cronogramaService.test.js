import { describe, it, expect, vi, beforeEach } from "vitest"
import { buscarCronograma } from "./cronogramaService"


describe("cronogramaService", () => {

    beforeEach(() => {
        vi.restoreAllMocks()
    })


    it("deve chamar a API corretamente e retornar os dados", async () => {

        const mockResponse = {
            cronograma: [
                { mes: 1, valor: 500 },
                { mes: 2, valor: 600 }
            ]
        }

        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockResponse)
            })
        )

        const dados = {
            credito: 1000,
            orcamento: 500,
            itens: [],
            mes: 1,
            ano: 2025
        }

        const resultado = await buscarCronograma(dados)

        expect(fetch).toHaveBeenCalledTimes(1)

        expect(resultado).toEqual(mockResponse)
    })


    it("deve lançar erro quando a resposta da API não for ok", async () => {

        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: false
            })
        )

        const dados = {}

        await expect(buscarCronograma(dados))
            .rejects
            .toThrow("Erro ao buscar cronograma.")
    })


    it("deve lançar erro se o fetch falhar", async () => {

        global.fetch = vi.fn(() =>
            Promise.reject(new Error("Falha de rede"))
        )

        const dados = {}

        await expect(buscarCronograma(dados))
            .rejects
            .toThrow("Falha de rede")
    })

})