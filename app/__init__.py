from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from werkzeug.exceptions import HTTPException

from .config import Config
from .routes.article_routes import article_bp
from .routes.user_routes import user_bp


def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)

    jwt = JWTManager(app)

    @jwt.unauthorized_loader
    def unauthorized_response(error):
        """Handles the case where authorization is missing."""
        return jsonify({"error": "Missing authorization header"}), 401

    @jwt.invalid_token_loader
    def invalid_token_response(token):
        """Handles the case where an invalid token is provided."""
        return jsonify({"error": "Invalid token", "message": "The token provided is invalid or expired."}), 401

    @jwt.expired_token_loader
    def expired_token_response(jwt_header, jwt_payload):
        """Handles the case where an expired token is used."""
        return jsonify({"error": "Expired token", "message": "The token has expired. Please log in again."}), 401

    @app.errorhandler(Exception)
    def handle_exception(e):
        """Handle all unhandled exceptions and return a JSON response."""
        if isinstance(e, HTTPException):
            response = e.get_response()
            response.data = jsonify({"error": e.name, "message": e.description}).get_data()
            response.content_type = "application/json"
            return response

        return jsonify({"error": "Internal Server Error", "message": str(e)}), 500

    app.register_blueprint(user_bp, url_prefix='/api')
    app.register_blueprint(article_bp, url_prefix='/api')

    return app
