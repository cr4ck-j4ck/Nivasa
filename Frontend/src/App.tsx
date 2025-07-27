import "./App.css";
import Nav from "./Layout/Nav";
import AppRoutes from "@/Router/Routes";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Footer from "./Layout/Footer";
import Login from "./Forms/Booking Forms/Login_Signup";
import { useGlobalStore } from "./Store/Global";
const App: React.FC = () => {
  const location = useLocation();
  const isMainListing = location.pathname === "/";
  const showLogin = useGlobalStore(state => state.showLogin)
  useEffect(() => {
    if (isMainListing) {
      document.body.style.paddingTop = "12rem";
    } else {
      document.body.style.paddingTop = "";
    }
  }, [isMainListing]);
  return (
    <div className="min-h-screen flex flex-col items-center relative w-[100vw] h-[100vh]">
      <Nav position={isMainListing ? "fixed top-0" : ""}></Nav>
      <AppRoutes />
      <Footer />
      {showLogin ? <Login/> : ""}
    </div>
  );
};

export default App;
