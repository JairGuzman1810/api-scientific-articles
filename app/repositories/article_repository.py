import json  # Import the JSON library for converting lists to JSON strings

import mysql.connector  # Import the MySQL connector library to interact with the MySQL database

from app.config import Config  # Import the configuration settings
from app.models.article import Article  # Import the Article model to work with article data


class ArticleRepository:
    """
    The ArticleRepository class handles interactions with the database for article-related operations.
    It provides a clear separation between business logic and data access logic,
    ensuring that all database queries (e.g., fetching, saving, updating articles) are managed
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

    def create_article(self, article):
        """Insert a new article into the database."""
        self.cursor.execute(
            """
            INSERT INTO scientific_articles 
            (title, authors, publication_date, keywords, abstract, journal, doi, pages, user_id) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (
                article.title,
                json.dumps(article.authors),  # Convert authors list to JSON
                article.publication_date,
                json.dumps(article.keywords),  # Convert keywords list to JSON
                article.abstract,
                article.journal,
                article.doi,
                article.pages,
                article.user_id
            )  # Parameterized query
        )
        self.connection.commit()  # Commit the transaction to save changes
        article.id = self.cursor.lastrowid  # Set the article ID to the last inserted row ID
        return article  # Return the newly created article

    def get_article_by_id(self, article_id):
        """Fetch an article from the database using the article ID."""
        self.cursor.execute(
            "SELECT * FROM scientific_articles WHERE id = %s",
            (article_id,)  # Parameterized query to prevent SQL injection
        )
        result = self.cursor.fetchone()  # Fetch one result from the executed query
        if result:
            return Article(*result)  # Unpack result directly into Article constructor
        return None  # Return None if no article found

    def get_all_articles(self):
        """Fetch all articles from the database."""
        self.cursor.execute("SELECT * FROM scientific_articles")
        results = self.cursor.fetchall()  # Fetch all results from the executed query
        return [Article(*article) for article in results]  # Convert each result into an Article instance

    def get_articles_by_user_id(self, user_id):
        """Fetch articles from the database using the user ID."""
        self.cursor.execute(
            "SELECT * FROM scientific_articles WHERE user_id = %s",
            (user_id,)  # Parameterized query to prevent SQL injection
        )
        results = self.cursor.fetchall()  # Fetch all results from the executed query
        if results:
            return [Article(*article) for article in results]  # Convert each result into an Article instance
        return None  # Return None if no articles found

    def update_article(self, article_id, article):
        """Update an existing article's information in the database."""
        self.cursor.execute(
            """
            UPDATE scientific_articles 
            SET title = %s, authors = %s, publication_date = %s, keywords = %s, 
            abstract = %s, journal = %s, doi = %s, pages = %s 
            WHERE id = %s
            """,
            (
                article.title,
                json.dumps(article.authors),  # Convert authors list to JSON
                article.publication_date,
                json.dumps(article.keywords),  # Convert keywords list to JSON
                article.abstract,
                article.journal,
                article.doi,
                article.pages,
                article_id
            )  # Parameterized query
        )
        self.connection.commit()  # Commit the transaction to save changes
        return article  # Return the updated article

    def delete_article(self, article_id):
        """Delete an article from the database using the article ID."""
        self.cursor.execute(
            "DELETE FROM scientific_articles WHERE id = %s",
            (article_id,)  # Parameterized query to prevent SQL injection
        )
        self.connection.commit()  # Commit the transaction to save changes
