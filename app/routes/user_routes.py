import os
import re

from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, jwt_required
from mysql.connector import Error as MySQLError

from app.services.user_service import UserService

user_bp = Blueprint('user', __name__)
user_service = UserService()


def handle_mysql_error(e):
    """Handle MySQL errors and return appropriate messages."""
    if e.errno == 1146:  # Table doesn't exist
        if os.getenv('FLASK_ENV') == 'development':
            table_name = extract_table_name(e.msg)
            return jsonify({"status": "error",
                            "message": f"A database table '{table_name}' is missing. Please check your database setup."}), 500
    return jsonify({"status": "error", "message": "Internal Server Error"}), 500


def extract_table_name(error_message):
    """Extract the table name from the MySQL error message."""
    match = re.search(r"Table '.*?\.(.*?)' doesn't exist", error_message)
    return match.group(1) if match else "unknown_table"


@user_bp.route('/users/register', methods=['POST'])
def register():
    """
    Register a new user.

    **Request Body Parameters:**
        - `username`: str, required - Unique username for the new user.
        - `password`: str, required - Password for the new user.
        - `first_name`: str, optional - User's first name.
        - `last_name`: str, optional - User's last name.

    **Response:**
        - `201 Created`: On successful registration with user data and tokens.
        - `400 Bad Request`: If the input is invalid or JSON is not provided.
        - `500 Internal Server Error`: For any server-related issues.
    """
    try:
        data = request.json
        if data is None:
            raise ValueError("Request body must be JSON.")

        # Register a new user with the provided details
        user = user_service.register_user(
            data['username'],
            data['password'],
            data.get('first_name', ''),
            data.get('last_name', '')
        )

        # Create JWT tokens for the new user
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)

        # Return success response with user data and tokens
        return jsonify({
            "status": "success",
            "data": {
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "first_name": user.first_name,
                    "last_name": user.last_name
                },
                "tokens": {
                    "access_token": access_token,
                    "refresh_token": refresh_token
                }
            }
        }), 201

    except ValueError as e:
        return jsonify({"status": "error", "message": str(e)}), 400
    except TypeError:
        return jsonify({"status": "error", "message": "Invalid input format. JSON is required."}), 400
    except MySQLError as e:
        return handle_mysql_error(e)
    except Exception as e:
        return jsonify({"error": "Internal Server Error", "message": str(e)}), 500


@user_bp.route('/users/login', methods=['POST'])
def login():
    """
    User login.

    **Request Body Parameters:**
        - `username`: str, required - The username of the user.
        - `password`: str, required - The password for the user.

    **Response:**
        - `200 OK`: On successful authentication with user data and tokens.
        - `400 Bad Request`: If the input is invalid or JSON is not provided.
        - `401 Unauthorized`: If the credentials are invalid.
        - `500 Internal Server Error`: For any server-related issues.
    """
    try:
        data = request.json
        if data is None:
            raise ValueError("Request body must be JSON.")

        # Authenticate the user with the provided credentials
        user = user_service.authenticate_user(data['username'], data['password'])

        # Check if user is authenticated successfully
        if user:
            # Create JWT tokens for the authenticated user
            access_token = create_access_token(identity=user.id)
            refresh_token = create_refresh_token(identity=user.id)

            # Return success response with user data and tokens
            return jsonify({
                "status": "success",
                "data": {
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "first_name": user.first_name,
                        "last_name": user.last_name
                    },
                    "tokens": {
                        "access_token": access_token,
                        "refresh_token": refresh_token
                    }
                }
            }), 200

        # Return error response if credentials are invalid
        return jsonify({"status": "error", "message": "Invalid credentials"}), 401

    except ValueError as e:
        return jsonify({"status": "error", "message": str(e)}), 400
    except TypeError:
        return jsonify({"status": "error", "message": "Invalid input format. JSON is required."}), 400
    except MySQLError as e:
        return handle_mysql_error(e)
    except Exception as e:
        return jsonify({"error": "Internal Server Error", "message": str(e)}), 500


@user_bp.route('/users/token', methods=['POST'])
@jwt_required(refresh=True)  # Protect this endpoint with JWT
def refresh():
    """
    Refresh the access token using a refresh token.

    **Security:**
        - Requires a valid bearer refresh token.

    **Parameters:**
        - `Authorization` (header): Bearer refresh token required to generate a new access token.

    **Responses:**
        - `200 OK`: New access token generated successfully.
        - `401 Unauthorized`: Missing or invalid refresh token.
        - `500 Internal Server Error`: For server-related issues.
    """
    current_user = get_jwt_identity()

    try:
        new_access_token = create_access_token(identity=current_user)

        return jsonify({
            "status": "success",
            "data": {
                "tokens": {
                    "access_token": new_access_token
                }
            }
        }), 200

    except Exception as e:
        return jsonify({"error": "Internal Server Error", "message": str(e)}), 500
