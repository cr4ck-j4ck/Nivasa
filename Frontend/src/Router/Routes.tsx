import { Routes, Route } from "react-router-dom";
import Home from "@/Pages/mainListing";
import ShowListing from "@/Pages/showListing";
import ProfilePage from "@/Pages/ProfilePage";
import PrivateRoutes from "@/Pages/PrivateRoutes";
import ProfileDashboard from "@/Pages/HostDashboard";
import AdminDashboard from "@/Pages/AdminDashboard";
import AuthPage from "@/Pages/LoginSignup";
import UnderConstruction from "@/Pages/UnderConstruction";
import Wishlist from "@/Pages/Wishlist";
import HostingProcess from "@/Pages/Hosting Pages/HostingProcess";
import PlaceTypeSelector from "@/Pages/Hosting Pages/TypeOfPlace";
import  NivasaLoadingScreen  from "@/Components/Nivasa-Host-Loading";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/room/:listingId" element={<ShowListing />} />
      <Route path="/hostProfile" element={<PrivateRoutes><ProfilePage /></PrivateRoutes>} />
      <Route path="/dashboard"  element={<PrivateRoutes><ProfileDashboard/></PrivateRoutes>}/>
      <Route path="/admin/dashboard" element={<PrivateRoutes><AdminDashboard/></PrivateRoutes>}/>
      <Route path="/auth" element={<AuthPage/>}/>
      <Route path="/wishlist" element={<Wishlist/>}/>
      <Route path="/become-host" element={<PrivateRoutes><HostingProcess/></PrivateRoutes>}/>
      <Route path="/step" element={<PlaceTypeSelector/>}/>
      <Route path="/loading" element={<NivasaLoadingScreen/>}/>
      <Route path="*" element={<UnderConstruction/>}/>
    </Routes>
  );
}
