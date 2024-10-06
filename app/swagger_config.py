from flask_swagger_ui import get_swaggerui_blueprint

# Define Swagger configurations directly in this file
SWAGGER_URL = '/api/docs'  # URL for exposing Swagger UI (without trailing '/')
API_URL = '/static/swagger.json'  # Our API url (can be a local resource)

SWAGGER_CONFIG = {
    'app_name': "Scientific Articles Management API",
    'docExpansion': "none",  # Collapse all sections by default
    'filter': True,  # Enable filtering to search through endpoints
    'showExtensions': True,  # Option to show/hide extensions
    'defaultModelsExpandDepth': -1,  # Do not expand models by default
    'customCss': """
        .topbar { display: none }  /* Hide the top bar */
        /* Add other custom styles here */
    """
}


def create_swagger_blueprint():
    swaggerui_blueprint = get_swaggerui_blueprint(
        SWAGGER_URL,
        API_URL,
        config=SWAGGER_CONFIG
    )

    return swaggerui_blueprint
