import ListingRow from "./ListingRow";

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

  for (let i = 0; i < 2; i++) {
    let randomNum = Math.ceil(Math.random() * (7 - i));
    arrOfRandomNum[i] = cities.splice(randomNum, 1)[0];
  }
  return (
    <div className="relative pt-10 pl-50">
      {arrOfRandomNum.map((el, i) => (
        <ListingRow city={el} key={i} />
      ))}
    </div>
  );
}
