import { Star, Award, Home, CheckCircle } from "lucide-react";
import userData from "./UserData";

export const stats = [
  { icon: Star, label: "Reviews", value: userData.totalReviews },
  { icon: Award, label: "Rating", value: userData.rating },
  { icon: Home, label: "Listings", value: userData.listings },
  { icon: CheckCircle, label: "Response Rate", value: userData.responseRate },
];
