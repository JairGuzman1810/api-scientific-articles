from werkzeug.exceptions import NotFound  # Import exceptions for error handling

from app.models.article import Article  # Import the Article model to work with article data
from app.repositories.article_repository import \
    ArticleRepository  # Import the ArticleRepository for database operations
from app.repositories.user_repository import UserRepository  # Import the UserRepository for user interactions


class ArticleService:
    """
    The ArticleService class contains the core business logic for article-related operations.
    It acts as an intermediary between the controller and the ArticleRepository,
    managing article creation, retrieval, updates, and deletions.
    """

    def __init__(self):
        # Initialize repositories to handle database interactions
        self.article_repository = ArticleRepository()
        self.user_repository = UserRepository()  # Initialize UserRepository

    def create_article(self, article_data):
        """Create a new article using provided article data."""

        # Extract user ID from the article data
        user_id = article_data.get('user_id')

        # Check if the user exists
        user = self.user_repository.get_user_by_id(user_id)  # Fetch user by ID
        if not user:
            raise NotFound("User not found.")  # Raise NotFound if the user does not exist

        # Create an Article object from the provided data
        article = Article(None, **article_data)
        return self.article_repository.create_article(article)  # Persist the article in the database

    def get_all_articles(self):
        """Retrieve all articles from the repository."""
        return self.article_repository.get_all_articles()  # Fetch all articles

    def get_article_by_id(self, article_id):
        """Fetch an article from the repository using the article ID."""
        article = self.article_repository.get_article_by_id(article_id)  # Fetch the article by ID
        if not article:
            raise NotFound("Article not found.")  # Raise NotFound if the article does not exist
        return article  # Return the found article

    def get_articles_by_user_id(self, user_id):
        """Fetch all articles associated with a specific user ID."""

        # Check if the user exists
        user = self.user_repository.get_user_by_id(user_id)  # Fetch user by ID
        if not user:
            raise NotFound("User not found.")  # Raise NotFound if the user does not exist

        return self.article_repository.get_articles_by_user_id(user_id)  # Fetch articles by user ID

    def search_articles(self, user_id, search_term, search_type):
        """Search for articles based on a given search term, type, and user ID."""

        # Check if the user exists
        user = self.user_repository.get_user_by_id(user_id)  # Fetch user by ID
        if not user:
            raise NotFound("User not found.")  # Raise NotFound if the user does not exist

        # Validate search type
        if search_type not in ['title', 'keywords', 'doi']:
            raise ValueError("Invalid search type. Allowed values are 'title', 'keywords', or 'doi'.")

        # Validate search term
        if not search_term:
            raise ValueError("Search term is required.")

        # Call the repository's search function
        return self.article_repository.search_articles(user_id, search_term, search_type)

    def update_article(self, article_id, article_data):
        """Update an existing article's details based on provided article_data."""
        # Fetch the article by ID to check if it exists
        article = self.article_repository.get_article_by_id(article_id)
        if not article:
            raise NotFound("Article not found.")  # Raise NotFound if the article does not exist

        # Update article attributes directly from article_data if provided
        for key, value in article_data.items():
            if hasattr(article,
                       key) and value is not None:  # Check if the article object has the attribute and value is not None
                setattr(article, key, value)  # Set the new value

        return self.article_repository.update_article(article_id, article)

    def delete_article(self, article_id):
        """Delete an article from the database."""
        # Check if the article exists
        article = self.article_repository.get_article_by_id(article_id)
        if not article:
            raise NotFound("Article not found.")  # Raise NotFound if the article does not exist
        self.article_repository.delete_article(article_id)  # Persist the deletion in the database
