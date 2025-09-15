import express from "express";
import {
  getPendingListings,
  updateListingStatus,
} from "../Controllers/ListingControl";
import asyncWrapper from "../utils/wrapAsync";
const router = express.Router();

// Admin routes
router.route("/pending").get(asyncWrapper(getPendingListings));
router
  .route("/listings/:listingId/status")
  .put(asyncWrapper(updateListingStatus));


export default router;