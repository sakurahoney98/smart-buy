from flask import Blueprint, request, jsonify
import src.app.domain.salario as salario
import src.app.domain.priorizacao as priorizacao
import src.app.service_layer.cronograma as cronograma

routes = Blueprint('routes', __name__)

@routes.route('/sugestao', methods=['POST'])
def sugestao():
    data = request.get_json()

    salario_capturado = data.get('salario')
    
    
    return jsonify({
        "sugestao": salario.sugestao_orcamento(salario_capturado)
    })
    
@routes.route('/perguntas', methods=['GET'])
def listar_perguntas():
    
    return jsonify({
        "perguntas": priorizacao.perguntas_prioridade()
    })
    
@routes.route('/prioridade', methods=['POST'])
def capturar_prioridade():
    data = request.get_json()

    lista = data.get('lista')
    
    
    
    return jsonify({
        "lista": priorizacao.priorizar_itens(lista)
    })
    
@routes.route('/cronograma', methods=['POST'])
def capturar_cronograma():
    
    data = request.get_json()

    dados = data.get('dados')
    
    return jsonify({
        "cronograma": cronograma.inicializar(dados['credito'], dados['orcamento'], dados['itens'], dados['mes'], dados['ano'])
    })
    
    