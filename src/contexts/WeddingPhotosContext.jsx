import { createContext, useContext } from "react";

export const WeddingPhotosContext = createContext();

export const useWeddingPhotos = () => useContext(WeddingPhotosContext);
