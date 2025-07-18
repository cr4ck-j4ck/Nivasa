import { createContext } from "react";
import type { IlistingObj } from "@/@Types/interfaces";

const ListingContext = createContext<IlistingObj | null>(null);
export default ListingContext;
