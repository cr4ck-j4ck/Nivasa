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
          _id: "$location.address.city",
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
          { "location.address.city": cityInfo.city },
          { 
            title: 1, 
            price: 1,
            gallery: 1,
            "location.address.city": 1,
            "location.address.state": 1,
            "location.address.country": 1,
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
    } catch {
      console.log("Auth error in getRandomCitiesWithListings");
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

    // Create new listing with pending status
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
      status: "pending", // Set status to pending for approval
    });

    const savedListing = await newListing.save();

    res.status(201).json({
      success: true,
      message: "Listing submitted successfully! It's now under review and will be approved within 24-48 hours.",
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

// Get host's listings filtered by status
export async function getHostListings(req: Request, res: Response) {
  try {
    if (!req.cookies.token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET!) as Idecoded;
    const userId = decoded.userId;

    const { status } = req.query;
    const filter: any = { host: userId };
    
    // Add status filter if provided
    if (status && ['pending', 'approved', 'rejected', 'draft'].includes(status as string)) {
      filter.status = status;
    }

    const listings = await ListingModel.find(filter)
      .select('title description propertyType typeOfPlace status createdAt updatedAt gallery pricing location.address.city rejectionReason')
      .sort({ updatedAt: -1 })
      .lean();

    res.json({
      success: true,
      listings,
      count: listings.length
    });

  } catch (error) {
    console.error("Error fetching host listings:", error);
    res.status(500).json({ 
      error: "Failed to fetch listings",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

// Get host dashboard stats
export async function getHostStats(req: Request, res: Response) {
  try {
    if (!req.cookies.token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET!) as Idecoded;
    const userId = decoded.userId;

    const stats = await ListingModel.aggregate([
      { $match: { host: new Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const statsObj = {
      pending: 0,
      approved: 0,
      rejected: 0,
      draft: 0,
      total: 0
    };

    stats.forEach(stat => {
      statsObj[stat._id as keyof typeof statsObj] = stat.count;
      statsObj.total += stat.count;
    });

    res.json({
      success: true,
      stats: statsObj
    });

  } catch (error) {
    console.error("Error fetching host stats:", error);
    res.status(500).json({ 
      error: "Failed to fetch stats",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

// Enhanced search functionality with city and date filtering
export async function searchListings(req: Request, res: Response) {
  try {
    const { city, checkIn, checkOut, guests, page = 1, limit = 20 } = req.query;

    // Build the base query - only show approved listings
    const query: any = { status: "approved" };

    // City filter (case-insensitive)
    if (city && typeof city === 'string') {
      query["location.address.city"] = { $regex: new RegExp(city, 'i') };
    }

    // Guest capacity filter
    if (guests && !isNaN(Number(guests))) {
      query["capacity.guests"] = { $gte: Number(guests) };
    }

    // Date availability filter
    if (checkIn || checkOut) {
      const availabilityQuery: any = {};
      
      if (checkIn) {
        const checkInDate = new Date(checkIn as string);
        if (!isNaN(checkInDate.getTime())) {
          availabilityQuery["availability.startDate"] = { $lte: checkInDate };
        }
      }
      
      if (checkOut) {
        const checkOutDate = new Date(checkOut as string);
        if (!isNaN(checkOutDate.getTime())) {
          availabilityQuery["availability.endDate"] = { $gte: checkOutDate };
        }
      }
      
      // Merge availability query with main query
      Object.assign(query, availabilityQuery);
    }

    // Pagination
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit))); // Max 50 results per page
    const skip = (pageNum - 1) * limitNum;

    // Execute search with pagination
    const [listings, totalCount] = await Promise.all([
      ListingModel.find(query)
        .populate("host", "firstName lastName avatar superhost")
        .select("title description location pricing roomType amenities capacity gallery images createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      ListingModel.countDocuments(query)
    ]);

    // Handle user wishlist if authenticated
    let listingsWithLikes = listings;
    try {
      if (req.cookies.token) {
        const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET!) as Idecoded;
        const user = await UserModel.findById(decoded.userId).select("wishlist");
        const wishlistIds = user?.wishlist?.map((id) => id.toString()) || [];

        listingsWithLikes = listings.map(listing => ({
          ...listing,
          isLiked: wishlistIds.includes(listing._id.toString())
        }));
      }
    } catch (error) {
      console.log("Auth error in searchListings:", error);
      // Continue without wishlist data
    }

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    res.json({
      success: true,
      listings: listingsWithLikes,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit: limitNum
      },
      searchParams: {
        city: city || null,
        checkIn: checkIn || null,
        checkOut: checkOut || null,
        guests: guests || null
      }
    });

  } catch (error) {
    console.error("Error in searchListings:", error);
    res.status(500).json({ 
      error: "Failed to search listings",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

// Admin: Get all pending listings for approval
export async function getPendingListings(req: Request, res: Response) {
  try {
    if (!req.cookies.token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET!) as Idecoded;
    const user = await UserModel.findById(decoded.userId);
    // Check if user is admin (you can implement role-based check here)
    if (!user || user.role !== "admin") { // Simple admin check - replace with proper role system
      return res.status(403).json({ error: "Admin access required" });
    }

    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const pendingListings = await ListingModel.find({ status: 'pending' })
      .populate('host', 'firstName lastName email')
      .select('title description propertyType typeOfPlace createdAt gallery location.address host')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const totalCount = await ListingModel.countDocuments({ status: 'pending' });

    res.json({
      success: true,
      listings: pendingListings,
      totalCount,
      currentPage: Number(page),
      totalPages: Math.ceil(totalCount / Number(limit))
    });

  } catch (error) {
    console.error("Error fetching pending listings:", error);
    res.status(500).json({ 
      error: "Failed to fetch pending listings",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

// Admin: Approve or reject a listing
export async function updateListingStatus(req: Request, res: Response) {
  try {
    if (!req.cookies.token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET!) as Idecoded;
    const user = await UserModel.findById(decoded.userId);
    
    // Check if user is admin
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { listingId } = req.params;
    const { status, rejectionReason } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: "Invalid status. Must be 'approved' or 'rejected'" });
    }

    if (status === 'rejected' && !rejectionReason) {
      return res.status(400).json({ error: "Rejection reason is required when rejecting a listing" });
    }

    const updateData: any = { status };
    if (status === 'rejected' && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const listing = await ListingModel.findByIdAndUpdate(
      listingId,
      updateData,
      { new: true }
    ).populate('host', 'firstName lastName email');

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    res.json({
      success: true,
      message: `Listing ${status} successfully`,
      listing
    });

    // TODO: Here you could add email notification to the host about approval/rejection
    // Example: await sendNotificationEmail(listing.host.email, status, rejectionReason);

  } catch (error) {
    console.error("Error updating listing status:", error);
    res.status(500).json({ 
      error: "Failed to update listing status",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
