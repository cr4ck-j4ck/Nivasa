import UserStore from "@/Store/UserStore";
import { Navigate } from "react-router-dom";
import LoadingUser from "./UserLoading";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
interface IprivateProps {
  children: React.ReactNode;
}

const PrivateRoutes = ({ children }: IprivateProps): React.JSX.Element => {
  const user = UserStore((state) => state.user);
  const isGettingUser = UserStore((state) => state.isGettingUser);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = "/auth";

  useEffect(() => {
    if (isGettingUser === "fullfilled" && !user) {
      // User is not logged in, redirect to login with return URL
      const returnUrl = location.pathname + location.search;
      console.log("User not authenticated, redirecting to login");
      navigate(`${redirectTo}?redirect=${encodeURIComponent(returnUrl)}`);
    }
  }, [user, isGettingUser, navigate, redirectTo, location]);
  if (user) {
    return <div className="w-full mt-10 bg-gray-50 flex justify-center">{children}</div>;
  }

  if (isGettingUser === "error") {
    return <Navigate to="/auth" replace />; // Redirect if no user or error
  }
  
  return <LoadingUser />;
};

export default PrivateRoutes;
