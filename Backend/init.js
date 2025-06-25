const fs = require('fs');
const connectDB = require("./config/db");
const listingModel = require("./Models/ListingModel");
const usersModel = require("./Models/UsersModel");
require("dotenv").config();

async function initData() {

  try {
    console.log(connectDB);
    await connectDB();
    console.log('MongoDB connected.');

    const data1 = JSON.parse(fs.readFileSync('./SampleData/userData.json', 'utf8'));
    await usersModel.deleteMany({});
    const insertedData = await usersModel.insertMany(data1);
    
    
    const data2 = JSON.parse(fs.readFileSync('./SampleData/listingsData.json', 'utf8'));
    const changedData2 = data2.map(element => {
      const randomHost = insertedData[Math.floor(Math.random() * insertedData.length)]._id;
      return { ...element, host: randomHost };
    });
    await listingModel.deleteMany({});
    await listingModel.insertMany(changedData2);
  } catch (err) {
    console.error('Error:', err);
  }
}initData()