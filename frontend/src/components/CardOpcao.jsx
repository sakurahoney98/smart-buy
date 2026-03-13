import { useNavigate } from 'react-router-dom'

import style from '../styles/CardOpcao.module.css'

/**
 * Componente que representa um cenário no sistema a ser seguido.
 * 
 * 
 * @param {Object} props
 * @param {string} props.titulo - Pergunta principal.
 * @param {string} props.descricao - Texto complementar da pergunta.
 * @param {string} props.to -  Caminho da rota para redirecionamento.
 * @param {string} props.imagem - Caminho da imagem que representa o cenário.
 * @param {string} props.descricaoImagem - Descrição textual da imagem para acessibilidade (alt text).
 * @returns {JSX.Element} Card com um cenário do sistema.
 */
function CardOpcao({ titulo, descricao, to, imagem, descricaoImagem = "" }) {
    
    const navigate = useNavigate()

    return (
        <div className={style.option}>
            <div className={style.option__icon}>
                <img src={imagem} alt={descricaoImagem} width="32" height="32" />

            </div>
            <div className={style.option__text} onClick={() => navigate(to)}>
                <h3>{titulo}</h3>
                <p>{descricao}</p>

            </div>

        </div>
    )
}




export default CardOpcao