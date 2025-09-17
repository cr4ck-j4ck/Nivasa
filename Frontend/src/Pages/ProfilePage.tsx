import { useState } from "react";
import TabButton from "@/Components/Dashboard/TabButton";
import OverviewTab from "@/Components/Dashboard/OverviewTab";
import ListingsTab from "@/Components/Dashboard/ListingTab";
import ReviewsTab from "@/Components/Dashboard/ReviewsTab";
import VerificationTab from "@/Components/Dashboard/VerificationTab";
import UserHeader from "@/Components/Dashboard/UserHeader";
import StatsGrid from "@/Components/Dashboard/StatsGrid";
import { useHostData } from "@/hooks/useHostData";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { error } = useHostData();

  if (error) {
    return (
      <>
        <title>Nivasa - Host Dashboard</title>
        <div className="w-full sm:max-w-[97vw] md:max-w-[90vw] lg:max-w-[75vw] 3xl:max-w-[80vw] mx-auto p-6 bg-white">
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-xl font-semibold mb-2">Unable to load dashboard</h2>
              <p className="text-gray-600">{error}</p>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <title>Nivasa - Host Dashboard</title>
      <div className="w-full sm:max-w-[97vw] md:max-w-[90vw] lg:max-w-[75vw] 3xl:max-w-[80vw] mx-auto p-6 bg-white">
        {/* Header, Stats, Bio */}
        <UserHeader />
        <StatsGrid />

        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            <TabButton
              id="overview"
              label="Overview"
              active={activeTab === "overview"}
              onClick={setActiveTab}
            />
            <TabButton
              id="listings"
              label="Listings"
              active={activeTab === "listings"}
              onClick={setActiveTab}
            />
            <TabButton
              id="reviews"
              label="Reviews"
              active={activeTab === "reviews"}
              onClick={setActiveTab}
            />
            <TabButton
              id="verification"
              label="Verification"
              active={activeTab === "verification"}
              onClick={setActiveTab}
            />
          </nav>
        </div>

        <div className="space-y-8">
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "listings" && <ListingsTab />}
          {activeTab === "reviews" && <ReviewsTab />}
          {activeTab === "verification" && <VerificationTab />}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
