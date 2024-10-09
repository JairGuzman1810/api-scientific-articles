# Scientific Articles Management API

This project is a **Scientific Articles Management API**, developed as part of a technical test for the Muyal Research
Group (MRG). Its goal is to provide functionality for managing a database of scientific articles, including operations
to create, read, update, and delete articles.

## Contents

- [Features](#features)
- [Base URL](#base-url)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Error Handling](#error-handling)
- [How to Run the Application](#how-to-run-the-application)

## Features

- **User Authentication**: Supports user registration, login, token management (access and refresh tokens), and user
  profile updates.
- **Article Management**: Allows for the creation, updating, deletion, and retrieval of scientific articles, including
  detailed information such as title, authors, keywords, abstract, journal, DOI, and more.
- **API Documentation**: Integrated with Swagger for detailed API specifications and endpoint documentation.

## Base URL

The API is accessible through the following base URL:

- For local development: `http://localhost:5000/api`
- For production: `api-scientific-articles.vercel.app`

## Authentication

This API uses JWT (JSON Web Tokens) for secure authentication. Users must obtain an access token by logging in. The
token must be included in the `Authorization` header as a Bearer token for routes that require authentication.

### Example Authorization Header

Authorization: Bearer <your-access-token>

### Token Expiration

Access tokens are short-lived. You can refresh your tokens using the refresh token endpoint to obtain a new access token
without having to re-authenticate.

## API Endpoints

The API includes the following key endpoints:

- **User Management**
    - POST `/api/users/register` - Register a new user
    - POST `/api/users/login` - User login
    - POST `/api/users/token` - Refresh access token
    - PUT `/api/users/<user_id>` - Update user information
    - PUT `/api/users/<user_id>/password` - Update user password
    - DELETE `/api/users/<user_id>` - Delete an user


- **Article Management**
    - POST `/api/articles` - Create a new article
    - GET `/api/articles` - Retrieve a list of articles
    - GET `/api/articles/<article_id>` - Retrieve a specific article
    - GET `/api/articles/user/<user_id>` - Retrieve articles by Uuser
    - PUT `/api/articles/<article_id>` - Update an existing article
    - DELETE `/api/articles/<article_id>` - Delete an article
    - GET `/api/articles/search/<user_id>?query=<str>&type=<keywords|title|doi>` - Search for scientific articles by
      title, keywords, or DOI for a specific user.

## API Documentation

This API comes with integrated documentation that can be accessed through two platforms:

1. **Postman**: The Postman collection for this API can be imported into your Postman application. This collection
   contains all the endpoints and example requests for quick testing. To import the collection:
    - Download the JSON file of the API collection
      from [this link](https://github.com/JairGuzman1810/api-scientific-articles/raw/interface/api/resources/postman_collection.json).
    - Open Postman, click on **Import**, and choose the downloaded JSON file.

<div style="display:flex; flex-wrap:wrap; justify-content:space-between;">
      <img src="https://github.com/JairGuzman1810/api-scientific-articles/blob/interface/api/resources/postman.PNG" alt=""/>
      <br/>
</div>

2. **Swagger**: You can view the API documentation directly in your browser by navigating to the following endpoint:
    - Swagger UI: `http://localhost:5000/api/docs`
      This documentation provides a comprehensive overview of the API endpoints, including descriptions,
      request/response examples, and interactive testing capabilities.

<div style="display:flex; flex-wrap:wrap; justify-content:space-between;">
      <img src="https://github.com/JairGuzman1810/api-scientific-articles/blob/interface/api/resources/swagger.PNG" alt="DB Schema"/>
      <br/>
</div>

## Project Structure

The project is organized in the following way:

```
app/ 
├── models/ 
│ └── (Defines data structures representing entities, e.g., articles, users) 
├── repositories/ 
│ └── (Handles database interactions, ensuring a clean separation of data access logic) 
├── routes/ 
│ └── (Controllers that manage incoming HTTP requests and route them to the appropriate services) 
└── services/ 
  └── (Contains core business logic and rules, interacting with controllers to implement user requests)
└── utils/
  └── (Handles logic for validations, error handling, and token generation)
```

### Rationale for Project Structure

1. **Request Management (Controllers)**: These handle incoming HTTP requests and route them to the appropriate services,
   acting as the entry point for user interactions.

2. **Business Logic (Services)**: This layer contains the core business rules and logic, implementing actions like
   registering a new article and validating inputs.

3. **Repository Management (Repositories)**: This layer interacts with the database, managing all database queries in a
   structured manner.

4. **Model Management (Models)**: This layer defines the data structures representing the system's entities, ensuring
   consistency in data management across services and repositories.

## Database Schema

### Models:

1. **Users**: Stores details about the system's users (e.g., authors, administrators).
2. **Scientific Articles**: Contains essential information about the scientific articles managed within the system.

### Users Table:

- **Fields**:
    - `id`: Primary key (auto-incremented), uniquely identifies each user.
    - `first_name`: Stores the user's first name.
    - `last_name`: Stores the user's last name.
    - `username`: Stores the informal name of the user (unique).
    - `password_hash`: Hashed password for user authentication.

### Scientific Articles Table:

- **Fields**:
    - `id`: Primary key (auto-incremented), uniquely identifies each article.
    - `title`: The title of the scientific article.
    - `authors`: List of authors to track authorship.
    - `publication_date`: Date when the article was published.
    - `keywords`: A list of keywords related to the article for search and categorization.
    - `abstract`: A summary of the article's content.
    - `journal`: The name of the journal where the article was published.
    - `doi`: The Digital Object Identifier for the article.
    - `pages`: Optional field to store the number of pages in the article.

<div style="display:flex; flex-wrap:wrap; justify-content:space-between;">
      <img src="https://github.com/JairGuzman1810/api-scientific-articles/blob/interface/api/resources/db_Schema.PNG" alt="DB Schema"/>
</div>

## Error Handling

Errors are returned in a structured format, providing clear error codes and messages to help developers understand what
went wrong. Common error statuses include:

- `400 Bad Request`: Invalid input data or missing required parameters.
- `401 Unauthorized`: Invalid or missing authentication credentials.
- `403 Forbidden`: The user does not have permission to perform the requested action.
- `404 Not Found`: The requested resource could not be found.
- `409 Conflict`: The resource already exists (e.g., trying to register a user with an existing username).

## How to Run the Application

1. Set the environment variables in your `.env` file:

```plaintext
# Secret key used to sign and verify JWT tokens (for user authentication and session management)
JWT_SECRET_KEY=your_secret_key

# The hostname or IP address of the MySQL database server
MYSQL_HOST=localhost

# The port number used to connect to the MySQL database server
MYSQL_PORT=3306

# The username to authenticate and connect to the MySQL database
MYSQL_USER=root

# The password for the MySQL user
MYSQL_PASSWORD=password

# The name of the database to connect to within MySQL
MYSQL_DATABASE=mysql

# The environment in which the Flask application is running
FLASK_ENV=development
```

2. Install the required dependencies from requirements.txt:

```
pip install -r requirements.txt
```

3. Run the application:

```
python run.py
```

# SCIAM (Scientific Articles Management) Application

This repository contains the source code for the SCIAM application, designed to facilitate the management of scientific articles. Built with modern technologies, the application allows users to efficiently register, manage, and retrieve their scientific publications.

## Contents

- [Key Features](#key-features)
- [Technologies and Main Dependencies](#technologies-and-main-dependencies)
- [Complete List of Dependencies](#complete-list-of-dependencies)
- [Setup and Installation](#setup-and-installation)
- [Environment Variables Configuration](#environment-variables-configuration)
- [Run the Application](#run-the-application)
- [Application Screenshots](#application-screenshots)
- [Download the App](#download-the-app)

## Key Features

- **Article Registration**: Users can input and register new scientific articles with required fields such as title, authors, publication date, keywords, abstract, journal, DOI, and pages.
- **Article Management**:
  - **View Articles**: List all registered articles and search by title, keywords, or DOI.
  - **Edit Articles**: Modify existing article details with ease.
  - **Delete Articles**: Remove articles from the system as needed.
- **User Authentication**: Secure login and registration processes with automatic handling of token refresh and expiration for a seamless user experience.

## Technologies and Main Dependencies

### Axios
Used for making API requests to interact with the backend services for articles and user management.

### Zustand
A state management library for handling application state efficiently.

### React Query
Manages server state and provides a powerful data-fetching mechanism, enhancing user experience with automatic caching and synchronization.

### Async Storage
Used for storing user preferences and data locally on the device for quick access.

### TypeScript
Ensures type safety and improves development experience.

### JWT
Manages user authentication and authorization, including automatic token refresh for enhanced security.



## Complete List of Dependencies

```json
  "dependencies": {
    "@expo/vector-icons": "^14.0.2",
    "@react-native-async-storage/async-storage": "^2.0.0",
    "@react-navigation/native": "^6.0.2",
    "@tanstack/react-query": "^5.59.0",
    "axios": "^1.7.7",
    "expo": "~51.0.28",
    "expo-dev-client": "~4.0.27",
    "expo-font": "~12.0.9",
    "expo-linking": "~6.3.1",
    "expo-router": "~3.5.23",
    "expo-splash-screen": "~0.27.5",
    "expo-status-bar": "~1.12.1",
    "expo-system-ui": "~3.0.7",
    "expo-web-browser": "~13.0.3",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "react-native": "0.74.5",
    "react-native-reanimated": "~3.10.1",
    "react-native-safe-area-context": "4.10.5",
    "react-native-screens": "3.31.1",
    "react-native-web": "~0.19.10",
    "zustand": "^5.0.0-rc.2",
    "expo-navigation-bar": "~3.0.7"
  }
```


## Setup and Installation

### Clone the Repository

1. Clone this repository to your local machine:
   
```sh
git clone "https://github.com/JairGuzman1810/wordle-react"
```
2. Navigate into the cloned repository:
   
```sh
cd wordle-react
```

### Install Dependencies

1. Run the following command to install all necessary dependencies:

```sh
npm install
```

2. Or if you prefer using Yarn:

```sh
yarn install
```

## Environment Variables Configuration
Create a .env file in the root of the project and add the following environment variables (replace with your own values):
```
EXPO_PUBLIC_API_URL=your_api_url 
```
### Run the Application

1. Once you have installed all dependencies, you can run the application using the following command:

```sh
npm run:android
```

## Application Screenshots

<div style="display:flex; flex-wrap:wrap; justify-content:space-between;">
    <img src="https://github.com/JairGuzman1810/api-scientific-articles/blob/interface/app/resources/App-1.jpg" alt="Captura de pantalla 1" width="180"/>
    <img src="https://github.com/JairGuzman1810/api-scientific-articles/blob/interface/app/resources/App-2.jpg" alt="Captura de pantalla 2" width="180"/>
    <img src="https://github.com/JairGuzman1810/api-scientific-articles/blob/interface/app/resources/App-3.jpg" alt="Captura de pantalla 3" width="180"/>
    <img src="https://github.com/JairGuzman1810/api-scientific-articles/blob/interface/app/resources/App-4.jpg" alt="Captura de pantalla 4" width="180"/>
</div>
<div style="display:flex; flex-wrap:wrap; justify-content:space-between;">
    <img src="https://github.com/JairGuzman1810/api-scientific-articles/blob/interface/app/resources/App-5.jpg" alt="Captura de pantalla 5" width="180"/>
    <img src="https://github.com/JairGuzman1810/api-scientific-articles/blob/interface/app/resources/App-6.jpg" alt="Captura de pantalla 6" width="180"/>
    <img src="https://github.com/JairGuzman1810/api-scientific-articles/blob/interface/app/resources/App-7.jpg" alt="Captura de pantalla 7" width="180"/>
    <img src="https://github.com/JairGuzman1810/api-scientific-articles/blob/interface/app/resources/App-8.jpg" alt="Captura de pantalla 8" width="180"/>
</div>

## Download the App

You can download the latest version of the SCIAM (Scientific Articles Management) app from the following link:

[Download SCIAM App](https://github.com/JairGuzman1810/api-scientific-articles/raw/refs/heads/interface/app/resources/app-release.apk)

