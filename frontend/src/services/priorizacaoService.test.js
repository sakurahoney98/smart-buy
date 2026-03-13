import { describe, it, expect, vi, beforeEach } from "vitest"

import {
    buscarPerguntas,
    buscarPrioridade
} from "./priorizacaoService"


describe("priorizacaoService", () => {

    beforeEach(() => {
        vi.restoreAllMocks()
    })


    it("deve buscar perguntas corretamente", async () => {

        const mockResponse = {
            perguntas: [
                {
                    tipo: "URGÊNCIA",
                    pergunta: "Precisa imediatamente?",
                    opcoes: []
                }
            ]
        }

        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockResponse)
            })
        )

        const resultado = await buscarPerguntas()

        expect(fetch).toHaveBeenCalledTimes(1)
        expect(fetch).toHaveBeenCalledWith(
            expect.any(String),
            { method: "GET" }
        )

        expect(resultado).toEqual(mockResponse)
    })


    it("deve lançar erro se buscarPerguntas falhar", async () => {

        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: false
            })
        )

        await expect(buscarPerguntas())
            .rejects
            .toThrow("Erro ao buscar perguntas.")
    })


    it("deve enviar lista e retornar itens priorizados", async () => {

        const lista = [
            {
                idItem: 1,
                respostas: {
                    IMPACTO: "A",
                    SITUAÇÃO: "B",
                    URGÊNCIA: "C"
                }
            }
        ]

        const mockResponse = {
            lista: [
                {
                    idItem: 1,
                    prioridade: 2
                }
            ]
        }

        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockResponse)
            })
        )

        const resultado = await buscarPrioridade(lista)

        expect(fetch).toHaveBeenCalledTimes(1)

        expect(fetch).toHaveBeenCalledWith(
            expect.any(String),
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    lista: lista
                })
            }
        )

        expect(resultado).toEqual(mockResponse)
    })


    it("deve lançar erro se buscarPrioridade falhar", async () => {

        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: false
            })
        )

        await expect(buscarPrioridade([]))
            .rejects
            .toThrow("Erro ao priorizar.")
    })

})