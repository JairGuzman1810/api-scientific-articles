from flask import Flask, jsonify  # Importing Flask for creating the app and jsonify for JSON responses
from flask_jwt_extended import JWTManager  # Importing JWTManager for handling JWTs (JSON Web Tokens)
from werkzeug.exceptions import HTTPException  # Importing HTTPException for handling HTTP errors

from .config import Config  # Importing configuration settings from a separate module
from .routes.article_routes import article_bp  # Importing article routes blueprint
from .routes.user_routes import user_bp  # Importing user routes blueprint
from .swagger_config import create_swagger_blueprint  # Importing function to create Swagger UI blueprint


def create_app():
    """Create and configure the Flask application."""
    app = Flask(__name__)  # Creating a new Flask application instance

    app.config.from_object(Config)  # Load the app configuration from the Config class

    jwt = JWTManager(app)  # Initializing the JWT manager with the app

    # Initialize Swagger UI for API documentation
    swaggerui_blueprint = create_swagger_blueprint()  # Create the Swagger blueprint

    @jwt.unauthorized_loader
    def unauthorized_response(error):
        """Handles the case where authorization is missing."""
        return jsonify({"error": "Missing authorization header"}), 401  # Return a JSON response with a 401 status code

    @jwt.invalid_token_loader
    def invalid_token_response(token):
        """Handles the case where an invalid token is provided."""
        return jsonify({"error": "Invalid token",
                        "message": "The token provided is invalid or expired."}), 401  # Return error message for invalid token

    @jwt.expired_token_loader
    def expired_token_response(jwt_header, jwt_payload):
        """Handles the case where an expired token is used."""
        return jsonify({"error": "Expired token",
                        "message": "The token has expired. Please log in again."}), 401  # Return error message for expired token

    @app.errorhandler(Exception)
    def handle_exception(e):
        """Handle all unhandled exceptions and return a JSON response."""
        if isinstance(e, HTTPException):  # Check if the exception is an HTTPException
            response = e.get_response()  # Get the default response for the HTTP error
            response.data = jsonify(
                {"error": e.name, "message": e.description}).get_data()  # Format the response data as JSON
            response.content_type = "application/json"  # Set content type to JSON
            return response  # Return the formatted response

        return jsonify({"error": "Internal Server Error",
                        "message": str(e)}), 500  # Return a generic error message for other exceptions

    # Register blueprints for user and article routes with a common URL prefix
    app.register_blueprint(user_bp, url_prefix='/api')  # Register user routes
    app.register_blueprint(article_bp, url_prefix='/api')  # Register article routes
    app.register_blueprint(swaggerui_blueprint)  # Register Swagger UI blueprint for API documentation

    return app  # Return the configured Flask app instance
