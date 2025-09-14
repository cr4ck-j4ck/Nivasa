import { Request, Response } from "express";
import ListingModel from "../Models/ListingModel";
import jwt from "jsonwebtoken";
import UserModel from "../Models/UsersModel";
import { Types } from "mongoose";
import { uploadBase64Image } from "../config/cloudinary";

interface Idecoded {
  userId: string;
}

export async function viewListing(req: Request, res: Response) {
  const data = await ListingModel.findById(req.params.id)
    .populate("host")
    .lean();
  if (data) {
    try {
      if (req.cookies.token) {
        const decoded = jwt.verify(
          req.cookies.token,
          process.env.JWT_SECRET!
        ) as Idecoded;
        const existingUser = await UserModel.findById(decoded.userId);
        if (
          data?._id &&
          existingUser?.wishlist?.includes(data._id as Types.ObjectId)
        ) {
          res.json({ ...data, isLiked: true });
          return;
        } else {
          res.json(data);
          return;
        }
      }else{
      res.json(data);
      return;
    }
    } catch (err) {
      res.json(data);
      return;
    }
    res.json(data);
  } else {
    res.status(400).send("Ha bhai ma chuda");
  }
}

export async function viewListingViaCity(req: Request, res: Response) {
  const dataObjects = await ListingModel.find(
    { "location.city": req.params.city },
    { title: 1, price: 1, "gallery.Bedroom 1": 1, "location.city": 1 }
  )
    .limit(10)
    .lean();
  try {
    if (req.cookies.token) {
      const decoded = jwt.verify(
        req.cookies.token,
        process.env.JWT_SECRET!
      ) as Idecoded;
      const user = await UserModel.findById(decoded.userId).select("wishlist");
      const wishlistIds = user?.wishlist?.map((id) => id.toString());
      if (wishlistIds) {
        const responseWithLikes = dataObjects.map((listing) => ({
          ...listing,
          isLiked: wishlistIds.includes(listing._id.toString()),
        }));
        res.send(responseWithLikes);
        return;
      }
    }else{
      res.json(dataObjects);
    }
  } catch {
    res.json(dataObjects);
  }
  // setTimeout(() => {
  // }, 10000);
}

export async function getRandomCitiesWithListings(req: Request, res: Response) {
  try {
    // Get all unique cities that have listings
    const citiesWithListings = await ListingModel.aggregate([
      {
        $group: {
          _id: "$location.city",
          count: { $sum: 1 }
        }
      },
      {
        $match: {
          _id: { $ne: null },
          count: { $gte: 1 }
        }
      },
      {
        $project: {
          city: "$_id",
          count: 1,
          _id: 0
        }
      }
    ]);

    // If we have fewer than 6 cities with listings, add some default cities
    const defaultCities = ["Mumbai", "Delhi", "Pune", "Gurugram", "Paris", "Indore", "Bengaluru", "Bhopal"];
    const existingCityNames = citiesWithListings.map(item => item.city);
    // This is not the right way because what if hosts from a city deleted there listings and now that city has 0 listings
    // But for now this will do
    const additionalCities = defaultCities
      .filter(city => !existingCityNames.includes(city))
      .slice(0, Math.max(0, 6 - citiesWithListings.length))
      .map(city => ({ city, count: 0 }));

    const allCities = [...citiesWithListings, ...additionalCities];

    // Randomly select 6 cities
    const shuffled = allCities.sort(() => 0.5 - Math.random());
    const selectedCities = shuffled.slice(0, 6);

    // Get listings for each selected city
    const citiesWithListingsData = await Promise.all(
      selectedCities.map(async (cityInfo) => {
        const listings = await ListingModel.find(
          { "location.city": cityInfo.city },
          { 
            title: 1, 
            price: 1,
            gallery: 1,
            "location.city": 1,
            "location.state": 1,
            "location.country": 1,
            createdAt: 1
          }
        )
        .limit(10)
        .sort({ createdAt: -1 })
        .lean();

        return {
          city: cityInfo.city,
          listings: listings,
          totalCount: cityInfo.count
        };
      })
    );
    // Handle user wishlist if authenticated
    try {
      if (req.cookies.token) {
        const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET!) as Idecoded;
        const user = await UserModel.findById(decoded.userId).select("wishlist");
        const wishlistIds = user?.wishlist?.map((id) => id.toString()) || [];

        const responseWithLikes = citiesWithListingsData.map(cityData => ({
          ...cityData,
          listings: cityData.listings.map(listing => ({
            ...listing,
            isLiked: wishlistIds.includes(listing._id.toString())
          }))
        }));
        return res.json(responseWithLikes);
      }
    } catch (error) {
      console.log("Auth error in getRandomCitiesWithListings:", error);
    }
    res.json(citiesWithListingsData);
  } catch (error) {
    console.error("Error in getRandomCitiesWithListings:", error);
    res.status(500).json({ error: "Failed to fetch cities with listings" });
  }
}

