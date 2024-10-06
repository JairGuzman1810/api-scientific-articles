import os  # Import the os module to interact with the operating system
import re  # Import the re module for regular expression operations

from flask import jsonify  # Import jsonify to create JSON responses for Flask
from mysql.connector import Error as MySQLError  # Import MySQLError to handle MySQL-specific errors
from werkzeug.exceptions import BadRequest, Unauthorized, NotFound
from werkzeug.exceptions import Conflict  # Import Conflict to handle conflicts (like duplicates) in requests


def handle_common_exceptions(e):
    """
    Handle common exceptions and return appropriate JSON responses based on the type of exception.

    **Parameters:**
        - `e`: The exception to handle.

    **Returns:**
        - Flask response object with a JSON error message and an appropriate HTTP status code.

    **Exceptions handled:**
        - `ValueError`: For invalid input or missing fields, returns a 400 status.
        - `Conflict`: For conflicts like duplicate records, returns a 409 status.
        - `MySQLError`: For MySQL-related issues, calls a specific MySQL error handler.
        - `BadRequest`: For JSON decoding errors, returns a 400 status.
        - `Unauthorized`: For unauthorized access (e.g., incorrect password), returns a 401 status.
        - `NotFound`: For resources not found, returns a 404 status.
        - `Exception`: For other uncaught exceptions, returns a 500 status indicating a server error.
    """
    if isinstance(e, BadRequest):  # Catch BadRequest for JSON decoding errors
        return jsonify({"status": "error", "message": "Invalid JSON payload."}), 400
    elif isinstance(e, ValueError):  # Check if the exception is a ValueError
        return jsonify({"status": "error", "message": str(e)}), 400  # Return a 400 response with the error message
    elif isinstance(e, Unauthorized):  # Check if the exception is Unauthorized
        return jsonify({"status": "error", "message": str(e)}), 401  # Return a 401 response with the error message
    elif isinstance(e, NotFound):  # Check if the exception is a NotFound
        return jsonify({"status": "error", "message": str(e)}), 404  # Return a 404 response with the error message
    elif isinstance(e, Conflict):  # Check if the exception is a Conflict
        return jsonify({"status": "error", "message": str(e)}), 409  # Return a 409 response with the conflict message
    elif isinstance(e, MySQLError):  # Check if the exception is a MySQL error
        return handle_mysql_error(e)  # Call a specific function to handle MySQL errors
    else:  # For all other exceptions
        return jsonify({"error": "Internal Server Error", "message": str(e)}), 500  # Return a 500 response


def handle_mysql_error(e):
    """
    Handle MySQL-specific errors and return appropriate responses.

    **Parameters:**
        - `e`: The MySQL error instance.

    **Returns:**
        - Flask response object with a JSON error message for the specific MySQL error.

    **Error handling:**
        - If the error is related to a missing table (errno 1146), and the environment is development,
          it attempts to extract the table name and provide a detailed error message.
        - For other errors, it returns a generic 500 Internal Server Error response.
    """
    if e.errno == 1146:  # Check if the MySQL error code indicates a missing table
        if os.getenv('FLASK_ENV') == 'development':  # Check if the environment is development
            table_name = extract_table_name(e.msg)  # Extract the missing table name from the error message
            return jsonify({
                "status": "error",  # Return an error status
                "message": f"A database table '{table_name}' is missing. Please check your database setup."
            }), 500  # Return a 500 response with the error message
    return jsonify({"status": "error", "message": "Internal Server Error"}), 500  # Return a generic 500 error response


def extract_table_name(error_message):
    """
    Extract the table name from the MySQL error message.

    **Parameters:**
        - `error_message`: The MySQL error message string containing the table name.

    **Returns:**
        - The name of the table if found; otherwise, returns "unknown_table".
    """
    match = re.search(r"Table '.*?\.(.*?)' doesn't exist", error_message)  # Use regex to find the table name
    return match.group(1) if match else "unknown_table"  # Return the table name if matched, else return "unknown_table"


def validate_array_field(field, field_name):
    """
    Validate that a given field is an array.

    **Parameters:**
        - `field`: The field to be validated (expected to be a list).
        - `field_name`: The name of the field, used in the error message.

    **Returns:**
        - The field if it is a list.

    **Raises:**
        - `ValueError`: If the field is not a list.
    """
    if isinstance(field, list):  # Check if the field is a list
        return field  # Return the field if it is a list
    else:  # If the field is not a list
        raise ValueError(f"{field_name} must be an array.")  # Raise an error indicating the field must be an array
