from flask import Blueprint, jsonify, request
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


@article_bp.route('/articles', methods=['GET'])
@jwt_required()
def get_articles():
    """
    Retrieve a list of articles.

    **Security:**
        - Requires a valid bearer token for authentication.

    **Response:**
        - `200 OK`: A list of articles retrieved successfully.
        - `500 Internal Server Error`: For any server-related issues.
    """
    try:
        # Retrieve all articles using the article service
        articles = article_service.get_all_articles()

        # Convert articles to a list of dictionaries for JSON response
        response_data = {
            "data": [article.__dict__ for article in articles],  # Convert each article to a dictionary
            "status": "success"  # Indicate the status of the request
        }

        # Return the success response with status 200
        return jsonify(response_data), 200

    except Exception as e:
        # Handle any exceptions using the common exception handler
        return handle_common_exceptions(e)


@article_bp.route('/articles/<int:article_id>', methods=['GET'])
@jwt_required()
def get_article(article_id):
    """
    Retrieve a specific article by its ID.

    **Security:**
        - Requires a valid bearer token for authentication.

    **Parameters:**
        - `article_id`: int, required - ID of the article to retrieve.

    **Responses:**
        - `200 OK`: On successful retrieval of the article.
        - `404 Not Found`: If the article with the given ID does not exist.
        - `500 Internal Server Error`: For any server-related issues.
    """
    try:
        # Retrieve the article by its ID using the article service
        article = article_service.get_article_by_id(article_id)

        # Prepare the response data
        response_data = {
            "data": article.__dict__,  # Convert the article to a dictionary
            "status": "success"  # Indicate the status of the request
        }

        return jsonify(response_data), 200

    except Exception as e:
        # Handle any exceptions using the common exception handler
        return handle_common_exceptions(e)


@article_bp.route('/articles/user/<int:user_id>', methods=['GET'])
@jwt_required()
def get_articles_by_user(user_id):
    """
    Retrieve all articles by a specific user ID.

    **Security:**
        - Requires a valid bearer token for authentication.

    **Parameters:**
        - `user_id`: int, required - ID of the user whose articles to retrieve.

    **Responses:**
        - `200 OK`: A list of articles retrieved successfully.
        - `404 Not Found`: User not found.
        - `500 Internal Server Error`: For any server-related issues.
    """
    try:
        # Retrieve all articles associated with the given user ID using the article service
        articles = article_service.get_articles_by_user_id(user_id)

        # Prepare the response data
        response_data = {
            "data": [article.__dict__ for article in articles] if articles else [],
            # Convert articles to a dictionary, or return empty list
            "status": "success"  # Indicate the status of the request
        }

        return jsonify(response_data), 200

    except Exception as e:
        # Handle any exceptions using the common exception handler
        return handle_common_exceptions(e)


@article_bp.route('/articles/search/<int:user_id>', methods=['GET'])
@jwt_required()
def search_articles(user_id):
    """
    Search for scientific articles by title, keywords, or DOI for a specific user.

    **Security:**
        - Requires a valid bearer token for authentication.

    **Path Parameters:**
        - `user_id`: int, required - ID of the user performing the search.

    **Query Parameters:**
        - `query`: str, required - The term to search for in the specified field.
        - `type`: str, required - The type of search ('title', 'keywords', or 'doi').

    **Response:**
        - `200 OK`: Articles retrieved successfully with the list of articles.
        - `400 Bad Request`: If the input is invalid or the query parameters are missing.
        - `404 Not Found`: User not found.
        - `500 Internal Server Error`: For any server-related issues.
    """
    try:
        # Retrieve query parameters
        search_term = request.args.get('query')  # Get the search term from query parameters
        search_type = request.args.get('type')  # Get the search type from query parameters

        # Search for articles using the article service
        articles = article_service.search_articles(user_id, search_term, search_type)

        # Prepare the response data
        response_data = {
            "status": "success",
            "data": {"articles": [article.__dict__ for article in articles]}
            # Convert Article instances to dictionaries
        }

        # Return the success response with status 200
        return jsonify(response_data), 200

    except Exception as e:
        # Handle any exceptions using the common exception handler
        return handle_common_exceptions(e)


@article_bp.route('/articles/<int:article_id>', methods=['PUT'])
@jwt_required()
def update_article(article_id):
    """
    Update an article by ID.

    **Security:**
        - Requires a valid bearer token for authentication.

    **Path Parameters:**
        - `article_id`: int, required - ID of the article to be updated.

    **Request Body Parameters:**
        - `title`: str - New title for the article.
        - `authors`: array of str - List of authors for the article.
        - `keywords`: array of str - List of keywords related to the article.
        - `publication_date`: str (YYYY-MM-DD) - Publication date of the article.
        - `abstract`: str - Summary of the article.
        - `journal`: str - Name of the journal.
        - `doi`: str - DOI of the article.
        - `pages`: str - Page numbers of the article.

    **Response:**
        - `200 OK`: Article updated successfully with a success message.
        - `400 Bad Request`: If the input is invalid or the request body is not JSON.
        - `404 Not Found`: If the article to be updated is not found.
        - `500 Internal Server Error`: For any server-related issues.
    """
    try:
        # Retrieve and validate the JSON data from the request body
        data = validate_json_and_required_fields(
            ['title', 'authors', 'publication_date', 'keywords', 'abstract', 'journal', 'doi']
        )

        # Validate authors and keywords fields to ensure they are arrays
        data['authors'] = validate_array_field(data.get('authors', []), "authors")
        data['keywords'] = validate_array_field(data.get('keywords', []), "keywords")

        # Update the article using the article service
        article_service.update_article(article_id, data)

        # Prepare the response data
        response_data = {
            "message": "Article updated successfully",  # Indicate the status of the request
            "status": "success"
        }

        # Return the success response with status 200
        return jsonify(response_data), 200

    except Exception as e:
        # Handle any exceptions using the common exception handler
        return handle_common_exceptions(e)


@article_bp.route('/articles/<int:article_id>', methods=['DELETE'])
@jwt_required()
def delete_article(article_id):
    """
    Delete an article by ID.

    **Security:**
        - Requires a valid bearer token for authentication.

    **Path Parameters:**
        - `article_id`: int, required - ID of the article to be deleted.

    **Response:**
        - `200 OK`: Article deleted successfully.
        - `404 Not Found`: If the article with the given ID does not exist.
        - `500 Internal Server Error`: For any server-related issues.
    """
    try:
        article_service.delete_article(article_id)
        return jsonify({"message": "Article deleted successfully", "status": "success"}), 200

    except Exception as e:
        # Handle any exceptions using the common exception handler
        return handle_common_exceptions(e)
