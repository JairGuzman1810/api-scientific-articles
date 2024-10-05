from flask import Flask, jsonify

from .config import Config


def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)

    @app.route('/')
    def home():
        return "Welcome to the Flask App!"

    @app.route('/hello', methods=['GET'])
    def hello():
        return jsonify(message="Hello, World!")

    return app
