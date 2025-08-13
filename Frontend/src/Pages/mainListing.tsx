import CustomAlert from "@/Components/CustomAlert";
import globalStore from "@/Store/Global";
import ListingRowSection from "@/Components/Listings/IndexPage/ListingRows"; // Adjust the path accordingly
import Nav from "@/Layout/Nav";
const MainListing = (): React.JSX.Element => {
  const mainPageMsg = globalStore((state) => state.mainPageMsg);
  const setMainPageMsg = globalStore((state) => state.setMainPageMsg);

  return (
    <>
    <Nav position="fixed top-0"></Nav>
      <div className="relative pt-10 max-w-[95vw] md:max-w-[92vw] lg:max-w-[95vw] 3xl:max-w-[90vw] mx-auto w-full">
        {mainPageMsg && (
          <CustomAlert
            title="Wishlist"
            message={mainPageMsg}
            variant="success"
            setFunc={() => setMainPageMsg(null)}
          />
        )}

        <ListingRowSection />
      </div>
    </>
  );
};

export default MainListing;
