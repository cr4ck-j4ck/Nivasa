const fs = require('fs');
const connectDB = require("./config/db");
const ListingModel = require("./Models/ListingModel");
module.exports = async function importData() {

  try {
    console.log(connectDB);
    await connectDB();
    console.log('MongoDB connected.');

    const data = JSON.parse(fs.readFileSync('./SampleData/listingsData.json', 'utf8'));
    console.log(data);
    await ListingModel.deleteMany({});
    await ListingModel.insertMany(data);
  } catch (err) {
    console.error('Error:', err);
  }
}
