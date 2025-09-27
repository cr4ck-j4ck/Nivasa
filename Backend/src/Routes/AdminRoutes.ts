import express from "express";
import {
  getPendingListings,
  updateListingStatus,
} from "../Controllers/ListingControl";
import asyncWrapper from "../utils/wrapAsync";
import { validate } from "../utils/validate";
import { z } from "zod";
import {
  listingIdParamSchema,
  updateListingStatusSchema,
} from "../Schemas/listing.Zodschema";
const router = express.Router();

const updateListingStatusValidation = z.object({
  params: listingIdParamSchema,
  body: updateListingStatusSchema,
});

// Admin routes
router.route("/pending").get(asyncWrapper(getPendingListings));
router
  .route("/listings/:listingId/status")
  .put(
    validate(updateListingStatusValidation),
    asyncWrapper(updateListingStatus)
  );

export default router;