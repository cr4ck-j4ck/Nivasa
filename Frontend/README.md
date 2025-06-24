# Project Nivasa Frontend

This directory contains the frontend application for Project Nivasa, built with React and Vite. It provides a dynamic and responsive user interface for users to browse, view, and interact with property listings.

For instructions on how to install the necessary dependencies and run the application, please refer to the main [README.md](../README.md) in the root directory.

## Core Features

-   **Interactive Listing Browsing:** Users can view property listings in a clean, card-based layout.
-   **Detailed Property View:** A dedicated page for each property, showcasing:
    -   An image gallery.
    -   Detailed descriptions and amenities.
    -   An interactive map showing the property's location.
    -   User reviews and ratings.
-   **Dynamic Search and Filtering:** Functionality to search for listings based on city.
-   **Responsive Design:** The UI is built to be responsive and work across various screen sizes.

## Tech Stack & Key Libraries

-   **Framework:** [React](https://reactjs.org/)
-   **Build Tool:** [Vite](https://vitejs.dev/)
-   **Routing:** [React Router](https://reactrouter.com/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components:** A mix of custom components, [Shadcn/ui](https://ui.shadcn.com/), and [Material-UI](https://mui.com/).
-   **Mapping:** [Leaflet](https://leafletjs.com/) with [MapTiler](https://www.maptiler.com/) for interactive maps.
-   **API Communication:** [Axios](https://axios-http.com/) for making HTTP requests to the backend.
-   **Date Management:** [date-fns](https://date-fns.org/) and [React Day Picker](https://react-day-picker.js.org/) for calendar functionalities.
-   **Icons:** [Lucide React](https://lucide.dev/guide/packages/lucide-react)

## Project Structure

The `src` directory is organized as follows to maintain a clean and scalable architecture:

```
src/
├── assets/           # Static assets like images, fonts, and icons
├── Components/       # Reusable UI components used across the application
│   ├── Listings/     # Components related to property listings (cards, rows, etc.)
│   └── ui/           # Generic UI elements from Shadcn/ui (Button, Calendar, etc.)
├── Context/          # React context for global state management
├── Layout/           # Major layout components like Navbar and Footer
├── lib/              # Utility functions (e.g., cn for merging class names)
├── Pages/            # Top-level page components for each route
├── Router/           # React Router configuration and route definitions
├── Services/         # API service functions for interacting with the backend
├── App.jsx           # Main application component with router setup
├── main.jsx          # The entry point of the React application
└── index.css         # Global styles and Tailwind CSS imports
```

## Available Scripts

In the `Frontend` directory, you can run the following scripts:

-   `npm run dev`: Starts the development server with Hot Module Replacement.
-   `npm run build`: Bundles the app for production.
-   `npm run lint`: Lints the code using ESLint.
-   `npm run preview`: Serves the production build locally to preview it.
