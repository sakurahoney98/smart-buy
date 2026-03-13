import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { OrcamentoProvider } from './context/OrcamentoContext'

import Home from './pages/Home'
import EscolhaOrcamento from './pages/EscolhaOrcamento'
import ValorOrcamento from './pages/ValorOrcamento'
import Salario from './pages/Salario'
import ConfirmarSugestao from './pages/ConfirmarSugestao'
import Credito from './pages/Credito'
import ListaCompras from './pages/ListaCompras'
import EscolhaPriorizacao from './pages/EscolhaPriorizacao'
import PriorizacaoManual from './pages/PriorizacaoManual'
import PriorizacaoAutomatica from './pages/PriorizacaoAutomatica'
import Resumo from './pages/Resumo'
import Cronograma from './pages/Cronograma'


import './styles/index.css'

/**
 * Ponto de entrada principal da aplicação (Main Component).
 * 
 * Atua como o "Composition Root", sendo responsável por:
 * 1. Inicializar a renderização do React.
 * 2. Configurar o roteamento global da aplicação.
 * 3. Injetar o provedor de contexto (OrcamentoProvider) em todas as rotas.
 * 4. Carregar os estilos globais.
 */

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <OrcamentoProvider>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="escolha-orcamento" element={<EscolhaOrcamento />}></Route>
          <Route path="valor-orcamento" element={<ValorOrcamento />}></Route>
          <Route path="salario" element={<Salario />}></Route>
          <Route path="confirmar-sugestao" element={<ConfirmarSugestao />}></Route>
          <Route path="credito" element={<Credito />}></Route>
          <Route path="lista-de-compras" element={<ListaCompras />}></Route>
          <Route path="priorizacao" element={<EscolhaPriorizacao />}></Route>
          <Route path="priorizacao-manual" element={<PriorizacaoManual />}></Route>
          <Route path="priorizacao-automatica" element={<PriorizacaoAutomatica />}></Route>
          <Route path="resumo" element={<Resumo />}></Route>
          <Route path="cronograma" element={<Cronograma />}></Route>
        </Routes>

      </OrcamentoProvider>

    </BrowserRouter>


  </StrictMode>,
)
