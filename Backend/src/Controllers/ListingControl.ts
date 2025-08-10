import { Request, Response } from "express";
import ListingModel from "../Models/ListingModel";
import jwt from "jsonwebtoken";
import UserModel from "../Models/UsersModel";
import util from "util";
interface Idecoded {
  userId: string;
}

export async function viewListing(req: Request, res: Response) {
  const data = await ListingModel.findById(req.params.id).populate("host");
  res.json(data);
}

export async function viewListingViaCity(req: Request, res: Response) {
  const dataObjects = await ListingModel.find(
    { "location.city": req.params.city },
    { title: 1, price: 1, "gallery.Bedroom 1": 1, "location.city": 1 }
  )
    .limit(10)
    .lean();
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
  // setTimeout(() => {
  res.json(dataObjects);
  // }, 10000);
}
