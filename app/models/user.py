# The 'User' class represents a user in the Scientific Article Management System, encapsulating user-related data.
# It includes essential attributes such as user identification, authentication details, and personal information.

class User:
    def __init__(self, id, username, first_name, last_name, password_hash):
        # Initialize a new instance of the User class with the following attributes:

        self.id = id
        # 'id' is the unique identifier for the user

        self.username = username
        # 'username' is the username chosen by the user for login or display purposes

        self.first_name = first_name
        # 'first_name' represents the user's given name

        self.last_name = last_name
        # 'last_name' represents the user's family name or surname

        self.password_hash = password_hash
        # 'password_hash' stores the hashed version of the user's password for secure storage
