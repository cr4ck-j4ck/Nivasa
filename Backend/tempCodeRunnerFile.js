const fs = require("fs");

// Random host IDs array
const hostIds = [
  "6856d1bd430e093b8df68f42",
  "6856d1bd430e093b8df68f43",
  "6856d1bd430e093b8df68f44",
  "6856d1bd430e093b8df68f45",
  "6856d1bd430e093b8df68f46",
  "6856d1bd430e093b8df68f48",
  "6856d1bd430e093b8df68f49"
];

// JSON listings read karo
const listings = JSON.parse(fs.readFileSync("./SampleData/listingsData.json", "utf-8"));

// Random ID assign karo har listing ke host field mein
const updatedListings = listings.map(listing => ({
  ...listing,
  host: hostIds[Math.floor(Math.random() * hostIds.length)]
}));

// Write back to new file
fs.writeFileSync("listings-randomized.json", JSON.stringify(updatedListings, null, 2));

console.log("✅ Random host IDs successfully assigned!");
