import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{
      minHeight: "70vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      color: "#555"
    }}>
      <h1 style={{ fontSize: "4rem", marginBottom: "1rem" }}>404</h1>
      <h2 style={{ marginBottom: "1rem" }}>Page Not Found</h2>
      <p style={{ marginBottom: "2rem" }}>
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        to="/"
        replace
        style={{
          padding: "0.5rem 1.5rem",
          background: "#007bff",
          color: "#fff",
          borderRadius: "4px",
          textDecoration: "none"
        }}
      >
        Go Home
      </Link>
    </div>
  );
}