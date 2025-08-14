import { Routes, Route } from "react-router-dom";
import Home from "@/Pages/mainListing";
import ShowListing from "@/Pages/showListing";
import ProfilePage from "@/Pages/ProfilePage";
import PrivateRoutes from "@/Pages/PrivateRoutes";
import LoadingUser from "@/Pages/UserLoading";
import ProfileDashboard from "@/Pages/HostDashboard";
import AuthPage from "@/Pages/LoginSignup";
import UnderConstruction from "@/Pages/UnderConstruction";
import Wishlist from "@/Pages/Wishlist";
import HostingProcess from "@/Pages/HostingProcess";
import PlaceTypeSelector from "@/Pages/TypeOfPlace";
import LocationPickerMap from "@/Components/HostingProcess/LocationPicker";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/room/:listingId" element={<ShowListing />} />
      <Route path="/hostProfile" element={<PrivateRoutes><ProfilePage /></PrivateRoutes>} />
      <Route path="/dashboard"  element={<PrivateRoutes><ProfileDashboard/></PrivateRoutes>}/>
      <Route path="/loading" element={<LoadingUser/>}/>
      <Route path="/auth" element={<AuthPage/>}/>
      <Route path="/wishlist" element={<Wishlist/>}/>
      <Route path="/become-host" element={<HostingProcess/>}/>
      <Route path="/step" element={<PlaceTypeSelector/>}/>
      <Route path="/locationPicker" element={<LocationPickerMap/>}/>
      <Route path="*" element={<UnderConstruction/>}/>
    </Routes>
  );
}
