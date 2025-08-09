import ListingRow from "../Components/Listings/IndexPage/ListingRow";
const MainListing = (): React.JSX.Element => {
  const cities = [
    "Mumbai",
    "Delhi",
    "Pune",
    "Gurugram",
    "Paris",
    "Indore",
    "Bengaluru",
    "Bhopal",
  ];
  const arrOfRandomNum :string[] = [];

  for (let i = 0; i < 4; i++) {
    const randomNum = Math.floor(Math.random() * (8 - i));
    arrOfRandomNum[i] = cities.splice(randomNum, 1)[0];
  }
  return (
    <div className="relative pt-10 max-w-[95vw] md:max-w-[92vw] lg:max-w-[95vw] 3xl:max-w-[90vw] mx-auto" >
      {arrOfRandomNum.map((el, i) => (
        <ListingRow city={el} key={i} />
      ))}
    </div>
  );
}

export default MainListing;