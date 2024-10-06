from flask import Blueprint, jsonify
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from werkzeug.exceptions import Unauthorized
from werkzeug.security import check_password_hash

from app.services.user_service import UserService
from app.utils.error_handling import handle_common_exceptions
from app.utils.tokens import generate_tokens
from app.utils.validations import validate_json_and_required_fields, validate_username_and_password

user_bp = Blueprint('user', __name__)
user_service = UserService()


@user_bp.route('/users/register', methods=['POST'])
def register():
    """
    Register a new user.

    **Request Body Parameters:**
        - `username`: str, required - The username of the user (must be an email).
        - `password`: str, required - The password for the user (minimum 6 characters).
        - `first_name`: str, required - User's first name.
        - `last_name`: str, required - User's last name.

    **Response:**
        - `201 Created`: On successful registration with user data and tokens.
        - `400 Bad Request`: If the input is invalid or JSON is not provided.
        - `409 Conflict`: Username is already taken by another user.
        - `500 Internal Server Error`: For any server-related issues.
    """
    try:
        # Validate that the request is JSON and contains the required fields
        data = validate_json_and_required_fields(['username', 'password', 'first_name', 'last_name'])

        # Validate the username and password format
        validate_username_and_password(data['username'], data['password'])

        # Register a new user with the provided details
        user = user_service.register_user(
            data['username'],
            data['password'],
            data['first_name'],
            data['last_name']
        )

        # Generate JWT tokens for the new user
        tokens = generate_tokens(user.id)

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
                "tokens": tokens  # Use the generated tokens dictionary
            }
        }), 201

    except Exception as e:
        return handle_common_exceptions(e)  # Use the utility function for common exception handling


@user_bp.route('/users/login', methods=['POST'])
def login():
    """
    User login.

    **Request Body Parameters:**
        - `username`: str, required - The username of the user (must be an email).
        - `password`: str, required - The password for the user (minimum 6 characters).

    **Response:**
        - `200 OK`: On successful authentication with user data and tokens.
        - `400 Bad Request`: If the input is invalid or JSON is not provided.
        - `401 Unauthorized`: If the credentials are invalid.
        - `500 Internal Server Error`: For any server-related issues.
    """
    try:
        # Validate that the request is JSON and contains the required fields
        data = validate_json_and_required_fields(['username', 'password'])

        # Validate the username and password format
        validate_username_and_password(data['username'], data['password'])

        # Authenticate the user with the provided credentials
        user = user_service.authenticate_user(data['username'], data['password'])

        # Check if user is authenticated successfully
        if user:
            # Generate JWT tokens for the authenticated user
            tokens = generate_tokens(user.id)

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
                    "tokens": tokens  # Use the generated tokens dictionary
                }
            }), 200

        # Return error response if credentials are invalid
        raise Unauthorized("Invalid Credentials.")

    except Exception as e:
        return handle_common_exceptions(e)  # Use the utility function for common exception handling


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
        return handle_common_exceptions(e)  # Use the utility function for common exception handling


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
            - `username`: New username (must be an email) for the user (string).
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
        # Validate that the required fields are present
        data = validate_json_and_required_fields(['username', 'first_name', 'last_name'])

        # Validate the username format
        validate_username_and_password(username=data['username'])

        # Update the user information by passing the entire data to the user service
        user_service.update_user(user_id, data)  # Pass the entire data for update

        # Return a success response indicating that the user has been updated
        return jsonify({"message": "User updated successfully"}), 200

    except Exception as e:
        # Use the common exception handler for all exceptions
        return handle_common_exceptions(e)


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
        # Validate that the request is JSON and contains the required fields
        data = validate_json_and_required_fields(['old_password', 'new_password'])

        # Validate the new password to ensure it meets the security requirements
        validate_username_and_password(username=None, password=data['new_password'])

        # Fetch the user by ID
        user = user_service.get_user_by_id(user_id)

        # Verify that the old password matches the stored password
        if user and check_password_hash(user.password_hash, data['old_password']):
            # Update the user's password if verification is successful
            user_service.update_user_password(user_id, data['new_password'])
            return jsonify({"message": "Password updated successfully"}), 200

        # Raise an UnauthorizedError if the old password is incorrect
        raise Unauthorized("Old password is incorrect")

    except Exception as e:
        # Use the common exception handler for all exceptions
        return handle_common_exceptions(e)


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

    except Exception as e:
        # Use the common exception handler for all exceptions
        return handle_common_exceptions(e)
