// ListingRowSection.tsx
import ListingRow from "./ListingRow";
import React, { useState, useEffect } from "react";
import { getCitiesWithListings, type CityWithListings } from "@/Services/listingService";

const ListingRowSection = React.memo(() => {
  const [citiesData, setCitiesData] = useState<CityWithListings[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCitiesWithListings = async () => {
      try {
        setIsLoading(true);
        const data = await getCitiesWithListings();
        setCitiesData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching cities with listings:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch listings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCitiesWithListings();
  }, []);

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading listings: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      {isLoading ? (
        // Show skeleton loading for 6 rows
        Array.from({ length: 6 }).map((_, i) => (
          <ListingRow key={i} cityData={null} isLoading={true} />
        ))
      ) : (
        citiesData.map((cityData, i) => (
          <ListingRow key={`${cityData.city}-${i}`} cityData={cityData} isLoading={false} />
        ))
      )}
    </>
  );
});

export default ListingRowSection;
