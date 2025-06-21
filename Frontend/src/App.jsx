import "./App.css";
import Nav from "./Layout/Nav";
import Footer from "./Layout/Footer";
import AppRoutes from "@/Router/Routes";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  const isMainListing = location.pathname === "/";
  if (isMainListing) {
    document.body.style.paddingTop = "12rem";
  }
  return (
    <div className="min-h-screen flex flex-col items-center">
      <Nav position={isMainListing ? "fixed top-0" : "relative"} />
      <AppRoutes />
      <Footer />
    </div>
  );
}

export default App;
