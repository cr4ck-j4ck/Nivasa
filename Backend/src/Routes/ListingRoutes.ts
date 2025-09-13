import express from "express";
const router = express.Router();
import { viewListing, viewListingViaCity, createListing } from "../Controllers/ListingControl";
import asyncWrapper from "../utils/wrapAsync";

router.route("/listing/:id").get(asyncWrapper(viewListing))

router.route("/listingCard/:city").get(asyncWrapper(viewListingViaCity))

router.route("/create-listing").post(asyncWrapper(createListing))

export default router;