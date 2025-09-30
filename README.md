# Nivasa - Property Listing and Booking Platform

![Nivasa](https://img.shields.io/badge/Nivasa-Property%20Booking-blue)
![Backend](https://img.shields.io/badge/Backend-Node.js%2FExpress-green)
![Frontend](https://img.shields.io/badge/Frontend-React%2FVite-orange)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

## 📖 Table of Contents

- [Project Overview](#-project-overview)
- [Folder Structure](#-folder-structure)
- [Environment Variables](#-environment-variables)
- [Getting Started](#-getting-started)
- [API Endpoints](#-api-endpoints)
- [Contribution Guide](#-contribution-guide)
- [License](#-license)

## 📝 Project Overview

Nivasa is a full-stack web application designed to serve as a comprehensive platform for listing, discovering, and booking properties. It provides a seamless user experience for both property owners who wish to list their spaces and users looking for a place to stay. The application is built with a modern technology stack, ensuring scalability, maintainability, and a high-quality user experience.

### Backend

The backend is a robust RESTful API built with **Node.js** and **Express.js**. It is written in **TypeScript** to ensure type safety and improve developer productivity. The backend is responsible for handling all business logic, including user authentication, property listings, bookings, and payments.

- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) and Google OAuth 2.0
- **Image Storage**: Cloudinary for cloud-based image management
- **Key Libraries**: `bcrypt` for password hashing, `zod` for validation, and `nodemailer` for email services.

### Frontend

The frontend is a modern, responsive, and interactive single-page application (SPA) built with **React**. It utilizes **Vite** for a fast and efficient development experience and is also written in **TypeScript**. The frontend is designed to provide a smooth and intuitive user interface for interacting with the platform.

- **Framework**: React
- **Language**: TypeScript
- **Bundler**: Vite
- **Routing**: React Router
- **State Management**: Zustand
- **Styling**: Tailwind CSS with Radix UI components
- **Mapping**: MapTiler SDK for interactive maps

## 📁 Folder Structure

The repository is organized into two main directories: `Backend` and `Frontend`. Below is a simplified overview of the project structure:

```
.
├── Backend/
│   ├── src/
│   │   ├── config/       # Database and Cloudinary configuration
│   │   ├── Controllers/  # Request handlers and business logic
│   │   ├── JWT/          # JWT generation and verification middleware
│   │   ├── Models/       # Mongoose schemas and models
│   │   ├── Routes/       # API endpoint definitions
│   │   └── server.ts     # Express server entry point
│   ├── package.json
│   └── tsconfig.json
│
├── Frontend/
│   ├── src/
│   │   ├── Components/   # Reusable React components
│   │   ├── Context/      # React context providers
│   │   ├── Pages/        # Top-level page components
│   │   ├── Services/     # API service functions
│   │   ├── Store/        # Zustand state management store
│   │   └── App.tsx       # Main application component
│   ├── package.json
│   └── vite.config.ts
│
├── LICENSE
└── README.md
```

## ⚙️ Environment Variables

To run the application locally, you need to set up environment variables for both the backend and frontend. Create a `.env` file in both the `Backend` and `Frontend` directories and populate them with the required values.

### Backend (`Backend/.env`)

```env
# MongoDB Connection
# Get this from your MongoDB Atlas dashboard
MONGO_URI=mongodb+srv://<user>:<password>@<cluster-url>/<database-name>
PORT=3000
NODE_ENV=development

# JWT Secrets
# Use strong, randomly generated strings
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key

# Google OAuth Credentials
# Get these from the Google Cloud Console
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000 # Adjust if your backend port is different

# Cloudinary Credentials
# Get these from your Cloudinary dashboard
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Frontend (`Frontend/.env`)

```env
# Backend API URL
# The URL of your running backend server
VITE_BACKEND_API=http://localhost:3000

# MapTiler API Key
# Get this from your MapTiler Cloud dashboard
VITE_MAPTILER_KEY=your_maptiler_api_key
```

## 🚀 Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) (or your preferred package manager)
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/cr4ck-j4ck/Nivasa.git
cd Nivasa
```

### 2. Set Up the Backend

- Navigate to the `Backend` directory:
  ```bash
  cd Backend
  ```
- Install dependencies:
  ```bash
  npm install
  ```
- Create a `.env` file and add the required backend environment variables (see [Environment Variables](#-environment-variables)).
- Run the development server:
  ```bash
  npm run dev
  ```
- The backend server should now be running on `http://localhost:3000` (or the port you configured).

### 3. Set Up the Frontend

- Open a new terminal and navigate to the `Frontend` directory:
  ```bash
  cd Frontend
  ```
- Install dependencies:
  ```bash
  npm install
  ```
- Create a `.env` file and add the required frontend environment variables (see [Environment Variables](#-environment-variables)).
- Run the development server:
  ```bash
  npm run dev
  ```
- The frontend development server should now be running on `http://localhost:5173` (or the port Vite assigns).

## 📝 API Endpoints

Here is a summary of the available API endpoints.

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

## 🤝 Contribution Guide

We welcome contributions from the community! To contribute, please follow these guidelines.

### Reporting Issues

- If you find a bug or have a feature request, please open an issue on GitHub.
- Provide a clear and descriptive title and a detailed description of the issue.

### Submitting Pull Requests

1.  **Fork the repository** and create a new branch for your feature or bug fix:
    ```bash
    git checkout -b feature/your-feature-name
    ```
2.  **Make your changes** and ensure the code follows the existing style.
3.  **Test your changes** to ensure they work as expected and do not break existing functionality.
4.  **Commit your changes** with a clear and concise commit message.
5.  **Push your branch** to your fork:
    ```bash
    git push origin feature/your-feature-name
    ```
6.  **Open a pull request** to the `main` branch of the original repository.

## 📜 License

This project is licensed under the **MIT License**.

The MIT License is a permissive free software license that allows for the reuse of the software within proprietary software, provided that all copies of the licensed software include a copy of the MIT License terms and the copyright notice. It grants you the right to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software.

For the full license text, please see the [LICENSE](LICENSE) file.