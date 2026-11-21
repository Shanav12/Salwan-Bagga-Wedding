import { useState, useEffect, useCallback, useMemo } from "react";
import { fetchWeddingPhotos } from "../api/weddingPhotos";
import { WeddingPhotosContext } from "./WeddingPhotosContext";

const WeddingPhotosProvider = ({ children }) => {
  const [imageList, setImageList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const urls = await fetchWeddingPhotos();
      setImageList(urls);
    } catch (error) {
      console.error("Error fetching wedding photos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const value = useMemo(
    () => ({ imageList, loading, fetchImages }),
    [imageList, loading, fetchImages],
  );

  return (
    <WeddingPhotosContext.Provider value={value}>
      {children}
    </WeddingPhotosContext.Provider>
  );
};

export default WeddingPhotosProvider;
