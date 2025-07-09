import "./App.css";
import Nav from "./Layout/Nav";
import Footer from "./Layout/Footer";
import AppRoutes from "@/Router/Routes";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const App:React.FC = () => {
  const location = useLocation();
  const isMainListing = location.pathname === "/";
  useEffect(() => {
    if (isMainListing) {
      document.body.style.paddingTop = "12rem";
    } else {
      document.body.style.paddingTop = "";
    }
  }, [isMainListing]);
  return (
    <div className="min-h-screen flex flex-col items-center">
      <Nav position={isMainListing ? "fixed top-0" : ""} >
      </Nav>
      <AppRoutes />
      <Footer />
    </div>
  );
}

export default App;
