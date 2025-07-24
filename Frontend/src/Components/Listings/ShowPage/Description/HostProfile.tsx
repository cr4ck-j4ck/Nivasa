import type { IfullListing } from "@/@Types/interfaces";
import { useListingStore } from "@/Store/ListingStore";

const HostProfile = () => {
  const listingObj = useListingStore(state => state.listingObj) as IfullListing;
  return (
    <div className="max-w-5xl mx-auto p-6 font-sans flex justify-center">
      {/* Host Info */}
      <div className="bg-white rounded-xl hostCard p-6 flex flex-col items-center text-center w-[40rem]">
        <img
          className="w-24 h-24 rounded-full border-4 border-white shadow-2xl object-cover"
          src={listingObj.host.avatar} // Replace with actual host image URL
          alt="Host"
        />
        <h2 className="text-xl font-semibold mt-4">{listingObj.host.fullName}</h2>
        <p className="text-gray-500 text-sm mt-1">Host</p>
        <div className="flex items-center justify-center space-x-2 mt-2">
          <span className="text-sm text-gray-600">3 Reviews</span>
          <span className="text-yellow-500 font-bold">★ 5.0</span>
        </div>

        <div className="mt-4 text-sm text-gray-700">
          <p>💡 Fun fact: I am a ceramic artist</p>
          <p>📍 Lives in Delhi, India</p>
        </div>

        <p className="mt-10 text-gray-700 text-lg hostDesc font-bold">
          Welcome to my thoughtfully curated space, a heartfelt extension of who I am. I'm a designer by
          profession, a ceramic potter by passion, and a host by heart. This home isn't just a stay—it's an experience of slow, intentional living...
        </p>
      </div>
 
    </div>
  );
};

export default HostProfile;
