from werkzeug.exceptions import NotFound, Conflict, Unauthorized
from werkzeug.security import generate_password_hash, check_password_hash  # Import functions for password hashing

from app.models.user import User  # Import the User model to work with user data
from app.repositories.user_repository import UserRepository  # Import the UserRepository for database operations


class UserService:
    """
    The UserService class contains the core business logic for user-related operations.
    It acts as an intermediary between the controller and the UserRepository,
    managing user registration, authentication, updates, and deletions.
    """

    def __init__(self):
        # Initialize UserRepository to handle database interactions
        self.user_repository = UserRepository()

    def register_user(self, username, password, first_name='', last_name=''):
        """Register a new user with the given username and password."""
        if self.user_repository.get_user_by_username(username):
            raise Conflict("User already exists.")  # Raise an error if the user already exists

        password_hash = generate_password_hash(password)  # Hash the user's password
        user = User(None, username, first_name, last_name, password_hash)  # Create a new User object
        return self.user_repository.create_user(user)  # Persist the user in the database

    def authenticate_user(self, username, password):
        """Authenticate a user by verifying their username and password."""
        user = self.user_repository.get_user_by_username(username)  # Fetch the user by username
        if user and check_password_hash(user.password_hash, password):  # Verify the password
            return user  # Return the authenticated user
        raise Unauthorized("Invalid Credentials.")  # Raise Unauthorized if authentication fails

    def update_user(self, user_id, user_data):
        """Update an existing user's details based on provided user_data."""
        user = self.user_repository.get_user_by_id(user_id)  # Fetch the user by ID
        if not user:
            raise NotFound("User not found.")  # Raise NotFound if the user does not exist

        # Check if the username is being updated and if it is already taken by another user
        new_username = user_data.get("username")
        if new_username and new_username != user.username:
            existing_user = self.user_repository.get_user_by_username(new_username)
            if existing_user:
                raise Conflict("Username is already taken by another user.")

        # Update user attributes directly from user_data if provided
        for key, value in user_data.items():
            if hasattr(user,
                       key) and value is not None:  # Check if the user object has the attribute and value is not None
                setattr(user, key, value)  # Set the new value

        return self.user_repository.update_user(user)  # Persist the updated user in the database

    def update_user_password(self, user_id, new_password):
        """Update a user's password."""
        user = self.user_repository.get_user_by_id(user_id)  # Fetch the user by ID
        if not user:
            raise NotFound("User not found.")  # Raise an error if the user does not exist

        user.password_hash = generate_password_hash(new_password)  # Hash the new password
        self.user_repository.update_user(user)  # Persist the user with the updated password

    def get_user_by_id(self, user_id):
        """Fetch a user from the database using the user ID."""
        user = self.user_repository.get_user_by_id(user_id)  # Fetch the user by ID
        if not user:
            raise NotFound("User not found.")  # Raise an error if the user does not exist
        return user  # Return the found user

    def delete_user(self, user_id):
        """Delete a user from the database."""
        user = self.user_repository.get_user_by_id(user_id)  # Fetch the user by ID
        if not user:
            raise NotFound("User not found.")  # Raise an error if the user does not exist
        self.user_repository.delete_user(user_id)  # Persist the deletion in the database
