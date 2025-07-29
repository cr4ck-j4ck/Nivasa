import { Routes, Route } from "react-router-dom";
import Home from "@/Pages/mainListing";
import NotFound from "@/Pages/NotFound";
import ShowListing from "@/Pages/showListing";
import ProfilePage from "@/Pages/ProfilePage";
import PrivateRoutes from "@/Pages/PrivateRoutes";
import LoadingUser from "@/Pages/UserLoading";
import ProfileDashboard from "@/Pages/Dashboard";
import AuthPage from "@/Pages/LoginSignup";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/room/:listingId" element={<ShowListing />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/profile" element={<PrivateRoutes><ProfilePage /></PrivateRoutes>} />
      <Route path="/dashboard"  element={<PrivateRoutes><ProfileDashboard/></PrivateRoutes>}/>
      <Route path="/loading" element={<LoadingUser/>}/>
      <Route path="/auth" element={<AuthPage/>}/>
    </Routes>
  );
}
