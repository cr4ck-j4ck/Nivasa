import { Routes, Route } from "react-router-dom";
import Home from "@/Pages/mainListing";
import NotFound from "@/Pages/NotFound";
import ShowRoom from "@/Pages/showListing"

export default function AppRoutes() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/listing/:id" element={<ListingDetail />} />
        <Route path="/search" element={<SearchResults />} /> */}
        <Route path="/room/:listingId" element={<ShowRoom/>}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
  );
}
