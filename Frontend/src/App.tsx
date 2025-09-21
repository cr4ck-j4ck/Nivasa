import "./App.css";
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
    if (location.pathname === "/become-host" || location.pathname === "/search") {
      setIsFooter(false);
    } else {
      setIsFooter(true);
    }
  }, [location.pathname]);

  useEffect(() => {
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
  }, [user, setUser, setIsGettingUser]);
  return (
    <div className={`min-h-screen ${location.pathname === "/" ? "marginTopClass":"marginTopForMobile"} flex flex-col items-center relative w-[100vw] h-fit`}>
      <AppRoutes />
      {isFooter && <Footer />}
    <MobileBottomNavigation/>
    </div>
  );
};

export default App;
