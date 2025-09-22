# Nivasa - A Modern Property Rental Platform

**Nivasa** is a full-stack, feature-rich property rental platform inspired by Airbnb. It provides a seamless experience for users to discover, book, and host unique properties around the world. This project is built with a modern tech stack, featuring a React frontend and a Node.js backend.

## ✨ Key Features

-   **User Authentication**: Secure user registration and login with email/password, plus seamless Google OAuth 2.0 integration. Includes email verification and JWT-based sessions.
-   **Dynamic Property Listings**: Browse listings by city, view detailed property pages with comprehensive information, image galleries, and interactive maps.
-   **Complete Booking System**: Check date availability in real-time, get dynamic pricing calculations, and create bookings with ease.
-   **Wishlist Management**: Users can save and manage their favorite properties in a personal wishlist.
-   **Multi-Step Hosting Flow**: A guided, user-friendly process for hosts to list their own properties, including photo uploads, setting amenities, and defining pricing.
-   **Host Dashboard**: A dedicated dashboard for hosts to manage their listings, track performance statistics, and view bookings.
-   **Admin Dashboard**: An internal tool for administrators to review, approve, or reject new property submissions, ensuring quality control.
-   **Real-time Feedback**: Server-Sent Events (SSE) for real-time updates during processes like email verification.

## 🛠️ Tech Stack

### Frontend

-   **Framework**: [React](https://reactjs.org/) with [Vite](https://vitejs.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [Shadcn/ui](https://ui.shadcn.com/) & custom components
-   **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
-   **Routing**: [React Router](https://reactrouter.com/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **API Communication**: [Axios](https://axios-http.com/)

### Backend

-   **Framework**: [Express.js](https://expressjs.com/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
-   **Authentication**: [Passport.js](http://www.passportjs.org/) (for Google OAuth), [JWT](https://jwt.io/), [bcrypt](https://www.npmjs.com/package/bcrypt)
-   **Validation**: [Zod](https://zod.dev/)
-   **Emailing**: [Nodemailer](https://nodemailer.com/)
-   **Image Handling**: [Cloudinary](https://cloudinary.com/) for image storage and transformations.

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   npm
-   MongoDB instance (local or cloud)
-   Cloudinary account for image uploads

### Backend Setup

1.  **Navigate to the backend directory**:
    ```bash
    cd Backend
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Set up environment variables**:
    Create a `.env` file in the `Backend` directory. Use `Backend/.env.example` as a template and fill in your credentials.
4.  **Run the development server**:
    ```bash
    npm run dev
    ```
    The backend will be running on `http://localhost:3000` (or your specified `PORT`).

### Frontend Setup

1.  **Navigate to the frontend directory**:
    ```bash
    cd Frontend
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Set up environment variables**:
    Create a `.env` file in the `Frontend` directory and add your backend API URL:
    ```env
    VITE_BACKEND_API=http://localhost:3000
    ```
4.  **Run the development server**:
    ```bash
    npm run dev
    ```
    The frontend will be running on `http://localhost:5173`.

## 📝 API Endpoints

### Authentication

| Method | Endpoint                | Description                               |
| :----- | :---------------------- | :---------------------------------------- |
| `POST` | `/user/signup`          | Registers a new user.                     |
| `POST` | `/user/login`           | Logs in a user and returns JWTs.          |
| `GET`  | `/auth/google`          | Initiates Google OAuth 2.0 flow.          |
| `GET`  | `/auth/google/callback` | Handles the Google OAuth callback.        |
| `GET`  | `/auth/status`          | Checks if the user is authenticated.      |

### Listings

| Method | Endpoint                   | Description                                  |
| :----- | :------------------------- | :------------------------------------------- |
| `POST` | `/create-listing`          | Creates a new property listing (for hosts).  |
| `GET`  | `/listing/:id`             | Fetches details for a single property.       |
| `GET`  | `/listingCard/:city`       | Fetches listings in a specific city.         |
| `GET`  | `/cities-with-listings`    | Gets a random selection of cities with their listings. |

### Bookings

| Method | Endpoint                   | Description                                  |
| :----- | :------------------------- | :------------------------------------------- |
| `GET`  | `/api/bookings/availability` | Checks if a listing is available for given dates. |
| `GET`  | `/api/bookings/calculate-pricing` | Calculates the price for a potential booking. |
| `POST` | `/api/bookings`            | Creates a new booking.                       |
| `GET`  | `/api/bookings/user`       | Retrieves all bookings for the logged-in user. |
| `GET`  | `/api/bookings/:bookingId` | Fetches details for a single booking.        |
| `PUT`  | `/api/bookings/:bookingId/cancel` | Cancels a booking.                    |

### User & Wishlist

| Method   | Endpoint             | Description                               |
| :------- | :------------------- | :---------------------------------------- |
| `GET`    | `/user/getWishlist`  | Retrieves the user's complete wishlist.   |
| `POST`   | `/user/wishlist`     | Adds a listing to the user's wishlist.    |
| `DELETE` | `/user/wishlist/:id` | Removes a listing from the user's wishlist. |

### Host Dashboard

| Method | Endpoint          | Description                               |
| :----- | :---------------- | :---------------------------------------- |
| `GET`  | `/host/listings`  | Gets all listings for the logged-in host. |
| `GET`  | `/host/stats`     | Gets statistics for the host's listings.  |

### Admin

| Method | Endpoint                       | Description                                  |
| :----- | :----------------------------- | :------------------------------------------- |
| `GET`  | `/admin/pending`               | Retrieves all listings pending approval.     |
| `PUT`  | `/admin/listings/:listingId/status` | Approves or rejects a listing.          |