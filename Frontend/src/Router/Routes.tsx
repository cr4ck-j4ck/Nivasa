import { Routes, Route } from "react-router-dom";
import Home from "@/Pages/mainListing";
import NotFound from "@/Pages/NotFound";
import ShowListing from "@/Pages/showListing";
import Dashboard from "@/Pages/ProfilePage";
import AuthForm from "@/Forms/User Forms/Login_Signup";
import PrivateRoutes from "@/Pages/PrivateRoutes";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route path="/listing/:id" element={<ListingDetail />} />
        <Route path="/search" element={<SearchResults />} /> */}
      <Route path="/room/:listingId" element={<ShowListing />} />
      <Route path="/login" element={<AuthForm />} />
      <Route path="*" element={<NotFound />} />
        <Route path="/dashboard" element={
          <PrivateRoutes>
            <Dashboard />
          </PrivateRoutes>
          } />
    </Routes>
  );
}
