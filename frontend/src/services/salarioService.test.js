import { describe, it, expect, vi, beforeEach } from "vitest"

import { buscarSugestao } from "./salarioService"


describe("salarioService", () => {

    beforeEach(() => {
        vi.restoreAllMocks()
    })


    it("deve enviar o salário e retornar a sugestão", async () => {

        const salario = 3000

        const mockResponse = {
            sugestao: 1500
        }

        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockResponse)
            })
        )

        const resultado = await buscarSugestao(salario)

        expect(fetch).toHaveBeenCalledTimes(1)

        expect(fetch).toHaveBeenCalledWith(
            expect.any(String),
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    salario: salario
                })
            }
        )

        expect(resultado).toEqual(mockResponse)
    })


    it("deve lançar erro se a API retornar erro", async () => {

        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: false
            })
        )

        await expect(buscarSugestao(3000))
            .rejects
            .toThrow("Erro ao buscar sugestão")
    })


    it("deve lançar erro se o fetch falhar", async () => {

        global.fetch = vi.fn(() =>
            Promise.reject(new Error("Falha de rede"))
        )

        await expect(buscarSugestao(3000))
            .rejects
            .toThrow("Falha de rede")
    })

})