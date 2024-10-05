# Import the create_app function from the app module.
from app import create_app

# Create an instance of the Flask application by calling the create_app function.
app = create_app()

# This condition checks if the script is being run directly (not imported as a module).
if __name__ == '__main__':
    # Start the Flask application with debug mode enabled.
    app.run(debug=True)
