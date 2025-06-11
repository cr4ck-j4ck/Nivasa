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

  for (let i = 0; i < 4; i++) {
    let randomNum = Math.ceil(Math.random() * 7 - i);
    arrOfRandomNum[i] = cities.splice(randomNum, 1)[0];
  }
  console.log(arrOfRandomNum);
  return (
    <div>
      {arrOfRandomNum.map((el, i) => (
        <ListingRow city={el} key={i} />
      ))}
    </div>
  );
}
