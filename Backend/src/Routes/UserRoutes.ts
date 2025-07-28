import express from "express";
import asyncWrapper from "../utils/wrapAsync";
import { createUser } from "../Controllers/UserController";
const router = express.Router();

router.route("/user").get(asyncWrapper(createUser));

export default router;