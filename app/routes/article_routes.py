from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

from app.services.article_service import ArticleService
from app.utils.error_handling import handle_common_exceptions, validate_array_field
from app.utils.validations import validate_json_and_required_fields

article_bp = Blueprint('article', __name__)
article_service = ArticleService()


@article_bp.route('/articles', methods=['POST'])
@jwt_required()
def create_article():
    """
    Create a new article.

    **Security:**
        - Requires a valid bearer token for authentication.

    **Request Body Parameters:**
        - `title`: str, required - Title of the article.
        - `authors`: array of str, required - List of authors.
        - `publication_date`: str (YYYY-MM-DD), required - Publication date.
        - `keywords`: array of str, required - List of keywords.
        - `abstract`: str, required - Summary of the article.
        - `journal`: str, required - Name of the journal.
        - `doi`: str, required - DOI of the article.
        - `pages`: int, optional - Number of pages in the article.
        - `user_id`: int, required - ID of the user creating the article.

    **Response:**
        - `201 Created`: On successful article creation with article data.
        - `400 Bad Request`: If the input is invalid or JSON is not provided.
        - `404 Not Found`: User not found.
        - `500 Internal Server Error`: For any server-related issues.
    """
    try:
        # Retrieve and validate the JSON data from the request body
        data = validate_json_and_required_fields(
            ['title', 'authors', 'publication_date', 'keywords', 'abstract', 'journal', 'doi', 'user_id']
        )

        # Validate authors and keywords fields to ensure they are arrays
        data['authors'] = validate_array_field(data.get('authors', []), "authors")
        data['keywords'] = validate_array_field(data.get('keywords', []), "keywords")

        # Handle optional pages field
        data['pages'] = data.get('pages', None)  # Default to None if not provided

        # Create the article using the article service
        article = article_service.create_article(data)

        # Prepare the response data
        response_data = {
            "data": {
                "article": article.__dict__  # Convert the article object to a dictionary
            },
            "status": "success"
        }

        # Return the success response with status 201
        return jsonify(response_data), 201

    except Exception as e:
        return handle_common_exceptions(e)  # Use the utility function for common exception handling
