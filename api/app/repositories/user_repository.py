import mysql.connector  # Import the MySQL connector library to interact with the MySQL database

from app.config import Config  # Import the configuration settings
from app.models.user import User  # Import the User model to work with user data


class UserRepository:
    """
    The UserRepository class handles interactions with the database for user-related operations.
    It provides a clear separation between business logic and data access logic,
    ensuring that all database queries (e.g., fetching, saving, updating users) are managed
    in a central, structured manner.
    """

    def __init__(self):
        # Initialize the database connection using parameters from the Config class
        self.connection = mysql.connector.connect(
            host=Config.MYSQL_HOST,  # Database host
            port=Config.MYSQL_PORT,  # Database port
            user=Config.MYSQL_USER,  # Database user
            password=Config.MYSQL_PASSWORD,  # Database password
            database=Config.MYSQL_DATABASE  # Database name
        )
        self.cursor = self.connection.cursor()  # Create a cursor to execute database queries

    def get_user_by_username(self, username):
        """Fetch a user from the database using the username."""
        self.cursor.execute(
            "SELECT id, username, first_name, last_name, password_hash FROM users WHERE username = %s",
            (username,)  # Parameterized query to prevent SQL injection
        )
        result = self.cursor.fetchone()  # Fetch one result from the executed query
        if result:
            return User(*result)  # Unpack result directly into User constructor
        return None  # Return None if no user found

    def get_user_by_id(self, user_id):
        """Fetch a user from the database using the user ID."""
        self.cursor.execute(
            "SELECT id, username, first_name, last_name, password_hash FROM users WHERE id = %s",
            (user_id,)  # Parameterized query to prevent SQL injection
        )
        result = self.cursor.fetchone()  # Fetch one result from the executed query
        if result:
            return User(*result)  # Unpack result directly into User constructor
        return None  # Return None if no user found

    def create_user(self, user):
        """Insert a new user into the database."""
        self.cursor.execute(
            "INSERT INTO users (username, first_name, last_name, password_hash) VALUES (%s, %s, %s, %s)",
            (user.username, user.first_name, user.last_name, user.password_hash)  # Parameterized query
        )
        self.connection.commit()  # Commit the transaction to save changes
        user.id = self.cursor.lastrowid  # Set the user ID to the last inserted row ID
        return user  # Return the newly created user

    def update_user(self, user):
        """Update an existing user's information in the database."""
        self.cursor.execute(
            "UPDATE users SET username = %s, first_name = %s, last_name = %s, password_hash = %s WHERE id = %s",
            (user.username, user.first_name, user.last_name, user.password_hash, user.id)  # Parameterized query
        )
        self.connection.commit()  # Commit the transaction to save changes
        return user  # Return the updated user

    def delete_user(self, user_id):
        """Delete a user from the database using the user ID."""
        self.cursor.execute(
            "DELETE FROM users WHERE id = %s",
            (user_id,)  # Parameterized query to prevent SQL injection
        )
        self.connection.commit()  # Commit the transaction to save changes
