import { useState, useEffect, useCallback, useMemo } from "react";
import { auth } from "../firebase_config";
import { signInAnonymously } from "firebase/auth";
import { fetchGalleryImages } from "../api/gallery";
import { GalleryContext } from "./GalleryContext";

const GalleryProvider = ({ children }) => {
  const [imageList, setImageList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    localStorage.removeItem("galleryImageCache");
    signInAnonymously(auth)
      .catch((err) => console.error("Auth error:", err))
      .finally(() => setAuthReady(true));
  }, []);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const urls = await fetchGalleryImages();
      setImageList(urls);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authReady) fetchImages();
  }, [authReady, fetchImages]);

  const value = useMemo(
    () => ({ imageList, loading, authReady, fetchImages }),
    [imageList, loading, authReady, fetchImages],
  );

  return (
    <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>
  );
};

export default GalleryProvider;
