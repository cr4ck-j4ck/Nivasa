import "./App.css";
import Nav from "./Layout/nav";
import MainListing from "./Pages/mainListing";
import Footer from "./Layout/footer";
import AppRoutes from "@/Router/Routes"; 

function App() {
  
  return (
    <>
      <Nav />
      <AppRoutes></AppRoutes>
      <Footer></Footer>
    </>
  );
}

export default App;
