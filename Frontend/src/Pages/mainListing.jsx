import ListingRow from "../Components/Listings/ListingRow";

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
    let randomNum = Math.ceil(Math.random() * (7 - i));
    arrOfRandomNum[i] = cities.splice(randomNum, 1)[0];
  }
  return (
    <div className="relative pt-10 w-full md:max-w-[95vw] lg:max-w-[87vw] 3xl:max-w-[90vw] mx-auto" >
      {arrOfRandomNum.map((el, i) => (
        <ListingRow city={el} key={i} />
      ))}
    </div>
  );
}
