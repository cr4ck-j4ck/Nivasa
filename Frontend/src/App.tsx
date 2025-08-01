import "./App.css";
import Nav from "./Layout/Nav";
import AppRoutes from "@/Router/Routes";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Footer from "./Layout/Footer";
import UserStore from "./Store/UserStore";
import { getUser } from "./Services/user.api";
import { useShallow } from "zustand/react/shallow";

const App: React.FC = () => {
  const location = useLocation();
  const isMainListing = location.pathname === "/";

  useEffect(() => {
    if (isMainListing) {
      document.body.style.paddingTop = "12rem";
    } else {
      document.body.style.paddingTop = "";
    }
  }, [isMainListing]);

  const { setUser, user, setIsGettingUser } = UserStore(
    useShallow((state) => ({
      user: state.user,
      setUser: state.setUser,
      setIsGettingUser: state.setIsGettingUser,
    }))
  );

  useEffect(() => {
    if (!user) {
      setIsGettingUser("pending");
      getUser()
        .then((res) => {
          if (res) {
            setUser(res);
          }
        }).catch(err => {
          console.log(err)
          setIsGettingUser("error")
        })
        .finally(() => {
          setIsGettingUser("fullfilled"); // Always stop loading even if user is null
        });
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center relative w-[100vw] h-[100vh]">
      <Nav position={isMainListing ? "fixed top-0" : ""}></Nav>
      <AppRoutes />
      <Footer />
    </div>
  );
};

export default App;
