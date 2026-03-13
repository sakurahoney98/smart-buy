/**
 * Endpoints da API do sistema.
 * Centraliza as URLs para evitar duplicação e facilitar manutenção.
 */

/**
 * URL base para o serviço de cronograma de compras
 * @constant {string}
 */
export const API_CRONOGRAMA = "http://127.0.0.1:3600/cronograma"

/**
 * URL para obter as perguntas do questionário de priorização
 * @constant {string}
 */
export const API_PRIORIZACAO_PERGUNTAS = "http://127.0.0.1:3600/perguntas"

/**
 * URL para enviar respostas e receber itens priorizados
 * @constant {string}
 */
export const API_PRIORIZACAO = "http://127.0.0.1:3600/prioridade"

/**
 * URL para obter sugestão de salário/orçamento
 * @constant {string}
 */
export const API_SALARIO = "http://127.0.0.1:3600/sugestao"