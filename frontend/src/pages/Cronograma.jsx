import HeaderVoltar from "../components/HeaderVoltar"
import ItemCronograma from "../components/ItemCronograma"
import { formatarValorParaExibicao } from '../util/formatador'
import { buscarCronograma } from "../services/cronogramaService"
import { jsPDF } from 'jspdf'
import { autoTable } from 'jspdf-autotable'
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useOrcamento } from "../context/OrcamentoContext"
import { useState } from "react"
import { useRef } from "react"

import icon_calendar from '../assets/calendar.png'
import icon_pdf from '../assets/download.png'
import icon_excel from '../assets/xls.png'
import style from '../styles/Cronograma.module.css'

/**
 * Página para visualizar baixar o cronograma do projeto.
 * 
 * Esta página é protegida: só pode ser acessada se o usuário já tiver informado o orçamento 
 * e montado a lista de compras nas etapas anteriores. Caso contrário, é redirecionado 
 * automaticamente para /escolha-orcamento ou /lista-de-compras.
 * 
 * Apresenta as informações de ações a serem realizadas em cada período bem como as informações
 * de orçamento e saldos. Permite também o download do cronograma nos formatos PDF e Excel.
 * 
 * @returns {JSX.Element} Página com as informações do cronograma e opções de download.
 */
function Cronograma() {

    const { dados } = useOrcamento()
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

    const carregou = useRef(false)
    const [cronograma, setCronograma] = useState([])

    useEffect(() => {
        if (carregou.current) return
        carregou.current = true

        /**
         * Função que recupera o cronograma do backend.
         * 
         * Função faz o envio das informações preenchidas pelo usuário ao backend e retorna
         * o cronograma formatado para exibição.
         * 
         */
        async function carregarCronograma() {
            const resultado = await buscarCronograma(dados)
            setCronograma(resultado.cronograma)

        }

        carregarCronograma()
    }, [dados])

    /**
     * Função que cria e baixa o cronograma em formato pdf.
     * 
     * Cria uma tabela formatada com todas as informações mensais utilizando a 
     * biblioteca jsPDF com autoTable.
     */
    function gerarPDF() {

        // Inicializando PDF
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4"
        })

        const MARGEM = 20
        const inicioY = 25

        // Título
        pdf.setFont("helvetica", "bold")
        pdf.setFontSize(22)
        pdf.text("Cronograma de Compras", MARGEM, inicioY)

        // Tabela
        let dadosTabela = []

        cronograma.map((item) => {
            dadosTabela.push([item.data.toUpperCase(), item.acao, item.obrigacoes, formatarValorParaExibicao(item.orcamento), formatarValorParaExibicao(item.acumulado), formatarValorParaExibicao(item.saldo_pos_compra)])

        })


        autoTable(pdf, {
            head: [['Mes', 'Ação', 'Obrigação', 'Orçamento', 'Acumulado', 'Saldo']],
            body: dadosTabela,
            startY: inicioY + 20,
            headStyles: {
                fillColor: [16, 183, 127],
                textColor: 255,
                fontStyle: 'bold'
            }
        });


        pdf.save("cronograma.pdf")
    }

    /**
     * Função que cria e baixa o cronograma em formato de planilha.
     * 
     * Cria uma planilha com os dados do cronograma utilizando a biblioteca xlsx 
     * e file-saver.
     */
    function gerarExcel() {

        // Inicialização da planilha
        const wb = XLSX.utils.book_new();

        // Criação da estrutura
        const dados = cronograma.map(item => ({
            "Mês": item.data.toUpperCase(),
            "Ação": item.acao ?? "-",
            "Obrigação": item.obrigacoes ?? "-",
            "Orçamento": formatarValorParaExibicao(item.orcamento) || 0,
            "Acumulado": formatarValorParaExibicao(item.acumulado) || 0,
            "Saldo pós-compra": formatarValorParaExibicao(item.saldo_pos_compra) || 0
        }));

        const ws = XLSX.utils.json_to_sheet(dados);


        XLSX.utils.book_append_sheet(wb, ws, "Cronograma");


        const excelBuffer = XLSX.write(wb, {
            bookType: "xlsx",
            type: "array"
        });

        const fileData = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });

        saveAs(fileData, "cronograma.xlsx");
    }

    return (
        <div className={style.cronograma}>
            <div className={style.cronograma__container}>
                <HeaderVoltar to="/resumo" />
                <div className={style.cronograma__content}>
                    <div className={style.cronograma__content_icon}>
                        <img src={icon_calendar} alt="Ícone de calendário representando cronograma" width="32" height="32" />

                    </div>
                    <div className={style.cronograma__content_text}>
                        <h2>Cronograma de Compras</h2>

                    </div>
                    <div className={style.cronograma__content_buttons_download}>
                        <button onClick={gerarPDF}><img src={icon_pdf} alt="Ícone de PDF" width="16" height="16" /> PDF</button>
                        <button onClick={gerarExcel}><img src={icon_excel} alt="Ícone de Excel" width="16" height="16" /> Excel</button>

                    </div>

                    <div className={style.cronograma__content_timeline}>
                        {
                            cronograma.length > 0 && (
                                cronograma.map((item, index) => (
                                    <ItemCronograma key={index}
                                        periodo={item.data.toUpperCase()}
                                        acao={item.acao}
                                        obrigacao={item.obrigacoes}
                                        orcamento={item.orcamento}
                                        acumulado={item.acumulado}
                                        saldoPosCompra={item.saldo_pos_compra}


                                    />
                                ))

                            )
                        }

                    </div>

                </div>

            </div>

        </div>
    )
}

export default Cronograma