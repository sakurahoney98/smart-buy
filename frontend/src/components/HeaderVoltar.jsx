import { useNavigate } from 'react-router-dom'

import icon_arrow_black from '../assets/arrow_back_black.png'
import style from '../styles/HeaderVoltar.module.css'

/**
 * Componente de cabeçalho com botão de navegação.
 *
 * Atua como um "Humble Object", focando apenas na apresentação visual e 
 * delegando a lógica de estado para o componente pai. Ao clicar no botão, 
 * o usuário é redirecionado para a rota especificada.
 * 
 * @param {Object} props
 * @param {string} props.to -  Caminho da rota para redirecionamento. 
 *                              Padrão: "/" (página inicial).
 * @returns {JSX.Element} Cabeçalho com botão de voltar.
 */
function HeaderVoltar({ to = '/' }) {
    const navigate = useNavigate()

    return (
        <div className={style.header}>
            <button onClick={() => navigate(to)}>
                <img src={icon_arrow_black} alt="Seta voltar" width="20" height="20" />
                Voltar
            </button>

        </div>
    )
}

export default HeaderVoltar