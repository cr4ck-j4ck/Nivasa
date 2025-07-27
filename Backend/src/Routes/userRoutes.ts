import express from "express";
import asyncWrapper from "../utils/wrapAsync";
import { createUser } from "../Controllers/userControllers";
const router = express.Router();

router.route("/user").get(asyncWrapper(createUser)).post();
