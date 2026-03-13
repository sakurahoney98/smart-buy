import { useNavigate } from 'react-router-dom'

import icon_wallet from '../assets/icon_wallet.png'
import style from '../styles/Home.module.css'

/**
 * Página inicial do aplicativo.
 * 
 * Apresenta uma introdução ao sistema de planejamento de compras e fornece um 
 * botão para iniciar o fluxo de configuração do orçamento.
 * 
 * @returns {JSX.Element} Página inicial com boas-vindas e botão de ação.
 */
function Home() {

  const navigate = useNavigate()

  /**
   * Função que redireciona para a página de escolha de orçamento.
   */
  function iniciar() {
    navigate('/escolha-orcamento')
  }

  return (
    <div className={style.home}>
      <div className={style.home__container}>
        <div className={style.home__content}>
          <div className={style.home__icon}>
            <img src={icon_wallet} alt="Ícone de carteira" width="48" height="48" />
          </div>


        </div>
        <div className={`${style.home__texto} ${style.home__content}`}>
          <h1>SmartBuy</h1>
          <p>Planeje suas compras de forma inteligente e alcance seus objetivos financeiros</p>

        </div>
        <div className={style.home__content}>
          <button onClick={iniciar}>Iniciar</button>

        </div>

      </div>


    </div>
  )
}

export default Home
