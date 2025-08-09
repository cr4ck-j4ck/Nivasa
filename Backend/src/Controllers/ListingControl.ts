import { Request, Response } from "express";
import ListingModel from "../Models/ListingModel";

export async function viewListing(req: Request, res: Response) {
  const data = await ListingModel.findById(req.params.id).populate("host");
  res.json(data);
}

export async function viewListingViaCity(req: Request, res: Response) {
  const dataObjects = await ListingModel.find(
    { "location.city": req.params.city },
    { title: 1, price: 1, "gallery.Bedroom 1": 1, "location.city": 1 }
  ).limit(10);
  // setTimeout(() => {
  res.json(dataObjects);
  // }, 10000);
}

