import "./App.css";
import Nav from "./Layout/Nav";
import AppRoutes from "@/Router/Routes";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Footer from "./Layout/Footer";
import UserStore from "./Store/UserStore";
import { getUser } from "./Services/user.api";
import { useShallow } from "zustand/react/shallow";
import MobileBottomNavigation from "./Pages/MobileFooter";

const App: React.FC = () => {
  const location = useLocation();
  const [isFooter, setIsFooter] = useState(true);


  const { setUser, user, setIsGettingUser } = UserStore(
    useShallow((state) => ({
      user: state.user,
      setUser: state.setUser,
      setIsGettingUser: state.setIsGettingUser,
    }))
  );

  useEffect(() => {
    if (location.pathname === "/settings") {
      setIsFooter(false);
    } else {
      setIsFooter(true);
    }
    if (!user) {
      setIsGettingUser("pending");
      getUser()
        .then((res) => {
          if (res) {
            setUser(res);
          }
        })
        .catch((err) => {
          console.log(err)
          setIsGettingUser("error");
        })
        .finally(() => {
          setIsGettingUser("fullfilled"); // Always stop loading even if user is null
        });
    }
  }, []);
  return (
    <div className={`min-h-screen ${location.pathname === "/" ? "marginTopClass":"marginTopForMobile"} flex flex-col items-center relative w-[100vw] h-[100vh]`}>
      <Nav position={location.pathname === "/" ? "fixed top-0" : ""}></Nav>
      <AppRoutes />
      {isFooter && <Footer />}
    <MobileBottomNavigation/>
    </div>
  );
};

export default App;
