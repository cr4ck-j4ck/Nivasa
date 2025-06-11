import "./App.css";
import Nav from "./Layout/nav";
import MainListing from "./Components/Listings/mainListing";
function App() {
  return (
    <>
      <Nav />
      <MainListing number={8}/>
    </>
  );
}

export default App;
