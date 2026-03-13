import HeaderVoltar from '../components/HeaderVoltar'
import CardOpcao from '../components/CardOpcao'


import icon_pen from '../assets/pen.png'
import icon_lightbulb from '../assets/lightbulb.png'
import style from '../styles/Escolha.module.css'


/**
 * Página para a escolha do orçamento.
 * 
 * Permite que o usuário escolha se deseja inserir um valor para o orçamento do projeto
 * ou se deseja uma sugestão do sistema com base no salário líquido.
 * 
 * @returns {JSX.Element} Página com duas opções de cenário para escolha.
 */
function EscolhaOrcamento() {

    return (
        <div className={style.escolha}>
            <div className={style.escolha__container}>
                <HeaderVoltar to="/" />
                <div className={style.escolha__question}>
                    <h1>Como você quer começar?</h1>
                    <p>Escolha uma das opções abaixo</p>

                </div>
                <div className={style.escolha__answer}>
                    <CardOpcao titulo="Informar um valor para o projeto"
                        descricao="Defina manualmente quanto você pode investir mensalmente"
                        imagem={icon_pen} descricaoImagem="Icone de caneta representando inserção manual"
                        to="/valor-orcamento" />
                    <CardOpcao titulo="Pedir sugestão do sistema"
                        descricao="Receba uma sugestão baseada no seu salário"
                        imagem={icon_lightbulb}
                        descricaoImagem="Icone de lâmpada representando sugestão automática"
                        to="/salario" />

                </div>

            </div>

        </div>
    )

}


export default EscolhaOrcamento