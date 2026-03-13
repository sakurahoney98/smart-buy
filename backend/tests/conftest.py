import pytest
from flask import Flask
from src.app.entrypoints.routes import routes


@pytest.fixture
def app():
    app = Flask(__name__)
    app.register_blueprint(routes)

    with app.app_context():
        yield app


@pytest.fixture
def client(app):
    return app.test_client()