export async function createListing(req: Request, res: Response) {
  try {
    // Verify JWT token
    if (!req.cookies.token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET!) as Idecoded;
    const userId = decoded.userId;

    // Validate user exists
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const {
      title,
      description,
      propertyType,
      typeOfPlace,
      highlight,
      address,
      coordinates,
      capacity,
      amenities,
      pricing,
      images // Array of base64 image strings
    } = req.body;
    // Validate required fields
    if (!title || !description || !propertyType || !typeOfPlace || !address || !coordinates || !capacity || !amenities || !pricing || !images) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate images array
    if (!Array.isArray(images) || images.length < 5) {
      return res.status(400).json({ error: "At least 5 images are required" });
    }

    // Upload images to Cloudinary
    const uploadPromises = images.map((base64Image: string) => 
      uploadBase64Image(base64Image, 'nivasa-listings')
    );

    const uploadedImageUrls = await Promise.all(uploadPromises);

    // Map typeOfPlace to roomType for backward compatibility
    let roomType: "Entire home/apt" | "Private room" | "Shared room" | "Entire studio";
    switch (typeOfPlace) {
      case "entire-place":
        roomType = "Entire home/apt";
        break;
      case "private-room":
        roomType = "Private room";
        break;
      case "shared-room":
        roomType = "Shared room";
        break;
      case "studio":
        roomType = "Entire studio";
        break;
      default:
        roomType = "Private room";
    }

    // Create new listing
    const newListing = new ListingModel({
      host: userId,
      title,
      description,
      propertyType,
      typeOfPlace,
      highlight: highlight || [],
      location: {
        address: {
          flatHouse: address.flatHouse,
          streetAddress: address.streetAddress,
          landmark: address.landmark,
          district: address.district,
          city: address.city,
          state: address.state,
          postalCode: address.postalCode,
          country: address.country || "India",
        },
        coordinates: {
          latitude: coordinates.lat,
          longitude: coordinates.lng,
        },
      },
      pricing: {
        weekdayPrice: pricing.weekdayPrice,
        weekendPrice: pricing.weekendPrice,
      },
      roomType,
      amenities,
      capacity: {
        guests: capacity.guests,
        bedrooms: capacity.bedrooms,
        beds: capacity.beds,
        bathrooms: capacity.bathrooms,
      },
      images: uploadedImageUrls,
      availability: {
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      },
      gallery: new Map([
        ["Bedroom 1", uploadedImageUrls.slice(0, Math.min(3, uploadedImageUrls.length))],
        ["Living Room", uploadedImageUrls.slice(3, Math.min(6, uploadedImageUrls.length))],
        ["Kitchen", uploadedImageUrls.slice(6, Math.min(9, uploadedImageUrls.length))],
      ]),
    });

    const savedListing = await newListing.save();

    res.status(201).json({
      success: true,
      message: "Listing created successfully",
      listing: savedListing,
    });

  } catch (error) {
    console.error("Error creating listing:", error);
    res.status(500).json({ 
      error: "Failed to create listing",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
