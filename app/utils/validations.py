from flask import request  # Import the request object from Flask


def validate_json_and_required_fields(required_fields):
    """
    Validate that the request is JSON and contains the required fields.

    **Parameters:**
        - `required_fields`: List of required fields that must be present in the request JSON.

    **Returns:**
        - Parsed JSON data from the request if valid.

    **Raises:**
        - `ValueError`: If the request is not JSON or if any required fields are missing.
    """
    if not request.is_json:  # Check if the request body is JSON
        raise ValueError("Request body must be JSON.")  # Raise an error if not JSON

    data = request.get_json()  # Parse the JSON body of the request
    missing_fields = [field for field in required_fields if field not in data]  # Identify any missing fields

    if missing_fields:  # If there are missing fields
        raise ValueError(
            f"Missing required fields: {', '.join(missing_fields)}")  # Raise an error listing the missing fields

    return data  # Return the parsed JSON data if all validations pass
