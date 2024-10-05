# The 'Article' class represents a scientific article in the Scientific Article Management System.
# It encapsulates essential information related to each article, such as title, authors, publication date,
# keywords, and other metadata.

class Article:
    def __init__(self, id, title, authors, publication_date, keywords, abstract, journal, doi, pages, user_id):
        # Initialize a new instance of the Article class with the following attributes:

        self.id = id
        # 'id' is the unique identifier for the article

        self.title = title
        # 'title' represents the title of the article

        self.authors = authors
        # 'authors' is a list of authors who contributed to the article

        self.publication_date = publication_date
        # 'publication_date' stores the date when the article was published (string format)

        self.keywords = keywords
        # 'keywords' is a list of key terms or phrases that relate to the article's content

        self.abstract = abstract
        # 'abstract' represents a brief summary of the article's content

        self.journal = journal
        # 'journal' is the name of the journal where the article was published

        self.doi = doi
        # 'doi' is the Digital Object Identifier for the article, a unique alphanumeric string

        self.pages = pages
        # 'pages' represents the range of pages the article covers in the journal

        self.user_id = user_id
        # 'user_id' is the identifier of the user who submitted or is associated with this article
