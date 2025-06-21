import ListingRow from "../Components/Listings/indexPage_Components/ListingRow";

export default function () {
  let cities = [
    "Mumbai",
    "Delhi",
    "Pune",
    "Gurugram",
    "Paris",
    "Indore",
    "Bengaluru",
    "Bhopal",
  ];
  let arrOfRandomNum = [];

  for (let i = 0; i < 4; i++) {
    let randomNum = Math.floor(Math.random() * (8 - i));
    arrOfRandomNum[i] = cities.splice(randomNum, 1)[0];
  }
  return (
    <div className="relative pt-10 w-full sm:max-w-[85vw] md:max-w-[92vw] lg:max-w-[95vw] 3xl:max-w-[90vw] mx-auto " >
      {arrOfRandomNum.map((el, i) => (
        <ListingRow city={el} key={i} />
      ))}
    </div>
  );
}
