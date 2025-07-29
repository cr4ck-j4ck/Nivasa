import { Routes, Route } from "react-router-dom";
import Home from "@/Pages/mainListing";
import NotFound from "@/Pages/NotFound";
import ShowListing from "@/Pages/showListing";
import ProfilePage from "@/Pages/ProfilePage";
import AuthForm from "@/Forms/User Forms/Login_Signup";
import PrivateRoutes from "@/Pages/PrivateRoutes";
import LoadingUser from "@/Pages/UserLoading";
import ProfileDashboard from "@/Pages/Dashboard";
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/room/:listingId" element={<ShowListing />} />
      <Route path="/login" element={<AuthForm />} />
      <Route path="*" element={<NotFound />} />
        <Route path="/profile" element={
          <PrivateRoutes>
            <ProfilePage />
          </PrivateRoutes>
          } />
      <Route path="/dashboard"  element={<PrivateRoutes><ProfileDashboard/></PrivateRoutes>}/>
      <Route path="/loading" element={<LoadingUser/>}/>
    </Routes>
  );
}
