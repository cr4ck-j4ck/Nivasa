import { useState } from "react";
import TabButton from "@/Components/Dashboard/TabButton";
import OverviewTab from "@/Components/Dashboard/OverviewTab";
import ListingsTab from "@/Components/Dashboard/ListingTab";
import ReviewsTab from "@/Components/Dashboard/ReviewsTab";
import VerificationTab from "@/Components/Dashboard/VerificationTab";
import UserHeader from "@/Components/Dashboard/UserHeader";
import StatsGrid from "@/Components/Dashboard/StatsGrid";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <>
    <title>Nivasa - Host Dashboard</title>
    <div className="w-full sm:max-w-[97vw] md:max-w-[90vw] lg:max-w-[75vw] 3xl:max-w-[80vw] mx-auto p-6 bg-white">
      {/* Header, Stats, Bio */}
      <UserHeader></UserHeader>
      <StatsGrid />
      {/* Include UserHeader, StatsGrid, BioInfo here */}

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
