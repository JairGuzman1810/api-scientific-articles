import os
import re

from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, jwt_required
from mysql.connector import Error as MySQLError
from werkzeug.exceptions import NotFound, Conflict
from werkzeug.security import check_password_hash

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
        - `409 Conflict`: Username is already taken by another user.
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
    except Conflict as e:
        return jsonify({"error": str(e)}), 409
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
    # Retrieve the identity of the currently authenticated user from the JWT token
    current_user = get_jwt_identity()

    try:
        # Create a new access token for the current user
        new_access_token = create_access_token(identity=current_user)

        # Return a JSON response indicating success, along with the new access token
        return jsonify({
            "status": "success",
            "data": {
                "tokens": {
                    "access_token": new_access_token  # Include the new access token in the response
                }
            }
        }), 200

    except Exception as e:
        # Handle any exceptions that occur during the token creation process
        return jsonify({"error": "Internal Server Error", "message": str(e)}), 500


@user_bp.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    """
    Update a user by ID.

    **Security:**
        - Requires a valid bearer token for authentication.

    **Parameters:**
        - `user_id` (path): ID of the user to be updated.
        - `Authorization` (header): Bearer token required to authorize the request.
        - `user_data` (body): JSON parameters to update the user, including:
            - `username`: New username for the user (string).
            - `first_name`: New first name for the user (string).
            - `last_name`: New last name for the user (string).

    **Responses:**
        - `200 OK`: User updated successfully.
        - `400 Bad Request`: Validation error or request body issue.
        - `404 Not Found`: User not found.
        - `409 Conflict`: Username is already taken by another user.
        - `500 Internal Server Error`: For server-related issues.
    """
    try:
        # Retrieve the JSON data from the request body
        data = request.json

        # Check if the request body is empty or not JSON
        if data is None:
            raise ValueError("Request body must be JSON.")

        # Update the user information by passing the entire data to the user service
        user_service.update_user(user_id, data)  # Pass the entire data for update

        # Return a success response indicating that the user has been updated
        return jsonify({"message": "User updated successfully"}), 200

    except ValueError as e:
        # Handle cases where the request body is not valid JSON
        return jsonify({"error": str(e)}), 400
    except NotFound as e:
        return jsonify({"error": str(e)}), 404
    except Conflict as e:
        return jsonify({"error": str(e)}), 409
    except MySQLError as e:
        # Handle MySQL-specific errors during the update operation
        return handle_mysql_error(e)
    except Exception as e:
        # Handle any other exceptions that occur during the process
        return jsonify({"error": "Internal Server Error", "message": str(e)}), 500


@user_bp.route('/users/<int:user_id>/password', methods=['PUT'])
@jwt_required()
def update_password(user_id):
    """
    Update a user's password.

    **Security:**
        - Requires a valid bearer token for authentication.

    **Parameters:**
        - `user_id` (path): ID of the user whose password is to be updated.
        - `Authorization` (header): Bearer token required to authorize the request.
        - `body` (JSON): Parameters to update a user's password, including:
            - `old_password`: The current password of the user (string).
            - `new_password`: The new password for the user (string).

    **Responses:**
        - `200 OK`: Password updated successfully.
        - `400 Bad Request`: Validation error or request body issue.
        - `401 Unauthorized`: Old password is incorrect.
        - `404 Not Found`: User not found.
        - `500 Internal Server Error`: For server-related issues.
    """
    try:
        # Retrieve the JSON data from the request body
        data = request.json

        # Check if the request body is empty or not JSON
        if data is None:
            raise ValueError("Request body must be JSON.")

        # Extract old and new passwords from the request body
        old_password = data.get('old_password')
        new_password = data.get('new_password')

        # Ensure both old and new passwords are provided
        if not old_password or not new_password:
            raise ValueError("Both old and new passwords are required.")

        # Fetch the user by ID
        user = user_service.get_user_by_id(user_id)

        # Verify that the old password matches the stored password
        if user and check_password_hash(user.password_hash, old_password):
            # Update the user's password if verification is successful
            user_service.update_user_password(user_id, new_password)
            return jsonify({"message": "Password updated successfully"}), 200

        # Return an error if the old password is incorrect
        return jsonify({"error": "Old password is incorrect"}), 401

    except ValueError as e:
        # Handle cases where the request body is not valid JSON
        return jsonify({"error": str(e)}), 400
    except NotFound as e:
        return jsonify({"error": str(e)}), 404
    except MySQLError as e:
        # Handle MySQL-specific errors during the password update operation
        return handle_mysql_error(e)
    except Exception as e:
        # Handle any other exceptions that occur during the process
        return jsonify({"error": "Internal Server Error", "message": str(e)}), 500


@user_bp.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete(user_id):
    """
    Delete a user by ID.

    **Security:**
        - Requires a valid bearer token for authentication.

    **Parameters:**
        - `user_id` (path): ID of the user to be deleted.
        - `Authorization` (header): Bearer token required to authorize the request.

    **Responses:**
        - `200 OK`: User deleted successfully.
        - `400 Bad Request`: Validation error or request issue.
        - `404 Not Found`: User not found.
        - `500 Internal Server Error`: For server-related issues.
    """
    try:
        # Attempt to delete the user by calling the user service's delete method
        user_service.delete_user(user_id)

        # Return a success response if the user is deleted successfully
        return jsonify({"status": "success", "message": "User deleted successfully."}), 200

    except ValueError as e:
        # Handle cases where the request may be invalid
        return jsonify({"status": "error", "message": str(e)}), 400
    except NotFound as e:
        return jsonify({"error": str(e)}), 404
    except MySQLError as e:
        # Handle MySQL-specific errors during the deletion operation
        return handle_mysql_error(e)
    except Exception as e:
        # Handle any other exceptions that occur during the process
        return jsonify({"error": "Internal Server Error", "message": str(e)}), 500
