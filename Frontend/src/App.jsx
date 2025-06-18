import "./App.css";
import Nav from "./Layout/nav";
import Footer from "./Layout/footer";
import AppRoutes from "@/Router/Routes";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  const isMainListing = location.pathname === "/";
  if (isMainListing) {
    document.body.style.paddingTop = "12rem";
  }
  return (
    <>
      <Nav position={isMainListing ? "fixed top-0" : "relative"} />
      <AppRoutes></AppRoutes>
      <Footer></Footer>
    </>
  );
}

export default App;
