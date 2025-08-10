// ListingRowSection.tsx
import ListingRow from "./ListingRow";
import React from "react";
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

const getRandomCities = (): string[] => {
  const tempCities = [...cities];
  const selectedCities: string[] = [];
  for (let i = 0; i < 2; i++) {
    const randomNum = Math.floor(Math.random() * (tempCities.length - i));
    selectedCities[i] = tempCities.splice(randomNum, 1)[0];
  }
  return selectedCities;
};

const ListingRowSection = React.memo(() => {
  const randomCities = React.useMemo(() => getRandomCities(), []);
  return (
    <>
      {randomCities.map((city, i) => (
        <ListingRow city={city} key={i} />
      ))}
    </>
  );
});

export default ListingRowSection;
