from flask_jwt_extended import create_access_token, create_refresh_token  # Import functions to create JWT tokens


def generate_tokens(user_id):
    """
    Generate access and refresh tokens for the user.

    **Parameters:**
        - `user_id`: The ID of the user for whom the tokens are being generated.

    **Returns:**
        - A dictionary containing:
            - `access_token`: The generated access token for the user.
            - `refresh_token`: The generated refresh token for the user.
    """
    access_token = create_access_token(identity=user_id)  # Create an access token with the user's ID as identity
    refresh_token = create_refresh_token(identity=user_id)  # Create a refresh token with the user's ID as identity
    return {
        "access_token": access_token,  # Include the access token in the returned dictionary
        "refresh_token": refresh_token  # Include the refresh token in the returned dictionary
    }
