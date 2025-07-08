"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const ListingModel_1 = require("./Models/ListingModel");
const wrapAsync_1 = __importDefault(require("./utils/wrapAsync"));
const UsersModel = require("./Models/UsersModel");
const db_1 = require("./config/db");
const app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
app.use((0, cors_1.default)({
    origin: [
        "https://nivasa-two.vercel.app",
        "https://nivasa-git-main-cr4ck-j4cks-projects.vercel.app",
        "http://localhost:5173",
    ],
}));
const PORT = process.env.PORT || 3000;
(0, db_1.connectDB)();
app.get("/", (req, res) => {
    console.log("Ha chal raha hai");
    res.send("Hii from NeoVim");
});
app.get("/listing/:id", (0, wrapAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield ListingModel_1.ListingModel.findById(req.params.id).populate("host");
    // setTimeout(() => {
    res.json(data);
    // }, 1000);
})));
app.get("/listingCard/:city", (0, wrapAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dataObjects = yield ListingModel_1.ListingModel.find({ "location.city": req.params.city }, { title: 1, price: 1, "gallery.Bedroom 1": 1, "location.city": 1 }).limit(10);
    // setTimeout(() => {
    res.json(dataObjects);
    // }, 1000);
})));
app.use((err, req, res, next) => {
    console.log(err);
    res.send("got error");
});
app.listen(PORT, () => {
    console.log(`started Listening on port ${PORT}`);
});
