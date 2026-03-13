from flask import Flask
from flask_cors import CORS
from src.app.entrypoints.routes import routes
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, template_folder='../templates', static_folder='../static')

CORS(app)

#Registro de rotas
app.register_blueprint(routes)



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3600, debug=False)