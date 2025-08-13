import { Request, Response } from "express";
import ListingModel from "../Models/ListingModel";
import jwt from "jsonwebtoken";
import UserModel from "../Models/UsersModel";
import { Types } from "mongoose";

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
        if (existingUser?.wishlist?.includes(data?._id as Types.ObjectId)) {
          res.json({ ...data, isLiked: true });
          return;
        }
      }
    } catch (err) {
      res.json(data);
      return;
    }
    res.json(data);
  }else{
    res.status(400).send("Ha bhai ma chuda")
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
    }
  } catch {
    res.json(dataObjects);
  }
  // setTimeout(() => {
  // }, 10000);
}
