const fs = require('fs');
const connectDB = require("./config/db");
const listingModel = require("./Models/ListingModel");
const usersModel = require("./Models/UsersModel");

async function initData() {

  try {
    console.log(connectDB);
    await connectDB();
    console.log('MongoDB connected.');

    const data1 = JSON.parse(fs.readFileSync('./SampleData/userData.json', 'utf8'));
    const data2 = JSON.parse(fs.readFileSync('./SampleData/listingsData.json', 'utf8'));
    await usersModel.deleteMany({});
    await usersModel.insertMany(data1);
    await listingModel.deleteMany({});
    await listingModel.insertMany(data2);
  } catch (err) {
    console.error('Error:', err);
  }
}initData()