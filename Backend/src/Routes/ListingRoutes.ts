import express from "express";
const router = express.Router();
import { 
  viewListing, 
  viewListingViaCity, 
  createListing, 
  getRandomCitiesWithListings,
  getHostListings,
  getHostStats
} from "../Controllers/ListingControl";
import asyncWrapper from "../utils/wrapAsync";

router.route("/listing/:id").get(asyncWrapper(viewListing))

router.route("/listingCard/:city").get(asyncWrapper(viewListingViaCity))

router.route("/create-listing").post(asyncWrapper(createListing))

router.route("/cities-with-listings").get(asyncWrapper(getRandomCitiesWithListings))

// Host dashboard routes
router.route("/host/listings").get(asyncWrapper(getHostListings))
router.route("/host/stats").get(asyncWrapper(getHostStats))

export default router;