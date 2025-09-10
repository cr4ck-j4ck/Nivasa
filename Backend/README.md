# Nivasa Backend

This is the backend for **Nivasa**, a property rental platform inspired by Airbnb. It is a RESTful API built with Node.js, Express, and TypeScript, providing essential services for user authentication, property listings, and user profile management.

## ✨ Features

-   **User Authentication**: Secure user registration and login with email/password.
-   **Google OAuth 2.0**: Seamless sign-in and sign-up using Google accounts.
-   **Email Verification**: New users receive a verification email to activate their accounts.
-   **JWT-Based Sessions**: Stateless authentication using JSON Web Tokens (JWT) with access and refresh tokens stored in secure, HTTP-only cookies.
-   **Property Listings**: API endpoints to fetch property details and browse listings by city.
-   **Wishlist Management**: Users can add or remove listings from their personal wishlist.
-   **Real-time Updates**: Server-Sent Events (SSE) for real-time feedback during the email verification process.
-   **Structured Data Validation**: Robust request body validation using Zod schemas.
-   **Database Seeding**: A script to initialize the database with sample user and listing data.

## 🛠️ Tech Stack

-   **Framework**: [Express.js](https://expressjs.com/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) ODM
-   **Authentication**: [Passport.js](http://www.passportjs.org/) (for Google OAuth), [JWT](https://jwt.io/), [bcrypt](https://www.npmjs.com/package/bcrypt)
-   **Validation**: [Zod](https://zod.dev/)
-   **Emailing**: [Nodemailer](https://nodemailer.com/) (with Zoho SMTP)
-   **Runtime**: [Node.js](https://nodejs.org/)

## 📂 Project Structure

The backend codebase is organized into a modular and maintainable structure:

```
/Backend
├── src/
│   ├── Controllers/    # Request handlers and business logic
│   ├── config/         # Database connection configuration
│   ├── JWT/            # JWT generation and verification middleware
│   ├── Models/         # Mongoose schemas and models
│   ├── Routes/         # API route definitions
│   ├── Schemas/        # Zod validation schemas
│   ├── Types/          # Custom TypeScript type definitions
│   ├── utils/          # Utility functions (error handling, async wrappers)
│   ├── auth.ts         # Passport.js strategy configuration
│   ├── init.ts         # Database seeding script
│   └── server.ts       # Main server entry point
├── .env.example        # Example environment variables
├── package.json        # Project dependencies and scripts
└── tsconfig.json       # TypeScript compiler options
```

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   npm
-   MongoDB instance (local or cloud)

### Installation & Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/cr4ck-j4ck/Nivasa.git
    ```

2.  **Navigate to the backend directory**:
    ```bash
    cd Nivasa/Backend
    ```

3.  **Install dependencies**:
    ```bash
    npm install
    ```

4.  **Set up environment variables**:
    Create a `.env` file in the `Backend` root directory and add the required variables. You can use `.env.example` as a template.
    ```env
    # Server Configuration
    PORT=3000
    NODE_ENV=development
    CLIENT_URL=http://localhost:5173
    BACKEND_URL=http://localhost:3000

    # Database
    MONGO_URI=your_mongodb_connection_string

    # JWT Secrets
    JWT_SECRET=your_jwt_secret
    JWT_REFRESH_SECRET=your_jwt_refresh_secret

    # Google OAuth Credentials
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    GOOGLE_REDIRECT_URI=http://localhost:3000

    # SMTP (Zoho) Credentials for Nodemailer
    SMTP_USER=your_zoho_email_address
    ZOHO_NO_REPLY=your_zoho_app_password
    ```

### Available Scripts

-   **Build the project**:
    Compiles TypeScript to JavaScript in the `dist` directory.
    ```bash
    npm run build
    ```

-   **Run in development mode**:
    Starts the server with `nodemon` and `ts-node` for automatic restarts on file changes.
    ```bash
    npm run dev
    ```

-   **Start the production server**:
    Runs the compiled JavaScript code from the `dist` directory.
    ```bash
    npm start
    ```

-   **Watch for changes**:
    Continuously watches TypeScript files and recompiles them on change.
    ```bash
    npm run watch
    ```

## 📝 API Endpoints

### Authentication

| Method | Endpoint                   | Description                                  |
| :----- | :------------------------- | :------------------------------------------- |
| `POST` | `/user/signup`             | Registers a new user via email and password. |
| `POST` | `/user/login`              | Logs in a user and returns JWTs in cookies.  |
| `GET`  | `/auth/google`             | Initiates the Google OAuth 2.0 flow.         |
| `GET`  | `/auth/google/callback`    | Handles the Google OAuth callback.           |
| `GET`  | `/auth/status`             | Checks if the user is currently authenticated. |
| `GET`  | `/user/verifyEmail-token`  | Verifies a user's email via a token link.    |
| `GET`  | `/user/verification-stream/:id` | SSE endpoint for real-time verification status. |

### Listings

| Method | Endpoint              | Description                                      |
| :----- | :-------------------- | :----------------------------------------------- |
| `GET`  | `/listing/:id`        | Fetches details for a single property by its ID. |
| `GET`  | `/listingCard/:city`  | Fetches a list of properties in a specific city. |

### Wishlist

| Method   | Endpoint               | Description                               |
| :------- | :--------------------- | :---------------------------------------- |
| `GET`    | `/user/getWishlist`    | Retrieves the user's complete wishlist.   |
| `POST`   | `/user/wishlist`       | Adds a listing to the user's wishlist.    |
| `DELETE` | `/user/wishlist/:id`   | Removes a listing from the user's wishlist. |
