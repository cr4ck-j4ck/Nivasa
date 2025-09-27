import express from "express";
const router = express.Router();
import { 
  viewListing, 
  viewListingViaCity, 
  createListing, 
  getRandomCitiesWithListings,
  getHostListings,
  getHostStats,
  searchListings
} from "../Controllers/ListingControl";
import asyncWrapper from "../utils/wrapAsync";
import { validate } from "../utils/validate";
import { z } from "zod";
import {
  listingIdParamSchema,
  cityParamSchema,
  createListingSchema,
  searchListingsSchema
} from "../Schemas/listing.Zodschema";

const viewListingValidation = z.object({ params: listingIdParamSchema });
const viewListingViaCityValidation = z.object({ params: cityParamSchema });
const createListingValidation = z.object({ body: createListingSchema });
const searchListingsValidation = z.object({ query: searchListingsSchema });

router.route("/listing/:id").get(validate(viewListingValidation), asyncWrapper(viewListing))

router.route("/listingCard/:city").get(validate(viewListingViaCityValidation), asyncWrapper(viewListingViaCity))

router.route("/create-listing").post(validate(createListingValidation), asyncWrapper(createListing))

router.route("/cities-with-listings").get(asyncWrapper(getRandomCitiesWithListings))

// Search route
router.route("/search").get(validate(searchListingsValidation), asyncWrapper(searchListings))

// Host dashboard routes
router.route("/host/listings").get(asyncWrapper(getHostListings))
router.route("/host/stats").get(asyncWrapper(getHostStats))

export default router;