import fs from "fs";
import path from "path";
import { connectDB } from "./config/db";
import ListingModel from "./Models/ListingModel";
import UserModel from "./Models/UsersModel";

interface IListing {
  host: string;
  title: string;
  description: string;
  location: {
    city: string;
    country: string;
    latitute: number;
    longitude: number;
  };
  price: number;
  roomType: string;
  amenities: string[];
  availabiltiy: {
    startDate: string;
    endDate: string;
  };
  capacity: {
    guests: number;
    bedrooms: number;
    beds: number;
  };
  gallery : Record<string,string[]>;
  createdAt:string
}

require("dotenv").config();

async function initData() {
  try {
    await connectDB();
    console.log("MongoDB connected.");
    const data1 = JSON.parse(
      fs.readFileSync(path.join(__dirname, "..", "SampleData", "userData.json"), "utf8")
    );
    await UserModel.deleteMany({});
    const insertedData = await UserModel.insertMany(data1);

    const data2 = JSON.parse(
      fs.readFileSync(path.join(__dirname, "..", "SampleData", "listingsData.json"), "utf8")
    );
    const changedData2 = data2.map((element:IListing) => {
      const randomHost =
        insertedData[Math.floor(Math.random() * insertedData.length)]._id;
      return { ...element, host: randomHost };
    });
    await ListingModel.deleteMany({});
    await ListingModel.insertMany(changedData2);
  } catch (err) {
    console.error("Error:", err);
  }
}
initData();
