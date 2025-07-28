import { Routes, Route } from "react-router-dom";
import Home from "@/Pages/mainListing";
import NotFound from "@/Pages/NotFound";
import ShowListing from "@/Pages/showListing";
import Dashboard from "@/Pages/ProfilePage";
import AuthForm from "@/Forms/User Forms/Login_Signup";
import PrivateRoutes from "@/Pages/PrivateRoutes";
import LoadingUser from "@/Pages/UserLoading";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/room/:listingId" element={<ShowListing />} />
      <Route path="/login" element={<AuthForm />} />
      <Route path="*" element={<NotFound />} />
        <Route path="/dashboard" element={
          <PrivateRoutes>
            <Dashboard />
          </PrivateRoutes>
          } />
      <Route path="/loading" element={<LoadingUser/>}/>
    </Routes>
  );
}
