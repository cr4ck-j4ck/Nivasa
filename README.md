# Project Nivasa

Nivasa is a full-stack web application designed for browsing and managing property listings. It provides a modern, user-friendly interface for users to find their next home and for administrators to manage the available properties.

## Table of Contents

- [Project Nivasa](#project-nivasa)
  - [Table of Contents](#table-of-contents)
  - [Tech Stack](#tech-stack)
    - [Frontend](#frontend)
    - [Backend](#backend)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running the Application](#running-the-application)
  - [Project Structure](#project-structure)
  - [License](#license)
  - [Author](#author)


## Tech Stack

### Frontend

*   **Framework:** [React](https://reactjs.org/) with [Vite](https://vitejs.dev/)
*   **Routing:** [React Router](https://reactrouter.com/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) with [PostCSS](https://postcss.org/)
*   **UI Components:**
    *   [Shadcn/ui](https://ui.shadcn.com/) (indicated by `class-variance-authority`, `clsx`, `tailwind-merge`)
    *   [Material-UI](https://mui.com/)
*   **Mapping:** [Leaflet](https://leafletjs.com/) & [MapTiler](https://www.maptiler.com/)
*   **HTTP Client:** [Axios](https://axios-http.com/)
*   **Icons:** [Lucide React](https://lucide.dev/guide/packages/lucide-react)

### Backend

*   **Framework:** [Express.js](https://expressjs.com/)
*   **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) ODM
*   **Environment Management:** [dotenv](https://www.npmjs.com/package/dotenv)
*   **Middleware:** [CORS](https://www.npmjs.com/package/cors)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have the following installed on your development machine:

*   Node.js (v18.x or later recommended)
*   npm (usually comes with Node.js)
*   MongoDB (local installation or a cloud-based instance like MongoDB Atlas)

### Installation

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/cr4ck-j4ck/Nivasa.git
    cd Nivasa
    ```

2.  **Install Backend dependencies:**

    ```sh
    cd Backend
    npm install
    ```

3.  **Install Frontend dependencies:**

    ```sh
    cd ../Frontend
    npm install --legacy-peer-deps
    ```

### Running the Application

1.  **Set up environment variables:**

    In the `Backend` directory, create a `.env` file and add the following variables. Replace the placeholder with your actual MongoDB connection string.

    ```
    MONGO_URL=mongodb://127.0.0.1:27017/nivasa
    ```

    If you want the backend server to run on a specific port, you can also add a `PORT` variable to your `.env` file, for example:

    ```
    PORT=5000
    ```

    If you leave out the `PORT` variable, the server will default to running on port 3000.

4.  **Set up Frontend environment variables:**

    In the `Frontend` directory, create a `.env` file and add the following variables.

    ```
    VITE_LISTING_API="http://localhost:3000/listing"
    VITE_CITY_API="http://localhost:3000/listingCard"
    VITE_MAPTILER_KEY=<YOUR_MAPTILER_API_KEY>
    ```

    - `VITE_LISTING_API`: This variable should point to the API endpoint for fetching individual listing data.
    - `VITE_CITY_API`: This variable should point to the API endpoint for fetching listings based on a city.
    - `VITE_MAPTILER_KEY`: This variable holds your API key from [MapTiler](https://www.maptiler.com/). It is required to display maps and use geocoding features in the application. You can get a free key from the MapTiler website.

    These variables are prefixed with `VITE_` to be exposed to the frontend client-side code, as is standard with Vite projects.

5.  **Start the Backend server:**

    From the `Backend` directory:

    ```sh
    node init.js # To seed the database with initial data
    node server.js
    ```

    The backend server should now be running on `http://localhost:3000`.

6.  **Start the Frontend development server:**

    From the `Frontend` directory:

    ```sh
    npm run dev
    ```

    The frontend development server will start, and you can view the application by navigating to the URL provided in the console (usually `http://localhost:5173`).

## Project Structure

The project is organized into two main directories:

*   `Frontend/`: Contains the React-based user interface.
*   `Backend/`: Contains the Express.js server and API logic.

```
Nivasa/
├── Backend/
│   ├── config/
│   ├── Models/
│   ├── SampleData/
│   ├── utils/
│   ├── init.js         # Database initialization
│   └── server.js       # Main backend server file
└── Frontend/
    ├── public/
    ├── src/
    │   ├── Components/
    │   ├── Context/
    │   ├── Layout/
    │   ├── Pages/
    │   ├── Services/
    │   └── App.jsx       # Main application component
    └── index.html
```

## License

This project is licensed under the ISC License - see the `LICENSE` file for details.

## Author

This project is created and maintained by **Pratyush Verma** ([cr4ck-j4ck](https://github.com/cr4ck-j4ck)).

- **GitHub:** [@cr4ck-j4ck](https://github.com/cr4ck-j4ck)
- **LinkedIn:** [Pratyush Verma](https://www.linkedin.com/in/cr4ck-j4ck/)
- **X:** [@cr4ck__j4ck](https://x.com/cr4ck__j4ck) 