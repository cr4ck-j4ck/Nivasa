import express from "express";
const router = express.Router();
import { viewListing, viewListingViaCity } from "../Controllers/ListingControl";
import asyncWrapper from "../utils/wrapAsync";

router.route("/listing/:id").get(asyncWrapper(viewListing))

router.route("/listingCard/:city").get(asyncWrapper(viewListingViaCity))
export default router;