import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/Pages/mainListing";
// import ListingDetail from "@/pages/ListingDetail";
// import SearchResults from "@/pages/SearchResults";
import NotFound from "@/pages/NotFound";

export default function AppRoutes() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/listing/:id" element={<ListingDetail />} /> */}
        {/* <Route path="/search" element={<SearchResults />} /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
  );
}
