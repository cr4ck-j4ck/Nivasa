import UserStore from "@/Store/UserStore";
import { Navigate } from "react-router-dom";
import LoadingUser from "./UserLoading";
interface IprivateProps {
  children: React.ReactNode;
}

const PrivateRoutes = ({ children }: IprivateProps): React.JSX.Element => {
  const user = UserStore((state) => state.user);
  const isGettingUser = UserStore((state) => state.isGettingUser);
  if (user) {
    return <div className="w-full mt-10 bg-gray-50 flex justify-center">{children}</div>;
  }

  if (isGettingUser === "error") {
    return <Navigate to="/login" replace />; // Redirect if no user or error
  }

  return <LoadingUser />;
};

export default PrivateRoutes;
