import os
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()


class Config:
    """
     Configuration class for the Scientific Article Management System.

     Contains settings for JWT authentication and MySQL database connection,
     loading sensitive information from environment variables for security.
     """
    # Secret key for JWT authentication
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your_jwt_secret_key')

    # Token expiration times
    JWT_ACCESS_TOKEN_EXPIRES = 1 * 60 * 60  # Access token now expires in 1 hour (3600 seconds)
    JWT_REFRESH_TOKEN_EXPIRES = 30 * 24 * 60 * 60  # Refresh token expires in 30 days

    # MySQL database connection settings
    MYSQL_HOST = os.getenv('MYSQL_HOST', 'localhost')  # Host where the MySQL server is running
    MYSQL_PORT = os.getenv('MYSQL_PORT', '3306')  # Port for MySQL connection
    MYSQL_USER = os.getenv('MYSQL_USER', 'root')  # MySQL user for authentication
    MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD', '')  # Password for the MySQL user
    MYSQL_DATABASE = os.getenv('MYSQL_DATABASE', 'mysql')  # Name of the database to connect to
